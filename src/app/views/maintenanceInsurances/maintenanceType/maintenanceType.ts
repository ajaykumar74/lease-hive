import { IBase } from "@/shared/IBase";

export interface IMaintenanceType extends IBase {
	Id :number;
TenantId :number;
MaintenanceTypeCode :string;
MaintenanceTypeName :string;
Description :string;
IsPlanned : boolean;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}