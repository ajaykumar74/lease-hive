import { IBase } from "@/shared/IBase";

export interface IAssetMaintenancePlan extends IBase {
	Id :number;
TenantId :number;
AssetId :number;
MaintenancePlanId :number;
StartDate :Date;
EndDate :Date;
BaselineDate :Date;
BaselineMeasureValue :number;
OverrideIntervalDays :number;
OverrideMeasureValue :number;
StatusCode :string;
RecordStatus :string;

}