export interface TaxClassification {
    Id: number;
    CountryCode: string;
    ClassificationType: string;
    ClassificationCode: string;
    Description: string;
    EffectiveFrom: string;
    EffectiveTo?: string | null;
    RecordStatus: string;
    RowVersionStr: string;
}

export type TaxClassificationInput = Omit<TaxClassification, 'Id'>;

export interface TaxClassificationMapping {
    Id: number;
    CountryCode: string;
    SourceType: string;
    SourceId: number;
    SourceDisplayName: string;
    TransactionTypeCode: string;
    TaxClassificationId: number;
    ClassificationType: string;
    ClassificationCode: string;
    ClassificationDescription: string;
    EffectiveFrom: string;
    EffectiveTo?: string | null;
    RecordStatus: string;
    RowVersionStr: string;
}

export interface TaxClassificationMappingInput {
    CountryCode: string;
    SourceType: string;
    SourceId: number;
    TransactionTypeCode: string;
    TaxClassificationId: number;
    EffectiveFrom: string;
    EffectiveTo?: string;
    RecordStatus: string;
    RowVersionStr?: string;
}

export interface TaxClassificationListResponse { Records: TaxClassification[]; TotalRecords: number; CanUpdate: boolean; }
export interface TaxClassificationMappingListResponse { Records: TaxClassificationMapping[]; TotalRecords: number; CanUpdate: boolean; }

export interface TaxClassificationSearchRequest { SearchTerm?: string; CountryCode?: string; ClassificationType?: string; RecordStatus?: string; Skip?: number; Take?: number; }
export interface TaxClassificationMappingSearchRequest { CountryCode?: string; SourceType?: string; SourceId?: number; TransactionTypeCode?: string; RecordStatus?: string; Skip?: number; Take?: number; }
