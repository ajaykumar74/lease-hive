# Hardcoded entity dropdowns — approval list

Scope: all frontend TypeScript files, including create/edit components. Includes literal options pushed into or assigned to `*IdOptions` arrays; includes blank/numeric placeholders. Already dynamic options are excluded. No application code was changed.

727 hardcoded dropdown definitions in 254 files and 127 entity folders; 163 distinct entity-ID field names. Scanned 1928 TypeScript files.

## BillingRun example

| Field | Data source | Current server lookup |
|---|---|---|
| BillingOrganisationId | Organisations | organisations — available |
| BillingRunStatusId | Billing run statuses | Not registered; add lookup |
| ApprovedByUserId | Application users | application-users — available |

These are entity records, not PicklistItems; values should be real IDs with readable labels.

## Folder summary

| Folder | Dropdown definitions | Files | Distinct fields |
|---|---:|---:|---:|
| assets | 101 | 36 | 30 |
| billings | 154 | 52 | 41 |
| crm | 4 | 4 | 2 |
| eolDisposals | 176 | 54 | 45 |
| leaseContracts | 110 | 58 | 32 |
| maintenanceInsurances | 182 | 50 | 53 |

## All distinct hardcoded entity-ID fields

The existing-route column identifies straightforward mappings from the current server registry. A dash means a new lookup or schema-specific mapping must be established; it does not mean the underlying entity/table is missing. Polymorphic fields such as ReferenceValuationId and InspectionItemReferenceId require context-specific validation.

| Field | Definitions | Existing route to reuse |
|---|---:|---|
| ActionByUserId | 2 | application-users |
| ApprovalRequestId | 8 | approval-requests |
| ApprovedByUserId | 12 | application-users |
| ApproverUserId | 2 | application-users |
| AssessedByUserId | 2 | application-users |
| AssessorPartyId | 2 | parties |
| AssetAttributeDefinitionId | 4 | — |
| AssetCategoryId | 18 | asset-categories |
| AssetDispositionDecisionId | 2 | — |
| AssetId | 59 | — |
| AssetMaintenancePlanId | 2 | — |
| AssetMakeId | 4 | asset-makes |
| AssetModelId | 4 | asset-models |
| AssetReturnId | 4 | — |
| AssetReturnScheduleId | 2 | — |
| AssetStatusId | 2 | — |
| AssetTypeId | 16 | asset-types |
| AssetUserId | 4 | asset-users |
| AssetValuationId | 2 | — |
| AssignedToUserId | 16 | application-users |
| AuctionProviderPartyId | 2 | parties |
| BankStatementId | 2 | — |
| BeneficiaryPartyId | 2 | parties |
| BidderPartyId | 2 | parties |
| BillingOrganisationId | 14 | organisations |
| BillingRunId | 2 | — |
| BillingRunStatusId | 2 | — |
| BrokerPartyId | 2 | parties |
| BuyerPartyId | 6 | parties |
| CompletedByUserId | 2 | application-users |
| CompletionCertificateDocumentId | 2 | — |
| ConditionGradeId | 4 | — |
| ContractAmendmentId | 2 | — |
| ContractApprovalRequestId | 2 | — |
| ContractConditionId | 2 | — |
| ContractExecutionId | 2 | — |
| ContractObligationId | 2 | — |
| ContractTerminationId | 4 | — |
| CostCentreId | 2 | cost-centres |
| CoverageTypeId | 4 | — |
| CreditNoteId | 2 | — |
| CreditPartyRoleId | 2 | — |
| CurrentLocationId | 2 | locations |
| CurrentPartyId | 2 | parties |
| CurrentPartyLocationId | 2 | party-locations |
| CustomerContactPartyId | 2 | parties |
| CustomerDepartmentId | 2 | customer-departments |
| CustomerDepositId | 2 | — |
| CustomerInvoiceId | 10 | — |
| CustomerInvoiceLineId | 6 | — |
| CustomerPartyId | 26 | parties |
| DebitNoteId | 2 | — |
| DelegatedFromUserId | 2 | application-users |
| DisposalAuctionId | 2 | — |
| DisposalAwardId | 2 | — |
| DisposalBidId | 2 | — |
| DisposalCaseId | 16 | — |
| DisposalOfferId | 2 | — |
| DispositionMethodId | 4 | — |
| DocumentId | 16 | — |
| EndOfLeaseCaseId | 18 | — |
| EndOfLeaseReasonId | 2 | — |
| EndOfLeaseSettlementId | 4 | — |
| EndOfLeaseStatusId | 2 | — |
| EventTypeId | 2 | — |
| ExecutedDocumentId | 2 | — |
| FinalMeasureReadingId | 2 | — |
| FinanceApprovalRequestId | 2 | — |
| FinanceHandoffId | 2 | — |
| FinanceReferenceId | 4 | — |
| FromAssetId | 2 | — |
| FromAssetUserId | 2 | — |
| FromLocationId | 2 | locations |
| FromPartyLocationId | 2 | party-locations |
| FromStatusId | 2 | — |
| HandoffStatusId | 2 | — |
| InspectionItemReferenceId | 2 | — |
| InspectionStatusId | 2 | — |
| InspectorUserId | 2 | application-users |
| InsuranceClaimId | 10 | — |
| InsuranceClaimStatusId | 2 | — |
| InsuranceIncidentId | 4 | — |
| InsurancePolicyAssetId | 2 | — |
| InsurancePolicyId | 8 | — |
| InsurancePolicyStatusId | 2 | — |
| InsurerPartyId | 2 | parties |
| InvoiceStatusId | 2 | — |
| JournalEntryId | 4 | — |
| LeaseContractAssetId | 12 | — |
| LeaseContractChargeId | 4 | — |
| LeaseContractDepositId | 2 | — |
| LeaseContractId | 58 | — |
| LeaseContractPartyId | 2 | parties |
| LeaseContractStatusId | 2 | — |
| LeasePaymentScheduleId | 2 | — |
| LeasePaymentScheduleLineId | 4 | — |
| LessorOrganisationId | 2 | organisations |
| LinkedByUserId | 2 | application-users |
| LocationId | 6 | locations |
| MaintenancePlanId | 4 | — |
| MaintenanceRequestId | 2 | — |
| MaintenanceScheduleId | 4 | — |
| MaintenanceTypeId | 8 | — |
| MaintenanceWorkOrderId | 14 | — |
| MatchedByUserId | 2 | application-users |
| MatchedPaymentReceiptId | 2 | — |
| MeasureDefinitionId | 4 | — |
| NewInsurancePolicyId | 2 | — |
| OrganisationBankAccountId | 4 | — |
| OrganisationId | 14 | organisations |
| OrganisationUnitId | 2 | organisation-units |
| OwningOrganisationId | 2 | organisations |
| PartyId | 6 | parties |
| PartyLocationId | 4 | party-locations |
| PayeePartyId | 2 | parties |
| PaymentReceiptId | 4 | — |
| PaymentReferenceId | 2 | — |
| PlannedOrganisationUnitId | 2 | organisation-units |
| PreferredServiceProviderPartyId | 2 | parties |
| PreviousPolicyId | 2 | — |
| ProcurementReferenceId | 2 | — |
| ProfitCentreId | 2 | profit-centres |
| ProposedInsurerPartyId | 2 | parties |
| QuoteId | 2 | quotes |
| ReceiptStatusId | 2 | — |
| ReceivableId | 4 | — |
| ReceivedByUserId | 2 | application-users |
| ReceivingOrganisationId | 2 | organisations |
| RecipientPartyId | 2 | parties |
| RecoveryPartyId | 2 | parties |
| RecyclerPartyId | 2 | parties |
| ReferenceValuationId | 2 | — |
| ReplacementAssetId | 2 | — |
| ReportedByUserId | 2 | application-users |
| RequestedByPartyId | 2 | parties |
| RequestedByUserId | 6 | application-users |
| RespondedByPartyId | 2 | parties |
| ResponsibleOrganisationUnitId | 6 | organisation-units |
| ReturnAssessmentId | 4 | — |
| ReturnInspectionId | 4 | — |
| ReturnLocationId | 6 | locations |
| ReversalOfAllocationId | 2 | locations |
| ServiceAgreementId | 2 | — |
| ServiceLocationId | 2 | — |
| ServiceProviderPartyId | 6 | parties |
| ServicingOrganisationUnitId | 2 | organisation-units |
| SettlementChargeTypeId | 2 | — |
| SignerPartyId | 2 | parties |
| SupplierPartyId | 2 | parties |
| TaxJurisdictionId | 2 | — |
| TaxTypeId | 4 | — |
| TechnicianPartyId | 2 | parties |
| TechnicianUserId | 2 | application-users |
| ToAssetId | 2 | — |
| ToAssetUserId | 2 | — |
| ToLocationId | 2 | locations |
| ToPartyLocationId | 2 | party-locations |
| ToStatusId | 2 | — |
| UOMId | 4 | — |
| UnitOfMeasureId | 4 | — |
| VerifiedByUserId | 2 | application-users |
| WorkflowDefinitionId | 2 | — |
| WorkflowInstanceId | 2 | — |

## Complete list by folder and component

### assets

| Component | Field | Current hardcoded values |
|---|---|---|
| [views/assets/asset/asset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-create.component.ts:93) | AssetCategoryId | (blank) |
| [views/assets/asset/asset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-create.component.ts:96) | AssetMakeId | 1, 2 |
| [views/assets/asset/asset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-create.component.ts:98) | AssetModelId | 1, 2 |
| [views/assets/asset/asset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-create.component.ts:111) | AssetStatusId | 1, 2 |
| [views/assets/asset/asset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-create.component.ts:94) | AssetTypeId | 1, 2 |
| [views/assets/asset/asset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-create.component.ts:104) | CurrentLocationId | 1, 2 |
| [views/assets/asset/asset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-create.component.ts:106) | CurrentPartyId | 1, 2 |
| [views/assets/asset/asset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-create.component.ts:108) | CurrentPartyLocationId | 1, 2 |
| [views/assets/asset/asset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-create.component.ts:100) | OwningOrganisationId | 1, 2 |
| [views/assets/asset/asset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-create.component.ts:102) | ResponsibleOrganisationUnitId | 1, 2 |
| [views/assets/asset/asset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-edit.component.ts:92) | AssetCategoryId | (blank) |
| [views/assets/asset/asset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-edit.component.ts:95) | AssetMakeId | 1, 2 |
| [views/assets/asset/asset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-edit.component.ts:97) | AssetModelId | 1, 2 |
| [views/assets/asset/asset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-edit.component.ts:110) | AssetStatusId | 1, 2 |
| [views/assets/asset/asset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-edit.component.ts:93) | AssetTypeId | 1, 2 |
| [views/assets/asset/asset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-edit.component.ts:103) | CurrentLocationId | 1, 2 |
| [views/assets/asset/asset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-edit.component.ts:105) | CurrentPartyId | 1, 2 |
| [views/assets/asset/asset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-edit.component.ts:107) | CurrentPartyLocationId | 1, 2 |
| [views/assets/asset/asset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-edit.component.ts:99) | OwningOrganisationId | 1, 2 |
| [views/assets/asset/asset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/asset/asset-edit.component.ts:101) | ResponsibleOrganisationUnitId | 1, 2 |
| [views/assets/assetAssignment/assetAssignment-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignment/assetAssignment-create.component.ts:102) | AssetUserId | Assetuser1, Assetuser2 |
| [views/assets/assetAssignment/assetAssignment-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignment/assetAssignment-create.component.ts:100) | CustomerDepartmentId | CustDepart1, CustDepart2 |
| [views/assets/assetAssignment/assetAssignment-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignment/assetAssignment-create.component.ts:96) | PartyId | Party1, Party2 |
| [views/assets/assetAssignment/assetAssignment-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignment/assetAssignment-create.component.ts:98) | PartyLocationId | PartyLoca1, PartyLoc2 |
| [views/assets/assetAssignment/assetAssignment-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignment/assetAssignment-edit.component.ts:82) | AssetId | Asset1, Asset2 |
| [views/assets/assetAssignment/assetAssignment-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignment/assetAssignment-edit.component.ts:90) | AssetUserId | Assetuser1, Assetuser2 |
| [views/assets/assetAssignment/assetAssignment-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignment/assetAssignment-edit.component.ts:88) | CustomerDepartmentId | CustDepart1, CustDepart2 |
| [views/assets/assetAssignment/assetAssignment-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignment/assetAssignment-edit.component.ts:84) | PartyId | Party1, Party2 |
| [views/assets/assetAssignment/assetAssignment-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignment/assetAssignment-edit.component.ts:86) | PartyLocationId | PartyLoca1, PartyLoc2 |
| [views/assets/assetAssignmentHistory/assetAssignmentHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignmentHistory/assetAssignmentHistory-create.component.ts:70) | EventTypeId | Created, Changed, Ended, Transferred |
| [views/assets/assetAssignmentHistory/assetAssignmentHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignmentHistory/assetAssignmentHistory-create.component.ts:74) | FromAssetUserId | Assetuser1, Assetuser2 |
| [views/assets/assetAssignmentHistory/assetAssignmentHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignmentHistory/assetAssignmentHistory-create.component.ts:78) | FromPartyLocationId | PartLocation1, PartyLocation2 |
| [views/assets/assetAssignmentHistory/assetAssignmentHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignmentHistory/assetAssignmentHistory-create.component.ts:76) | ToAssetUserId | Assetuser1, Assetuser2 |
| [views/assets/assetAssignmentHistory/assetAssignmentHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignmentHistory/assetAssignmentHistory-create.component.ts:80) | ToPartyLocationId | Lease, Custody, Demo, Internal |
| [views/assets/assetAssignmentHistory/assetAssignmentHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignmentHistory/assetAssignmentHistory-edit.component.ts:70) | EventTypeId | Created, Changed, Ended, Transferred |
| [views/assets/assetAssignmentHistory/assetAssignmentHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignmentHistory/assetAssignmentHistory-edit.component.ts:74) | FromAssetUserId | Assetuser1, Assetuser2 |
| [views/assets/assetAssignmentHistory/assetAssignmentHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignmentHistory/assetAssignmentHistory-edit.component.ts:78) | FromPartyLocationId | PartLocation1, PartyLocation2 |
| [views/assets/assetAssignmentHistory/assetAssignmentHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignmentHistory/assetAssignmentHistory-edit.component.ts:76) | ToAssetUserId | Assetuser1, Assetuser2 |
| [views/assets/assetAssignmentHistory/assetAssignmentHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAssignmentHistory/assetAssignmentHistory-edit.component.ts:80) | ToPartyLocationId | Lease, Custody, Demo, Internal |
| [views/assets/assetAttributeDefinition/assetAttributeDefinition-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAttributeDefinition/assetAttributeDefinition-create.component.ts:74) | AssetCategoryId | (blank) |
| [views/assets/assetAttributeDefinition/assetAttributeDefinition-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAttributeDefinition/assetAttributeDefinition-create.component.ts:75) | AssetTypeId | (blank) |
| [views/assets/assetAttributeDefinition/assetAttributeDefinition-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAttributeDefinition/assetAttributeDefinition-edit.component.ts:74) | AssetCategoryId | (blank) |
| [views/assets/assetAttributeDefinition/assetAttributeDefinition-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAttributeDefinition/assetAttributeDefinition-edit.component.ts:75) | AssetTypeId | (blank) |
| [views/assets/assetAttributeOption/assetAttributeOption-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAttributeOption/assetAttributeOption-create.component.ts:67) | AssetAttributeDefinitionId | (blank) |
| [views/assets/assetAttributeOption/assetAttributeOption-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAttributeOption/assetAttributeOption-edit.component.ts:67) | AssetAttributeDefinitionId | (blank) |
| [views/assets/assetAttributeValue/assetAttributeValue-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAttributeValue/assetAttributeValue-create.component.ts:85) | AssetAttributeDefinitionId | (blank) |
| [views/assets/assetAttributeValue/assetAttributeValue-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAttributeValue/assetAttributeValue-create.component.ts:84) | AssetId | (blank) |
| [views/assets/assetAttributeValue/assetAttributeValue-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAttributeValue/assetAttributeValue-edit.component.ts:71) | AssetAttributeDefinitionId | (blank) |
| [views/assets/assetAttributeValue/assetAttributeValue-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetAttributeValue/assetAttributeValue-edit.component.ts:70) | AssetId | (blank) |
| [views/assets/assetInspection/assetInspection-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-create.component.ts:91) | AssetId | Asset1, Asset2 |
| [views/assets/assetInspection/assetInspection-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-create.component.ts:99) | ConditionGradeId | ConditionGrad1, ConditionGrad2 |
| [views/assets/assetInspection/assetInspection-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-create.component.ts:101) | InspectionStatusId | InspectionStatus1, InspectionStatus2 |
| [views/assets/assetInspection/assetInspection-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-create.component.ts:97) | InspectorUserId | AppUser1, AppUser2 |
| [views/assets/assetInspection/assetInspection-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-create.component.ts:93) | LocationId | Location1, Location2 |
| [views/assets/assetInspection/assetInspection-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-create.component.ts:95) | PartyId | Party1, Party2 |
| [views/assets/assetInspection/assetInspection-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-edit.component.ts:77) | AssetId | Asset1, Asset2 |
| [views/assets/assetInspection/assetInspection-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-edit.component.ts:85) | ConditionGradeId | ConditionGrad1, ConditionGrad2 |
| [views/assets/assetInspection/assetInspection-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-edit.component.ts:87) | InspectionStatusId | InspectionStatus1, InspectionStatus2 |
| [views/assets/assetInspection/assetInspection-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-edit.component.ts:83) | InspectorUserId | AppUser1, AppUser2 |
| [views/assets/assetInspection/assetInspection-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-edit.component.ts:79) | LocationId | Location1, Location2 |
| [views/assets/assetInspection/assetInspection-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetInspection/assetInspection-edit.component.ts:81) | PartyId | Party1, Party2 |
| [views/assets/assetLocationHistory/assetLocationHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetLocationHistory/assetLocationHistory-create.component.ts:91) | AssetId | Asset1, Asset2 |
| [views/assets/assetLocationHistory/assetLocationHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetLocationHistory/assetLocationHistory-create.component.ts:93) | FromLocationId | Location1, Location2 |
| [views/assets/assetLocationHistory/assetLocationHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetLocationHistory/assetLocationHistory-create.component.ts:97) | PartyLocationId | PartyLoca1, PartyLoc2 |
| [views/assets/assetLocationHistory/assetLocationHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetLocationHistory/assetLocationHistory-create.component.ts:95) | ToLocationId | Location1, Location2 |
| [views/assets/assetLocationHistory/assetLocationHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetLocationHistory/assetLocationHistory-edit.component.ts:77) | AssetId | Asset1, Asset2 |
| [views/assets/assetLocationHistory/assetLocationHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetLocationHistory/assetLocationHistory-edit.component.ts:79) | FromLocationId | Location1, Location2 |
| [views/assets/assetLocationHistory/assetLocationHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetLocationHistory/assetLocationHistory-edit.component.ts:83) | PartyLocationId | PartyLoca1, PartyLoc2 |
| [views/assets/assetLocationHistory/assetLocationHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetLocationHistory/assetLocationHistory-edit.component.ts:81) | ToLocationId | Location1, Location2 |
| [views/assets/assetMake/assetMake-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMake/assetMake-create.component.ts:68) | AssetCategoryId | (blank) |
| [views/assets/assetMake/assetMake-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMake/assetMake-edit.component.ts:68) | AssetCategoryId | (blank) |
| [views/assets/assetMeasureDefinition/assetMeasureDefinition-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureDefinition/assetMeasureDefinition-create.component.ts:72) | AssetCategoryId | AssetCat1, AssetCat2 |
| [views/assets/assetMeasureDefinition/assetMeasureDefinition-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureDefinition/assetMeasureDefinition-create.component.ts:74) | AssetTypeId | AssetType1, AssetType2 |
| [views/assets/assetMeasureDefinition/assetMeasureDefinition-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureDefinition/assetMeasureDefinition-create.component.ts:76) | UnitOfMeasureId | Text1, Text2 |
| [views/assets/assetMeasureDefinition/assetMeasureDefinition-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureDefinition/assetMeasureDefinition-edit.component.ts:72) | AssetCategoryId | AssetCat1, AssetCat2 |
| [views/assets/assetMeasureDefinition/assetMeasureDefinition-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureDefinition/assetMeasureDefinition-edit.component.ts:74) | AssetTypeId | AssetType1, AssetType2 |
| [views/assets/assetMeasureDefinition/assetMeasureDefinition-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureDefinition/assetMeasureDefinition-edit.component.ts:76) | UnitOfMeasureId | Text1, Text2 |
| [views/assets/assetMeasureReading/assetMeasureReading-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureReading/assetMeasureReading-create.component.ts:72) | AssetCategoryId | AssetCat1, AssetCat2 |
| [views/assets/assetMeasureReading/assetMeasureReading-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureReading/assetMeasureReading-create.component.ts:74) | AssetTypeId | AssetType1, AssetType2 |
| [views/assets/assetMeasureReading/assetMeasureReading-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureReading/assetMeasureReading-create.component.ts:76) | UnitOfMeasureId | Text1, Text2 |
| [views/assets/assetMeasureReading/assetMeasureReading-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureReading/assetMeasureReading-edit.component.ts:72) | AssetCategoryId | AssetCat1, AssetCat2 |
| [views/assets/assetMeasureReading/assetMeasureReading-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureReading/assetMeasureReading-edit.component.ts:74) | AssetTypeId | AssetType1, AssetType2 |
| [views/assets/assetMeasureReading/assetMeasureReading-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetMeasureReading/assetMeasureReading-edit.component.ts:76) | UnitOfMeasureId | Text1, Text2 |
| [views/assets/assetModel/assetModel-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetModel/assetModel-create.component.ts:71) | AssetMakeId | (blank) |
| [views/assets/assetModel/assetModel-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetModel/assetModel-create.component.ts:72) | AssetTypeId | (blank) |
| [views/assets/assetModel/assetModel-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetModel/assetModel-edit.component.ts:71) | AssetMakeId | (blank) |
| [views/assets/assetModel/assetModel-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetModel/assetModel-edit.component.ts:72) | AssetTypeId | (blank) |
| [views/assets/assetOwnershipHistory/assetOwnershipHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetOwnershipHistory/assetOwnershipHistory-create.component.ts:84) | AssetId | Asset1, Asset2 |
| [views/assets/assetOwnershipHistory/assetOwnershipHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetOwnershipHistory/assetOwnershipHistory-edit.component.ts:70) | AssetId | Asset1, Asset2 |
| [views/assets/assetStatusHistory/assetStatusHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetStatusHistory/assetStatusHistory-create.component.ts:69) | FromStatusId | Status1, Status |
| [views/assets/assetStatusHistory/assetStatusHistory-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetStatusHistory/assetStatusHistory-create.component.ts:71) | ToStatusId | Status1, Status |
| [views/assets/assetStatusHistory/assetStatusHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetStatusHistory/assetStatusHistory-edit.component.ts:69) | FromStatusId | Status1, Status |
| [views/assets/assetStatusHistory/assetStatusHistory-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetStatusHistory/assetStatusHistory-edit.component.ts:71) | ToStatusId | Status1, Status |
| [views/assets/assetType/assetType-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetType/assetType-create.component.ts:70) | AssetCategoryId | (blank) |
| [views/assets/assetType/assetType-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/assetType/assetType-edit.component.ts:70) | AssetCategoryId | (blank) |
| [views/assets/equipmentAsset/equipmentAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/equipmentAsset/equipmentAsset-create.component.ts:70) | AssetId | (blank) |
| [views/assets/equipmentAsset/equipmentAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/equipmentAsset/equipmentAsset-edit.component.ts:70) | AssetId | (blank) |
| [views/assets/iTAsset/iTAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/iTAsset/iTAsset-create.component.ts:73) | AssetId | (blank) |
| [views/assets/iTAsset/iTAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/iTAsset/iTAsset-edit.component.ts:73) | AssetId | (blank) |
| [views/assets/propertyAsset/propertyAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/assets/propertyAsset/propertyAsset-create.component.ts:71) | AssetId | (blank) |
| [views/assets/propertyAsset/propertyAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/assets/propertyAsset/propertyAsset-edit.component.ts:71) | AssetId | (blank) |

### billings

| Component | Field | Current hardcoded values |
|---|---|---|
| [views/billings/accountingEvent/accountingEvent-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/accountingEvent/accountingEvent-create.component.ts:82) | JournalEntryId | JournalEntryId1, JournalEntryId2 |
| [views/billings/accountingEvent/accountingEvent-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/accountingEvent/accountingEvent-create.component.ts:77) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/billings/accountingEvent/accountingEvent-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/accountingEvent/accountingEvent-edit.component.ts:81) | JournalEntryId | JournalEntryId1, JournalEntryId2 |
| [views/billings/accountingEvent/accountingEvent-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/accountingEvent/accountingEvent-edit.component.ts:76) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/billings/bankStatement/bankStatement-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/bankStatement/bankStatement-create.component.ts:74) | OrganisationBankAccountId | OrganisationBankAccountId1, OrganisationBankAccountId2 |
| [views/billings/bankStatement/bankStatement-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/bankStatement/bankStatement-edit.component.ts:73) | OrganisationBankAccountId | OrganisationBankAccountId1, OrganisationBankAccountId2 |
| [views/billings/bankStatementLine/bankStatementLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/bankStatementLine/bankStatementLine-create.component.ts:74) | BankStatementId | BankStatementId1, BankStatementId2 |
| [views/billings/bankStatementLine/bankStatementLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/bankStatementLine/bankStatementLine-create.component.ts:76) | MatchedPaymentReceiptId | MatchedPaymentReceiptId1, MatchedPaymentReceiptId2 |
| [views/billings/bankStatementLine/bankStatementLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/bankStatementLine/bankStatementLine-edit.component.ts:73) | BankStatementId | BankStatementId1, BankStatementId2 |
| [views/billings/bankStatementLine/bankStatementLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/bankStatementLine/bankStatementLine-edit.component.ts:75) | MatchedPaymentReceiptId | MatchedPaymentReceiptId1, MatchedPaymentReceiptId2 |
| [views/billings/billingRun/billingRun-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRun/billingRun-create.component.ts:84) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/billings/billingRun/billingRun-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRun/billingRun-create.component.ts:78) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/billingRun/billingRun-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRun/billingRun-create.component.ts:80) | BillingRunStatusId | BillingRunStatusId1, BillingRunStatusId2 |
| [views/billings/billingRun/billingRun-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRun/billingRun-edit.component.ts:83) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/billings/billingRun/billingRun-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRun/billingRun-edit.component.ts:77) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/billingRun/billingRun-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRun/billingRun-edit.component.ts:79) | BillingRunStatusId | BillingRunStatusId1, BillingRunStatusId2 |
| [views/billings/billingRunItem/billingRunItem-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRunItem/billingRunItem-create.component.ts:80) | BillingRunId | BillingRunId1, BillingRunId2 |
| [views/billings/billingRunItem/billingRunItem-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRunItem/billingRunItem-create.component.ts:91) | CustomerInvoiceId | CustomerInvoiceId1, CustomerInvoiceId2 |
| [views/billings/billingRunItem/billingRunItem-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRunItem/billingRunItem-create.component.ts:86) | LeaseContractChargeId | LeaseContractChargeId1, LeaseContractChargeId2 |
| [views/billings/billingRunItem/billingRunItem-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRunItem/billingRunItem-create.component.ts:82) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/billingRunItem/billingRunItem-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRunItem/billingRunItem-create.component.ts:84) | LeasePaymentScheduleLineId | LeasePaymentScheduleLineId1, LeasePaymentScheduleLineId2 |
| [views/billings/billingRunItem/billingRunItem-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRunItem/billingRunItem-edit.component.ts:79) | BillingRunId | BillingRunId1, BillingRunId2 |
| [views/billings/billingRunItem/billingRunItem-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRunItem/billingRunItem-edit.component.ts:90) | CustomerInvoiceId | CustomerInvoiceId1, CustomerInvoiceId2 |
| [views/billings/billingRunItem/billingRunItem-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRunItem/billingRunItem-edit.component.ts:85) | LeaseContractChargeId | LeaseContractChargeId1, LeaseContractChargeId2 |
| [views/billings/billingRunItem/billingRunItem-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRunItem/billingRunItem-edit.component.ts:81) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/billingRunItem/billingRunItem-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/billingRunItem/billingRunItem-edit.component.ts:83) | LeasePaymentScheduleLineId | LeasePaymentScheduleLineId1, LeasePaymentScheduleLineId2 |
| [views/billings/creditNote/creditNote-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNote/creditNote-create.component.ts:80) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/creditNote/creditNote-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNote/creditNote-create.component.ts:84) | CustomerInvoiceId | CustomerInvoiceId1, CustomerInvoiceId2 |
| [views/billings/creditNote/creditNote-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNote/creditNote-create.component.ts:82) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/creditNote/creditNote-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNote/creditNote-create.component.ts:86) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/creditNote/creditNote-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNote/creditNote-edit.component.ts:79) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/creditNote/creditNote-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNote/creditNote-edit.component.ts:83) | CustomerInvoiceId | CustomerInvoiceId1, CustomerInvoiceId2 |
| [views/billings/creditNote/creditNote-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNote/creditNote-edit.component.ts:81) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/creditNote/creditNote-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNote/creditNote-edit.component.ts:85) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/creditNoteLine/creditNoteLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNoteLine/creditNoteLine-create.component.ts:70) | CreditNoteId | CreditNoteId1, CreditNoteId2 |
| [views/billings/creditNoteLine/creditNoteLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNoteLine/creditNoteLine-create.component.ts:72) | CustomerInvoiceLineId | CustomerInvoiceLineId1, CustomerInvoiceLineId2 |
| [views/billings/creditNoteLine/creditNoteLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNoteLine/creditNoteLine-edit.component.ts:69) | CreditNoteId | CreditNoteId1, CreditNoteId2 |
| [views/billings/creditNoteLine/creditNoteLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/creditNoteLine/creditNoteLine-edit.component.ts:71) | CustomerInvoiceLineId | CustomerInvoiceLineId1, CustomerInvoiceLineId2 |
| [views/billings/customerDeposit/customerDeposit-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerDeposit/customerDeposit-create.component.ts:87) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/customerDeposit/customerDeposit-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerDeposit/customerDeposit-create.component.ts:85) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/customerDeposit/customerDeposit-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerDeposit/customerDeposit-create.component.ts:83) | LeaseContractDepositId | LeaseContractDepositId1, LeaseContractDepositId2 |
| [views/billings/customerDeposit/customerDeposit-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerDeposit/customerDeposit-create.component.ts:81) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/customerDeposit/customerDeposit-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerDeposit/customerDeposit-edit.component.ts:86) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/customerDeposit/customerDeposit-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerDeposit/customerDeposit-edit.component.ts:84) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/customerDeposit/customerDeposit-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerDeposit/customerDeposit-edit.component.ts:82) | LeaseContractDepositId | LeaseContractDepositId1, LeaseContractDepositId2 |
| [views/billings/customerDeposit/customerDeposit-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerDeposit/customerDeposit-edit.component.ts:80) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/customerInvoice/customerInvoice-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoice/customerInvoice-create.component.ts:87) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/customerInvoice/customerInvoice-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoice/customerInvoice-create.component.ts:89) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/customerInvoice/customerInvoice-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoice/customerInvoice-create.component.ts:85) | InvoiceStatusId | InvoiceStatusId1, InvoiceStatusId2 |
| [views/billings/customerInvoice/customerInvoice-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoice/customerInvoice-create.component.ts:91) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/customerInvoice/customerInvoice-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoice/customerInvoice-edit.component.ts:86) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/customerInvoice/customerInvoice-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoice/customerInvoice-edit.component.ts:88) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/customerInvoice/customerInvoice-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoice/customerInvoice-edit.component.ts:84) | InvoiceStatusId | InvoiceStatusId1, InvoiceStatusId2 |
| [views/billings/customerInvoice/customerInvoice-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoice/customerInvoice-edit.component.ts:90) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts:83) | CustomerInvoiceId | CustomerInvoiceId1, CustomerInvoiceId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts:91) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts:89) | LeaseContractChargeId | LeaseContractChargeId1, LeaseContractChargeId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts:85) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts:87) | LeasePaymentScheduleLineId | LeasePaymentScheduleLineId1, LeasePaymentScheduleLineId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts:94) | UOMId | UOMId1, UOMId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts:82) | CustomerInvoiceId | CustomerInvoiceId1, CustomerInvoiceId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts:90) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts:88) | LeaseContractChargeId | LeaseContractChargeId1, LeaseContractChargeId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts:84) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts:86) | LeasePaymentScheduleLineId | LeasePaymentScheduleLineId1, LeasePaymentScheduleLineId2 |
| [views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts:93) | UOMId | UOMId1, UOMId2 |
| [views/billings/customerInvoiceTax/customerInvoiceTax-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoiceTax/customerInvoiceTax-create.component.ts:74) | CustomerInvoiceId | CustomerInvoiceId1, CustomerInvoiceId2 |
| [views/billings/customerInvoiceTax/customerInvoiceTax-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoiceTax/customerInvoiceTax-create.component.ts:76) | CustomerInvoiceLineId | CustomerInvoiceLineId1, CustomerInvoiceLineId2 |
| [views/billings/customerInvoiceTax/customerInvoiceTax-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoiceTax/customerInvoiceTax-create.component.ts:80) | TaxJurisdictionId | TaxJurisdictionId1, TaxJurisdictionId2 |
| [views/billings/customerInvoiceTax/customerInvoiceTax-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoiceTax/customerInvoiceTax-create.component.ts:78) | TaxTypeId | TaxTypeId1, TaxTypeId2 |
| [views/billings/customerInvoiceTax/customerInvoiceTax-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoiceTax/customerInvoiceTax-edit.component.ts:73) | CustomerInvoiceId | CustomerInvoiceId1, CustomerInvoiceId2 |
| [views/billings/customerInvoiceTax/customerInvoiceTax-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoiceTax/customerInvoiceTax-edit.component.ts:75) | CustomerInvoiceLineId | CustomerInvoiceLineId1, CustomerInvoiceLineId2 |
| [views/billings/customerInvoiceTax/customerInvoiceTax-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoiceTax/customerInvoiceTax-edit.component.ts:79) | TaxJurisdictionId | TaxJurisdictionId1, TaxJurisdictionId2 |
| [views/billings/customerInvoiceTax/customerInvoiceTax-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerInvoiceTax/customerInvoiceTax-edit.component.ts:77) | TaxTypeId | TaxTypeId1, TaxTypeId2 |
| [views/billings/customerStatementSnapshot/customerStatementSnapshot-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerStatementSnapshot/customerStatementSnapshot-create.component.ts:79) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/customerStatementSnapshot/customerStatementSnapshot-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerStatementSnapshot/customerStatementSnapshot-create.component.ts:81) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/customerStatementSnapshot/customerStatementSnapshot-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerStatementSnapshot/customerStatementSnapshot-create.component.ts:84) | DocumentId | DocumentId1, DocumentId2 |
| [views/billings/customerStatementSnapshot/customerStatementSnapshot-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerStatementSnapshot/customerStatementSnapshot-edit.component.ts:78) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/customerStatementSnapshot/customerStatementSnapshot-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerStatementSnapshot/customerStatementSnapshot-edit.component.ts:80) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/customerStatementSnapshot/customerStatementSnapshot-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/customerStatementSnapshot/customerStatementSnapshot-edit.component.ts:83) | DocumentId | DocumentId1, DocumentId2 |
| [views/billings/debitNote/debitNote-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNote/debitNote-create.component.ts:79) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/debitNote/debitNote-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNote/debitNote-create.component.ts:83) | CustomerInvoiceId | CustomerInvoiceId1, CustomerInvoiceId2 |
| [views/billings/debitNote/debitNote-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNote/debitNote-create.component.ts:81) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/debitNote/debitNote-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNote/debitNote-create.component.ts:85) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/debitNote/debitNote-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNote/debitNote-edit.component.ts:78) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/debitNote/debitNote-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNote/debitNote-edit.component.ts:82) | CustomerInvoiceId | CustomerInvoiceId1, CustomerInvoiceId2 |
| [views/billings/debitNote/debitNote-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNote/debitNote-edit.component.ts:80) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/debitNote/debitNote-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNote/debitNote-edit.component.ts:84) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/debitNoteLine/debitNoteLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNoteLine/debitNoteLine-create.component.ts:72) | CustomerInvoiceLineId | CustomerInvoiceLineId1, CustomerInvoiceLineId2 |
| [views/billings/debitNoteLine/debitNoteLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNoteLine/debitNoteLine-create.component.ts:70) | DebitNoteId | DebitNoteId1, DebitNoteId2 |
| [views/billings/debitNoteLine/debitNoteLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNoteLine/debitNoteLine-edit.component.ts:71) | CustomerInvoiceLineId | CustomerInvoiceLineId1, CustomerInvoiceLineId2 |
| [views/billings/debitNoteLine/debitNoteLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/debitNoteLine/debitNoteLine-edit.component.ts:69) | DebitNoteId | DebitNoteId1, DebitNoteId2 |
| [views/billings/depositTransaction/depositTransaction-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/depositTransaction/depositTransaction-create.component.ts:82) | ApprovalRequestId | ApprovalRequestId1, ApprovalRequestId2 |
| [views/billings/depositTransaction/depositTransaction-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/depositTransaction/depositTransaction-create.component.ts:75) | CustomerDepositId | CustomerDepositId1, CustomerDepositId2 |
| [views/billings/depositTransaction/depositTransaction-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/depositTransaction/depositTransaction-create.component.ts:78) | PaymentReceiptId | PaymentReceiptId1, PaymentReceiptId2 |
| [views/billings/depositTransaction/depositTransaction-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/depositTransaction/depositTransaction-create.component.ts:80) | ReceivableId | ReceivableId1, ReceivableId2 |
| [views/billings/depositTransaction/depositTransaction-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/depositTransaction/depositTransaction-edit.component.ts:81) | ApprovalRequestId | ApprovalRequestId1, ApprovalRequestId2 |
| [views/billings/depositTransaction/depositTransaction-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/depositTransaction/depositTransaction-edit.component.ts:74) | CustomerDepositId | CustomerDepositId1, CustomerDepositId2 |
| [views/billings/depositTransaction/depositTransaction-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/depositTransaction/depositTransaction-edit.component.ts:77) | PaymentReceiptId | PaymentReceiptId1, PaymentReceiptId2 |
| [views/billings/depositTransaction/depositTransaction-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/depositTransaction/depositTransaction-edit.component.ts:79) | ReceivableId | ReceivableId1, ReceivableId2 |
| [views/billings/financeAccountMapping/financeAccountMapping-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeAccountMapping/financeAccountMapping-create.component.ts:72) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/billings/financeAccountMapping/financeAccountMapping-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeAccountMapping/financeAccountMapping-create.component.ts:74) | TaxTypeId | TaxTypeId1, TaxTypeId2 |
| [views/billings/financeAccountMapping/financeAccountMapping-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeAccountMapping/financeAccountMapping-edit.component.ts:71) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/billings/financeAccountMapping/financeAccountMapping-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeAccountMapping/financeAccountMapping-edit.component.ts:73) | TaxTypeId | TaxTypeId1, TaxTypeId2 |
| [views/billings/financeApprovalAction/financeApprovalAction-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeApprovalAction/financeApprovalAction-create.component.ts:72) | ActionByUserId | ActionByUserId1, ActionByUserId2 |
| [views/billings/financeApprovalAction/financeApprovalAction-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeApprovalAction/financeApprovalAction-create.component.ts:70) | FinanceApprovalRequestId | FinanceApprovalRequestId1, FinanceApprovalRequestId2 |
| [views/billings/financeApprovalAction/financeApprovalAction-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeApprovalAction/financeApprovalAction-edit.component.ts:71) | ActionByUserId | ActionByUserId1, ActionByUserId2 |
| [views/billings/financeApprovalAction/financeApprovalAction-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeApprovalAction/financeApprovalAction-edit.component.ts:69) | FinanceApprovalRequestId | FinanceApprovalRequestId1, FinanceApprovalRequestId2 |
| [views/billings/financeApprovalRequest/financeApprovalRequest-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeApprovalRequest/financeApprovalRequest-create.component.ts:77) | RequestedByUserId | RequestedByUserId1, RequestedByUserId2 |
| [views/billings/financeApprovalRequest/financeApprovalRequest-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeApprovalRequest/financeApprovalRequest-create.component.ts:75) | WorkflowInstanceId | WorkflowInstanceId1, WorkflowInstanceId2 |
| [views/billings/financeApprovalRequest/financeApprovalRequest-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeApprovalRequest/financeApprovalRequest-edit.component.ts:76) | RequestedByUserId | RequestedByUserId1, RequestedByUserId2 |
| [views/billings/financeApprovalRequest/financeApprovalRequest-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeApprovalRequest/financeApprovalRequest-edit.component.ts:74) | WorkflowInstanceId | WorkflowInstanceId1, WorkflowInstanceId2 |
| [views/billings/financeDocumentLink/financeDocumentLink-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeDocumentLink/financeDocumentLink-create.component.ts:70) | DocumentId | DocumentId1, DocumentId2 |
| [views/billings/financeDocumentLink/financeDocumentLink-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeDocumentLink/financeDocumentLink-edit.component.ts:69) | DocumentId | DocumentId1, DocumentId2 |
| [views/billings/financeException/financeException-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeException/financeException-create.component.ts:79) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/billings/financeException/financeException-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeException/financeException-edit.component.ts:78) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/billings/financeReconciliation/financeReconciliation-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeReconciliation/financeReconciliation-create.component.ts:79) | MatchedByUserId | MatchedByUserId1, MatchedByUserId2 |
| [views/billings/financeReconciliation/financeReconciliation-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/financeReconciliation/financeReconciliation-edit.component.ts:78) | MatchedByUserId | MatchedByUserId1, MatchedByUserId2 |
| [views/billings/journalEntry/journalEntry-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntry/journalEntry-create.component.ts:75) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/billings/journalEntry/journalEntry-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntry/journalEntry-edit.component.ts:74) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/billings/journalEntryLine/journalEntryLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-create.component.ts:96) | AssetId | AssetId1, AssetId2 |
| [views/billings/journalEntryLine/journalEntryLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-create.component.ts:86) | CostCentreId | CostCentreId1, CostCentreId2 |
| [views/billings/journalEntryLine/journalEntryLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-create.component.ts:92) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/journalEntryLine/journalEntryLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-create.component.ts:83) | JournalEntryId | JournalEntryId1, JournalEntryId2 |
| [views/billings/journalEntryLine/journalEntryLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-create.component.ts:94) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/journalEntryLine/journalEntryLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-create.component.ts:90) | OrganisationUnitId | OrganisationUnitId1, OrganisationUnitId2 |
| [views/billings/journalEntryLine/journalEntryLine-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-create.component.ts:88) | ProfitCentreId | ProfitCentreId1, ProfitCentreId2 |
| [views/billings/journalEntryLine/journalEntryLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-edit.component.ts:95) | AssetId | AssetId1, AssetId2 |
| [views/billings/journalEntryLine/journalEntryLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-edit.component.ts:85) | CostCentreId | CostCentreId1, CostCentreId2 |
| [views/billings/journalEntryLine/journalEntryLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-edit.component.ts:91) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/journalEntryLine/journalEntryLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-edit.component.ts:82) | JournalEntryId | JournalEntryId1, JournalEntryId2 |
| [views/billings/journalEntryLine/journalEntryLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-edit.component.ts:93) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/journalEntryLine/journalEntryLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-edit.component.ts:89) | OrganisationUnitId | OrganisationUnitId1, OrganisationUnitId2 |
| [views/billings/journalEntryLine/journalEntryLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/journalEntryLine/journalEntryLine-edit.component.ts:87) | ProfitCentreId | ProfitCentreId1, ProfitCentreId2 |
| [views/billings/paymentAllocation/paymentAllocation-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentAllocation/paymentAllocation-create.component.ts:73) | PaymentReceiptId | PaymentReceiptId1, PaymentReceiptId2 |
| [views/billings/paymentAllocation/paymentAllocation-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentAllocation/paymentAllocation-create.component.ts:75) | ReceivableId | ReceivableId1, ReceivableId2 |
| [views/billings/paymentAllocation/paymentAllocation-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentAllocation/paymentAllocation-create.component.ts:78) | ReversalOfAllocationId | ReversalOfAllocationId1, ReversalOfAllocationId2 |
| [views/billings/paymentAllocation/paymentAllocation-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentAllocation/paymentAllocation-edit.component.ts:72) | PaymentReceiptId | PaymentReceiptId1, PaymentReceiptId2 |
| [views/billings/paymentAllocation/paymentAllocation-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentAllocation/paymentAllocation-edit.component.ts:74) | ReceivableId | ReceivableId1, ReceivableId2 |
| [views/billings/paymentAllocation/paymentAllocation-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentAllocation/paymentAllocation-edit.component.ts:77) | ReversalOfAllocationId | ReversalOfAllocationId1, ReversalOfAllocationId2 |
| [views/billings/paymentReceipt/paymentReceipt-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentReceipt/paymentReceipt-create.component.ts:84) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/paymentReceipt/paymentReceipt-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentReceipt/paymentReceipt-create.component.ts:88) | OrganisationBankAccountId | OrganisationBankAccountId1, OrganisationBankAccountId2 |
| [views/billings/paymentReceipt/paymentReceipt-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentReceipt/paymentReceipt-create.component.ts:80) | ReceiptStatusId | ReceiptStatusId1, ReceiptStatusId2 |
| [views/billings/paymentReceipt/paymentReceipt-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentReceipt/paymentReceipt-create.component.ts:82) | ReceivingOrganisationId | ReceivingOrganisationId1, ReceivingOrganisationId2 |
| [views/billings/paymentReceipt/paymentReceipt-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentReceipt/paymentReceipt-edit.component.ts:83) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/paymentReceipt/paymentReceipt-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentReceipt/paymentReceipt-edit.component.ts:87) | OrganisationBankAccountId | OrganisationBankAccountId1, OrganisationBankAccountId2 |
| [views/billings/paymentReceipt/paymentReceipt-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentReceipt/paymentReceipt-edit.component.ts:79) | ReceiptStatusId | ReceiptStatusId1, ReceiptStatusId2 |
| [views/billings/paymentReceipt/paymentReceipt-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/paymentReceipt/paymentReceipt-edit.component.ts:81) | ReceivingOrganisationId | ReceivingOrganisationId1, ReceivingOrganisationId2 |
| [views/billings/receivable/receivable-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/receivable/receivable-create.component.ts:83) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/receivable/receivable-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/receivable/receivable-create.component.ts:85) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/receivable/receivable-create.component.ts](D:/Works/leasehive-client/src/app/views/billings/receivable/receivable-create.component.ts:88) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/billings/receivable/receivable-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/receivable/receivable-edit.component.ts:82) | BillingOrganisationId | BillingOrganisationId1, BillingOrganisationId2 |
| [views/billings/receivable/receivable-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/receivable/receivable-edit.component.ts:84) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/billings/receivable/receivable-edit.component.ts](D:/Works/leasehive-client/src/app/views/billings/receivable/receivable-edit.component.ts:87) | LeaseContractId | LeaseContractId1, LeaseContractId2 |

### crm

| Component | Field | Current hardcoded values |
|---|---|---|
| [views/crm/creditApplicantParty/creditApplicantParty-create.component.ts](D:/Works/leasehive-client/src/app/views/crm/creditApplicantParty/creditApplicantParty-create.component.ts:61) | CreditPartyRoleId | CreditPartRole1, CreditPartyRole2 |
| [views/crm/creditApplicantParty/creditApplicantParty-edit.component.ts](D:/Works/leasehive-client/src/app/views/crm/creditApplicantParty/creditApplicantParty-edit.component.ts:61) | CreditPartyRoleId | CreditPartRole1, CreditPartyRole2 |
| [views/crm/originationHandoff/originationHandoff-create.component.ts](D:/Works/leasehive-client/src/app/views/crm/originationHandoff/originationHandoff-create.component.ts:67) | HandoffStatusId | Ready, Sent, Accepted, Failed |
| [views/crm/originationHandoff/originationHandoff-edit.component.ts](D:/Works/leasehive-client/src/app/views/crm/originationHandoff/originationHandoff-edit.component.ts:67) | HandoffStatusId | Ready, Sent, Accepted, Failed |

### eolDisposals

| Component | Field | Current hardcoded values |
|---|---|---|
| [views/eolDisposals/assetDispositionDecision/assetDispositionDecision-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetDispositionDecision/assetDispositionDecision-create.component.ts:89) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/eolDisposals/assetDispositionDecision/assetDispositionDecision-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetDispositionDecision/assetDispositionDecision-create.component.ts:81) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetDispositionDecision/assetDispositionDecision-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetDispositionDecision/assetDispositionDecision-create.component.ts:83) | DispositionMethodId | DispositionMethodId1, DispositionMethodId2 |
| [views/eolDisposals/assetDispositionDecision/assetDispositionDecision-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetDispositionDecision/assetDispositionDecision-create.component.ts:79) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/assetDispositionDecision/assetDispositionDecision-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetDispositionDecision/assetDispositionDecision-create.component.ts:85) | ReferenceValuationId | ReferenceValuationId1, ReferenceValuationId2 |
| [views/eolDisposals/assetDispositionDecision/assetDispositionDecision-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetDispositionDecision/assetDispositionDecision-edit.component.ts:88) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/eolDisposals/assetDispositionDecision/assetDispositionDecision-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetDispositionDecision/assetDispositionDecision-edit.component.ts:80) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetDispositionDecision/assetDispositionDecision-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetDispositionDecision/assetDispositionDecision-edit.component.ts:82) | DispositionMethodId | DispositionMethodId1, DispositionMethodId2 |
| [views/eolDisposals/assetDispositionDecision/assetDispositionDecision-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetDispositionDecision/assetDispositionDecision-edit.component.ts:78) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/assetDispositionDecision/assetDispositionDecision-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetDispositionDecision/assetDispositionDecision-edit.component.ts:84) | ReferenceValuationId | ReferenceValuationId1, ReferenceValuationId2 |
| [views/eolDisposals/assetReturn/assetReturn-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-create.component.ts:81) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetReturn/assetReturn-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-create.component.ts:83) | AssetReturnScheduleId | AssetReturnScheduleId1, AssetReturnScheduleId2 |
| [views/eolDisposals/assetReturn/assetReturn-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-create.component.ts:79) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/assetReturn/assetReturn-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-create.component.ts:89) | FinalMeasureReadingId | FinalMeasureReadingId1, FinalMeasureReadingId2 |
| [views/eolDisposals/assetReturn/assetReturn-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-create.component.ts:87) | ReceivedByUserId | ReceivedByUserId1, ReceivedByUserId2 |
| [views/eolDisposals/assetReturn/assetReturn-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-create.component.ts:91) | ReturnInspectionId | ReturnInspectionId1, ReturnInspectionId2 |
| [views/eolDisposals/assetReturn/assetReturn-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-create.component.ts:85) | ReturnLocationId | ReturnLocationId1, ReturnLocationId2 |
| [views/eolDisposals/assetReturn/assetReturn-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-edit.component.ts:80) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetReturn/assetReturn-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-edit.component.ts:82) | AssetReturnScheduleId | AssetReturnScheduleId1, AssetReturnScheduleId2 |
| [views/eolDisposals/assetReturn/assetReturn-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-edit.component.ts:78) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/assetReturn/assetReturn-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-edit.component.ts:88) | FinalMeasureReadingId | FinalMeasureReadingId1, FinalMeasureReadingId2 |
| [views/eolDisposals/assetReturn/assetReturn-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-edit.component.ts:86) | ReceivedByUserId | ReceivedByUserId1, ReceivedByUserId2 |
| [views/eolDisposals/assetReturn/assetReturn-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-edit.component.ts:90) | ReturnInspectionId | ReturnInspectionId1, ReturnInspectionId2 |
| [views/eolDisposals/assetReturn/assetReturn-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturn/assetReturn-edit.component.ts:84) | ReturnLocationId | ReturnLocationId1, ReturnLocationId2 |
| [views/eolDisposals/assetReturnSchedule/assetReturnSchedule-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturnSchedule/assetReturnSchedule-create.component.ts:77) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetReturnSchedule/assetReturnSchedule-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturnSchedule/assetReturnSchedule-create.component.ts:84) | CustomerContactPartyId | CustomerContactPartyId1, CustomerContactPartyId2 |
| [views/eolDisposals/assetReturnSchedule/assetReturnSchedule-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturnSchedule/assetReturnSchedule-create.component.ts:75) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/assetReturnSchedule/assetReturnSchedule-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturnSchedule/assetReturnSchedule-create.component.ts:81) | ResponsibleOrganisationUnitId | ResponsibleOrganisationUnitId1, ResponsibleOrganisationUnitId2 |
| [views/eolDisposals/assetReturnSchedule/assetReturnSchedule-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturnSchedule/assetReturnSchedule-create.component.ts:79) | ReturnLocationId | ReturnLocationId1, ReturnLocationId2 |
| [views/eolDisposals/assetReturnSchedule/assetReturnSchedule-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturnSchedule/assetReturnSchedule-edit.component.ts:76) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetReturnSchedule/assetReturnSchedule-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturnSchedule/assetReturnSchedule-edit.component.ts:83) | CustomerContactPartyId | CustomerContactPartyId1, CustomerContactPartyId2 |
| [views/eolDisposals/assetReturnSchedule/assetReturnSchedule-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturnSchedule/assetReturnSchedule-edit.component.ts:74) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/assetReturnSchedule/assetReturnSchedule-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturnSchedule/assetReturnSchedule-edit.component.ts:80) | ResponsibleOrganisationUnitId | ResponsibleOrganisationUnitId1, ResponsibleOrganisationUnitId2 |
| [views/eolDisposals/assetReturnSchedule/assetReturnSchedule-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetReturnSchedule/assetReturnSchedule-edit.component.ts:78) | ReturnLocationId | ReturnLocationId1, ReturnLocationId2 |
| [views/eolDisposals/assetSale/assetSale-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetSale/assetSale-create.component.ts:80) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetSale/assetSale-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetSale/assetSale-create.component.ts:82) | BuyerPartyId | BuyerPartyId1, BuyerPartyId2 |
| [views/eolDisposals/assetSale/assetSale-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetSale/assetSale-create.component.ts:84) | DisposalAwardId | DisposalAwardId1, DisposalAwardId2 |
| [views/eolDisposals/assetSale/assetSale-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetSale/assetSale-create.component.ts:78) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/assetSale/assetSale-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetSale/assetSale-create.component.ts:87) | FinanceHandoffId | FinanceHandoffId1, FinanceHandoffId2 |
| [views/eolDisposals/assetSale/assetSale-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetSale/assetSale-edit.component.ts:79) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetSale/assetSale-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetSale/assetSale-edit.component.ts:81) | BuyerPartyId | BuyerPartyId1, BuyerPartyId2 |
| [views/eolDisposals/assetSale/assetSale-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetSale/assetSale-edit.component.ts:83) | DisposalAwardId | DisposalAwardId1, DisposalAwardId2 |
| [views/eolDisposals/assetSale/assetSale-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetSale/assetSale-edit.component.ts:77) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/assetSale/assetSale-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetSale/assetSale-edit.component.ts:86) | FinanceHandoffId | FinanceHandoffId1, FinanceHandoffId2 |
| [views/eolDisposals/assetScrap/assetScrap-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetScrap/assetScrap-create.component.ts:77) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetScrap/assetScrap-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetScrap/assetScrap-create.component.ts:75) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/assetScrap/assetScrap-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetScrap/assetScrap-create.component.ts:79) | RecyclerPartyId | RecyclerPartyId1, RecyclerPartyId2 |
| [views/eolDisposals/assetScrap/assetScrap-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetScrap/assetScrap-edit.component.ts:76) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetScrap/assetScrap-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetScrap/assetScrap-edit.component.ts:74) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/assetScrap/assetScrap-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetScrap/assetScrap-edit.component.ts:78) | RecyclerPartyId | RecyclerPartyId1, RecyclerPartyId2 |
| [views/eolDisposals/assetWriteOff/assetWriteOff-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetWriteOff/assetWriteOff-create.component.ts:85) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/eolDisposals/assetWriteOff/assetWriteOff-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetWriteOff/assetWriteOff-create.component.ts:79) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetWriteOff/assetWriteOff-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetWriteOff/assetWriteOff-create.component.ts:77) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/assetWriteOff/assetWriteOff-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetWriteOff/assetWriteOff-create.component.ts:83) | InsuranceClaimId | InsuranceClaimId1, InsuranceClaimId2 |
| [views/eolDisposals/assetWriteOff/assetWriteOff-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetWriteOff/assetWriteOff-edit.component.ts:84) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/eolDisposals/assetWriteOff/assetWriteOff-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetWriteOff/assetWriteOff-edit.component.ts:78) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/assetWriteOff/assetWriteOff-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetWriteOff/assetWriteOff-edit.component.ts:76) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/assetWriteOff/assetWriteOff-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/assetWriteOff/assetWriteOff-edit.component.ts:82) | InsuranceClaimId | InsuranceClaimId1, InsuranceClaimId2 |
| [views/eolDisposals/disposalAuction/disposalAuction-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAuction/disposalAuction-create.component.ts:75) | AuctionProviderPartyId | AuctionProviderPartyId1, AuctionProviderPartyId2 |
| [views/eolDisposals/disposalAuction/disposalAuction-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAuction/disposalAuction-create.component.ts:73) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/disposalAuction/disposalAuction-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAuction/disposalAuction-edit.component.ts:74) | AuctionProviderPartyId | AuctionProviderPartyId1, AuctionProviderPartyId2 |
| [views/eolDisposals/disposalAuction/disposalAuction-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAuction/disposalAuction-edit.component.ts:72) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/disposalAward/disposalAward-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAward/disposalAward-create.component.ts:89) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/eolDisposals/disposalAward/disposalAward-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAward/disposalAward-create.component.ts:86) | BuyerPartyId | BuyerPartyId1, BuyerPartyId2 |
| [views/eolDisposals/disposalAward/disposalAward-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAward/disposalAward-create.component.ts:84) | DisposalBidId | DisposalBidId1, DisposalBidId2 |
| [views/eolDisposals/disposalAward/disposalAward-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAward/disposalAward-create.component.ts:79) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/disposalAward/disposalAward-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAward/disposalAward-create.component.ts:82) | DisposalOfferId | DisposalOfferId1, DisposalOfferId2 |
| [views/eolDisposals/disposalAward/disposalAward-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAward/disposalAward-edit.component.ts:88) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/eolDisposals/disposalAward/disposalAward-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAward/disposalAward-edit.component.ts:85) | BuyerPartyId | BuyerPartyId1, BuyerPartyId2 |
| [views/eolDisposals/disposalAward/disposalAward-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAward/disposalAward-edit.component.ts:83) | DisposalBidId | DisposalBidId1, DisposalBidId2 |
| [views/eolDisposals/disposalAward/disposalAward-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAward/disposalAward-edit.component.ts:78) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/disposalAward/disposalAward-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalAward/disposalAward-edit.component.ts:81) | DisposalOfferId | DisposalOfferId1, DisposalOfferId2 |
| [views/eolDisposals/disposalBid/disposalBid-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalBid/disposalBid-create.component.ts:75) | BidderPartyId | BidderPartyId1, BidderPartyId2 |
| [views/eolDisposals/disposalBid/disposalBid-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalBid/disposalBid-create.component.ts:73) | DisposalAuctionId | DisposalAuctionId1, DisposalAuctionId2 |
| [views/eolDisposals/disposalBid/disposalBid-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalBid/disposalBid-edit.component.ts:74) | BidderPartyId | BidderPartyId1, BidderPartyId2 |
| [views/eolDisposals/disposalBid/disposalBid-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalBid/disposalBid-edit.component.ts:72) | DisposalAuctionId | DisposalAuctionId1, DisposalAuctionId2 |
| [views/eolDisposals/disposalCase/disposalCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalCase/disposalCase-create.component.ts:76) | AssetDispositionDecisionId | AssetDispositionDecisionId1, AssetDispositionDecisionId2 |
| [views/eolDisposals/disposalCase/disposalCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalCase/disposalCase-create.component.ts:78) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/disposalCase/disposalCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalCase/disposalCase-create.component.ts:84) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/eolDisposals/disposalCase/disposalCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalCase/disposalCase-create.component.ts:82) | DispositionMethodId | DispositionMethodId1, DispositionMethodId2 |
| [views/eolDisposals/disposalCase/disposalCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalCase/disposalCase-create.component.ts:80) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/eolDisposals/disposalCase/disposalCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalCase/disposalCase-edit.component.ts:75) | AssetDispositionDecisionId | AssetDispositionDecisionId1, AssetDispositionDecisionId2 |
| [views/eolDisposals/disposalCase/disposalCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalCase/disposalCase-edit.component.ts:77) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/disposalCase/disposalCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalCase/disposalCase-edit.component.ts:83) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/eolDisposals/disposalCase/disposalCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalCase/disposalCase-edit.component.ts:81) | DispositionMethodId | DispositionMethodId1, DispositionMethodId2 |
| [views/eolDisposals/disposalCase/disposalCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalCase/disposalCase-edit.component.ts:79) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/eolDisposals/disposalOffer/disposalOffer-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalOffer/disposalOffer-create.component.ts:75) | BuyerPartyId | BuyerPartyId1, BuyerPartyId2 |
| [views/eolDisposals/disposalOffer/disposalOffer-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalOffer/disposalOffer-create.component.ts:73) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/disposalOffer/disposalOffer-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalOffer/disposalOffer-edit.component.ts:74) | BuyerPartyId | BuyerPartyId1, BuyerPartyId2 |
| [views/eolDisposals/disposalOffer/disposalOffer-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalOffer/disposalOffer-edit.component.ts:72) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/disposalValuationReference/disposalValuationReference-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalValuationReference/disposalValuationReference-create.component.ts:74) | AssetValuationId | AssetValuationId1, AssetValuationId2 |
| [views/eolDisposals/disposalValuationReference/disposalValuationReference-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalValuationReference/disposalValuationReference-create.component.ts:72) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/disposalValuationReference/disposalValuationReference-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalValuationReference/disposalValuationReference-edit.component.ts:73) | AssetValuationId | AssetValuationId1, AssetValuationId2 |
| [views/eolDisposals/disposalValuationReference/disposalValuationReference-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/disposalValuationReference/disposalValuationReference-edit.component.ts:71) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts:85) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts:95) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts:87) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts:91) | EndOfLeaseReasonId | EndOfLeaseReasonId1, EndOfLeaseReasonId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts:93) | EndOfLeaseStatusId | EndOfLeaseStatusId1, EndOfLeaseStatusId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts:83) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts:81) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-create.component.ts:89) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts:84) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts:94) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts:86) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts:90) | EndOfLeaseReasonId | EndOfLeaseReasonId1, EndOfLeaseReasonId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts:92) | EndOfLeaseStatusId | EndOfLeaseStatusId1, EndOfLeaseStatusId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts:82) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts:80) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseCase/endOfLeaseCase-edit.component.ts:88) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-create.component.ts:72) | DocumentId | DocumentId1, DocumentId2 |
| [views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-create.component.ts:75) | LinkedByUserId | LinkedByUserId1, LinkedByUserId2 |
| [views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-edit.component.ts:71) | DocumentId | DocumentId1, DocumentId2 |
| [views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-edit.component.ts:74) | LinkedByUserId | LinkedByUserId1, LinkedByUserId2 |
| [views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-create.component.ts:78) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-edit.component.ts:77) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/eolDisposals/endOfLeaseNotice/endOfLeaseNotice-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseNotice/endOfLeaseNotice-create.component.ts:73) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/endOfLeaseNotice/endOfLeaseNotice-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseNotice/endOfLeaseNotice-edit.component.ts:72) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/endOfLeaseOption/endOfLeaseOption-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseOption/endOfLeaseOption-create.component.ts:72) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/endOfLeaseOption/endOfLeaseOption-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseOption/endOfLeaseOption-edit.component.ts:71) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-create.component.ts:82) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-create.component.ts:78) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-create.component.ts:76) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-edit.component.ts:81) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-edit.component.ts:77) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-edit.component.ts:75) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/endOfLeaseSettlementLine/endOfLeaseSettlementLine-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseSettlementLine/endOfLeaseSettlementLine-create.component.ts:76) | EndOfLeaseSettlementId | EndOfLeaseSettlementId1, EndOfLeaseSettlementId2 |
| [views/eolDisposals/endOfLeaseSettlementLine/endOfLeaseSettlementLine-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseSettlementLine/endOfLeaseSettlementLine-create.component.ts:78) | SettlementChargeTypeId | SettlementChargeTypeId1, SettlementChargeTypeId2 |
| [views/eolDisposals/endOfLeaseSettlementLine/endOfLeaseSettlementLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseSettlementLine/endOfLeaseSettlementLine-edit.component.ts:75) | EndOfLeaseSettlementId | EndOfLeaseSettlementId1, EndOfLeaseSettlementId2 |
| [views/eolDisposals/endOfLeaseSettlementLine/endOfLeaseSettlementLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/endOfLeaseSettlementLine/endOfLeaseSettlementLine-edit.component.ts:77) | SettlementChargeTypeId | SettlementChargeTypeId1, SettlementChargeTypeId2 |
| [views/eolDisposals/excessUsageAssessment/excessUsageAssessment-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/excessUsageAssessment/excessUsageAssessment-create.component.ts:76) | MeasureDefinitionId | MeasureDefinitionId1, MeasureDefinitionId2 |
| [views/eolDisposals/excessUsageAssessment/excessUsageAssessment-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/excessUsageAssessment/excessUsageAssessment-create.component.ts:74) | ReturnAssessmentId | ReturnAssessmentId1, ReturnAssessmentId2 |
| [views/eolDisposals/excessUsageAssessment/excessUsageAssessment-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/excessUsageAssessment/excessUsageAssessment-edit.component.ts:75) | MeasureDefinitionId | MeasureDefinitionId1, MeasureDefinitionId2 |
| [views/eolDisposals/excessUsageAssessment/excessUsageAssessment-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/excessUsageAssessment/excessUsageAssessment-edit.component.ts:73) | ReturnAssessmentId | ReturnAssessmentId1, ReturnAssessmentId2 |
| [views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-create.component.ts:88) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-create.component.ts:82) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-create.component.ts:84) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-create.component.ts:78) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-create.component.ts:80) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-edit.component.ts:87) | ApprovedByUserId | ApprovedByUserId1, ApprovedByUserId2 |
| [views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-edit.component.ts:81) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-edit.component.ts:83) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-edit.component.ts:77) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-edit.component.ts:79) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-create.component.ts:79) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-create.component.ts:77) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-create.component.ts:85) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-create.component.ts:82) | RequestedByUserId | RequestedByUserId1, RequestedByUserId2 |
| [views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-edit.component.ts:78) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-edit.component.ts:76) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-edit.component.ts:84) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-edit.component.ts:81) | RequestedByUserId | RequestedByUserId1, RequestedByUserId2 |
| [views/eolDisposals/returnAssessment/returnAssessment-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessment/returnAssessment-create.component.ts:80) | AssessedByUserId | AssessedByUserId1, AssessedByUserId2 |
| [views/eolDisposals/returnAssessment/returnAssessment-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessment/returnAssessment-create.component.ts:78) | AssetReturnId | AssetReturnId1, AssetReturnId2 |
| [views/eolDisposals/returnAssessment/returnAssessment-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessment/returnAssessment-create.component.ts:76) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/returnAssessment/returnAssessment-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessment/returnAssessment-create.component.ts:82) | ReturnInspectionId | ReturnInspectionId1, ReturnInspectionId2 |
| [views/eolDisposals/returnAssessment/returnAssessment-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessment/returnAssessment-edit.component.ts:79) | AssessedByUserId | AssessedByUserId1, AssessedByUserId2 |
| [views/eolDisposals/returnAssessment/returnAssessment-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessment/returnAssessment-edit.component.ts:77) | AssetReturnId | AssetReturnId1, AssetReturnId2 |
| [views/eolDisposals/returnAssessment/returnAssessment-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessment/returnAssessment-edit.component.ts:75) | EndOfLeaseCaseId | EndOfLeaseCaseId1, EndOfLeaseCaseId2 |
| [views/eolDisposals/returnAssessment/returnAssessment-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessment/returnAssessment-edit.component.ts:81) | ReturnInspectionId | ReturnInspectionId1, ReturnInspectionId2 |
| [views/eolDisposals/returnAssessmentDamage/returnAssessmentDamage-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessmentDamage/returnAssessmentDamage-create.component.ts:76) | InspectionItemReferenceId | InspectionItemReferenceId1, InspectionItemReferenceId2 |
| [views/eolDisposals/returnAssessmentDamage/returnAssessmentDamage-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessmentDamage/returnAssessmentDamage-create.component.ts:74) | ReturnAssessmentId | ReturnAssessmentId1, ReturnAssessmentId2 |
| [views/eolDisposals/returnAssessmentDamage/returnAssessmentDamage-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessmentDamage/returnAssessmentDamage-edit.component.ts:75) | InspectionItemReferenceId | InspectionItemReferenceId1, InspectionItemReferenceId2 |
| [views/eolDisposals/returnAssessmentDamage/returnAssessmentDamage-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnAssessmentDamage/returnAssessmentDamage-edit.component.ts:73) | ReturnAssessmentId | ReturnAssessmentId1, ReturnAssessmentId2 |
| [views/eolDisposals/returnItemChecklist/returnItemChecklist-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnItemChecklist/returnItemChecklist-create.component.ts:71) | AssetReturnId | AssetReturnId1, AssetReturnId2 |
| [views/eolDisposals/returnItemChecklist/returnItemChecklist-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/returnItemChecklist/returnItemChecklist-edit.component.ts:70) | AssetReturnId | AssetReturnId1, AssetReturnId2 |
| [views/eolDisposals/settlementAcknowledgement/settlementAcknowledgement-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/settlementAcknowledgement/settlementAcknowledgement-create.component.ts:70) | EndOfLeaseSettlementId | EndOfLeaseSettlementId1, EndOfLeaseSettlementId2 |
| [views/eolDisposals/settlementAcknowledgement/settlementAcknowledgement-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/settlementAcknowledgement/settlementAcknowledgement-create.component.ts:73) | RespondedByPartyId | RespondedByPartyId1, RespondedByPartyId2 |
| [views/eolDisposals/settlementAcknowledgement/settlementAcknowledgement-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/settlementAcknowledgement/settlementAcknowledgement-edit.component.ts:69) | EndOfLeaseSettlementId | EndOfLeaseSettlementId1, EndOfLeaseSettlementId2 |
| [views/eolDisposals/settlementAcknowledgement/settlementAcknowledgement-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/settlementAcknowledgement/settlementAcknowledgement-edit.component.ts:72) | RespondedByPartyId | RespondedByPartyId1, RespondedByPartyId2 |
| [views/eolDisposals/supplierReturn/supplierReturn-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/supplierReturn/supplierReturn-create.component.ts:77) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/supplierReturn/supplierReturn-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/supplierReturn/supplierReturn-create.component.ts:75) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/supplierReturn/supplierReturn-create.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/supplierReturn/supplierReturn-create.component.ts:79) | SupplierPartyId | SupplierPartyId1, SupplierPartyId2 |
| [views/eolDisposals/supplierReturn/supplierReturn-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/supplierReturn/supplierReturn-edit.component.ts:76) | AssetId | AssetId1, AssetId2 |
| [views/eolDisposals/supplierReturn/supplierReturn-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/supplierReturn/supplierReturn-edit.component.ts:74) | DisposalCaseId | DisposalCaseId1, DisposalCaseId2 |
| [views/eolDisposals/supplierReturn/supplierReturn-edit.component.ts](D:/Works/leasehive-client/src/app/views/eolDisposals/supplierReturn/supplierReturn-edit.component.ts:78) | SupplierPartyId | SupplierPartyId1, SupplierPartyId2 |

### leaseContracts

| Component | Field | Current hardcoded values |
|---|---|---|
| [views/leaseContracts/contractAmendment/contractAmendment-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAmendment/contractAmendment-create.component.ts:78) | ApprovalRequestId | ApprovalRequestId1, ApprovalRequestId2 |
| [views/leaseContracts/contractAmendment/contractAmendment-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAmendment/contractAmendment-create.component.ts:74) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractAmendment/contractAmendment-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAmendment/contractAmendment-edit.component.ts:77) | ApprovalRequestId | ApprovalRequestId1, ApprovalRequestId2 |
| [views/leaseContracts/contractAmendment/contractAmendment-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAmendment/contractAmendment-edit.component.ts:73) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractAmendmentChange/contractAmendmentChange-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAmendmentChange/contractAmendmentChange-create.component.ts:69) | ContractAmendmentId | ContractAmendmentId1, ContractAmendmentId2 |
| [views/leaseContracts/contractAmendmentChange/contractAmendmentChange-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAmendmentChange/contractAmendmentChange-edit.component.ts:68) | ContractAmendmentId | ContractAmendmentId1, ContractAmendmentId2 |
| [views/leaseContracts/contractApprovalAction/contractApprovalAction-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractApprovalAction/contractApprovalAction-create.component.ts:72) | ApproverUserId | ApproverUserId1, ApproverUserId2 |
| [views/leaseContracts/contractApprovalAction/contractApprovalAction-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractApprovalAction/contractApprovalAction-create.component.ts:70) | ContractApprovalRequestId | ContractApprovalRequestId1, ContractApprovalRequestId2 |
| [views/leaseContracts/contractApprovalAction/contractApprovalAction-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractApprovalAction/contractApprovalAction-create.component.ts:75) | DelegatedFromUserId | DelegatedFromUserId1, DelegatedFromUserId2 |
| [views/leaseContracts/contractApprovalAction/contractApprovalAction-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractApprovalAction/contractApprovalAction-edit.component.ts:71) | ApproverUserId | ApproverUserId1, ApproverUserId2 |
| [views/leaseContracts/contractApprovalAction/contractApprovalAction-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractApprovalAction/contractApprovalAction-edit.component.ts:69) | ContractApprovalRequestId | ContractApprovalRequestId1, ContractApprovalRequestId2 |
| [views/leaseContracts/contractApprovalAction/contractApprovalAction-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractApprovalAction/contractApprovalAction-edit.component.ts:74) | DelegatedFromUserId | DelegatedFromUserId1, DelegatedFromUserId2 |
| [views/leaseContracts/contractApprovalRequest/contractApprovalRequest-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractApprovalRequest/contractApprovalRequest-create.component.ts:71) | WorkflowDefinitionId | WorkflowDefinitionId1, WorkflowDefinitionId2 |
| [views/leaseContracts/contractApprovalRequest/contractApprovalRequest-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractApprovalRequest/contractApprovalRequest-edit.component.ts:70) | WorkflowDefinitionId | WorkflowDefinitionId1, WorkflowDefinitionId2 |
| [views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-create.component.ts:77) | ContractTerminationId | ContractTerminationId1, ContractTerminationId2 |
| [views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-create.component.ts:75) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-create.component.ts:73) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-create.component.ts:80) | ReturnLocationId | ReturnLocationId1, ReturnLocationId2 |
| [views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-edit.component.ts:76) | ContractTerminationId | ContractTerminationId1, ContractTerminationId2 |
| [views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-edit.component.ts:74) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-edit.component.ts:72) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-edit.component.ts:79) | ReturnLocationId | ReturnLocationId1, ReturnLocationId2 |
| [views/leaseContracts/contractCondition/contractCondition-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractCondition/contractCondition-create.component.ts:74) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractCondition/contractCondition-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractCondition/contractCondition-edit.component.ts:73) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractConditionEvidence/contractConditionEvidence-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractConditionEvidence/contractConditionEvidence-create.component.ts:71) | ContractConditionId | ContractConditionId1, ContractConditionId2 |
| [views/leaseContracts/contractConditionEvidence/contractConditionEvidence-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractConditionEvidence/contractConditionEvidence-create.component.ts:74) | DocumentId | DocumentId1, DocumentId2 |
| [views/leaseContracts/contractConditionEvidence/contractConditionEvidence-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractConditionEvidence/contractConditionEvidence-edit.component.ts:70) | ContractConditionId | ContractConditionId1, ContractConditionId2 |
| [views/leaseContracts/contractConditionEvidence/contractConditionEvidence-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractConditionEvidence/contractConditionEvidence-edit.component.ts:73) | DocumentId | DocumentId1, DocumentId2 |
| [views/leaseContracts/contractEvent/contractEvent-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractEvent/contractEvent-create.component.ts:70) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractEvent/contractEvent-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractEvent/contractEvent-edit.component.ts:69) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractExecution/contractExecution-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExecution/contractExecution-create.component.ts:78) | CompletionCertificateDocumentId | CompletionCertificateDocumentId1, CompletionCertificateDocumentId2 |
| [views/leaseContracts/contractExecution/contractExecution-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExecution/contractExecution-create.component.ts:76) | ExecutedDocumentId | ExecutedDocumentId1, ExecutedDocumentId2 |
| [views/leaseContracts/contractExecution/contractExecution-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExecution/contractExecution-edit.component.ts:77) | CompletionCertificateDocumentId | CompletionCertificateDocumentId1, CompletionCertificateDocumentId2 |
| [views/leaseContracts/contractExecution/contractExecution-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExecution/contractExecution-edit.component.ts:75) | ExecutedDocumentId | ExecutedDocumentId1, ExecutedDocumentId2 |
| [views/leaseContracts/contractExecutionParty/contractExecutionParty-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExecutionParty/contractExecutionParty-create.component.ts:72) | ContractExecutionId | ContractExecutionId1, ContractExecutionId2 |
| [views/leaseContracts/contractExecutionParty/contractExecutionParty-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExecutionParty/contractExecutionParty-create.component.ts:74) | LeaseContractPartyId | LeaseContractPartyId1, LeaseContractPartyId2 |
| [views/leaseContracts/contractExecutionParty/contractExecutionParty-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExecutionParty/contractExecutionParty-create.component.ts:76) | SignerPartyId | SignerPartyId1, SignerPartyId2 |
| [views/leaseContracts/contractExecutionParty/contractExecutionParty-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExecutionParty/contractExecutionParty-edit.component.ts:71) | ContractExecutionId | ContractExecutionId1, ContractExecutionId2 |
| [views/leaseContracts/contractExecutionParty/contractExecutionParty-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExecutionParty/contractExecutionParty-edit.component.ts:73) | LeaseContractPartyId | LeaseContractPartyId1, LeaseContractPartyId2 |
| [views/leaseContracts/contractExecutionParty/contractExecutionParty-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExecutionParty/contractExecutionParty-edit.component.ts:75) | SignerPartyId | SignerPartyId1, SignerPartyId2 |
| [views/leaseContracts/contractExternalReference/contractExternalReference-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExternalReference/contractExternalReference-create.component.ts:68) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractExternalReference/contractExternalReference-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractExternalReference/contractExternalReference-edit.component.ts:67) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractHandoff/contractHandoff-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractHandoff/contractHandoff-create.component.ts:71) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractHandoff/contractHandoff-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractHandoff/contractHandoff-edit.component.ts:70) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractNotice/contractNotice-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractNotice/contractNotice-create.component.ts:80) | DocumentId | DocumentId1, DocumentId2 |
| [views/leaseContracts/contractNotice/contractNotice-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractNotice/contractNotice-create.component.ts:74) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractNotice/contractNotice-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractNotice/contractNotice-create.component.ts:77) | RecipientPartyId | RecipientPartyId1, RecipientPartyId2 |
| [views/leaseContracts/contractNotice/contractNotice-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractNotice/contractNotice-edit.component.ts:79) | DocumentId | DocumentId1, DocumentId2 |
| [views/leaseContracts/contractNotice/contractNotice-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractNotice/contractNotice-edit.component.ts:73) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractNotice/contractNotice-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractNotice/contractNotice-edit.component.ts:76) | RecipientPartyId | RecipientPartyId1, RecipientPartyId2 |
| [views/leaseContracts/contractObligation/contractObligation-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractObligation/contractObligation-create.component.ts:73) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractObligation/contractObligation-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractObligation/contractObligation-edit.component.ts:72) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractObligationEvent/contractObligationEvent-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractObligationEvent/contractObligationEvent-create.component.ts:71) | ContractObligationId | ContractObligationId1, ContractObligationId2 |
| [views/leaseContracts/contractObligationEvent/contractObligationEvent-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractObligationEvent/contractObligationEvent-create.component.ts:74) | DocumentId | DocumentId1, DocumentId2 |
| [views/leaseContracts/contractObligationEvent/contractObligationEvent-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractObligationEvent/contractObligationEvent-edit.component.ts:70) | ContractObligationId | ContractObligationId1, ContractObligationId2 |
| [views/leaseContracts/contractObligationEvent/contractObligationEvent-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractObligationEvent/contractObligationEvent-edit.component.ts:73) | DocumentId | DocumentId1, DocumentId2 |
| [views/leaseContracts/contractRenewalOption/contractRenewalOption-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractRenewalOption/contractRenewalOption-create.component.ts:71) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractRenewalOption/contractRenewalOption-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractRenewalOption/contractRenewalOption-edit.component.ts:70) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractSuspension/contractSuspension-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractSuspension/contractSuspension-create.component.ts:74) | ApprovalRequestId | ApprovalRequestId1, ApprovalRequestId2 |
| [views/leaseContracts/contractSuspension/contractSuspension-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractSuspension/contractSuspension-create.component.ts:70) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractSuspension/contractSuspension-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractSuspension/contractSuspension-edit.component.ts:73) | ApprovalRequestId | ApprovalRequestId1, ApprovalRequestId2 |
| [views/leaseContracts/contractSuspension/contractSuspension-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractSuspension/contractSuspension-edit.component.ts:69) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractTermination/contractTermination-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractTermination/contractTermination-create.component.ts:77) | ApprovalRequestId | ApprovalRequestId1, ApprovalRequestId2 |
| [views/leaseContracts/contractTermination/contractTermination-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractTermination/contractTermination-create.component.ts:73) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractTermination/contractTermination-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractTermination/contractTermination-edit.component.ts:76) | ApprovalRequestId | ApprovalRequestId1, ApprovalRequestId2 |
| [views/leaseContracts/contractTermination/contractTermination-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractTermination/contractTermination-edit.component.ts:72) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/contractTerminationCharge/contractTerminationCharge-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractTerminationCharge/contractTerminationCharge-create.component.ts:67) | ContractTerminationId | ContractTerminationId1, ContractTerminationId2 |
| [views/leaseContracts/contractTerminationCharge/contractTerminationCharge-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/contractTerminationCharge/contractTerminationCharge-edit.component.ts:66) | ContractTerminationId | ContractTerminationId1, ContractTerminationId2 |
| [views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-create.component.ts:75) | FromAssetId | FromAssetId1, FromAssetId2 |
| [views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-create.component.ts:72) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-create.component.ts:77) | ToAssetId | ToAssetId1, ToAssetId2 |
| [views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-edit.component.ts:74) | FromAssetId | FromAssetId1, FromAssetId2 |
| [views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-edit.component.ts:71) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-edit.component.ts:76) | ToAssetId | ToAssetId1, ToAssetId2 |
| [views/leaseContracts/leaseContract/leaseContract-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContract/leaseContract-create.component.ts:88) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/leaseContracts/leaseContract/leaseContract-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContract/leaseContract-create.component.ts:90) | LeaseContractStatusId | LeaseContractStatusId1, LeaseContractStatusId2 |
| [views/leaseContracts/leaseContract/leaseContract-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContract/leaseContract-create.component.ts:84) | LessorOrganisationId | LessorOrganisationId1, LessorOrganisationId2 |
| [views/leaseContracts/leaseContract/leaseContract-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContract/leaseContract-create.component.ts:93) | QuoteId | QuoteId1, QuoteId2 |
| [views/leaseContracts/leaseContract/leaseContract-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContract/leaseContract-create.component.ts:86) | ServicingOrganisationUnitId | ServicingOrganisationUnitId1, ServicingOrganisationUnitId2 |
| [views/leaseContracts/leaseContract/leaseContract-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContract/leaseContract-edit.component.ts:87) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/leaseContracts/leaseContract/leaseContract-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContract/leaseContract-edit.component.ts:89) | LeaseContractStatusId | LeaseContractStatusId1, LeaseContractStatusId2 |
| [views/leaseContracts/leaseContract/leaseContract-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContract/leaseContract-edit.component.ts:83) | LessorOrganisationId | LessorOrganisationId1, LessorOrganisationId2 |
| [views/leaseContracts/leaseContract/leaseContract-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContract/leaseContract-edit.component.ts:92) | QuoteId | QuoteId1, QuoteId2 |
| [views/leaseContracts/leaseContract/leaseContract-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContract/leaseContract-edit.component.ts:85) | ServicingOrganisationUnitId | ServicingOrganisationUnitId1, ServicingOrganisationUnitId2 |
| [views/leaseContracts/leaseContractAsset/leaseContractAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractAsset/leaseContractAsset-create.component.ts:81) | AssetCategoryId | AssetCategoryId1, AssetCategoryId2 |
| [views/leaseContracts/leaseContractAsset/leaseContractAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractAsset/leaseContractAsset-create.component.ts:79) | AssetId | AssetId1, AssetId2 |
| [views/leaseContracts/leaseContractAsset/leaseContractAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractAsset/leaseContractAsset-create.component.ts:83) | AssetTypeId | AssetTypeId1, AssetTypeId2 |
| [views/leaseContracts/leaseContractAsset/leaseContractAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractAsset/leaseContractAsset-create.component.ts:77) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leaseContractAsset/leaseContractAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractAsset/leaseContractAsset-create.component.ts:85) | UOMId | UOMId1, UOMId2 |
| [views/leaseContracts/leaseContractAsset/leaseContractAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractAsset/leaseContractAsset-edit.component.ts:80) | AssetCategoryId | AssetCategoryId1, AssetCategoryId2 |
| [views/leaseContracts/leaseContractAsset/leaseContractAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractAsset/leaseContractAsset-edit.component.ts:78) | AssetId | AssetId1, AssetId2 |
| [views/leaseContracts/leaseContractAsset/leaseContractAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractAsset/leaseContractAsset-edit.component.ts:82) | AssetTypeId | AssetTypeId1, AssetTypeId2 |
| [views/leaseContracts/leaseContractAsset/leaseContractAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractAsset/leaseContractAsset-edit.component.ts:76) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leaseContractAsset/leaseContractAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractAsset/leaseContractAsset-edit.component.ts:84) | UOMId | UOMId1, UOMId2 |
| [views/leaseContracts/leaseContractCharge/leaseContractCharge-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractCharge/leaseContractCharge-create.component.ts:73) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leaseContractCharge/leaseContractCharge-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractCharge/leaseContractCharge-edit.component.ts:72) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leaseContractDeposit/leaseContractDeposit-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractDeposit/leaseContractDeposit-create.component.ts:71) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leaseContractDeposit/leaseContractDeposit-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractDeposit/leaseContractDeposit-edit.component.ts:70) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leaseContractDocumentLink/leaseContractDocumentLink-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractDocumentLink/leaseContractDocumentLink-create.component.ts:69) | DocumentId | DocumentId1, DocumentId2 |
| [views/leaseContracts/leaseContractDocumentLink/leaseContractDocumentLink-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractDocumentLink/leaseContractDocumentLink-edit.component.ts:68) | DocumentId | DocumentId1, DocumentId2 |
| [views/leaseContracts/leaseContractParty/leaseContractParty-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractParty/leaseContractParty-create.component.ts:73) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leaseContractParty/leaseContractParty-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractParty/leaseContractParty-create.component.ts:75) | PartyId | PartyId1, PartyId2 |
| [views/leaseContracts/leaseContractParty/leaseContractParty-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractParty/leaseContractParty-edit.component.ts:72) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leaseContractParty/leaseContractParty-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractParty/leaseContractParty-edit.component.ts:74) | PartyId | PartyId1, PartyId2 |
| [views/leaseContracts/leaseContractTerm/leaseContractTerm-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractTerm/leaseContractTerm-create.component.ts:72) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leaseContractTerm/leaseContractTerm-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leaseContractTerm/leaseContractTerm-edit.component.ts:71) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule-create.component.ts:74) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule-edit.component.ts:73) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/leaseContracts/leasePaymentScheduleLine/leasePaymentScheduleLine-create.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leasePaymentScheduleLine/leasePaymentScheduleLine-create.component.ts:65) | LeasePaymentScheduleId | LeasePaymentScheduleId1, LeasePaymentScheduleId2 |
| [views/leaseContracts/leasePaymentScheduleLine/leasePaymentScheduleLine-edit.component.ts](D:/Works/leasehive-client/src/app/views/leaseContracts/leasePaymentScheduleLine/leasePaymentScheduleLine-edit.component.ts:64) | LeasePaymentScheduleId | LeasePaymentScheduleId1, LeasePaymentScheduleId2 |

### maintenanceInsurances

| Component | Field | Current hardcoded values |
|---|---|---|
| [views/maintenanceInsurances/assetDowntime/assetDowntime-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetDowntime/assetDowntime-create.component.ts:76) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/assetDowntime/assetDowntime-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetDowntime/assetDowntime-create.component.ts:80) | InsuranceIncidentId | InsuranceIncidentId1, InsuranceIncidentId2 |
| [views/maintenanceInsurances/assetDowntime/assetDowntime-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetDowntime/assetDowntime-create.component.ts:78) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/assetDowntime/assetDowntime-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetDowntime/assetDowntime-create.component.ts:84) | ReplacementAssetId | ReplacementAssetId1, ReplacementAssetId2 |
| [views/maintenanceInsurances/assetDowntime/assetDowntime-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetDowntime/assetDowntime-edit.component.ts:75) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/assetDowntime/assetDowntime-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetDowntime/assetDowntime-edit.component.ts:79) | InsuranceIncidentId | InsuranceIncidentId1, InsuranceIncidentId2 |
| [views/maintenanceInsurances/assetDowntime/assetDowntime-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetDowntime/assetDowntime-edit.component.ts:77) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/assetDowntime/assetDowntime-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetDowntime/assetDowntime-edit.component.ts:83) | ReplacementAssetId | ReplacementAssetId1, ReplacementAssetId2 |
| [views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan-create.component.ts:73) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan-create.component.ts:75) | MaintenancePlanId | MaintenancePlanId1, MaintenancePlanId2 |
| [views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan-edit.component.ts:72) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan-edit.component.ts:74) | MaintenancePlanId | MaintenancePlanId1, MaintenancePlanId2 |
| [views/maintenanceInsurances/insuranceClaim/insuranceClaim-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaim/insuranceClaim-create.component.ts:90) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/maintenanceInsurances/insuranceClaim/insuranceClaim-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaim/insuranceClaim-create.component.ts:87) | InsuranceClaimStatusId | InsuranceClaimStatusId1, InsuranceClaimStatusId2 |
| [views/maintenanceInsurances/insuranceClaim/insuranceClaim-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaim/insuranceClaim-create.component.ts:81) | InsuranceIncidentId | InsuranceIncidentId1, InsuranceIncidentId2 |
| [views/maintenanceInsurances/insuranceClaim/insuranceClaim-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaim/insuranceClaim-create.component.ts:85) | InsurancePolicyAssetId | InsurancePolicyAssetId1, InsurancePolicyAssetId2 |
| [views/maintenanceInsurances/insuranceClaim/insuranceClaim-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaim/insuranceClaim-create.component.ts:83) | InsurancePolicyId | InsurancePolicyId1, InsurancePolicyId2 |
| [views/maintenanceInsurances/insuranceClaim/insuranceClaim-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaim/insuranceClaim-edit.component.ts:89) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/maintenanceInsurances/insuranceClaim/insuranceClaim-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaim/insuranceClaim-edit.component.ts:86) | InsuranceClaimStatusId | InsuranceClaimStatusId1, InsuranceClaimStatusId2 |
| [views/maintenanceInsurances/insuranceClaim/insuranceClaim-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaim/insuranceClaim-edit.component.ts:80) | InsuranceIncidentId | InsuranceIncidentId1, InsuranceIncidentId2 |
| [views/maintenanceInsurances/insuranceClaim/insuranceClaim-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaim/insuranceClaim-edit.component.ts:84) | InsurancePolicyAssetId | InsurancePolicyAssetId1, InsurancePolicyAssetId2 |
| [views/maintenanceInsurances/insuranceClaim/insuranceClaim-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaim/insuranceClaim-edit.component.ts:82) | InsurancePolicyId | InsurancePolicyId1, InsurancePolicyId2 |
| [views/maintenanceInsurances/insuranceClaimAssessment/insuranceClaimAssessment-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaimAssessment/insuranceClaimAssessment-create.component.ts:77) | AssessorPartyId | AssessorPartyId1, AssessorPartyId2 |
| [views/maintenanceInsurances/insuranceClaimAssessment/insuranceClaimAssessment-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaimAssessment/insuranceClaimAssessment-create.component.ts:75) | InsuranceClaimId | InsuranceClaimId1, InsuranceClaimId2 |
| [views/maintenanceInsurances/insuranceClaimAssessment/insuranceClaimAssessment-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaimAssessment/insuranceClaimAssessment-edit.component.ts:76) | AssessorPartyId | AssessorPartyId1, AssessorPartyId2 |
| [views/maintenanceInsurances/insuranceClaimAssessment/insuranceClaimAssessment-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaimAssessment/insuranceClaimAssessment-edit.component.ts:74) | InsuranceClaimId | InsuranceClaimId1, InsuranceClaimId2 |
| [views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-create.component.ts:84) | FinanceReferenceId | FinanceReferenceId1, FinanceReferenceId2 |
| [views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-create.component.ts:78) | InsuranceClaimId | InsuranceClaimId1, InsuranceClaimId2 |
| [views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-create.component.ts:82) | PayeePartyId | PayeePartyId1, PayeePartyId2 |
| [views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-edit.component.ts:83) | FinanceReferenceId | FinanceReferenceId1, FinanceReferenceId2 |
| [views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-edit.component.ts:77) | InsuranceClaimId | InsuranceClaimId1, InsuranceClaimId2 |
| [views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-edit.component.ts:81) | PayeePartyId | PayeePartyId1, PayeePartyId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts:82) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts:91) | AssetUserId | AssetUserId1, AssetUserId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts:89) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts:84) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts:87) | LocationId | LocationId1, LocationId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts:93) | ReportedByUserId | ReportedByUserId1, ReportedByUserId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts:81) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts:90) | AssetUserId | AssetUserId1, AssetUserId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts:88) | CustomerPartyId | CustomerPartyId1, CustomerPartyId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts:83) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts:86) | LocationId | LocationId1, LocationId2 |
| [views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts:92) | ReportedByUserId | ReportedByUserId1, ReportedByUserId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts:90) | BrokerPartyId | BrokerPartyId1, BrokerPartyId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts:95) | CoverageTypeId | CoverageTypeId1, CoverageTypeId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts:92) | InsurancePolicyStatusId | InsurancePolicyStatusId1, InsurancePolicyStatusId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts:88) | InsurerPartyId | InsurerPartyId1, InsurerPartyId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts:86) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts:98) | PaymentReferenceId | PaymentReferenceId1, PaymentReferenceId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts:100) | PreviousPolicyId | PreviousPolicyId1, PreviousPolicyId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts:89) | BrokerPartyId | BrokerPartyId1, BrokerPartyId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts:94) | CoverageTypeId | CoverageTypeId1, CoverageTypeId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts:91) | InsurancePolicyStatusId | InsurancePolicyStatusId1, InsurancePolicyStatusId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts:87) | InsurerPartyId | InsurerPartyId1, InsurerPartyId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts:85) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts:97) | PaymentReferenceId | PaymentReferenceId1, PaymentReferenceId2 |
| [views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts:99) | PreviousPolicyId | PreviousPolicyId1, PreviousPolicyId2 |
| [views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-create.component.ts:81) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-create.component.ts:88) | BeneficiaryPartyId | BeneficiaryPartyId1, BeneficiaryPartyId2 |
| [views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-create.component.ts:85) | CoverageTypeId | CoverageTypeId1, CoverageTypeId2 |
| [views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-create.component.ts:79) | InsurancePolicyId | InsurancePolicyId1, InsurancePolicyId2 |
| [views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-create.component.ts:83) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-edit.component.ts:80) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-edit.component.ts:87) | BeneficiaryPartyId | BeneficiaryPartyId1, BeneficiaryPartyId2 |
| [views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-edit.component.ts:84) | CoverageTypeId | CoverageTypeId1, CoverageTypeId2 |
| [views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-edit.component.ts:78) | InsurancePolicyId | InsurancePolicyId1, InsurancePolicyId2 |
| [views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-edit.component.ts:82) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/maintenanceInsurances/insurancePolicyEndorsement/insurancePolicyEndorsement-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyEndorsement/insurancePolicyEndorsement-create.component.ts:73) | InsurancePolicyId | InsurancePolicyId1, InsurancePolicyId2 |
| [views/maintenanceInsurances/insurancePolicyEndorsement/insurancePolicyEndorsement-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insurancePolicyEndorsement/insurancePolicyEndorsement-edit.component.ts:72) | InsurancePolicyId | InsurancePolicyId1, InsurancePolicyId2 |
| [views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-create.component.ts:82) | FinanceReferenceId | FinanceReferenceId1, FinanceReferenceId2 |
| [views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-create.component.ts:76) | InsuranceClaimId | InsuranceClaimId1, InsuranceClaimId2 |
| [views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-create.component.ts:79) | RecoveryPartyId | RecoveryPartyId1, RecoveryPartyId2 |
| [views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-edit.component.ts:81) | FinanceReferenceId | FinanceReferenceId1, FinanceReferenceId2 |
| [views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-edit.component.ts:75) | InsuranceClaimId | InsuranceClaimId1, InsuranceClaimId2 |
| [views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-edit.component.ts:78) | RecoveryPartyId | RecoveryPartyId1, RecoveryPartyId2 |
| [views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-create.component.ts:84) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-create.component.ts:76) | InsurancePolicyId | InsurancePolicyId1, InsurancePolicyId2 |
| [views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-create.component.ts:82) | NewInsurancePolicyId | NewInsurancePolicyId1, NewInsurancePolicyId2 |
| [views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-create.component.ts:79) | ProposedInsurerPartyId | ProposedInsurerPartyId1, ProposedInsurerPartyId2 |
| [views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-edit.component.ts:83) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-edit.component.ts:75) | InsurancePolicyId | InsurancePolicyId1, InsurancePolicyId2 |
| [views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-edit.component.ts:81) | NewInsurancePolicyId | NewInsurancePolicyId1, NewInsurancePolicyId2 |
| [views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-edit.component.ts:78) | ProposedInsurerPartyId | ProposedInsurerPartyId1, ProposedInsurerPartyId2 |
| [views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-create.component.ts:77) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-create.component.ts:79) | ConditionGradeId | ConditionGradeId1, ConditionGradeId2 |
| [views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-create.component.ts:75) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-create.component.ts:81) | VerifiedByUserId | VerifiedByUserId1, VerifiedByUserId2 |
| [views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-edit.component.ts:76) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-edit.component.ts:78) | ConditionGradeId | ConditionGradeId1, ConditionGradeId2 |
| [views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-edit.component.ts:74) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion-edit.component.ts:80) | VerifiedByUserId | VerifiedByUserId1, VerifiedByUserId2 |
| [views/maintenanceInsurances/maintenanceException/maintenanceException-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceException/maintenanceException-create.component.ts:78) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/maintenanceInsurances/maintenanceException/maintenanceException-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceException/maintenanceException-edit.component.ts:77) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/maintenanceInsurances/maintenanceInsuranceDocumentLink/maintenanceInsuranceDocumentLink-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceInsuranceDocumentLink/maintenanceInsuranceDocumentLink-create.component.ts:70) | DocumentId | DocumentId1, DocumentId2 |
| [views/maintenanceInsurances/maintenanceInsuranceDocumentLink/maintenanceInsuranceDocumentLink-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceInsuranceDocumentLink/maintenanceInsuranceDocumentLink-edit.component.ts:69) | DocumentId | DocumentId1, DocumentId2 |
| [views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-create.component.ts:81) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-edit.component.ts:80) | AssignedToUserId | AssignedToUserId1, AssignedToUserId2 |
| [views/maintenanceInsurances/maintenancePlan/maintenancePlan-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenancePlan/maintenancePlan-create.component.ts:83) | AssetCategoryId | AssetCategoryId1, AssetCategoryId2 |
| [views/maintenanceInsurances/maintenancePlan/maintenancePlan-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenancePlan/maintenancePlan-create.component.ts:87) | AssetModelId | AssetModelId1, AssetModelId2 |
| [views/maintenanceInsurances/maintenancePlan/maintenancePlan-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenancePlan/maintenancePlan-create.component.ts:85) | AssetTypeId | AssetTypeId1, AssetTypeId2 |
| [views/maintenanceInsurances/maintenancePlan/maintenancePlan-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenancePlan/maintenancePlan-create.component.ts:81) | MaintenanceTypeId | MaintenanceTypeId1, MaintenanceTypeId2 |
| [views/maintenanceInsurances/maintenancePlan/maintenancePlan-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenancePlan/maintenancePlan-create.component.ts:90) | MeasureDefinitionId | MeasureDefinitionId1, MeasureDefinitionId2 |
| [views/maintenanceInsurances/maintenancePlan/maintenancePlan-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenancePlan/maintenancePlan-edit.component.ts:82) | AssetCategoryId | AssetCategoryId1, AssetCategoryId2 |
| [views/maintenanceInsurances/maintenancePlan/maintenancePlan-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenancePlan/maintenancePlan-edit.component.ts:86) | AssetModelId | AssetModelId1, AssetModelId2 |
| [views/maintenanceInsurances/maintenancePlan/maintenancePlan-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenancePlan/maintenancePlan-edit.component.ts:84) | AssetTypeId | AssetTypeId1, AssetTypeId2 |
| [views/maintenanceInsurances/maintenancePlan/maintenancePlan-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenancePlan/maintenancePlan-edit.component.ts:80) | MaintenanceTypeId | MaintenanceTypeId1, MaintenanceTypeId2 |
| [views/maintenanceInsurances/maintenancePlan/maintenancePlan-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenancePlan/maintenancePlan-edit.component.ts:89) | MeasureDefinitionId | MeasureDefinitionId1, MeasureDefinitionId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts:81) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts:92) | LocationId | LocationId1, LocationId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts:83) | MaintenanceScheduleId | MaintenanceScheduleId1, MaintenanceScheduleId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts:85) | MaintenanceTypeId | MaintenanceTypeId1, MaintenanceTypeId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts:88) | RequestedByPartyId | RequestedByPartyId1, RequestedByPartyId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts:90) | RequestedByUserId | RequestedByUserId1, RequestedByUserId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts:80) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts:91) | LocationId | LocationId1, LocationId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts:82) | MaintenanceScheduleId | MaintenanceScheduleId1, MaintenanceScheduleId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts:84) | MaintenanceTypeId | MaintenanceTypeId1, MaintenanceTypeId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts:87) | RequestedByPartyId | RequestedByPartyId1, RequestedByPartyId2 |
| [views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts:89) | RequestedByUserId | RequestedByUserId1, RequestedByUserId2 |
| [views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts:81) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts:79) | AssetMaintenancePlanId | AssetMaintenancePlanId1, AssetMaintenancePlanId2 |
| [views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts:83) | MaintenancePlanId | MaintenancePlanId1, MaintenancePlanId2 |
| [views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts:86) | PlannedOrganisationUnitId | PlannedOrganisationUnitId1, PlannedOrganisationUnitId2 |
| [views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts:88) | PreferredServiceProviderPartyId | PreferredServiceProviderPartyId1, PreferredServiceProviderPartyId2 |
| [views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts:80) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts:78) | AssetMaintenancePlanId | AssetMaintenancePlanId1, AssetMaintenancePlanId2 |
| [views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts:82) | MaintenancePlanId | MaintenancePlanId1, MaintenancePlanId2 |
| [views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts:85) | PlannedOrganisationUnitId | PlannedOrganisationUnitId1, PlannedOrganisationUnitId2 |
| [views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts:87) | PreferredServiceProviderPartyId | PreferredServiceProviderPartyId1, PreferredServiceProviderPartyId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts:92) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts:112) | InsuranceClaimId | InsuranceClaimId1, InsuranceClaimId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts:100) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts:98) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts:94) | MaintenanceRequestId | MaintenanceRequestId1, MaintenanceRequestId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts:96) | MaintenanceScheduleId | MaintenanceScheduleId1, MaintenanceScheduleId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts:102) | MaintenanceTypeId | MaintenanceTypeId1, MaintenanceTypeId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts:108) | ResponsibleOrganisationUnitId | ResponsibleOrganisationUnitId1, ResponsibleOrganisationUnitId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts:106) | ServiceLocationId | ServiceLocationId1, ServiceLocationId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts:104) | ServiceProviderPartyId | ServiceProviderPartyId1, ServiceProviderPartyId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts:91) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts:111) | InsuranceClaimId | InsuranceClaimId1, InsuranceClaimId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts:99) | LeaseContractAssetId | LeaseContractAssetId1, LeaseContractAssetId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts:97) | LeaseContractId | LeaseContractId1, LeaseContractId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts:93) | MaintenanceRequestId | MaintenanceRequestId1, MaintenanceRequestId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts:95) | MaintenanceScheduleId | MaintenanceScheduleId1, MaintenanceScheduleId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts:101) | MaintenanceTypeId | MaintenanceTypeId1, MaintenanceTypeId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts:107) | ResponsibleOrganisationUnitId | ResponsibleOrganisationUnitId1, ResponsibleOrganisationUnitId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts:105) | ServiceLocationId | ServiceLocationId1, ServiceLocationId2 |
| [views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts:103) | ServiceProviderPartyId | ServiceProviderPartyId1, ServiceProviderPartyId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-create.component.ts:73) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-create.component.ts:75) | TechnicianPartyId | TechnicianPartyId1, TechnicianPartyId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-create.component.ts:77) | TechnicianUserId | TechnicianUserId1, TechnicianUserId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-edit.component.ts:72) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-edit.component.ts:74) | TechnicianPartyId | TechnicianPartyId1, TechnicianPartyId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour-edit.component.ts:76) | TechnicianUserId | TechnicianUserId1, TechnicianUserId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderPart/maintenanceWorkOrderPart-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderPart/maintenanceWorkOrderPart-create.component.ts:74) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderPart/maintenanceWorkOrderPart-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderPart/maintenanceWorkOrderPart-create.component.ts:77) | ProcurementReferenceId | ProcurementReferenceId1, ProcurementReferenceId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderPart/maintenanceWorkOrderPart-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderPart/maintenanceWorkOrderPart-edit.component.ts:73) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderPart/maintenanceWorkOrderPart-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderPart/maintenanceWorkOrderPart-edit.component.ts:76) | ProcurementReferenceId | ProcurementReferenceId1, ProcurementReferenceId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderService/maintenanceWorkOrderService-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderService/maintenanceWorkOrderService-create.component.ts:73) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderService/maintenanceWorkOrderService-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderService/maintenanceWorkOrderService-create.component.ts:75) | ServiceProviderPartyId | ServiceProviderPartyId1, ServiceProviderPartyId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderService/maintenanceWorkOrderService-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderService/maintenanceWorkOrderService-edit.component.ts:72) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderService/maintenanceWorkOrderService-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderService/maintenanceWorkOrderService-edit.component.ts:74) | ServiceProviderPartyId | ServiceProviderPartyId1, ServiceProviderPartyId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderTask/maintenanceWorkOrderTask-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderTask/maintenanceWorkOrderTask-create.component.ts:76) | CompletedByUserId | CompletedByUserId1, CompletedByUserId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderTask/maintenanceWorkOrderTask-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderTask/maintenanceWorkOrderTask-create.component.ts:73) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderTask/maintenanceWorkOrderTask-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderTask/maintenanceWorkOrderTask-edit.component.ts:75) | CompletedByUserId | CompletedByUserId1, CompletedByUserId2 |
| [views/maintenanceInsurances/maintenanceWorkOrderTask/maintenanceWorkOrderTask-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/maintenanceWorkOrderTask/maintenanceWorkOrderTask-edit.component.ts:72) | MaintenanceWorkOrderId | MaintenanceWorkOrderId1, MaintenanceWorkOrderId2 |
| [views/maintenanceInsurances/serviceAgreement/serviceAgreement-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreement/serviceAgreement-create.component.ts:77) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/maintenanceInsurances/serviceAgreement/serviceAgreement-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreement/serviceAgreement-create.component.ts:79) | ServiceProviderPartyId | ServiceProviderPartyId1, ServiceProviderPartyId2 |
| [views/maintenanceInsurances/serviceAgreement/serviceAgreement-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreement/serviceAgreement-edit.component.ts:76) | OrganisationId | OrganisationId1, OrganisationId2 |
| [views/maintenanceInsurances/serviceAgreement/serviceAgreement-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreement/serviceAgreement-edit.component.ts:78) | ServiceProviderPartyId | ServiceProviderPartyId1, ServiceProviderPartyId2 |
| [views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-create.component.ts:78) | AssetCategoryId | AssetCategoryId1, AssetCategoryId2 |
| [views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-create.component.ts:82) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-create.component.ts:80) | AssetTypeId | AssetTypeId1, AssetTypeId2 |
| [views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-create.component.ts:84) | MaintenanceTypeId | MaintenanceTypeId1, MaintenanceTypeId2 |
| [views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-create.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-create.component.ts:76) | ServiceAgreementId | ServiceAgreementId1, ServiceAgreementId2 |
| [views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-edit.component.ts:77) | AssetCategoryId | AssetCategoryId1, AssetCategoryId2 |
| [views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-edit.component.ts:81) | AssetId | AssetId1, AssetId2 |
| [views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-edit.component.ts:79) | AssetTypeId | AssetTypeId1, AssetTypeId2 |
| [views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-edit.component.ts:83) | MaintenanceTypeId | MaintenanceTypeId1, MaintenanceTypeId2 |
| [views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-edit.component.ts](D:/Works/leasehive-client/src/app/views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-edit.component.ts:75) | ServiceAgreementId | ServiceAgreementId1, ServiceAgreementId2 |

## Implementation after confirmation

- Reuse LoggedInUserService lookup helpers and add server lookup types where necessary.
- Use tenant-scoped entity data and readable names/codes; never seed fake EntityNameId1 rows.
- Apply parent filters where relationships require them (party, organisation, unit, contract, etc.).
- Load both create and edit forms, retaining the current selection, including inactive selected records.
- Verify selected records remain available beyond the first 100 results; add search/paging where needed.
- Validate ambiguous references against server models before selecting their lookup source.

No server/client wiring changes are made until confirmation.
