import { IBase } from "@/shared/IBase";

export interface IMaintenanceRequest extends IBase {
	Id :number;
TenantId :number;
MaintenanceRequestNo :string;
AssetId :number;
MaintenanceScheduleId :number;
MaintenanceTypeId :number;
RequestSourceCode :string;
RequestedAt :Date;
RequestedByPartyId :number;
RequestedByUserId :number;
LocationId :number;
PriorityCode :string;
ProblemDescription :string;
StatusCode :string;
RecordStatus :string;

}