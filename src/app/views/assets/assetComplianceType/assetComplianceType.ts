import { IBase } from "@/shared/IBase";

export interface IAssetComplianceType extends IBase {
	Id :number;
AssetComplianceTypeId :string;
TenantId :number;
AssetCategoryId :number;
AssetCategoryDisplayName?: string;
ComplianceCode :string;
ComplianceName :string;
RequiresExpiry : boolean;
RequiresDocument : boolean;
ReminderDaysBefore :number;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}
