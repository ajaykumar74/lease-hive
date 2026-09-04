import { IBase } from "@/shared/IBase";

export interface IMaintenanceCompletion extends IBase {
	Id :number;
TenantId :number;
MaintenanceWorkOrderId :number;
AssetId :number;
CompletedAt :Date;
CompletionMeasureValue :number;
ConditionGradeId :number;
CompletionSummary :string;
NextDueDate :Date;
NextDueMeasureValue :number;
VerifiedByUserId :number;
VerifiedAt :Date;
RecordStatus :string;

}