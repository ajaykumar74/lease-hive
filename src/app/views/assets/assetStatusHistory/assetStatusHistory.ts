import { IBase } from "@/shared/IBase";

export interface IAssetStatusHistory extends IBase {
	Id :number;
AssetStatusHistoryId :string;
TenantId :number;
AssetId :number;
FromStatusId :number;
ToStatusId :number;
ReasonCode :string;
Remarks :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}