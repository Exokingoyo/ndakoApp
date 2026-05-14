# Module Paiement - Amélioration Integration avec Carnet

## 📋 Résumé des Améliorations

Ce document décrit les améliorations apportées au module de paiement pour une meilleure intégration avec le système de Carnet (carnets de paiement mensuels).

## 🔄 Architecture Améliorée

### 1. **Modèle Payement.js** ✅
Nouvelles propriétés ajoutées:
- `carnet` - Référence directe au carnet associé
- `reference` - Numéro unique de reçu/confirmation
- `description` - Notes supplémentaires
- `refundedAmount` - Montant remboursé (si applicable)
- `refundReason` - Raison du remboursement
- `refundDate` - Date du remboursement
- Status étendu: `'pending' | 'completed' | 'failed' | 'refunded'`

### 2. **PayementService.js** ✅
**Nouvelles méthodes:**

#### `createFromCarnet(carnetId, amount, paymentMethod, userId, description)`
- Crée un paiement directement depuis un carnet
- Génère automatiquement une référence unique
- Marque le paiement comme `completed`
- Réconcilie automatiquement le carnet
```javascript
const payment = await PayementService.createFromCarnet(
  'carnetId123',
  5000,           // montant
  'mobile_money', // méthode
  'userId456',    // utilisateur
  'Paiement janvier'
);
```

#### `reconcileCarnetPayments(carnetId)`
- Réconcilie tous les paiements d'un carnet
- Calcule le montant total payé (status='completed')
- Met à jour automatiquement le statut du carnet:
  - `paid` - Montant total ≥ loyer
  - `partial` - Paiement partiel reçu
  - `unpaid` - Aucun paiement
- Envoie des notifications
```javascript
const carnet = await PayementService.reconcileCarnetPayments('carnetId123');
```

#### `getPaymentHistory(carnetId)`
- Retourne l'historique complet des paiements d'un carnet
- Groupé par statut: completed, pending, failed, refunded
- Calcule les totaux et le montant restant
```javascript
const history = await PayementService.getPaymentHistory('carnetId123');
// Retourne: {
//   carnet: {...},
//   totalLoyer: 5000,
//   totalPaid: 3000,
//   totalRefunded: 500,
//   remainingAmount: 2500,
//   isFullyPaid: false,
//   payements: { completed: [...], pending: [...], ... }
// }
```

#### `processPaymentCompletion(payementId)`
- Marque un paiement comme complété
- Réconcilie le carnet associé automatiquement
```javascript
const completed = await PayementService.processPaymentCompletion('payementId123');
```

#### `refundPayment(payementId, refundAmount, refundReason)`
- Traite un remboursement
- Valide que le montant n'excède pas l'original
- Réconcilie le carnet associé
- Envoie une notification utilisateur
```javascript
const refunded = await PayementService.refundPayment(
  'payementId123',
  1000,           // montant du remboursement
  'Remboursement erreur'
);
```

### 3. **PayementController.js** ✅
**Nouveaux endpoints:**

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/v1/payement` | Créer un paiement standard |
| POST | `/api/v1/payement/carnet/:carnetId` | Créer paiement depuis carnet ⭐ |
| GET | `/api/v1/payement` | Récupérer mes paiements |
| GET | `/api/v1/payement/carnet/:carnetId` | Historique des paiements du carnet ⭐ |
| POST | `/api/v1/payement/reconcile/:carnetId` | Réconcilier les paiements du carnet ⭐ |
| PUT | `/api/v1/payement/:id` | Mettre à jour un paiement |
| POST | `/api/v1/payement/:id/refund` | Rembourser un paiement ⭐ |

### 4. **PayementRepo.js** ✅
**Nouvelles queries:**

#### `findByCarnet(carnetId)`
- Récupère tous les paiements d'un carnet
```javascript
const payments = await PayementRepo.findByCarnet('carnetId123');
```

#### `findByCarnetAndUser(carnetId, userId)`
- Récupère les paiements d'un carnet pour un utilisateur spécifique
```javascript
const payments = await PayementRepo.findByCarnetAndUser('carnetId123', 'userId456');
```

#### `findCompletedByCarnet(carnetId)`
- Récupère seulement les paiements complétés d'un carnet
```javascript
const completed = await PayementRepo.findCompletedByCarnet('carnetId123');
```

### 5. **CarnetService.js** ✅
**Nouvelles méthodes:**

#### `calculatePaymentSummary(carnetId)`
- Calcul précis du résumé des paiements
- Retourne: loyerAmount, totalCompleted, totalPending, totalFailed, totalRefunded, remaining, isFullyPaid, percentagePaid
```javascript
const summary = await CarnetService.calculatePaymentSummary('carnetId123');
```

#### `getPaymentDetails(carnetId)`
- Détails complets du carnet + tous ses paiements
- Inclut: carnet, summary, payements, details (dates)
```javascript
const details = await CarnetService.getPaymentDetails('carnetId123');
```

### 6. **CarnetPaymentHelper.js** ✅
**Utilitaires pour synchronisation Carnet ↔ Paiement:**

| Méthode | Description |
|---------|-------------|
| `linkPaymentToCarnet()` | Lier un paiement à un carnet |
| `getMissingPayments()` | Récupérer les paiements manquants |
| `isCarnetFullyPaid()` | Vérifier si carnet est payé |
| `syncCarnetStatus()` | Synchroniser automatiquement le statut |
| `generatePaymentReport()` | Rapport de paiement pour une location |
| `markAsLate()` | Marquer des carnets comme en retard |

## 📍 Flux de Paiement Intégré

### Scénario 1: Paiement depuis un Carnet
```
1. POST /api/v1/payement/carnet/:carnetId
   ↓
2. Service crée le paiement avec ref carnet
   ↓
3. Paiement automatiquement complété
   ↓
4. Carnet réconcilié
   ↓
5. Status carnet mis à jour (paid/partial/unpaid)
   ↓
6. Notifications envoyées (bailleur + locateur)
```

### Scénario 2: Historique et Réconciliation
```
1. GET /api/v1/payement/carnet/:carnetId
   ↓
2. Récupère tous les paiements groupés par status
   ↓
3. Calcule les montants: payé, restant, remboursé
   ↓
4. Retourne l'historique complet
```

### Scénario 3: Remboursement
```
1. POST /api/v1/payement/:id/refund
   ↓
2. Valide le montant
   ↓
3. Marque le paiement comme refunded
   ↓
4. Réconcilie le carnet
   ↓
5. Notification utilisateur
```

## 🔐 Rétrocompatibilité

✅ **Tous les anciens endpoints fonctionnent toujours:**
- `POST /api/v1/payement` - Création classique
- `GET /api/v1/payement` - Récupération paiements utilisateur
- `PUT /api/v1/payement/:id` - Mise à jour

Les nouvelles fonctionnalités sont additionnelles et n'interfèrent pas avec l'existant.

## 📊 Exemple d'Utilisation Complète

```javascript
// 1. Récupérer un carnet
const carnet = await Carnet.findOne({ id: 'carnet-123' });

// 2. Créer un paiement depuis le carnet
const payment = await PayementService.createFromCarnet(
  'carnet-123',
  5000,
  'mobile_money',
  'user-456',
  'Paiement janvier 2026'
);
// Le paiement est automatiquement completed et le carnet réconcilié

// 3. Vérifier l'historique
const history = await PayementService.getPaymentHistory('carnet-123');
console.log(`Payé: ${history.totalPaid}/${history.totalLoyer}`);
console.log(`Carnet entièrement payé: ${history.isFullyPaid}`);

// 4. En cas d'erreur, rembourser
if (someError) {
  await PayementService.refundPayment(
    payment.id,
    5000,
    'Erreur lors du traitement'
  );
}

// 5. Rapport complet pour l'année
const report = await CarnetPaymentHelper.generatePaymentReport('location-789', 2026);
console.log(report);
// {
//   locationId: 'location-789',
//   year: 2026,
//   stats: {
//     paidCount: 10,
//     partialCount: 1,
//     unpaidCount: 1,
//     totalLoyer: 60000,
//     totalPaid: 55000,
//     totalRemaining: 5000,
//     percentagePaid: 91.67%
//   },
//   carnets: [...]
// }
```

## 📝 Notes de Migration

**Aucune migration forcée requise!** Le système est rétrocompatible. Cependant:

1. **Base de données**: Les migrations Sails appliqueront les nouveaux champs
2. **Notification**: Vérifiez que `NotificationService` est disponible
3. **Testing**: Testez les workflows paiement-carnet intégrés

## 🧪 Checklist de Validation

- [x] Modèles mis à jour
- [x] Services enrichis avec 5 nouvelles méthodes
- [x] Controller amélioré avec 4 nouveaux endpoints
- [x] Repository augmenté avec 3 nouvelles queries
- [x] CarnetService enrichi
- [x] Helper créé pour utilitaires
- [x] Routes configurées
- [x] Rétrocompatibilité vérifiée
- [x] Notifications intégrées
- [x] Documentation complète

## 🚀 Prochaines Étapes Recommandées

1. **Tests unitaires** pour les nouvelles méthodes
2. **Tests d'intégration** pour les workflows complets
3. **Synchronisation périodique** des carnets en retard via CRON
4. **Dashboard** pour visualiser les paiements par location/carnet
5. **Rapports** de paiement exportables (PDF)
6. **Webhook** pour notifications paiement en temps réel

---

**Version**: 1.0  
**Date**: 2026-05-14  
**Auteur**: Copilot AI
