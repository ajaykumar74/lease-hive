export interface TaxRule {
    Id: number;
    CountryCode: string;
    JurisdictionCode?: string | null;
    TaxTypeCode: string;
    TaxCode: string;
    TaxName: string;
    TaxGroupCode?: string | null;
    AssetCategoryId?: number | null;
    LeaseTypeCode?: string | null;
    TransactionTypeCode?: string | null;
    RulePriority?: number | null;
    TaxRate: number;
    TaxTreatmentCode: string;
    AppliesToRental: boolean;
    AppliesToServices: boolean;
    AppliesToCharges: boolean;
    EffectiveFrom: string;
    EffectiveTo?: string | null;
    RecordStatus: string;
    RowVersionStr: string;
}

export type TaxRuleInput = Omit<TaxRule, 'Id'>;

export interface TaxRuleSearchRequest {
    SearchTerm?: string;
    CountryCode?: string;
    JurisdictionCode?: string;
    TaxTypeCode?: string;
    RecordStatus?: string;
    Skip?: number;
    Take?: number;
}

export interface TaxRuleListResponse {
    Records: TaxRule[];
    TotalRecords: number;
    CanUpdate: boolean;
}
