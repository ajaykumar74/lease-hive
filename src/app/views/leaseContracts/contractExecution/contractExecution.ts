import { IBase } from "@/shared/IBase";

export interface IContractExecution extends IBase {
	Id :number;
ContractExecutionId :string;
TenantId :number;
ReferenceType :string;
ReferenceId :number;
ExecutionMethodCode :string;
ExecutionStatusCode :string;
SentOn :Date;
ExecutedOn :Date;
ExternalEnvelopeId :string;
ExecutedDocumentId :number;
CompletionCertificateDocumentId :number;

}