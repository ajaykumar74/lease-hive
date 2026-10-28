export interface ILeaseContractActivationIssue {
    Code: string;
    Message: string;
    SectionCode: string;
    Severity: string;
}

export interface ILeaseContractActivationAsset {
    AssetId: number;
    AssetNumber: string;
    Identifier: string;
    IsValidAllocation: boolean;
    AllocationIssue: string;
    DeliveredOnUtc?: string | null;
    DeliverySummary: string;
    AcceptedOnUtc?: string | null;
    AcceptanceStatusCode: string;
    AcceptanceSummary: string;
}

export interface ILeaseContractActivationAssetOption { AssetId: number; Label: string; }
export interface ILeaseContractActivationRequirement {
    LeaseContractAssetId: number;
    AssetCategoryName: string;
    AssetTypeName: string;
    RequiredQuantity: number;
    AllocationStatusCode: string;
    AllocatedAssets: ILeaseContractActivationAsset[];
    AvailableAssets: ILeaseContractActivationAssetOption[];
}
export interface ILeaseContractActivationLocation { LocationId: number; Label: string; }
export interface ILeaseContractActivationReadiness {
    LeaseContractId: number;
    ContractNumber: string;
    StatusCode: string;
    IsReadyForActivation: boolean;
    ProposedCommencementDate?: string | null;
    BlockingErrors: ILeaseContractActivationIssue[];
    Warnings: ILeaseContractActivationIssue[];
    AssetRequirements: ILeaseContractActivationRequirement[];
    DeliveryLocations: ILeaseContractActivationLocation[];
}
export interface ILeaseContractActivationResult {
    Readiness: ILeaseContractActivationReadiness;
    AlreadyActivated: boolean;
    CommencementDate?: string | null;
    MaturityDate?: string | null;
    Message: string;
}
