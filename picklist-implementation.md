# Picklist implementation

352 component files updated; 808 dropdown definitions read 209 categories. SQL contains 877 candidate rows and inserts only missing rows.

Run Scripts/SeedPicklistItems.sql followed by Scripts/SeedFrontendPicklistItems.sql, then sign in again to refresh the picklist cache. Neither script was executed by this change.

## Category mapping

See picklist-mapping.json for each component, field, category and preserved value set. Conflicting field names use entity-prefixed categories. AcquisitionCurrencyCode reuses CurrencyCode; IssuingCountryCode reuses CountryCode. TaxResidencyCountryCode preserves USA as currently stored.

## Unresolved definitions intentionally excluded

- asset.ConditionGradeCode: Sample data or entity/free-text field.
- assetAttributeDefinition.DataTypeCode: No meaningful values defined.
- assetAttributeDefinition.UnitMeasureType: No meaningful values defined.
- assetCategory.ExtensionTypeCode: No meaningful values defined.
- assetIdentifier.IdentifierTypeCode: No meaningful values defined.
- assetIdentifier.IssuingStateCode: No meaningful values defined.
- assetStatusHistory.ReasonCode: No meaningful values defined.
- assetUser.Designation: Sample data or entity/free-text field.
- assetUser.Email: Sample data or entity/free-text field.
- assetUser.FullName: Sample data or entity/free-text field.
- brandPartner.Country: Sample data or entity/free-text field.
- brandPartner.CurrencySymbol: Sample data or entity/free-text field.
- contact.Department: Sample data or entity/free-text field.
- contact.Designation: Sample data or entity/free-text field.
- contractApprovalRequest.RequestedBy: Sample data or entity/free-text field.
- contractCondition.SatisfiedBy: Sample data or entity/free-text field.
- contractConditionEvidence.CapturedBy: Sample data or entity/free-text field.
- contractEvent.PerformedBy: Sample data or entity/free-text field.
- contractObligationEvent.PerformedBy: Sample data or entity/free-text field.
- costCentre.ExternalLedgerCode: Sample data or entity/free-text field.
- creditApplication.RiskSegmentCode: No meaningful values defined.
- creditAssessment.AssessmentVersion: Sample data or entity/free-text field.
- creditDocumentChecklist.DocumentType: Sample data or entity/free-text field.
- customer.Classification: No meaningful values defined.
- customer.PermanentCity: Sample data or entity/free-text field.
- customer.PermanentState: Sample data or entity/free-text field.
- customer.WorkCity: Sample data or entity/free-text field.
- customer.WorkState: Sample data or entity/free-text field.
- customerDepartment.BillingReference: Sample data or entity/free-text field.
- customerDepartment.CostCentreCode: Sample data or entity/free-text field.
- department.CostCentreCode: Sample data or entity/free-text field.
- department.DepartmentCode: Sample data or entity/free-text field.
- equipmentAsset.SafetyClass: No meaningful values defined.
- leaseAssetAllocationEvent.PerformedBy: Sample data or entity/free-text field.
- leasePaymentSchedule.GeneratedBy: Sample data or entity/free-text field.
- organisationUnit.CostCentreCode: Sample data or entity/free-text field.
- organisationUnit.ProfitCentreCode: Sample data or entity/free-text field.
- partyDocument.VerifiedBy: Sample data or entity/free-text field.
- partyRole.ApprovedBy: Sample data or entity/free-text field.
- partyRole.RoleCode: No meaningful values defined.
- portalUser.Department: Sample data or entity/free-text field.
- profitCentre.ExternalLedgerCode: Sample data or entity/free-text field.
- propertyAsset.PropertyType: No meaningful values defined.
- vehicleAsset.EmissionNormCode: No meaningful values defined.
- vehicleAsset.FuelTypeCode: No meaningful values defined.

The already wired DiscountType, Gender, MaritalStatus and NatureOfBusiness categories have no definitive values in repository seeds; no values were invented. Entity-ID options remain outside this picklist migration.

## Server behavior

PicklistItemRepository.GetForTenantAsync now returns one row per category/value, preferring the current tenant row over a shared system row. Both bootstrap and category requests use this path.

## Validation

- TypeScript no-emit check passed.
- Angular development build passed.
- API and referenced .NET projects built successfully to a separate output directory (0 errors; existing warnings). The normal output directory was locked by the running API.
- Verified all 808 mappings against 877 unique seed rows, create/edit category consistency, SQL field lengths, and unchanged entity-ID option definitions in all 352 modified component files.
- SQL was not executed; live database idempotency and tenant selection have not been integration-tested.
