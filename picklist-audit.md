# Picklist category approval list

Repository-based audit of the entire frontend; live database contents have not been queried. No application code changes or insert script are included.

## BillingRun findings

| Category | Action | Values |
|---|---|---|
| RunType | Create | SCHEDULED, ADHOC, FINAL, ADJUSTMENT |
| CurrencyCode | Reuse existing | INR, USD, GBP |
| RecordStatus | Add missing values; preserve existing values | Draft, Inactive, Archived (Active already seeded) |

BillingOrganisationId, BillingRunStatusId and ApprovedByUserId are entity lookups and are excluded from picklist seeding.

## Proposed new categories across the frontend

These names have genuine enumerated options and no matching general seed category. Where multiple sets exist, use entity-specific categories; approve the existing value sets separately instead of taking their union. The detailed inventory below shows every set and source file.

| Candidate category | Mapping decision |
|---|---|
| AcceptanceMethodCode | One value set |
| ActionCode | 2 distinct value sets: entity-specific mapping |
| ActivityType | One value set |
| AgreementTypeCode | One value set |
| AllocationStatusCode | One value set |
| AllocationType | One value set |
| AmendmentStatusCode | One value set |
| AmendmentTypeCode | One value set |
| ApprovalStatus | 2 distinct value sets: entity-specific mapping |
| ApprovalStatusCode | One value set |
| AssessmentStatusCode | One value set |
| AssessmentTypeCode | One value set |
| AssignmentType | One value set |
| AwardSourceCode | One value set |
| BidStatusCode | One value set |
| BillingFrequency | One value set |
| BillingStatusCode | One value set |
| CalculationMethodCode | One value set |
| CalculationTypeCode | One value set |
| ChangeSectionCode | One value set |
| ChargeTypeCode | 3 distinct value sets: entity-specific mapping |
| ChecklistStatus | One value set |
| Classification | One value set |
| ConditionCode | One value set |
| ConditionStatus | One value set |
| ConditionType | One value set |
| ConditionTypeCode | One value set |
| CoverageCode | One value set |
| CreditPolicyCode | One value set |
| CustomerImpactCode | One value set |
| CustomerResponseCode | One value set |
| DataTypeCode | One value set |
| DecisionCode | 2 distinct value sets: entity-specific mapping |
| DecisionReasonCode | One value set |
| DeliveryChannelCode | One value set |
| DeliveryMethodCode | One value set |
| DeliveryStatusCode | One value set |
| DepositStatus | One value set |
| DepositTypeCode | One value set |
| DirectionCode | One value set |
| DiscountTypeCode | One value set |
| DocumentPurposeCode | 2 distinct value sets: entity-specific mapping |
| DocumentRole | One value set |
| DocumentRoleCode | 2 distinct value sets: entity-specific mapping |
| DomainCode | One value set |
| DowntimeReasonCode | One value set |
| DueEventCode | One value set |
| DueStatusCode | One value set |
| EmissionNormCode | One value set |
| EndorsementTypeCode | One value set |
| EventCode | One value set |
| EventType | One value set |
| EventTypeCode | 2 distinct value sets: entity-specific mapping |
| EvidenceTypeCode | One value set |
| ExceptionType | One value set |
| ExceptionTypeCode | 3 distinct value sets: entity-specific mapping |
| ExecutionMethodCode | One value set |
| ExecutionStatusCode | One value set |
| ExposureType | One value set |
| ExtensionTypeCode | 2 distinct value sets: entity-specific mapping |
| FeatureCode | One value set |
| FrequencyCode | 2 distinct value sets: entity-specific mapping |
| FuelTypeCode | One value set |
| GeneratedFromCode | One value set |
| HandoffReasonCode | One value set |
| HandoffStatusCode | One value set |
| HandoffType | One value set |
| HandoffTypeCode | 2 distinct value sets: entity-specific mapping |
| IdentifierTypeCode | One value set |
| ImportSource | One value set |
| IncidentTypeCode | One value set |
| InstructionCode | One value set |
| IssuingCountryCode | One value set |
| IssuingStateCode | One value set |
| LeaseTypeCode | One value set |
| LimitStatus | One value set |
| MatchMethod | One value set |
| MatchStatus | One value set |
| MovementType | One value set |
| NewUsedCode | One value set |
| NoticeTypeCode | 2 distinct value sets: entity-specific mapping |
| ObligationTypeCode | One value set |
| OptionCode | One value set |
| OptionTypeCode | One value set |
| OutcomeCode | One value set |
| OwnershipType | One value set |
| PartyRoleCode | One value set |
| PaymentFrequencyCode | One value set |
| PaymentMethod | One value set |
| PaymentTimingCode | One value set |
| PolicyTypeCode | One value set |
| PostingStatus | 2 distinct value sets: entity-specific mapping |
| PriorityCode | One value set |
| PropertyType | One value set |
| ProviderCode | One value set |
| ReasonCode | 3 distinct value sets: entity-specific mapping |
| ReceivableStatus | One value set |
| ReconciliationStatus | One value set |
| ReconciliationType | One value set |
| RecoveryTypeCode | One value set |
| ReferenceType | 9 distinct value sets: entity-specific mapping |
| ReferenceTypeCode | 7 distinct value sets: entity-specific mapping |
| RenewalStatusCode | One value set |
| RepairabilityCode | One value set |
| RequestSourceCode | One value set |
| RequiredForEventCode | One value set |
| RequirementStatusCode | One value set |
| ResponseCode | One value set |
| ResponsiblePartyCode | One value set |
| ResultStatusCode | One value set |
| ReturnStatusCode | One value set |
| ReviewFrequencyMonths | One value set |
| RiskRatingCode | One value set |
| RiskSegmentCode | One value set |
| Role | One value set |
| RoleCode | One value set |
| RunType | One value set |
| SafetyClass | One value set |
| ScheduleStatusCode | One value set |
| ServicePackageCode | One value set |
| SettlementTypeCode | One value set |
| Severity | One value set |
| SeverityCode | One value set |
| SignatureStatusCode | One value set |
| SourceDocumentType | One value set |
| SourceModule | One value set |
| SourceReferenceType | One value set |
| SourceType | One value set |
| SourceTypeCode | 2 distinct value sets: entity-specific mapping |
| StatusCode | 37 distinct value sets: entity-specific mapping |
| SuspensionReasonCode | One value set |
| TargetModuleCode | 3 distinct value sets: entity-specific mapping |
| TargetType | One value set |
| TaskStatusCode | One value set |
| TaxResidencyCountryCode | One value set |
| TaxType | One value set |
| TerminationStatusCode | One value set |
| TerminationTypeCode | One value set |
| TransactionType | One value set |
| TriggerTypeCode | One value set |
| UnitMeasureType | One value set |
| ValidationStatus | One value set |
| WorkOrderStatusCode | One value set |
| WriteOffReasonCode | One value set |

## Fields needing correction or lookup/reuse decisions before seeding

- **AcquisitionCurrencyCode**: 1, 2
- **ApprovedBy**: 1, 2
- **AssessmentVersion**: Party1, Party2
- **BillingReference**: AssetCat1, AssetCat2
- **CapturedBy**: CapturedBy1, CapturedBy2
- **ConditionGradeCode**: Condition1
- **CostCentreCode**: 1, 2, Center1, Center2, U001, U002, CostCenter1, CostCenter2
- **Country**: (blank)
- **CurrencySymbol**: (blank)
- **Department**: (blank)
- **DepartmentCode**: Credit, Finance, Sales
- **Designation**: CustContact1, CustContact2, (blank)
- **Email**: AssetCat1, AssetCat2
- **ExternalLedgerCode**: Ledger1, Ledger2
- **FullName**: CostCenter1, CostCenter2
- **GeneratedBy**: GeneratedBy1, GeneratedBy2
- **PerformedBy**: PerformedBy1, PerformedBy2
- **PermanentCity**: (blank)
- **PermanentState**: (blank)
- **ProfitCentreCode**: U001, U002
- **RequestedBy**: RequestedBy1, RequestedBy2
- **SatisfiedBy**: SatisfiedBy1, SatisfiedBy2
- **VerifiedBy**: Emp1, Emp2
- **WorkCity**: (blank)
- **WorkState**: (blank)
- **businessCalendar**: 1, 2

Do not insert blank options or generated samples (DocType1, StatusChange1, etc.). ReasonCode also includes placeholder values in one context; seed only the meaningful approved sets. Country/IssuingCountryCode/TaxResidencyCountryCode should be assessed for reuse of CountryCode rather than creating duplicate country lists. AcquisitionCurrencyCode should reuse CurrencyCode after correcting its sample numeric values.

## Already wired categories missing from the general seed

DiscountType, Gender, MaritalStatus, NatureOfBusiness. Their definitive values must be established before adding rows. Legacy recovery SQL is not proof that a current tenant contains these categories.

## Additional array-literal definitions

CRM approvalAction create/edit also define ActionCode using an array literal: APPROVE, REJECT, RETURN, DELEGATE. Keep this set separate from finance approval actions that offer WAIVE. Dashboard display filters and grid/page-size settings are UI preferences, not domain picklists.

## Existing server/client support

The server already exposes PicklistItems/bootstrap and supports tenant/system categories. The frontend caches these values and exposes getPicklistOptions(category). After approval, reuse this path, adjust server behavior only where necessary, update create/edit forms consistently, and generate an idempotent SQL insert script for the approved rows. The script will not be executed.

---

# Frontend picklist audit — approval draft

Scope: all TypeScript files under src/app; hardcoded `this.*Options.push({Text, Value})` definitions. Entity-ID fields are excluded. Findings compare against repository seed definitions, not a live database. No application code or insert scripts have been changed/generated.

Scanned 1928 files. Found 895 non-ID option definitions across 174 field names; excluded 727 entity-ID option definitions. 170 field names have no matching category in Scripts/SeedPicklistItems.sql.

## Missing category candidates

Field names with multiple value sets need entity-specific categories or explicit reuse decisions; their values must not be blindly merged. Values below preserve current spelling/case.

### AcceptanceMethodCode

- Values: `PORTAL`, `ESIGN/EMAIL`, `MANUAL`
  Sources: `views/crm/quoteAcceptance/quoteAcceptance-create.component.ts`, `views/crm/quoteAcceptance/quoteAcceptance-edit.component.ts`

### AcquisitionCurrencyCode

- Values: `1`, `2`
  Sources: `views/assets/asset/asset-create.component.ts`, `views/assets/asset/asset-edit.component.ts`

### ActionCode — multiple option sets; split by entity

- Values: `APPROVE`, `REJECT`, `RETURN`, `WAIVE`
  Sources: `views/billings/financeApprovalAction/financeApprovalAction-create.component.ts`, `views/billings/financeApprovalAction/financeApprovalAction-edit.component.ts`
- Values: `APPROVE`, `REJECT`, `RETURN`, `DELEGATE`
  Sources: `views/leaseContracts/contractApprovalAction/contractApprovalAction-create.component.ts`, `views/leaseContracts/contractApprovalAction/contractApprovalAction-edit.component.ts`

### ActivityType

- Values: `Call`, `Email`, `Meeting`, `Note`, `Task`
  Sources: `views/crm/leadActivity/leadActivity-create.component.ts`, `views/crm/leadActivity/leadActivity-edit.component.ts`

### AgreementTypeCode

- Values: `AMC`, `WARRANTY`, `SERVICE_RATE`, `SLA`
  Sources: `views/maintenanceInsurances/serviceAgreement/serviceAgreement-create.component.ts`, `views/maintenanceInsurances/serviceAgreement/serviceAgreement-edit.component.ts`

### AllocationStatusCode

- Values: `PENDING`, `ALLOCATED`, `ACTIVE`, `REPLACED`, `RELEASED`
  Sources: `views/leaseContracts/leaseContractAsset/leaseContractAsset-create.component.ts`, `views/leaseContracts/leaseContractAsset/leaseContractAsset-edit.component.ts`

### AllocationType

- Values: `NORMAL`, `ADVANCE`, `SHORT_PAY`, `WRITE_OFF`
  Sources: `views/billings/paymentAllocation/paymentAllocation-create.component.ts`, `views/billings/paymentAllocation/paymentAllocation-edit.component.ts`

### AmendmentStatusCode

- Values: `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `EXECUTED`, `CANCELLED`
  Sources: `views/leaseContracts/contractAmendment/contractAmendment-create.component.ts`, `views/leaseContracts/contractAmendment/contractAmendment-edit.component.ts`

### AmendmentTypeCode

- Values: `TERM`, `RENTAL`, `ASSET`, `PARTY`, `EXTENSION`, `OTHER`
  Sources: `views/leaseContracts/contractAmendment/contractAmendment-create.component.ts`, `views/leaseContracts/contractAmendment/contractAmendment-edit.component.ts`

### ApprovalStatus — multiple option sets; split by entity

- Values: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`
  Sources: `views/billings/financeApprovalRequest/financeApprovalRequest-create.component.ts`, `views/billings/financeApprovalRequest/financeApprovalRequest-edit.component.ts`
- Values: `Pending`, `Approved`, `Rejected`, `Preturned`
  Sources: `views/crm/approvalRequest/approvalRequest-create.component.ts`, `views/crm/approvalRequest/approvalRequest-edit.component.ts`

### ApprovalStatusCode

- Values: `PENDING`, `APPROVED`, `REJECTED`, `RETURNED`
  Sources: `views/leaseContracts/contractApprovalRequest/contractApprovalRequest-create.component.ts`, `views/leaseContracts/contractApprovalRequest/contractApprovalRequest-edit.component.ts`

### ApprovedBy

- Values: `1`, `2`
  Sources: `views/parties/partyRole/partyRole-create.component.ts`

### AssessmentStatusCode

- Values: `DRAFT`, `REVIEW`, `APPROVED`
  Sources: `views/eolDisposals/returnAssessment/returnAssessment-create.component.ts`, `views/eolDisposals/returnAssessment/returnAssessment-edit.component.ts`

### AssessmentTypeCode

- Values: `MANUAL`, `MODEL`, `HYBRID`
  Sources: `views/crm/creditAssessment/creditAssessment-create.component.ts`, `views/crm/creditAssessment/creditAssessment-edit.component.ts`

### AssessmentVersion

- Values: `Party1`, `Party2`
  Sources: `views/crm/creditAssessment/creditAssessment-create.component.ts`, `views/crm/creditAssessment/creditAssessment-edit.component.ts`

### AssignmentType

- Values: `Lease`, `Custody`, `Demo`, `Internal`
  Sources: `views/assets/assetAssignment/assetAssignment-create.component.ts`, `views/assets/assetAssignment/assetAssignment-edit.component.ts`

### AwardSourceCode

- Values: `OFFER`, `BID`, `NEGOTIATED`
  Sources: `views/eolDisposals/disposalAward/disposalAward-create.component.ts`, `views/eolDisposals/disposalAward/disposalAward-edit.component.ts`

### BidStatusCode

- Values: `RECEIVED`, `VALID`, `REJECTED`, `WINNER`
  Sources: `views/eolDisposals/disposalBid/disposalBid-create.component.ts`, `views/eolDisposals/disposalBid/disposalBid-edit.component.ts`

### BillingFrequency

- Values: `Monthly`, `Quarterly`, `Annual`
  Sources: `views/crm/quote/quote-create.component.ts`, `views/crm/quote/quote-edit.component.ts`

### BillingReference

- Values: `AssetCat1`, `AssetCat2`
  Sources: `views/parties/customerDepartment/customerDepartment-create.component.ts`, `views/parties/customerDepartment/customerDepartment-edit.component.ts`

### BillingStatusCode

- Values: `PENDING`, `HANDED_OFF`, `BILLED`
  Sources: `views/leaseContracts/leasePaymentScheduleLine/leasePaymentScheduleLine-create.component.ts`, `views/leaseContracts/leasePaymentScheduleLine/leasePaymentScheduleLine-edit.component.ts`

### businessCalendar

- Values: `1`, `2`
  Sources: `views/organisations/businessCalendarHoliday/businessCalendarHoliday-create.component.ts`

### CalculationMethodCode

- Values: `FLAT`, `IRR`, `CUSTOM`, `RENTAL`
  Sources: `views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule-create.component.ts`, `views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule-edit.component.ts`

### CalculationTypeCode

- Values: `FIXED`, `PERCENT`, `PER_UNIT`
  Sources: `views/crm/quoteCharge/quoteCharge-create.component.ts`, `views/crm/quoteCharge/quoteCharge-edit.component.ts`

### CapturedBy

- Values: `CapturedBy1`, `CapturedBy2`
  Sources: `views/leaseContracts/contractConditionEvidence/contractConditionEvidence-create.component.ts`, `views/leaseContracts/contractConditionEvidence/contractConditionEvidence-edit.component.ts`

### ChangeSectionCode

- Values: `TERMS`, `ASSET`, `PARTY`, `SCHEDULE`, `CHARGE`
  Sources: `views/leaseContracts/contractAmendmentChange/contractAmendmentChange-create.component.ts`, `views/leaseContracts/contractAmendmentChange/contractAmendmentChange-edit.component.ts`

### ChargeTypeCode — multiple option sets; split by entity

- Values: `RENTAL`, `FEE`, `SERVICE`, `TERMINATION`
  Sources: `views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-create.component.ts`, `views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine-edit.component.ts`
- Values: `EARLY_TERMINATION`, `NOTICE`, `ASSET_DAMAGE`, `OTHER`
  Sources: `views/leaseContracts/contractTerminationCharge/contractTerminationCharge-create.component.ts`, `views/leaseContracts/contractTerminationCharge/contractTerminationCharge-edit.component.ts`
- Values: `PROCESSING`, `DOCUMENTATION`, `DELIVERY`, `OTHER`
  Sources: `views/leaseContracts/leaseContractCharge/leaseContractCharge-create.component.ts`, `views/leaseContracts/leaseContractCharge/leaseContractCharge-edit.component.ts`

### ChecklistStatus

- Values: `Missing`, `Received`, `Verified`, `Waived`
  Sources: `views/crm/creditDocumentChecklist/creditDocumentChecklist-create.component.ts`, `views/crm/creditDocumentChecklist/creditDocumentChecklist-edit.component.ts`

### Classification

- Values: ``
  Sources: `views/customer/customer-create.component.ts`, `views/customer/customer-edit.component.ts`

### ConditionCode

- Values: `GOOD`, `DAMAGED`, `MISSING`
  Sources: `views/eolDisposals/returnItemChecklist/returnItemChecklist-create.component.ts`, `views/eolDisposals/returnItemChecklist/returnItemChecklist-edit.component.ts`

### ConditionGradeCode

- Values: `Condition1`
  Sources: `views/assets/asset/asset-create.component.ts`, `views/assets/asset/asset-edit.component.ts`

### ConditionStatus

- Values: `Open`, `Satisfied`, `Waived`, `Failed`
  Sources: `views/crm/creditCondition/creditCondition-create.component.ts`, `views/crm/creditCondition/creditCondition-edit.component.ts`

### ConditionType

- Values: `Deposit`, `Guarantee`, `Document`
  Sources: `views/crm/creditCondition/creditCondition-create.component.ts`, `views/crm/creditCondition/creditCondition-edit.component.ts`

### ConditionTypeCode

- Values: `CREDIT`, `DOCUMENT`, `DEPOSIT`, `INSURANCE`, `ASSET`, `OTHER`
  Sources: `views/leaseContracts/contractCondition/contractCondition-create.component.ts`, `views/leaseContracts/contractCondition/contractCondition-edit.component.ts`

### CostCentreCode — multiple option sets; split by entity

- Values: `1`, `2`
  Sources: `views/department/department-create.component.ts`
- Values: `Center1`, `Center2`
  Sources: `views/department/department-edit.component.ts`
- Values: `U001`, `U002`
  Sources: `views/organisations/organisationUnit/organisationUnit-create.component.ts`, `views/organisations/organisationUnit/organisationUnit-edit.component.ts`
- Values: `CostCenter1`, `CostCenter2`
  Sources: `views/parties/customerDepartment/customerDepartment-create.component.ts`, `views/parties/customerDepartment/customerDepartment-edit.component.ts`

### Country

- Values: ``
  Sources: `views/brandPartner/brandPartner-create.component.ts`, `views/brandPartner/brandPartner-edit.component.ts`

### CoverageCode

- Values: `FULL`, `LABOUR`, `PARTS`, `SERVICE`
  Sources: `views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-create.component.ts`, `views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage-edit.component.ts`

### CreditPolicyCode

- Values: `PAN`, `GSTCertificate`, `CINCertificate`, `BankProof`, `AddressProof`
  Sources: `views/parties/partyCreditProfile/partyCreditProfile-create.component.ts`, `views/parties/partyCreditProfile/partyCreditProfile-edit.component.ts`

### CurrencySymbol

- Values: ``
  Sources: `views/brandPartner/brandPartner-create.component.ts`, `views/brandPartner/brandPartner-edit.component.ts`

### CustomerImpactCode

- Values: `NONE`, `LOW`, `MEDIUM`, `HIGH`
  Sources: `views/maintenanceInsurances/assetDowntime/assetDowntime-create.component.ts`, `views/maintenanceInsurances/assetDowntime/assetDowntime-edit.component.ts`

### CustomerResponseCode

- Values: `RETURN`, `PURCHASE`, `EXTEND`, `QUERY`
  Sources: `views/eolDisposals/endOfLeaseNotice/endOfLeaseNotice-create.component.ts`, `views/eolDisposals/endOfLeaseNotice/endOfLeaseNotice-edit.component.ts`

### DataTypeCode

- Values: ``
  Sources: `views/assets/assetAttributeDefinition/assetAttributeDefinition-create.component.ts`, `views/assets/assetAttributeDefinition/assetAttributeDefinition-edit.component.ts`

### DecisionCode — multiple option sets; split by entity

- Values: `APPROVED`, `DECLINED`, `REFERRED`
  Sources: `views/crm/creditDecision/creditDecision-create.component.ts`, `views/crm/creditDecision/creditDecision-edit.component.ts`
- Values: `ACCEPTED`, `REJECTED`
  Sources: `views/crm/quoteAcceptance/quoteAcceptance-create.component.ts`, `views/crm/quoteAcceptance/quoteAcceptance-edit.component.ts`

### DecisionReasonCode

- Values: `WITH_CONDITIONS`
  Sources: `views/crm/creditDecision/creditDecision-create.component.ts`, `views/crm/creditDecision/creditDecision-edit.component.ts`

### DeliveryChannelCode

- Values: `EMAIL`, `PORTAL`, `POST`, `HAND`
  Sources: `views/eolDisposals/endOfLeaseNotice/endOfLeaseNotice-create.component.ts`, `views/eolDisposals/endOfLeaseNotice/endOfLeaseNotice-edit.component.ts`

### DeliveryMethodCode

- Values: `EMAIL`, `POST`, `PORTAL`, `COURIER`
  Sources: `views/leaseContracts/contractNotice/contractNotice-create.component.ts`, `views/leaseContracts/contractNotice/contractNotice-edit.component.ts`

### DeliveryStatusCode

- Values: `DRAFT`, `SENT`, `DELIVERED`, `FAILED`
  Sources: `views/leaseContracts/contractNotice/contractNotice-create.component.ts`, `views/leaseContracts/contractNotice/contractNotice-edit.component.ts`

### Department

- Values: ``
  Sources: `views/contact/contact-create.component.ts`, `views/contact/contact-edit.component.ts`, `views/portalUser/portalUser-create.component.ts`, `views/portalUser/portalUser-edit.component.ts`

### DepartmentCode

- Values: `Credit`, `Finance`, `Sales`
  Sources: `views/department/department-create.component.ts`, `views/department/department-edit.component.ts`

### DepositStatus

- Values: `PENDING`, `HELD`, `PART_USED`, `REFUNDED`, `CLOSED`
  Sources: `views/billings/customerDeposit/customerDeposit-create.component.ts`, `views/billings/customerDeposit/customerDeposit-edit.component.ts`

### DepositTypeCode

- Values: `SECURITY`, `ADVANCE`, `OTHER`
  Sources: `views/billings/customerDeposit/customerDeposit-create.component.ts`, `views/billings/customerDeposit/customerDeposit-edit.component.ts`, `views/leaseContracts/leaseContractDeposit/leaseContractDeposit-create.component.ts`, `views/leaseContracts/leaseContractDeposit/leaseContractDeposit-edit.component.ts`

### Designation — multiple option sets; split by entity

- Values: `CustContact1`, `CustContact2`
  Sources: `views/assets/assetUser/assetUser-create.component.ts`, `views/assets/assetUser/assetUser-edit.component.ts`
- Values: ``
  Sources: `views/contact/contact-create.component.ts`, `views/contact/contact-edit.component.ts`

### DirectionCode

- Values: `CHARGE`, `CREDIT`
  Sources: `views/eolDisposals/settlementChargeType/settlementChargeType-create.component.ts`, `views/eolDisposals/settlementChargeType/settlementChargeType-edit.component.ts`

### DiscountTypeCode

- Values: `PERCENT`, `FIXED`, `RATE_OVERRIDE`
  Sources: `views/crm/quoteDiscount/quoteDiscount-create.component.ts`, `views/crm/quoteDiscount/quoteDiscount-edit.component.ts`

### DocumentPurposeCode — multiple option sets; split by entity

- Values: `FINANCIAL_STATEMENT`
  Sources: `views/crm/originationDocumentLink/originationDocumentLink-create.component.ts`, `views/crm/originationDocumentLink/originationDocumentLink-edit.component.ts`
- Values: `AGREEMENT`, `KYC`, `GUARANTEE`, `SCHEDULE`, `NOTICE`, `OTHER`
  Sources: `views/leaseContracts/leaseContractDocumentLink/leaseContractDocumentLink-create.component.ts`, `views/leaseContracts/leaseContractDocumentLink/leaseContractDocumentLink-edit.component.ts`

### DocumentRole

- Values: `PDF`, `TAX_RESPONSE`, `PAYMENT_PROOF`, `STATEMENT`, `EXPORT`
  Sources: `views/billings/financeDocumentLink/financeDocumentLink-create.component.ts`, `views/billings/financeDocumentLink/financeDocumentLink-edit.component.ts`

### DocumentRoleCode — multiple option sets; split by entity

- Values: `NOTICE`, `RETURN_FORM`, `APPROVAL`, `SALE_CERT`, `CERTIFICATE`
  Sources: `views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-create.component.ts`, `views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-edit.component.ts`
- Values: `POLICY`, `FIR`, `PHOTO`, `ESTIMATE`, `SURVEY`, `INVOICE`, `SETTLEMENT`
  Sources: `views/maintenanceInsurances/maintenanceInsuranceDocumentLink/maintenanceInsuranceDocumentLink-create.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceDocumentLink/maintenanceInsuranceDocumentLink-edit.component.ts`

### DomainCode

- Values: `MAINTENANCE`, `INSURANCE`
  Sources: `views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-create.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-edit.component.ts`

### DowntimeReasonCode

- Values: `BREAKDOWN`, `ACCIDENT`, `PLANNED`, `CLAIM`
  Sources: `views/maintenanceInsurances/assetDowntime/assetDowntime-create.component.ts`, `views/maintenanceInsurances/assetDowntime/assetDowntime-edit.component.ts`

### DueEventCode

- Values: `SIGNING`, `ACTIVATION`, `SCHEDULED`
  Sources: `views/leaseContracts/leaseContractCharge/leaseContractCharge-create.component.ts`, `views/leaseContracts/leaseContractCharge/leaseContractCharge-edit.component.ts`

### DueStatusCode

- Values: `UPCOMING`, `DUE`, `OVERDUE`, `COMPLETED`, `SKIPPED`
  Sources: `views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts`, `views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts`

### Email

- Values: `AssetCat1`, `AssetCat2`
  Sources: `views/assets/assetUser/assetUser-create.component.ts`, `views/assets/assetUser/assetUser-edit.component.ts`

### EmissionNormCode

- Values: ``
  Sources: `views/assets/vehicleAsset/vehicleAsset-create.component.ts`, `views/assets/vehicleAsset/vehicleAsset-edit.component.ts`

### EndorsementTypeCode

- Values: `ADD_ASSET`, `REMOVE_ASSET`, `VALUE`, `DETAIL`, `COVER`
  Sources: `views/maintenanceInsurances/insurancePolicyEndorsement/insurancePolicyEndorsement-create.component.ts`, `views/maintenanceInsurances/insurancePolicyEndorsement/insurancePolicyEndorsement-edit.component.ts`

### EventCode

- Values: `ALLOCATE`, `REPLACE`, `RELEASE`, `HOLD`
  Sources: `views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-create.component.ts`, `views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-edit.component.ts`

### EventType

- Values: `INVOICE`, `RECEIPT`, `ALLOCATION`, `CREDIT_NOTE`, `DEPOSIT`, `REFUND`
  Sources: `views/billings/accountingEvent/accountingEvent-create.component.ts`, `views/billings/accountingEvent/accountingEvent-edit.component.ts`

### EventTypeCode — multiple option sets; split by entity

- Values: `CREATED`, `APPROVED`, `EXECUTED`, `ACTIVATED`, `AMENDED`, `SUSPENDED`, `TERMINATED`, `CLOSED`
  Sources: `views/leaseContracts/contractEvent/contractEvent-create.component.ts`, `views/leaseContracts/contractEvent/contractEvent-edit.component.ts`
- Values: `DUE`, `SATISFIED`, `BREACH`, `WAIVER`, `CLOSE`
  Sources: `views/leaseContracts/contractObligationEvent/contractObligationEvent-create.component.ts`, `views/leaseContracts/contractObligationEvent/contractObligationEvent-edit.component.ts`

### EvidenceTypeCode

- Values: `DOCUMENT`, `FINANCE`, `ASSET`, `EXTERNAL`
  Sources: `views/leaseContracts/contractConditionEvidence/contractConditionEvidence-create.component.ts`, `views/leaseContracts/contractConditionEvidence/contractConditionEvidence-edit.component.ts`

### ExceptionType

- Values: `BILLING`, `TAX`, `PAYMENT`, `POSTING`, `RECONCILIATION`
  Sources: `views/billings/financeException/financeException-create.component.ts`, `views/billings/financeException/financeException-edit.component.ts`

### ExceptionTypeCode — multiple option sets; split by entity

- Values: `OVERDUE_RETURN`, `EVIDENCE`, `DISPUTE`, `HANDOFF`, `SALE`, `DISPOSAL`
  Sources: `views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-create.component.ts`, `views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-edit.component.ts`
- Values: `OVERDUE`, `ESTIMATE`, `SLA`, `DATA`, `INTEGRATION`
  Sources: `views/maintenanceInsurances/maintenanceException/maintenanceException-create.component.ts`, `views/maintenanceInsurances/maintenanceException/maintenanceException-edit.component.ts`
- Values: `COVER_GAP`, `EXPIRY`, `CLAIM_DELAY`, `DOCUMENT`, `HANDOFF`
  Sources: `views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-create.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-edit.component.ts`

### ExecutionMethodCode

- Values: `ESIGN`, `WET_SIGN`, `DIGITAL`, `OTHER`
  Sources: `views/leaseContracts/contractExecution/contractExecution-create.component.ts`, `views/leaseContracts/contractExecution/contractExecution-edit.component.ts`

### ExecutionStatusCode

- Values: `PENDING`, `SENT`, `PARTIAL`, `EXECUTED`, `DECLINED`, `EXPIRED`
  Sources: `views/leaseContracts/contractExecution/contractExecution-create.component.ts`, `views/leaseContracts/contractExecution/contractExecution-edit.component.ts`

### ExposureType

- Values: `Existing`, `Proposed`, `Guaranteed`
  Sources: `views/crm/creditExposure/creditExposure-create.component.ts`, `views/crm/creditExposure/creditExposure-edit.component.ts`

### ExtensionTypeCode — multiple option sets; split by entity

- Values: `Vehicle`
  Sources: `views/assets/assetCategory/assetCategory-create.component.ts`
- Values: ``
  Sources: `views/assets/assetCategory/assetCategory-edit.component.ts`

### ExternalLedgerCode

- Values: `Ledger1`, `Ledger2`
  Sources: `views/organisations/costCentre/costCentre-create.component.ts`, `views/organisations/costCentre/costCentre-edit.component.ts`, `views/organisations/profitCentre/profitCentre-create.component.ts`, `views/organisations/profitCentre/profitCentre-edit.component.ts`

### FeatureCode

- Values: `QUOTE`, `LEAD`, `CREDIT`
  Sources: `views/crm/approvalRequest/approvalRequest-create.component.ts`, `views/crm/approvalRequest/approvalRequest-edit.component.ts`

### FrequencyCode — multiple option sets; split by entity

- Values: `ONCE`, `MONTHLY`, `ANNUAL`, `EVENT`
  Sources: `views/leaseContracts/contractObligation/contractObligation-create.component.ts`, `views/leaseContracts/contractObligation/contractObligation-edit.component.ts`
- Values: `ONCE`, `MONTHLY`, `ANNUAL`
  Sources: `views/leaseContracts/leaseContractCharge/leaseContractCharge-create.component.ts`, `views/leaseContracts/leaseContractCharge/leaseContractCharge-edit.component.ts`

### FuelTypeCode

- Values: ``
  Sources: `views/assets/vehicleAsset/vehicleAsset-create.component.ts`, `views/assets/vehicleAsset/vehicleAsset-edit.component.ts`

### FullName

- Values: `CostCenter1`, `CostCenter2`
  Sources: `views/assets/assetUser/assetUser-create.component.ts`, `views/assets/assetUser/assetUser-edit.component.ts`

### GeneratedBy

- Values: `GeneratedBy1`, `GeneratedBy2`
  Sources: `views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule-create.component.ts`, `views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule-edit.component.ts`

### GeneratedFromCode

- Values: `PLAN`, `MANUAL`, `EVENT`
  Sources: `views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-create.component.ts`, `views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule-edit.component.ts`

### HandoffReasonCode

- Values: `RE_LEASE`, `SALE`, `CONDITION`
  Sources: `views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-create.component.ts`, `views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-edit.component.ts`

### HandoffStatusCode

- Values: `READY`, `SENT`, `ACCEPTED`, `FAILED`
  Sources: `views/leaseContracts/contractHandoff/contractHandoff-create.component.ts`, `views/leaseContracts/contractHandoff/contractHandoff-edit.component.ts`

### HandoffType

- Values: `GL_POSTING`, `COLLECTIONS`, `CONTRACT_STATUS`, `TAX_REPORTING`
  Sources: `views/billings/financeHandoff/financeHandoff-create.component.ts`, `views/billings/financeHandoff/financeHandoff-edit.component.ts`

### HandoffTypeCode — multiple option sets; split by entity

- Values: `CHARGE`, `REFUND`, `SALE`, `OWNERSHIP`, `LIFECYCLE`, `WORK_ORDER`
  Sources: `views/eolDisposals/endOfLeaseDisposalHandoff/endOfLeaseDisposalHandoff-create.component.ts`, `views/eolDisposals/endOfLeaseDisposalHandoff/endOfLeaseDisposalHandoff-edit.component.ts`
- Values: `FINANCE`, `PROCUREMENT`, `CONTRACT`, `ASSET`, `INSURER`
  Sources: `views/maintenanceInsurances/maintenanceInsuranceHandoff/maintenanceInsuranceHandoff-create.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceHandoff/maintenanceInsuranceHandoff-edit.component.ts`

### IdentifierTypeCode

- Values: ``
  Sources: `views/assets/assetIdentifier/assetIdentifier-create.component.ts`, `views/assets/assetIdentifier/assetIdentifier-edit.component.ts`

### ImportSource

- Values: `API`, `FILE`, `MANUAL`
  Sources: `views/billings/bankStatement/bankStatement-create.component.ts`, `views/billings/bankStatement/bankStatement-edit.component.ts`

### IncidentTypeCode

- Values: `ACCIDENT`, `THEFT`, `FIRE`, `FLOOD`, `DAMAGE`, `OTHER`
  Sources: `views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts`, `views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts`

### InstructionCode

- Values: `RETURN`, `PURCHASE`, `EXTEND`, `RELEASE`
  Sources: `views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-create.component.ts`, `views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-edit.component.ts`

### IssuingCountryCode

- Values: ``
  Sources: `views/assets/assetIdentifier/assetIdentifier-create.component.ts`, `views/assets/assetIdentifier/assetIdentifier-edit.component.ts`

### IssuingStateCode

- Values: ``
  Sources: `views/assets/assetIdentifier/assetIdentifier-create.component.ts`, `views/assets/assetIdentifier/assetIdentifier-edit.component.ts`

### LeaseTypeCode

- Values: `OPERATING`, `FINANCE`, `RENTAL`, `OTHER`
  Sources: `views/leaseContracts/leaseContractTerm/leaseContractTerm-create.component.ts`, `views/leaseContracts/leaseContractTerm/leaseContractTerm-edit.component.ts`

### LimitStatus

- Values: `Active`, `Suspended`, `Expired`
  Sources: `views/crm/creditLimit/creditLimit-create.component.ts`, `views/crm/creditLimit/creditLimit-edit.component.ts`

### MatchMethod

- Values: `AUTO`, `MANUAL`
  Sources: `views/billings/financeReconciliation/financeReconciliation-create.component.ts`, `views/billings/financeReconciliation/financeReconciliation-edit.component.ts`

### MatchStatus

- Values: `UNMATCHED`, `AUTO_MATCHED`, `MANUAL_MATCHED`, `IGNORED`
  Sources: `views/billings/bankStatementLine/bankStatementLine-create.component.ts`, `views/billings/bankStatementLine/bankStatementLine-edit.component.ts`

### MovementType

- Values: `Transfer`, `Delivery`, `Return`
  Sources: `views/assets/assetLocationHistory/assetLocationHistory-create.component.ts`, `views/assets/assetLocationHistory/assetLocationHistory-edit.component.ts`

### NewUsedCode

- Values: `NEW`, `USED`, `ANY`
  Sources: `views/crm/leaseRequirementAsset/leaseRequirementAsset-create.component.ts`, `views/crm/leaseRequirementAsset/leaseRequirementAsset-edit.component.ts`

### NoticeTypeCode — multiple option sets; split by entity

- Values: `EXPIRY`, `TERMINATION`, `RETURN`, `OPTION`
  Sources: `views/eolDisposals/endOfLeaseNotice/endOfLeaseNotice-create.component.ts`, `views/eolDisposals/endOfLeaseNotice/endOfLeaseNotice-edit.component.ts`
- Values: `RENEWAL`, `DEFAULT`, `TERMINATION`, `AMENDMENT`, `OTHER`
  Sources: `views/leaseContracts/contractNotice/contractNotice-create.component.ts`, `views/leaseContracts/contractNotice/contractNotice-edit.component.ts`

### ObligationTypeCode

- Values: `INSURANCE`, `MAINTENANCE`, `REPORTING`, `USAGE`, `COMPLIANCE`, `OTHER`
  Sources: `views/leaseContracts/contractObligation/contractObligation-create.component.ts`, `views/leaseContracts/contractObligation/contractObligation-edit.component.ts`

### OptionCode

- Values: `RETURN`, `PURCHASE`, `EXTEND`, `RENEW`
  Sources: `views/eolDisposals/endOfLeaseOption/endOfLeaseOption-create.component.ts`, `views/eolDisposals/endOfLeaseOption/endOfLeaseOption-edit.component.ts`

### OptionTypeCode

- Values: `RENEW`, `EXTEND`, `PURCHASE`, `RETURN`
  Sources: `views/leaseContracts/contractRenewalOption/contractRenewalOption-create.component.ts`, `views/leaseContracts/contractRenewalOption/contractRenewalOption-edit.component.ts`

### OutcomeCode

- Values: `Followup`, `Call`
  Sources: `views/crm/leadActivity/leadActivity-create.component.ts`, `views/crm/leadActivity/leadActivity-edit.component.ts`

### OwnershipType

- Values: `Owned`, `Managed`, `Financed`
  Sources: `views/assets/assetOwnershipHistory/assetOwnershipHistory-create.component.ts`, `views/assets/assetOwnershipHistory/assetOwnershipHistory-edit.component.ts`

### PartyRoleCode

- Values: `LESSEE`, `CO_LESSEE`, `GUARANTOR`, `BROKER`, `OTHER`
  Sources: `views/leaseContracts/leaseContractParty/leaseContractParty-create.component.ts`, `views/leaseContracts/leaseContractParty/leaseContractParty-edit.component.ts`

### PaymentFrequencyCode

- Values: `MONTHLY`, `QUARTERLY`, `ANNUAL`, `CUSTOM`
  Sources: `views/leaseContracts/leaseContractTerm/leaseContractTerm-create.component.ts`, `views/leaseContracts/leaseContractTerm/leaseContractTerm-edit.component.ts`

### PaymentMethod

- Values: `BANK_TRANSFER`, `UPI`, `CARD`, `CHEQUE`
  Sources: `views/billings/paymentReceipt/paymentReceipt-create.component.ts`, `views/billings/paymentReceipt/paymentReceipt-edit.component.ts`

### PaymentTimingCode

- Values: `ADVANCE`, `ARREARS`
  Sources: `views/leaseContracts/leaseContractTerm/leaseContractTerm-create.component.ts`, `views/leaseContracts/leaseContractTerm/leaseContractTerm-edit.component.ts`

### PerformedBy

- Values: `PerformedBy1`, `PerformedBy2`
  Sources: `views/leaseContracts/contractEvent/contractEvent-create.component.ts`, `views/leaseContracts/contractEvent/contractEvent-edit.component.ts`, `views/leaseContracts/contractObligationEvent/contractObligationEvent-create.component.ts`, `views/leaseContracts/contractObligationEvent/contractObligationEvent-edit.component.ts`, `views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-create.component.ts`, `views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent-edit.component.ts`

### PermanentCity

- Values: ``
  Sources: `views/customer/customer-create.component.ts`, `views/customer/customer-edit.component.ts`

### PermanentState

- Values: ``
  Sources: `views/customer/customer-create.component.ts`, `views/customer/customer-edit.component.ts`

### PolicyTypeCode

- Values: `INDIVIDUAL`, `FLEET`, `GROUP`, `MASTER`
  Sources: `views/maintenanceInsurances/insurancePolicy/insurancePolicy-create.component.ts`, `views/maintenanceInsurances/insurancePolicy/insurancePolicy-edit.component.ts`

### PostingStatus — multiple option sets; split by entity

- Values: `PENDING`, `GENERATED`, `POSTED`, `FAILED`, `REVERSED`
  Sources: `views/billings/accountingEvent/accountingEvent-create.component.ts`, `views/billings/accountingEvent/accountingEvent-edit.component.ts`
- Values: `DRAFT`, `APPROVED`, `POSTED`, `FAILED`, `REVERSED`
  Sources: `views/billings/journalEntry/journalEntry-create.component.ts`, `views/billings/journalEntry/journalEntry-edit.component.ts`

### PriorityCode

- Values: `LOW`, `NORMAL`, `HIGH`, `CRITICAL`
  Sources: `views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts`, `views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts`

### ProfitCentreCode

- Values: `U001`, `U002`
  Sources: `views/organisations/organisationUnit/organisationUnit-create.component.ts`, `views/organisations/organisationUnit/organisationUnit-edit.component.ts`

### PropertyType

- Values: ``
  Sources: `views/assets/propertyAsset/propertyAsset-create.component.ts`, `views/assets/propertyAsset/propertyAsset-edit.component.ts`

### ProviderCode

- Values: `CIBIL`, `CRISI`
  Sources: `views/crm/creditBureauResult/creditBureauResult-create.component.ts`, `views/crm/creditBureauResult/creditBureauResult-edit.component.ts`

### ReasonCode — multiple option sets; split by entity

- Values: `StatusChange1`, `StatusChange2`
  Sources: `views/assets/assetStatusHistory/assetStatusHistory-create.component.ts`, `views/assets/assetStatusHistory/assetStatusHistory-edit.component.ts`
- Values: `RATE_CORRECTION`, `SERVICE_CREDIT`, `CANCELLATION`
  Sources: `views/billings/creditNote/creditNote-create.component.ts`, `views/billings/creditNote/creditNote-edit.component.ts`
- Values: `UNDER_BILLING`, `LATE_FEE`, `DAMAGE`, `OTHER`
  Sources: `views/billings/debitNote/debitNote-create.component.ts`, `views/billings/debitNote/debitNote-edit.component.ts`

### ReceivableStatus

- Values: `OPEN`, `PART_PAID`, `PAID`, `DISPUTED`, `WRITTEN_OFF`
  Sources: `views/billings/receivable/receivable-create.component.ts`, `views/billings/receivable/receivable-edit.component.ts`

### ReconciliationStatus

- Values: `NEW`, `PART_MATCHED`, `RECONCILED`, `EXCEPTION`
  Sources: `views/billings/bankStatement/bankStatement-create.component.ts`, `views/billings/bankStatement/bankStatement-edit.component.ts`

### ReconciliationType

- Values: `BANK_RECEIPT`, `GL_POSTING`, `GATEWAY`
  Sources: `views/billings/financeReconciliation/financeReconciliation-create.component.ts`, `views/billings/financeReconciliation/financeReconciliation-edit.component.ts`

### RecoveryTypeCode

- Values: `THIRD_PARTY`, `SUBROGATION`, `SALVAGE`, `OTHER`
  Sources: `views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-create.component.ts`, `views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-edit.component.ts`

### ReferenceType — multiple option sets; split by entity

- Values: `Contract`, `Handover`
  Sources: `views/assets/assetAssignment/assetAssignment-create.component.ts`, `views/assets/assetAssignment/assetAssignment-edit.component.ts`
- Values: `Document`, `Invoice`
  Sources: `views/assets/assetLocationHistory/assetLocationHistory-create.component.ts`, `views/assets/assetLocationHistory/assetLocationHistory-edit.component.ts`
- Values: `BILLING_RUN`, `CREDIT_NOTE`, `REFUND`, `WRITE_OFF`, `JOURNAL`
  Sources: `views/billings/financeApprovalRequest/financeApprovalRequest-create.component.ts`, `views/billings/financeApprovalRequest/financeApprovalRequest-edit.component.ts`
- Values: `INVOICE`, `RECEIPT`, `CREDIT_NOTE`, `BANK_STATEMENT`, `JOURNAL`
  Sources: `views/billings/financeDocumentLink/financeDocumentLink-create.component.ts`, `views/billings/financeDocumentLink/financeDocumentLink-edit.component.ts`
- Values: `LEAD`, `OPPORTUNITY`, `REQUIREMENT`, `QUOTE`, `CREDIT`
  Sources: `views/crm/originationDocumentLink/originationDocumentLink-create.component.ts`, `views/crm/originationDocumentLink/originationDocumentLink-edit.component.ts`
- Values: `CONTRACT`, `ACTIVATION`, `AMENDMENT`, `TERMINATION`, `WAIVER`
  Sources: `views/leaseContracts/contractApprovalRequest/contractApprovalRequest-create.component.ts`, `views/leaseContracts/contractApprovalRequest/contractApprovalRequest-edit.component.ts`
- Values: `CONTRACT`, `AMENDMENT`
  Sources: `views/leaseContracts/contractExecution/contractExecution-create.component.ts`, `views/leaseContracts/contractExecution/contractExecution-edit.component.ts`
- Values: `ACTIVATION`, `AMENDMENT`, `TERMINATION`, `SCHEDULE`
  Sources: `views/leaseContracts/contractHandoff/contractHandoff-create.component.ts`, `views/leaseContracts/contractHandoff/contractHandoff-edit.component.ts`
- Values: `CONTRACT`, `AMENDMENT`, `TERMINATION`, `CONDITION`
  Sources: `views/leaseContracts/leaseContractDocumentLink/leaseContractDocumentLink-create.component.ts`, `views/leaseContracts/leaseContractDocumentLink/leaseContractDocumentLink-edit.component.ts`

### ReferenceTypeCode — multiple option sets; split by entity

- Values: `CASE`, `RETURN`, `SETTLEMENT`, `DISPOSAL`, `SALE`, `SCRAP`
  Sources: `views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-create.component.ts`, `views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink-edit.component.ts`
- Values: `CASE`, `RETURN`, `SETTLEMENT`, `DISPOSAL`, `SALE`
  Sources: `views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-create.component.ts`, `views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-edit.component.ts`
- Values: `CUSTOMER_PO`, `ESIGN`, `LEGAL`, `LEGACY`, `PROVIDER`, `OTHER`
  Sources: `views/leaseContracts/contractExternalReference/contractExternalReference-create.component.ts`, `views/leaseContracts/contractExternalReference/contractExternalReference-edit.component.ts`
- Values: `SCHEDULE`, `REQUEST`, `WORK_ORDER`, `AGREEMENT`
  Sources: `views/maintenanceInsurances/maintenanceException/maintenanceException-create.component.ts`, `views/maintenanceInsurances/maintenanceException/maintenanceException-edit.component.ts`
- Values: `WORK_ORDER`, `POLICY`, `INCIDENT`, `CLAIM`, `ASSESSMENT`, `SETTLEMENT`
  Sources: `views/maintenanceInsurances/maintenanceInsuranceDocumentLink/maintenanceInsuranceDocumentLink-create.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceDocumentLink/maintenanceInsuranceDocumentLink-edit.component.ts`
- Values: `ASSET`, `POLICY`, `CLAIM`, `WORK_ORDER`
  Sources: `views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-create.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-edit.component.ts`
- Values: `WORK_ORDER`, `CLAIM`, `SETTLEMENT`, `POLICY`
  Sources: `views/maintenanceInsurances/maintenanceInsuranceHandoff/maintenanceInsuranceHandoff-create.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceHandoff/maintenanceInsuranceHandoff-edit.component.ts`

### RenewalStatusCode

- Values: `OPEN`, `QUOTING`, `APPROVAL`, `RENEWED`, `NOT_RENEWED`
  Sources: `views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-create.component.ts`, `views/maintenanceInsurances/insuranceRenewal/insuranceRenewal-edit.component.ts`

### RepairabilityCode

- Values: `REPAIRABLE`, `TOTAL_LOSS`, `REVIEW`
  Sources: `views/maintenanceInsurances/insuranceClaimAssessment/insuranceClaimAssessment-create.component.ts`, `views/maintenanceInsurances/insuranceClaimAssessment/insuranceClaimAssessment-edit.component.ts`

### RequestedBy

- Values: `RequestedBy1`, `RequestedBy2`
  Sources: `views/leaseContracts/contractApprovalRequest/contractApprovalRequest-create.component.ts`, `views/leaseContracts/contractApprovalRequest/contractApprovalRequest-edit.component.ts`

### RequestSourceCode

- Values: `SCHEDULE`, `BREAKDOWN`, `INSPECTION`, `CUSTOMER`, `RECALL`, `MANUAL`
  Sources: `views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts`, `views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts`

### RequiredForEventCode

- Values: `APPROVAL`, `EXECUTION`, `ACTIVATION`
  Sources: `views/leaseContracts/contractCondition/contractCondition-create.component.ts`, `views/leaseContracts/contractCondition/contractCondition-edit.component.ts`

### RequirementStatusCode

- Values: `Draft`, `Submitted`, `Approved`, `Closed`
  Sources: `views/crm/leaseRequirement/leaseRequirement-create.component.ts`, `views/crm/leaseRequirement/leaseRequirement-edit.component.ts`

### ResponseCode

- Values: `ACCEPTED`, `DISPUTED`, `NO_RESPONSE`
  Sources: `views/eolDisposals/settlementAcknowledgement/settlementAcknowledgement-create.component.ts`, `views/eolDisposals/settlementAcknowledgement/settlementAcknowledgement-edit.component.ts`

### ResponsiblePartyCode

- Values: `LESSOR`, `LESSEE`, `THIRD_PARTY`
  Sources: `views/leaseContracts/contractObligation/contractObligation-create.component.ts`, `views/leaseContracts/contractObligation/contractObligation-edit.component.ts`

### ResultStatusCode

- Values: `SUCCESS`, `FAILED`, `PENDING`
  Sources: `views/crm/creditBureauResult/creditBureauResult-create.component.ts`, `views/crm/creditBureauResult/creditBureauResult-edit.component.ts`

### ReturnStatusCode

- Values: `RECEIVED`, `PENDING_EVIDENCE`, `CONFIRMED`
  Sources: `views/eolDisposals/assetReturn/assetReturn-create.component.ts`, `views/eolDisposals/assetReturn/assetReturn-edit.component.ts`

### ReviewFrequencyMonths

- Values: `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`
  Sources: `views/parties/partyCreditProfile/partyCreditProfile-create.component.ts`, `views/parties/partyCreditProfile/partyCreditProfile-edit.component.ts`

### RiskRatingCode

- Values: `A1`, `A2`, `A3`
  Sources: `views/crm/creditDecision/creditDecision-create.component.ts`, `views/crm/creditDecision/creditDecision-edit.component.ts`

### RiskSegmentCode

- Values: ``
  Sources: `views/crm/creditApplication/creditApplication-create.component.ts`, `views/crm/creditApplication/creditApplication-edit.component.ts`

### Role

- Values: `MemberOwner`, `MemberAdmin`, `MemberUser`, `PartnerOwner`, `PartnerAdmin`, `PartnerUser`
  Sources: `views/portalUser/portalUser-create.component.ts`, `views/portalUser/portalUser-edit.component.ts`

### RoleCode

- Values: ``
  Sources: `views/parties/partyRole/partyRole-create.component.ts`, `views/parties/partyRole/partyRole-edit.component.ts`

### RunType

- Values: `SCHEDULED`, `ADHOC`, `FINAL`, `ADJUSTMENT`
  Sources: `views/billings/billingRun/billingRun-create.component.ts`, `views/billings/billingRun/billingRun-edit.component.ts`

### SafetyClass

- Values: ``
  Sources: `views/assets/equipmentAsset/equipmentAsset-create.component.ts`, `views/assets/equipmentAsset/equipmentAsset-edit.component.ts`

### SatisfiedBy

- Values: `SatisfiedBy1`, `SatisfiedBy2`
  Sources: `views/leaseContracts/contractCondition/contractCondition-create.component.ts`, `views/leaseContracts/contractCondition/contractCondition-edit.component.ts`

### ScheduleStatusCode

- Values: `DRAFT`, `APPROVED`, `ACTIVE`, `SUPERSEDED`
  Sources: `views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule-create.component.ts`, `views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule-edit.component.ts`

### ServicePackageCode

- Values: `Full`, `Partial`
  Sources: `views/crm/leaseRequirementAsset/leaseRequirementAsset-create.component.ts`, `views/crm/leaseRequirementAsset/leaseRequirementAsset-edit.component.ts`

### SettlementTypeCode

- Values: `REPAIRER`, `REIMBURSEMENT`, `TOTAL_LOSS`, `RECOVERY`
  Sources: `views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-create.component.ts`, `views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-edit.component.ts`

### Severity

- Values: `INFO`, `WARN`, `ERROR`, `CRITICAL`
  Sources: `views/billings/financeException/financeException-create.component.ts`, `views/billings/financeException/financeException-edit.component.ts`

### SeverityCode

- Values: `INFO`, `WARN`, `ERROR`, `CRITICAL`
  Sources: `views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-create.component.ts`, `views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-edit.component.ts`, `views/maintenanceInsurances/maintenanceException/maintenanceException-create.component.ts`, `views/maintenanceInsurances/maintenanceException/maintenanceException-edit.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-create.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-edit.component.ts`

### SignatureStatusCode

- Values: `PENDING`, `SIGNED`, `DECLINED`
  Sources: `views/leaseContracts/contractExecutionParty/contractExecutionParty-create.component.ts`, `views/leaseContracts/contractExecutionParty/contractExecutionParty-edit.component.ts`

### SourceDocumentType

- Values: `INVOICE`, `DEBIT_NOTE`, `OTHER`
  Sources: `views/billings/receivable/receivable-create.component.ts`, `views/billings/receivable/receivable-edit.component.ts`

### SourceModule

- Values: `BILLING`, `AR`, `AP`, `DEPOSIT`
  Sources: `views/billings/journalEntry/journalEntry-create.component.ts`, `views/billings/journalEntry/journalEntry-edit.component.ts`

### SourceReferenceType

- Values: `QUOTE`, `MANUAL`, `MIGRATION`, `RENEWAL`
  Sources: `views/leaseContracts/leaseContract/leaseContract-create.component.ts`, `views/leaseContracts/leaseContract/leaseContract-edit.component.ts`

### SourceType

- Values: `SCHEDULE`, `CHARGE`, `TERMINATION`, `ADJUSTMENT`
  Sources: `views/billings/billingRunItem/billingRunItem-create.component.ts`, `views/billings/billingRunItem/billingRunItem-edit.component.ts`

### SourceTypeCode — multiple option sets; split by entity

- Values: `SETTLEMENT`, `SALE`, `WRITE_OFF`, `RETURN`, `DISPOSITION`
  Sources: `views/eolDisposals/endOfLeaseDisposalHandoff/endOfLeaseDisposalHandoff-create.component.ts`, `views/eolDisposals/endOfLeaseDisposalHandoff/endOfLeaseDisposalHandoff-edit.component.ts`
- Values: `USAGE`, `DAMAGE`, `ITEM`, `FEE`, `DEPOSIT`
  Sources: `views/eolDisposals/endOfLeaseSettlementLine/endOfLeaseSettlementLine-create.component.ts`, `views/eolDisposals/endOfLeaseSettlementLine/endOfLeaseSettlementLine-edit.component.ts`

### StatusCode — multiple option sets; split by entity

- Values: `DRAFT`, `VALIDATED`, `APPROVED`, `PROCESSING`, `COMPLETED`, `FAILED`, `CANCELLED`
  Sources: `views/billings/billingRunStatus/billingRunStatus-create.component.ts`, `views/billings/billingRunStatus/billingRunStatus-edit.component.ts`
- Values: `DRAFT`, `APPROVED`, `ISSUED`, `CANCELLED`
  Sources: `views/billings/creditNote/creditNote-create.component.ts`, `views/billings/creditNote/creditNote-edit.component.ts`, `views/billings/debitNote/debitNote-create.component.ts`, `views/billings/debitNote/debitNote-edit.component.ts`
- Values: `OPEN`, `ASSIGNED`, `RESOLVED`, `WAIVED`, `CLOSED`
  Sources: `views/billings/financeException/financeException-create.component.ts`, `views/billings/financeException/financeException-edit.component.ts`, `views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-create.component.ts`, `views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException-edit.component.ts`, `views/maintenanceInsurances/maintenanceException/maintenanceException-create.component.ts`, `views/maintenanceInsurances/maintenanceException/maintenanceException-edit.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-create.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException-edit.component.ts`
- Values: `PENDING`, `SENT`, `ACKNOWLEDGED`, `FAILED`, `RETRY`
  Sources: `views/billings/financeHandoff/financeHandoff-create.component.ts`, `views/billings/financeHandoff/financeHandoff-edit.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceHandoff/maintenanceInsuranceHandoff-create.component.ts`, `views/maintenanceInsurances/maintenanceInsuranceHandoff/maintenanceInsuranceHandoff-edit.component.ts`
- Values: `MATCHED`, `EXCEPTION`, `REVERSED`
  Sources: `views/billings/financeReconciliation/financeReconciliation-create.component.ts`, `views/billings/financeReconciliation/financeReconciliation-edit.component.ts`
- Values: `DRAFT`, `APPROVAL_PENDING`, `APPROVED`, `ISSUED`, `PART_PAID`, `PAID`, `CANCELLED`
  Sources: `views/billings/invoiceStatus/invoiceStatus-create.component.ts`, `views/billings/invoiceStatus/invoiceStatus-edit.component.ts`
- Values: `RECEIVED`, `VERIFIED`, `PART_ALLOCATED`, `ALLOCATED`, `REVERSED`, `FAILED`
  Sources: `views/billings/receiptStatus/receiptStatus-create.component.ts`, `views/billings/receiptStatus/receiptStatus-edit.component.ts`
- Values: `PROPOSED`, `APPROVAL`, `APPROVED`, `REJECTED`, `EXECUTED`
  Sources: `views/eolDisposals/assetDispositionDecision/assetDispositionDecision-create.component.ts`, `views/eolDisposals/assetDispositionDecision/assetDispositionDecision-edit.component.ts`
- Values: `SCHEDULED`, `RESCHEDULED`, `COMPLETED`, `CANCELLED`
  Sources: `views/eolDisposals/assetReturnSchedule/assetReturnSchedule-create.component.ts`, `views/eolDisposals/assetReturnSchedule/assetReturnSchedule-edit.component.ts`
- Values: `DRAFT`, `APPROVED`, `HANDED_OFF`, `COMPLETED`, `CANCELLED`
  Sources: `views/eolDisposals/assetSale/assetSale-create.component.ts`, `views/eolDisposals/assetSale/assetSale-edit.component.ts`
- Values: `PLANNED`, `APPROVED`, `COMPLETED`, `CANCELLED`
  Sources: `views/eolDisposals/assetScrap/assetScrap-create.component.ts`, `views/eolDisposals/assetScrap/assetScrap-edit.component.ts`
- Values: `PLANNED`, `OPEN`, `CLOSED`, `CANCELLED`, `AWARDED`
  Sources: `views/eolDisposals/disposalAuction/disposalAuction-create.component.ts`, `views/eolDisposals/disposalAuction/disposalAuction-edit.component.ts`
- Values: `AWARDED`, `ACCEPTED`, `CANCELLED`
  Sources: `views/eolDisposals/disposalAward/disposalAward-create.component.ts`, `views/eolDisposals/disposalAward/disposalAward-edit.component.ts`
- Values: `OPEN`, `MARKETED`, `AWARDED`, `COMPLETED`, `CANCELLED`
  Sources: `views/eolDisposals/disposalCase/disposalCase-create.component.ts`, `views/eolDisposals/disposalCase/disposalCase-edit.component.ts`
- Values: `RECEIVED`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`
  Sources: `views/eolDisposals/disposalOffer/disposalOffer-create.component.ts`, `views/eolDisposals/disposalOffer/disposalOffer-edit.component.ts`
- Values: `PENDING`, `ACCEPTED`, `COMPLETED`, `FAILED`, `CANCELLED`
  Sources: `views/eolDisposals/endOfLeaseDisposalHandoff/endOfLeaseDisposalHandoff-create.component.ts`, `views/eolDisposals/endOfLeaseDisposalHandoff/endOfLeaseDisposalHandoff-edit.component.ts`
- Values: `DRAFT`, `APPROVAL`, `APPROVED`, `ACKNOWLEDGED`, `HANDED_OFF`, `CLOSED`
  Sources: `views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-create.component.ts`, `views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement-edit.component.ts`
- Values: `OPEN`, `NOTICE`, `RETURN`, `ASSESSMENT`, `SETTLEMENT`, `DISPOSITION`, `CLOSED`
  Sources: `views/eolDisposals/endOfLeaseStatus/endOfLeaseStatus-create.component.ts`, `views/eolDisposals/endOfLeaseStatus/endOfLeaseStatus-edit.component.ts`
- Values: `REQUESTED`, `APPROVED`, `DECLINED`, `COMPLETED`, `CANCELLED`
  Sources: `views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-create.component.ts`, `views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise-edit.component.ts`
- Values: `REQUESTED`, `ACCEPTED`, `COMPLETED`, `CANCELLED`
  Sources: `views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-create.component.ts`, `views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff-edit.component.ts`
- Values: `PLANNED`, `APPROVED`, `DISPATCHED`, `ACCEPTED`, `CLOSED`
  Sources: `views/eolDisposals/supplierReturn/supplierReturn-create.component.ts`, `views/eolDisposals/supplierReturn/supplierReturn-edit.component.ts`
- Values: `PENDING`, `SENT`, `ACKNOWLEDGED`, `COMPLETED`
  Sources: `views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-create.component.ts`, `views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction-edit.component.ts`
- Values: `PENDING`, `SATISFIED`, `WAIVED`, `FAILED`
  Sources: `views/leaseContracts/contractCondition/contractCondition-create.component.ts`, `views/leaseContracts/contractCondition/contractCondition-edit.component.ts`
- Values: `OPEN`, `COMPLIANT`, `BREACHED`, `CLOSED`
  Sources: `views/leaseContracts/contractObligation/contractObligation-create.component.ts`, `views/leaseContracts/contractObligation/contractObligation-edit.component.ts`
- Values: `AVAILABLE`, `EXERCISED`, `EXPIRED`, `WAIVED`
  Sources: `views/leaseContracts/contractRenewalOption/contractRenewalOption-create.component.ts`, `views/leaseContracts/contractRenewalOption/contractRenewalOption-edit.component.ts`
- Values: `ACTIVE`, `REINSTATED`, `CANCELLED`
  Sources: `views/leaseContracts/contractSuspension/contractSuspension-create.component.ts`, `views/leaseContracts/contractSuspension/contractSuspension-edit.component.ts`
- Values: `REQUIRED`, `RECEIVED`, `WAIVED`, `REFUNDED`
  Sources: `views/leaseContracts/leaseContractDeposit/leaseContractDeposit-create.component.ts`, `views/leaseContracts/leaseContractDeposit/leaseContractDeposit-edit.component.ts`
- Values: `ACTIVE`, `SUSPENDED`, `CLOSED`
  Sources: `views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan-create.component.ts`, `views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan-edit.component.ts`
- Values: `PENDING`, `CONFIRMED`, `REVERSED`
  Sources: `views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-create.component.ts`, `views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement-edit.component.ts`
- Values: `DRAFT`, `LODGED`, `SURVEY`, `QUERY`, `APPROVED`, `PART_APPROVED`, `REJECTED`, `SETTLED`, `CLOSED`
  Sources: `views/maintenanceInsurances/insuranceClaimStatus/insuranceClaimStatus-create.component.ts`, `views/maintenanceInsurances/insuranceClaimStatus/insuranceClaimStatus-edit.component.ts`
- Values: `OPEN`, `UNDER_REVIEW`, `CLAIMED`, `CLOSED`
  Sources: `views/maintenanceInsurances/insuranceIncident/insuranceIncident-create.component.ts`, `views/maintenanceInsurances/insuranceIncident/insuranceIncident-edit.component.ts`
- Values: `ACTIVE`, `SUSPENDED`, `REMOVED`, `EXPIRED`
  Sources: `views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-create.component.ts`, `views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-edit.component.ts`
- Values: `DRAFT`, `SUBMITTED`, `ISSUED`, `CANCELLED`
  Sources: `views/maintenanceInsurances/insurancePolicyEndorsement/insurancePolicyEndorsement-create.component.ts`, `views/maintenanceInsurances/insurancePolicyEndorsement/insurancePolicyEndorsement-edit.component.ts`
- Values: `DRAFT`, `PLACEMENT`, `ACTIVE`, `EXPIRED`, `CANCELLED`, `RENEWED`
  Sources: `views/maintenanceInsurances/insurancePolicyStatus/insurancePolicyStatus-create.component.ts`, `views/maintenanceInsurances/insurancePolicyStatus/insurancePolicyStatus-edit.component.ts`
- Values: `OPEN`, `PART_RECOVERED`, `RECOVERED`, `WAIVED`, `CLOSED`
  Sources: `views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-create.component.ts`, `views/maintenanceInsurances/insuranceRecovery/insuranceRecovery-edit.component.ts`
- Values: `OPEN`, `TRIAGED`, `APPROVED`, `REJECTED`, `CONVERTED`, `CANCELLED`
  Sources: `views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-create.component.ts`, `views/maintenanceInsurances/maintenanceRequest/maintenanceRequest-edit.component.ts`
- Values: `DRAFT`, `APPROVED`, `ACTIVE`, `SUSPENDED`, `EXPIRED`, `CLOSED`
  Sources: `views/maintenanceInsurances/serviceAgreement/serviceAgreement-create.component.ts`, `views/maintenanceInsurances/serviceAgreement/serviceAgreement-edit.component.ts`

### SuspensionReasonCode

- Values: `CREDIT`, `DEFAULT`, `LEGAL`, `OPERATIONAL`, `OTHER`
  Sources: `views/leaseContracts/contractSuspension/contractSuspension-create.component.ts`, `views/leaseContracts/contractSuspension/contractSuspension-edit.component.ts`

### TargetModuleCode — multiple option sets; split by entity

- Values: `Contact`
  Sources: `views/crm/originationHandoff/originationHandoff-create.component.ts`, `views/crm/originationHandoff/originationHandoff-edit.component.ts`
- Values: `FINANCE`, `ASSET`, `CONTRACT`, `MAINT`, `PROCUREMENT`
  Sources: `views/eolDisposals/endOfLeaseDisposalHandoff/endOfLeaseDisposalHandoff-create.component.ts`, `views/eolDisposals/endOfLeaseDisposalHandoff/endOfLeaseDisposalHandoff-edit.component.ts`
- Values: `BILLING`, `FINANCE`, `ASSET_OPS`, `SERVICING`
  Sources: `views/leaseContracts/contractHandoff/contractHandoff-create.component.ts`, `views/leaseContracts/contractHandoff/contractHandoff-edit.component.ts`

### TargetType

- Values: `PaymentReceipt`, `JournalEntry`
  Sources: `views/billings/financeReconciliation/financeReconciliation-create.component.ts`, `views/billings/financeReconciliation/financeReconciliation-edit.component.ts`

### TaskStatusCode

- Values: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `NOT_REQUIRED`
  Sources: `views/maintenanceInsurances/maintenanceWorkOrderTask/maintenanceWorkOrderTask-create.component.ts`, `views/maintenanceInsurances/maintenanceWorkOrderTask/maintenanceWorkOrderTask-edit.component.ts`

### TaxResidencyCountryCode

- Values: `IN`, `USA`, `UK`
  Sources: `views/parties/party/party-create.component.ts`, `views/parties/party/party-edit.component.ts`

### TaxType

- Values: `GST`, `VAT`
  Sources: `views/crm/quoteTax/quoteTax-create.component.ts`, `views/crm/quoteTax/quoteTax-edit.component.ts`, `views/leaseContracts/leaseContractCharge/leaseContractCharge-create.component.ts`, `views/leaseContracts/leaseContractCharge/leaseContractCharge-edit.component.ts`

### TerminationStatusCode

- Values: `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `EFFECTIVE`, `CANCELLED`
  Sources: `views/leaseContracts/contractTermination/contractTermination-create.component.ts`, `views/leaseContracts/contractTermination/contractTermination-edit.component.ts`

### TerminationTypeCode

- Values: `EXPIRY`, `EARLY`, `CUSTOMER_DEFAULT`, `MUTUAL`, `OTHER`
  Sources: `views/leaseContracts/contractTermination/contractTermination-create.component.ts`, `views/leaseContracts/contractTermination/contractTermination-edit.component.ts`

### TransactionType

- Values: `RECEIPT`, `UTILIZE`, `REFUND`, `FORFEIT`, `REVERSAL`
  Sources: `views/billings/depositTransaction/depositTransaction-create.component.ts`, `views/billings/depositTransaction/depositTransaction-edit.component.ts`

### TriggerTypeCode

- Values: `DATE`, `MEASURE`, `BOTH`, `EVENT`
  Sources: `views/maintenanceInsurances/maintenancePlan/maintenancePlan-create.component.ts`, `views/maintenanceInsurances/maintenancePlan/maintenancePlan-edit.component.ts`

### UnitMeasureType

- Values: ``
  Sources: `views/assets/assetAttributeDefinition/assetAttributeDefinition-create.component.ts`, `views/assets/assetAttributeDefinition/assetAttributeDefinition-edit.component.ts`

### ValidationStatus

- Values: `PENDING`, `VALID`, `EXCLUDED`, `ERROR`, `INVOICED`
  Sources: `views/billings/billingRunItem/billingRunItem-create.component.ts`, `views/billings/billingRunItem/billingRunItem-edit.component.ts`

### VerifiedBy

- Values: `Emp1`, `Emp2`
  Sources: `views/parties/partyDocument/partyDocument-create.component.ts`, `views/parties/partyDocument/partyDocument-edit.component.ts`

### WorkCity

- Values: ``
  Sources: `views/customer/customer-create.component.ts`, `views/customer/customer-edit.component.ts`

### WorkOrderStatusCode

- Values: `DRAFT`, `APPROVAL`, `APPROVED`, `DISPATCHED`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`, `CANCELLED`
  Sources: `views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-create.component.ts`, `views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder-edit.component.ts`

### WorkState

- Values: ``
  Sources: `views/customer/customer-create.component.ts`, `views/customer/customer-edit.component.ts`

### WriteOffReasonCode

- Values: `TOTAL_LOSS`, `OBSOLETE`, `UNEconomic`, `LOST`
  Sources: `views/eolDisposals/assetWriteOff/assetWriteOff-create.component.ts`, `views/eolDisposals/assetWriteOff/assetWriteOff-edit.component.ts`

## Existing categories with additional hardcoded values

- **CountryCode**: missing values ``. 
- **DocumentType**: missing values `DocType1`, `DocType2`. 
- **RecordStatus**: missing values `Draft`, `Inactive`, `Archived`, ``. Multiple option sets: preserve context-specific choices.

## Already referenced categories absent from the general seed

- DiscountType
- Gender
- MaritalStatus
- NatureOfBusiness

## Excluded entity-ID fields

ActionByUserId, ApprovalRequestId, ApprovedByUserId, ApproverUserId, AssessedByUserId, AssessorPartyId, AssetAttributeDefinitionId, AssetCategoryId, AssetDispositionDecisionId, AssetId, AssetMaintenancePlanId, AssetMakeId, AssetModelId, AssetReturnId, AssetReturnScheduleId, AssetStatusId, AssetTypeId, AssetUserId, AssetValuationId, AssignedToUserId, AuctionProviderPartyId, BankStatementId, BeneficiaryPartyId, BidderPartyId, BillingOrganisationId, BillingRunId, BillingRunStatusId, BrokerPartyId, BuyerPartyId, CompletedByUserId, CompletionCertificateDocumentId, ConditionGradeId, ContractAmendmentId, ContractApprovalRequestId, ContractConditionId, ContractExecutionId, ContractObligationId, ContractTerminationId, CostCentreId, CoverageTypeId, CreditNoteId, CreditPartyRoleId, CurrentLocationId, CurrentPartyId, CurrentPartyLocationId, CustomerContactPartyId, CustomerDepartmentId, CustomerDepositId, CustomerInvoiceId, CustomerInvoiceLineId, CustomerPartyId, DebitNoteId, DelegatedFromUserId, DisposalAuctionId, DisposalAwardId, DisposalBidId, DisposalCaseId, DisposalOfferId, DispositionMethodId, DocumentId, EndOfLeaseCaseId, EndOfLeaseReasonId, EndOfLeaseSettlementId, EndOfLeaseStatusId, EventTypeId, ExecutedDocumentId, FinalMeasureReadingId, FinanceApprovalRequestId, FinanceHandoffId, FinanceReferenceId, FromAssetId, FromAssetUserId, FromLocationId, FromPartyLocationId, FromStatusId, HandoffStatusId, InspectionItemReferenceId, InspectionStatusId, InspectorUserId, InsuranceClaimId, InsuranceClaimStatusId, InsuranceIncidentId, InsurancePolicyAssetId, InsurancePolicyId, InsurancePolicyStatusId, InsurerPartyId, InvoiceStatusId, JournalEntryId, LeaseContractAssetId, LeaseContractChargeId, LeaseContractDepositId, LeaseContractId, LeaseContractPartyId, LeaseContractStatusId, LeasePaymentScheduleId, LeasePaymentScheduleLineId, LessorOrganisationId, LinkedByUserId, LocationId, MaintenancePlanId, MaintenanceRequestId, MaintenanceScheduleId, MaintenanceTypeId, MaintenanceWorkOrderId, MatchedByUserId, MatchedPaymentReceiptId, MeasureDefinitionId, NewInsurancePolicyId, OrganisationBankAccountId, OrganisationId, OrganisationUnitId, OwningOrganisationId, PartyId, PartyLocationId, PayeePartyId, PaymentReceiptId, PaymentReferenceId, PlannedOrganisationUnitId, PreferredServiceProviderPartyId, PreviousPolicyId, ProcurementReferenceId, ProfitCentreId, ProposedInsurerPartyId, QuoteId, ReceiptStatusId, ReceivableId, ReceivedByUserId, ReceivingOrganisationId, RecipientPartyId, RecoveryPartyId, RecyclerPartyId, ReferenceValuationId, ReplacementAssetId, ReportedByUserId, RequestedByPartyId, RequestedByUserId, RespondedByPartyId, ResponsibleOrganisationUnitId, ReturnAssessmentId, ReturnInspectionId, ReturnLocationId, ReversalOfAllocationId, ServiceAgreementId, ServiceLocationId, ServiceProviderPartyId, ServicingOrganisationUnitId, SettlementChargeTypeId, SignerPartyId, SupplierPartyId, TaxJurisdictionId, TaxTypeId, TechnicianPartyId, TechnicianUserId, ToAssetId, ToAssetUserId, ToLocationId, ToPartyLocationId, ToStatusId, UOMId, UnitOfMeasureId, VerifiedByUserId, WorkflowDefinitionId, WorkflowInstanceId

## Implementation after approval

Reuse the existing PicklistItems bootstrap endpoint and LoggedInUserService.getPicklistOptions(category). Select category mappings per entity where field names have conflicting value sets. Preserve option values/case and existing selections. Generate an idempotent SQL insert script for approved missing rows; do not execute it. Entity-ID dropdowns require entity lookups, not PicklistItems.
