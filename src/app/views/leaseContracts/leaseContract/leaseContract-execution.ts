import { IDocumentAttachment } from '@/shared/document-attachments/document-attachment.service';

export interface ILeaseContractExecutionWorkflow {
    LeaseContractId: number;
    ContractNumber: string;
    ContractStatusCode: string;
    OrganisationId: number;
    IssuedAgreementDocumentId: number;
    IssuedAgreementDocumentVersionId: number;
    IssuedAgreementDocumentLinkId: number;
    IssuedAgreementFileName: string;
    IssuedOnUtc?: string | null;
    SignedAgreementDocumentId?: number | null;
    SignedAgreementDocumentVersionId?: number | null;
    SignedAgreementDocumentLinkId?: number | null;
    SignedAgreementFileName: string;
    SignedAgreementUploadedOnUtc?: string | null;
    ContractExecutionId?: number | null;
    ExecutionStatusCode: string;
    SignatureRequestSentOnUtc?: string | null;
    EmailJobQueueId?: number | null;
    CustomerSignerName: string;
    CustomerSignerEmail: string;
    CustomerSignatureStatusCode: string;
    CustomerSignedOnUtc?: string | null;
    LessorSignerName: string;
    LessorSignerEmail: string;
    LessorSignatureStatusCode: string;
    LessorSignedOnUtc?: string | null;
    ExecutedOnUtc?: string | null;
}

export interface ILeaseContractSignatureSendResult {
    LeaseContractId: number;
    ContractNumber: string;
    EmailJobQueueId?: number | null;
    RecipientEmail: string;
    RequestedOnUtc?: string | null;
    AlreadyQueued: boolean;
    Message: string;
}

export interface ILeaseContractSignedAgreementUploadResult {
    Execution: ILeaseContractExecutionWorkflow;
    SignedAgreement: IDocumentAttachment;
}

export interface ILeaseContractExecutionResult {
    Execution: ILeaseContractExecutionWorkflow;
    AlreadyExecuted: boolean;
    Message: string;
}
