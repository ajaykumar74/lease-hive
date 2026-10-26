/**
 * Contract for the quotation aggregate endpoint.  It intentionally excludes
 * tenant and audit values: those are supplied by the API from the authenticated
 * request context.
 */
export interface IQuotationWorkspace {
    Quote: IQuotationWorkspaceHeader;
    Assets: IQuotationWorkspaceAsset[];
    Services: IQuotationWorkspaceService[];
    Charges: IQuotationWorkspaceCharge[];
    RemovedAssetIds: number[];
    RemovedServiceIds: number[];
    RemovedChargeIds: number[];
}

export interface IQuotationWorkspaceHeader {
    Id: number;
    RowVersionStr?: string;
    QuoteId?: string;
    QuoteGroupNo: number;
    VersionNo?: string;
    OpportunityId: number;
    LeaseRequirementId: number;
    PartyId: number;
    OriginatingOrganisationId: number;
    QuoteStatusId: number;
    StatusCode?: string;
    StatusName?: string;
    IsEditable?: boolean;
    QuoteDate: Date | string;
    ValidUntil: Date | string;
    CurrencyCode: string;
    RequestedTermMonths: number;
    BillingFrequency: string;
    SecurityDepositAmount: number;
    Remarks?: string;
    PricingModeCode: string;
    LeaseTypeCode?: string;
    PaymentTimingCode?: string;
    PeriodicTotalAmount?: number;
    UpfrontAmount?: number;
    TotalContractValue?: number;
    TermsAndConditions?: string;
    DeliveryTerms?: string;
    ReturnTerms?: string;
    ServiceLevelTerms?: string;
    TaxAmount?: number;
    DiscountAmount?: number;
}

export interface IQuotationWorkspaceAsset {
    Id: number;
    ClientKey: string;
    RowVersionStr?: string;
    LeaseRequirementAssetId: number;
    LineNo: number;
    AssetCategoryId: number;
    AssetTypeId: number;
    AssetMakeId: number;
    AssetModelId: number;
    Description?: string;
    Quantity: number;
    UnitAssetCost: number;
    TermMonths: number;
    BillingFrequency: string;
    ManualPeriodicRentalAmount: number;
    PricingMethodCode?: string;
    CalculatedPeriodicRentalAmount?: number;
    AnnualFundingRate?: number;
    EstimatedResidualValueAmount?: number;
    NonRefundableDownPaymentAmount?: number;
    ContractualBulletPaymentAmount?: number;
    UsageAllowance?: number;
    ExpectedUsage?: number;
    ExcessUsageRate?: number;
    PricingInputHash?: string;
    PricingCalculatedAt?: Date | string;
    AppliedPricingScenarioId?: number | null;
    PricingIsStale?: boolean;
    TaxCode?: string;
}

export interface IQuotationWorkspaceService {
    Id: number;
    ClientKey: string;
    RowVersionStr?: string;
    QuoteAssetId: number;
    QuoteAssetClientKey?: string;
    LeaseServiceId: number;
    ServiceNameSnapshot?: string;
    IsIncluded: boolean;
    IsSeparatelyChargeable: boolean;
    ChargeFrequencyCode?: string;
    UnitAmount: number;
    Quantity: number;
    ServiceTerms?: string;
    LeaseServiceDisplayName?: string;
}

export interface IQuotationWorkspaceCharge {
    Id: number;
    ClientKey: string;
    RowVersionStr?: string;
    QuoteAssetId: number;
    QuoteAssetClientKey?: string;
    ChargeType: string;
    ChargeDescription: string;
    CalculationTypeCode: string;
    RateOrAmount: number;
    IsRecurring: boolean;
    ChargeFrequencyCode?: string;
    TaxCode?: string;
    StartPeriodNo?: number | null;
    EndPeriodNo?: number | null;
}

export interface ILeasePricingInput {
    QuoteId: number;
    QuoteAssetId: number;
    AssetCategoryId: number;
    CurrencyCode?: string;
    PricingModeCode: string;
    PaymentTimingCode?: string;
    BillingFrequency?: string;
    Quantity: number;
    UnitAssetCost: number;
    TermMonths: number;
    AnnualFundingRate: number;
    EstimatedResidualValueAmount: number;
    EstimatedResidualValuePercent?: number;
    NonRefundableDownPaymentAmount: number;
    ContractualBulletPaymentAmount: number;
    RefundableSecurityDepositAmount: number;
    UsageAllowance: number;
    ExpectedUsage: number;
    ExcessUsageRate: number;
    ManualPeriodicRentalAmount: number;
    Services: ILeasePricingServiceInput[];
    Charges: ILeasePricingChargeInput[];
}

export interface ILeasePricingServiceInput {
    QuoteServiceId: number;
    ServiceName?: string;
    IsIncluded: boolean;
    IsSeparatelyChargeable: boolean;
    ChargeFrequencyCode?: string;
    UnitAmount: number;
    Quantity: number;
}

export interface ILeasePricingChargeInput {
    QuoteChargeId: number;
    Description?: string;
    IsRecurring: boolean;
    ChargeFrequencyCode?: string;
    StartPeriodNo?: number | null;
    EndPeriodNo?: number | null;
    Amount: number;
}

export interface ILeasePricingResult {
    InputHash: string;
    PricingModeCode: string;
    AssetCostAmount: number;
    NetFinancedAmount: number;
    MonthlyFundingRate: number;
    PeriodicBaseRental: number;
    PeriodicServiceAmount: number;
    PeriodicRecurringChargeAmount: number;
    PeriodicCustomerPayment: number;
    UpfrontReductionAmount: number;
    UpfrontChargeAmount: number;
    RefundableSecurityDepositAmount: number;
    ContractualBulletPaymentAmount: number;
    EstimatedResidualValueAmount: number;
    ProjectedExcessUsageAmount: number;
    EndOfTermCustomerPaymentAmount: number;
    TotalBaseRentalPayments: number;
    TotalServicePayments: number;
    TotalRecurringChargePayments: number;
    TotalContractualPayments: number;
    TotalCashOutflowIncludingRefundableDeposit: number;
    Warnings: string[];
    Schedule: ILeasePricingScheduleLine[];
}

export interface ILeasePricingScheduleLine {
    PeriodNo: number;
    OpeningBalance: number;
    FinanceCharge: number;
    PrincipalRecovery: number;
    BaseRentalAmount: number;
    ServiceAmount: number;
    RecurringChargeAmount: number;
    UpfrontChargeAmount: number;
    ContractualBulletAmount: number;
    ExpectedResidualRecoveryAmount: number;
    ProjectedExcessUsageAmount: number;
    RefundableSecurityDepositAmount: number;
    TotalCustomerPaymentAmount: number;
    ClosingBalance: number;
}

export interface ILeasePricingScenario {
    Id: number;
    QuoteId: number;
    QuoteAssetId: number;
    ScenarioNo: number;
    ScenarioName: string;
    PricingModeCode: string;
    TermMonths: number;
    AnnualFundingRate: number;
    PeriodicBaseRental: number;
    PeriodicServiceAmount: number;
    TotalContractValue: number;
    InputHash: string;
    IsSelected: boolean;
    CalculatedAt: Date | string;
    Result?: ILeasePricingResult;
}

export interface IApplyLeasePricingResult {
    ScenarioId: number;
    QuoteAssetId: number;
    PricingInputHash: string;
    AssetRowVersionStr: string;
    QuoteRowVersionStr: string;
    QuotePeriodicTotalAmount: number;
    QuoteUpfrontAmount: number;
    QuoteTotalContractValue: number;
    Result: ILeasePricingResult;
}

export interface IQuotationCommercialStatus {
    QuoteId: number;
    QuoteNumber: string;
    QuoteGroupNo: number;
    VersionNo: string;
    StatusCode: string;
    StatusName: string;
    IsEditable: boolean;
    PeriodicTotalAmount: number;
    UpfrontAmount: number;
    TaxAmount: number;
    TotalContractValue: number;
    CurrencyCode: string;
    CommercialStateHash: string;
    ApprovalRequestId?: number | null;
    ApprovalStatus?: string;
    PricingSnapshotId?: number | null;
    PolicyEvaluations: IQuotationPolicyEvaluation[];
    ApprovalHistory: IQuotationApprovalHistory[];
    PaymentSchedule: IQuotationPaymentSchedule[];
}

export interface IQuotationPolicyEvaluation {
    LeasePricingPolicyId?: number | null;
    PolicyCode: string;
    SeverityCode: string;
    EvaluationCode: string;
    Message: string;
    RequiresApproval: boolean;
}

export interface IQuotationApprovalHistory {
    ApprovalRequestId: number;
    ApprovalRequestNumber: string;
    ApprovalStatus: string;
    StepNo: number;
    ApproverUserId: number;
    ActionCode: string;
    ActionDateTime: Date | string;
    Comments?: string;
}

export interface IQuotationPaymentSchedule {
    PeriodNo: number;
    DueDate: Date | string;
    NetAmount: number;
    TaxAmount: number;
    GrossAmount: number;
    PaymentTimingCode: string;
    Description: string;
}

export interface IQuotationCommercialActionResult {
    QuoteId: number;
    StatusCode: string;
    ApprovalRequestId?: number | null;
    PricingSnapshotId?: number | null;
    Message: string;
}

export interface IQuoteContractHandoffResult {
    QuoteId: number;
    LeaseContractId: number;
    ContractNumber: string;
    ReusedExistingDraft: boolean;
    PricingSnapshotId: number;
}
