import { IBase } from "@/shared/IBase";

export interface IMaintenanceWorkOrderTask extends IBase {
	Id :number;
TenantId :number;
MaintenanceWorkOrderId :number;
LineNo :number;
TaskCode :string;
TaskDescription :string;
MandatoryFlag : boolean;
TaskStatusCode :string;
CompletedAt :Date;
CompletedByUserId :number;
Remarks :string;
RecordStatus :string;

}