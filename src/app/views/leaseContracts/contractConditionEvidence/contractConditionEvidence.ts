import { IBase } from "@/shared/IBase";

export interface IContractConditionEvidence extends IBase {
	Id :number;
ContractConditionEvidenceId :string;
TenantId :number;
ContractConditionId :number;
EvidenceTypeCode :string;
DocumentId :number;
ReferenceType :string;
ReferenceId :number;
EvidenceNotes :string;
CapturedOn :Date;
CapturedBy :number;

}