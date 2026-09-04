import { IBase } from "@/shared/IBase";

export interface IFinanceReconciliation extends IBase {
	Id :number;
TenantId :number;
ReconciliationType :string;
SourceType :string;
SourceId :number;
TargetType :string;
TargetId :number;
MatchedAmount :number;
ReconciliationDate :Date;
StatusCode :string;
MatchedByUserId :number;
MatchMethod :string;
RecordStatus :string;

}