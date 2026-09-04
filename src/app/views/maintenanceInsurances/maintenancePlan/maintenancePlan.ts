import { IBase } from "@/shared/IBase";

export interface IMaintenancePlan extends IBase {
	Id :number;
TenantId :number;
MaintenancePlanCode :string;
MaintenancePlanName :string;
MaintenanceTypeId :number;
AssetCategoryId :number;
AssetTypeId :number;
AssetModelId :number;
TriggerTypeCode :string;
IntervalDays :number;
MeasureDefinitionId :number;
IntervalMeasureValue :number;
LeadDays :number;
LeadMeasureValue :number;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}