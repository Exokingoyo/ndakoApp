/**
 * Test Guide - Module Paiement Intégré
 * 
 * Ce fichier documente les endpoints à tester avec des exemples cURL et Postman
 */

// ============================================================================
// 1. CRÉER UN PAIEMENT DEPUIS UN CARNET (Nouveau ⭐)
// ============================================================================

/**
 * Endpoint: POST /api/v1/payement/carnet/:carnetId
 * Description: Créer un paiement directement pour un carnet
 * Authentification: Requise (Bearer token)
 */

// cURL
curl -X POST http://localhost:1337/api/v1/payement/carnet/carnet-123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentMethod": "mobile_money",
    "description": "Paiement janvier"
  }'

// Réponse attendue:
{
  "status": "success",
  "message": "Paiement créé et carnet mis à jour avec succès.",
  "payement": {
    "id": "pay-456",
    "amount": 5000,
    "carnet": "carnet-123",
    "status": "completed",
    "reference": "PAY-carnet-123-1715704000000",
    "description": "Paiement janvier",
    "paymentMethod": "mobile_money",
    "date": "2026-05-14T13:44:11.367+01:00",
    ...
  }
}

// ============================================================================
// 2. RÉCUPÉRER L'HISTORIQUE DES PAIEMENTS D'UN CARNET (Nouveau ⭐)
// ============================================================================

/**
 * Endpoint: GET /api/v1/payement/carnet/:carnetId
 * Description: Voir tous les paiements d'un carnet groupés par statut
 */

curl -X GET http://localhost:1337/api/v1/payement/carnet/carnet-123 \
  -H "Authorization: Bearer YOUR_TOKEN"

// Réponse attendue:
{
  "status": "success",
  "message": "Historique des paiements récupéré.",
  "history": {
    "carnet": {
      "id": "carnet-123",
      "mois": 1,
      "year": 2026,
      "loyer": 5000,
      "status": "partial",
      "montant": 5000,
      "reste": 0,
      ...
    },
    "totalLoyer": 5000,
    "totalPaid": 5000,
    "totalRefunded": 0,
    "remainingAmount": 0,
    "isFullyPaid": true,
    "payements": {
      "completed": [
        {
          "id": "pay-456",
          "amount": 5000,
          "status": "completed",
          "date": "2026-05-14",
          ...
        }
      ],
      "pending": [],
      "failed": [],
      "refunded": []
    }
  }
}

// ============================================================================
// 3. REMBOURSER UN PAIEMENT (Nouveau ⭐)
// ============================================================================

/**
 * Endpoint: POST /api/v1/payement/:id/refund
 * Description: Traiter le remboursement d'un paiement
 * Montant: Doit être ≤ montant original
 */

curl -X POST http://localhost:1337/api/v1/payement/pay-456/refund \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "reason": "Correction erreur de saisie"
  }'

// Réponse attendue:
{
  "status": "success",
  "message": "Remboursement traité avec succès.",
  "payement": {
    "id": "pay-456",
    "amount": 5000,
    "status": "refunded",
    "refundedAmount": 1000,
    "refundReason": "Correction erreur de saisie",
    "refundDate": "2026-05-14T13:45:00.000+01:00",
    ...
  }
}

// ============================================================================
// 4. RÉCONCILIER LES PAIEMENTS D'UN CARNET (Nouveau ⭐)
// ============================================================================

/**
 * Endpoint: POST /api/v1/payement/reconcile/:carnetId
 * Description: Forcer la réconciliation d'un carnet
 * Raison: Corriger les statuts si synchronisation manquée
 */

curl -X POST http://localhost:1337/api/v1/payement/reconcile/carnet-123 \
  -H "Authorization: Bearer YOUR_TOKEN"

// Réponse attendue:
{
  "status": "success",
  "message": "Paiements du carnet réconciliés.",
  "carnet": {
    "id": "carnet-123",
    "status": "paid",
    "montant": 5000,
    "reste": 0,
    "loyer": 5000,
    ...
  }
}

// ============================================================================
// 5. CRÉER UN PAIEMENT CLASSIQUE (Ancien, encore supporté ✓)
// ============================================================================

curl -X POST http://localhost:1337/api/v1/payement \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "location-123",
    "amount": 2000,
    "motif": "electricity",
    "paymentMethod": "card",
    "date": "2026-05-14",
    "description": "Facture d'\''électricité"'
  }'

// ============================================================================
// 6. RÉCUPÉRER MES PAIEMENTS (Ancien, amélioré ✓)
// ============================================================================

/**
 * Ancien endpoint, mais maintenant retourne aussi carnet
 */

curl -X GET "http://localhost:1337/api/v1/payement?page=1&limit=10&status=completed" \
  -H "Authorization: Bearer YOUR_TOKEN"

// Réponse attendue:
{
  "status": "success",
  "payements": [
    {
      "id": "pay-456",
      "amount": 5000,
      "carnet": {
        "id": "carnet-123",
        ...
      },
      "location": {...},
      "user": {...},
      ...
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}

// ============================================================================
// 7. METTRE À JOUR UN PAIEMENT (Ancien, encore supporté ✓)
// ============================================================================

curl -X PUT http://localhost:1337/api/v1/payement/pay-456 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'

// ============================================================================
// SCÉNARIOS DE TEST COMPLETS
// ============================================================================

/**
 * SCÉNARIO 1: Flux de paiement complet
 */

// 1. Créer un paiement depuis carnet
POST /api/v1/payement/carnet/carnet-123
{
  "amount": 5000,
  "paymentMethod": "mobile_money"
}
// → Status: completed, carnet.status: partial/paid

// 2. Vérifier l'historique
GET /api/v1/payement/carnet/carnet-123
// → totalPaid: 5000, isFullyPaid: true (si loyer=5000)

// 3. Vérifier que le carnet est bien mis à jour
GET /api/v1/carnets/carnet-123
// → status: 'paid', montant: 5000, reste: 0

/**
 * SCÉNARIO 2: Remboursement
 */

// 1. Créer un paiement
POST /api/v1/payement
{
  "location": "location-123",
  "amount": 5000,
  "motif": "loyer",
  "paymentMethod": "card",
  "carnet": "carnet-123"
}
// → Status: pending

// 2. Compléter le paiement
PUT /api/v1/payement/pay-789
{ "status": "completed" }
// → Status: completed, carnet réconcilié

// 3. Rembourser
POST /api/v1/payement/pay-789/refund
{
  "amount": 1000,
  "reason": "Remboursement partiel"
}
// → Status: refunded, refundedAmount: 1000

// 4. Vérifier l'historique
GET /api/v1/payement/carnet/carnet-123
// → totalRefunded: 1000, remainingAmount: 1000

/**
 * SCÉNARIO 3: Erreur de synchronisation
 */

// Si le carnet n'a pas le bon statut
POST /api/v1/payement/reconcile/carnet-123
// → Recalcule tous les paiements et met à jour le carnet

// ============================================================================
// VARIABLES POSTMAN
// ============================================================================

// Créer ces variables dans Postman:
// {{base_url}} = http://localhost:1337
// {{token}} = votre_bearer_token
// {{carnetId}} = carnet-123
// {{payementId}} = pay-456
// {{locationId}} = location-123

/**
 * Utilisation:
 * POST {{base_url}}/api/v1/payement/carnet/{{carnetId}}
 * Header: Authorization: Bearer {{token}}
 */

// ============================================================================
// CODES D'ERREUR POSSIBLES
// ============================================================================

// 400 - Montant invalide
{
  "status": "error",
  "message": "Montant invalide."
}

// 404 - Carnet non trouvé
{
  "status": "error",
  "message": "Carnet introuvable."
}

// 400 - Remboursement dépasse le montant original
{
  "status": "error",
  "message": "Le montant du remboursement ne peut pas dépasser le montant original."
}

// ============================================================================
// COMMANDES DE DÉBOGAGE (JavaScript)
// ============================================================================

// Dans la console du navigateur ou Node.js:

// Récupérer un carnet complet avec ses paiements
const carnetDetails = await PayementService.getPaymentHistory('carnet-123');
console.log(carnetDetails);

// Calculer le résumé des paiements
const summary = await CarnetService.calculatePaymentSummary('carnet-123');
console.log(summary);

// Générer un rapport de paiement
const report = await CarnetPaymentHelper.generatePaymentReport('location-123', 2026);
console.log(report);

// Vérifier si un carnet est entièrement payé
const isPaid = await CarnetPaymentHelper.isCarnetFullyPaid('carnet-123');
console.log(isPaid);

// Récupérer les paiements manquants
const missing = await CarnetPaymentHelper.getMissingPayments('carnet-123');
console.log(missing);
