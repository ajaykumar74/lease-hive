import { IBase } from "@/shared/IBase";

export interface ILeaseService extends IBase {
	Id :number;
LeaseServiceId :string;
TenantId :number;
ServiceCode :string;
ServiceName :string;
AssetCategoryId :number;
DefaultChargeTypeCode :string;
DefaultRate :number;
CurrencyCode :string;
Description :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}