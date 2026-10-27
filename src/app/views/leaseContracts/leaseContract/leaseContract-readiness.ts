export interface ILeaseContractReadinessIssue {
    Severity: 'ERROR' | 'WARNING';
    Code: string;
    Message: string;
    SectionCode: string;
    Field?: string | null;
}

export interface ILeaseContractReadinessSection {
    Code: string;
    Label: string;
    IsComplete: boolean;
}

export interface ILeaseContractReadiness {
    LeaseContractId: number;
    ContractNumber: string;
    StatusCode: string;
    IsReadyForApproval: boolean;
    IsSubmittedForApproval: boolean;
    ApprovalRequestId?: number | null;
    ApprovalStatus: string;
    ApprovedByUserId?: number | null;
    ApprovedOn?: string | null;
    Sections: ILeaseContractReadinessSection[];
    BlockingErrors: ILeaseContractReadinessIssue[];
    Warnings: ILeaseContractReadinessIssue[];
}

export interface ILeaseContractApprovalActionResult {
    LeaseContractId: number;
    ContractNumber: string;
    StatusCode: string;
    ApprovalRequestId: number;
    ApprovalStatus: string;
    IsFullyApproved: boolean;
    ApprovedOn?: string | null;
    ApprovedByUserId?: number | null;
    Message: string;
}

export interface ILeaseContractApprovalSubmission {
    LeaseContractId: number;
    ContractNumber: string;
    StatusCode: string;
    ApprovalRequestId: number;
    ReusedPendingRequest: boolean;
    Message: string;
    Readiness: ILeaseContractReadiness;
}
