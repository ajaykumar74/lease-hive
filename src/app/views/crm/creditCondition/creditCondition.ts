import { IBase } from "@/shared/IBase";

export interface ICreditCondition extends IBase {
	Id :number;
CreditConditionId :string;
TenantId :number;
CreditDecisionId :number;
ConditionType :string;
ConditionText :string;
IsPrecedent : boolean;
DueDate :Date;
ConditionStatus :string;
SatisfiedOn :Date;
EvidenceDocumentId :string;
VerifiedBy :number;

}