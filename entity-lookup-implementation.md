# Entity dropdown implementation

Wired 665 dropdown definitions across 240 component files. Added 67 server lookup types; reused existing registered types. No entity records or database schema were created.

## Behavior

- Real numeric record IDs and readable labels. AssetType.AssetCategoryId explicitly preserves AssetCategory.AssetCategoryId string values to match the server DTO.
- Tenant scope resolved from authenticated claims or authenticated user ownership; caller tenant alone is not trusted.
- Stable paged results with selected records first, including inactive selected records.
- All pages loaded for client-side dropdown filtering.
- Form changes reload parent-filtered lookups and cancel older requests.
- Invalid selections are cleared after a successful lookup; errors preserve the stored value and display an error.
- Subscriptions end when the component is destroyed.

## Unresolved sources

62 dropdown definitions remain unchanged because the source schema or ownership rules could not be verified.

| Field | Reason | Components |
|---|---|---|
| AssetValuationId | No verified source entity/schema | disposalValuationReference |
| CompletionCertificateDocumentId | Document model lacks tenant ownership; access mapping required | contractExecution |
| DocumentId | Document model lacks tenant ownership; access mapping required | customerStatementSnapshot, financeDocumentLink, endOfLeaseDisposalDocumentLink, contractConditionEvidence, contractNotice, contractObligationEvent, leaseContractDocumentLink, maintenanceInsuranceDocumentLink |
| EventTypeId | No verified source entity/schema | assetAssignmentHistory |
| ExecutedDocumentId | Document model lacks tenant ownership; access mapping required | contractExecution |
| FinanceReferenceId | No verified source entity/schema | insuranceClaimSettlement, insuranceRecovery |
| HandoffStatusId | No verified source entity/schema | originationHandoff |
| InspectionItemReferenceId | No verified source entity/schema | returnAssessmentDamage |
| InspectionStatusId | No verified source entity/schema | assetInspection |
| OrganisationBankAccountId | No verified source entity/schema | bankStatement, paymentReceipt |
| PaymentReferenceId | No verified source entity/schema | insurancePolicy |
| ProcurementReferenceId | No verified source entity/schema | maintenanceWorkOrderPart |
| ReferenceValuationId | No verified source entity/schema | assetDispositionDecision |
| TaxJurisdictionId | No verified source entity/schema | customerInvoiceTax |
| TaxTypeId | No verified source entity/schema | customerInvoiceTax, financeAccountMapping |
| UOMId | No verified source entity/schema | customerInvoiceLine, leaseContractAsset |
| UnitOfMeasureId | No verified source entity/schema | assetMeasureDefinition, assetMeasureReading |
| WorkflowDefinitionId | No verified source entity/schema | contractApprovalRequest |
| WorkflowInstanceId | No verified source entity/schema | financeApprovalRequest |

## Reviewable mapping

See entity-lookup-plan.json for each component, source model, lookup URL, and parent-filter mapping. The organisationUnit template change that was already in the working tree was preserved.

## Running and validating

Restart/rebuild the API to load the new lookup endpoints before using the updated client. No SQL seed script is needed: lookup values come from existing entity records.

The focused browser tests cover pagination, tenant parameters, selected records, parent-filter request cancellation, error recovery, destruction cleanup, and readable category IDs. Run: `node node_modules/@angular/cli/bin/ng.js test --watch=false --karma-config=karma.entity-lookup.cjs --include=src/app/shared/entity-lookup.spec.ts`. The isolated launcher disables GPU acceleration because the local headless GPU process fails to start.

No live-database integration test was performed; source tables/columns were checked against the repository models and repository table definitions.

## Final validation

Angular development build passed. .NET API and referenced projects built successfully to an isolated output directory (0 errors; existing warnings). All four focused browser tests passed. The 665 client-to-server mappings and target filter columns passed static checks.
