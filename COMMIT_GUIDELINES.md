# Commandes de Commit Recommandées

## Commit 1: Amélioration du modèle Payement
```bash
git add ndakoApp/api/models/Payement.js
git commit -m "feat: Enhance Payement model with carnet integration

- Add carnet reference for direct link to Carnet
- Add reference field for unique receipt/confirmation number
- Add description field for payment notes
- Add refund fields: refundedAmount, refundReason, refundDate
- Add 'refunded' status to payment statuses
- Use decimal(10,2) for amount precision

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Commit 2: Enrichissement de PayementService
```bash
git add ndakoApp/api/services/PayementService.js
git commit -m "feat: Add payment-carnet integration methods to PayementService

- Add createFromCarnet() for direct carnet payment creation
- Add reconcileCarnetPayments() for auto-synchronization
- Add getPaymentHistory() for payment tracking and reporting
- Add processPaymentCompletion() for status handling
- Add refundPayment() for refund management
- Integrate NotificationService for user notifications
- Enhance create() to support carnet linking

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Commit 3: Amélioration du PayementController
```bash
git add ndakoApp/api/controllers/PayementController.js
git commit -m "feat: Add carnet-integrated endpoints to PayementController

- Add POST /api/v1/payement/carnet/:carnetId endpoint
- Add GET /api/v1/payement/carnet/:carnetId endpoint
- Add POST /api/v1/payement/reconcile/:carnetId endpoint
- Add POST /api/v1/payement/:id/refund endpoint
- Improve error handling and validation
- Add detailed JSDoc comments

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Commit 4: Amélioration du PayementRepo
```bash
git add ndakoApp/api/repositories/PayementRepo.js
git commit -m "feat: Add carnet-specific queries to PayementRepo

- Add findByCarnet() for all payments by carnet
- Add findByCarnetAndUser() for filtered payments
- Add findCompletedByCarnet() for completed payments only
- Populate carnet in all queries
- Improve documentation

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Commit 5: Enrichissement du CarnetService
```bash
git add ndakoApp/api/services/CarnetService.js
git commit -m "feat: Add payment summary methods to CarnetService

- Add calculatePaymentSummary() for detailed payment analytics
- Add getPaymentDetails() for complete carnet + payments info
- Include percentage paid and remaining amount calculation
- Return comprehensive payment statistics

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Commit 6: Création du CarnetPaymentHelper
```bash
git add ndakoApp/api/helpers/CarnetPaymentHelper.js
git commit -m "feat: Create CarnetPaymentHelper for payment-carnet utilities

- Add linkPaymentToCarnet() for dynamic linking
- Add getMissingPayments() for payment tracking
- Add isCarnetFullyPaid() for status verification
- Add syncCarnetStatus() for automatic synchronization
- Add generatePaymentReport() for location-based reporting
- Add markAsLate() for overdue carnet management

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Commit 7: Mise à jour des routes
```bash
git add ndakoApp/config/routes.js
git commit -m "feat: Add payment integration routes

- Add POST /api/v1/payement/carnet/:carnetId
- Add GET /api/v1/payement/carnet/:carnetId
- Add POST /api/v1/payement/reconcile/:carnetId
- Add POST /api/v1/payement/:id/refund
- Maintain backward compatibility with existing routes

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Commit 8: Documentation
```bash
git add ndakoApp/PAYMENT_MODULE_IMPROVEMENTS.md
git add ndakoApp/PAYMENT_API_TEST_GUIDE.js
git add ARCHITECTURE_DETAILS.md
git add README_PAYMENT_MODULE.md
git commit -m "docs: Add comprehensive payment module documentation

- Add PAYMENT_MODULE_IMPROVEMENTS.md with architecture details
- Add PAYMENT_API_TEST_GUIDE.js with API examples
- Add ARCHITECTURE_DETAILS.md with structure overview
- Add README_PAYMENT_MODULE.md with implementation summary
- Include test scenarios and usage examples
- Provide migration and validation checklists

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Commit Unique (Alternative - tout en une)
```bash
git add ndakoApp/api/models/Payement.js
git add ndakoApp/api/services/PayementService.js
git add ndakoApp/api/controllers/PayementController.js
git add ndakoApp/api/repositories/PayementRepo.js
git add ndakoApp/api/services/CarnetService.js
git add ndakoApp/api/helpers/CarnetPaymentHelper.js
git add ndakoApp/config/routes.js
git add ndakoApp/PAYMENT_MODULE_IMPROVEMENTS.md
git add ndakoApp/PAYMENT_API_TEST_GUIDE.js
git add ARCHITECTURE_DETAILS.md
git add README_PAYMENT_MODULE.md
git commit -m "feat: Implement comprehensive payment-carnet integration module

This implements a complete integration between the Payement and Carnet modules with:

New Features:
- Direct payment creation from carnet (POST /api/v1/payement/carnet/:carnetId)
- Payment history tracking per carnet
- Automatic carnet reconciliation and status update
- Refund management with auto-reconciliation
- Payment and carnet synchronization

Enhancements:
- Payement model with carnet reference and refund fields
- PayementService with 5 new integration methods
- PayementController with 4 new endpoints
- PayementRepo with 3 new carnet-specific queries
- CarnetService with payment summary methods
- CarnetPaymentHelper with 6 utility functions

Documentation:
- Comprehensive architecture documentation
- API test guide with examples
- Migration and validation checklists

Backward Compatibility:
- All existing endpoints remain functional
- No breaking changes to data structures
- Optional carnet linking for new payments

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Pour exécuter les commits

```bash
# Option 1: Commits séquentiels (recommandé pour clarté)
for commit in {1..8}; do
  echo "Executing commit $commit..."
  # (exécuter chaque commit séquentiellement)
done

# Option 2: Commit unique (plus rapide)
git commit -m "..." # voir le commit unique ci-dessus

# Option 3: Utiliser le skill commit Copilot
/commit
```

## Vérifier les commits
```bash
git log --oneline -8
git show <commit-hash>
git diff <commit-hash>~1
```

## Push vers repository
```bash
git push origin branch-name
```
