import { IBase } from "@/shared/IBase";

export interface IAssetStatusHistory extends IBase {
	Id :number;
AssetStatusHistoryId :string;
TenantId :number;
AssetId :number;
FromStatusId :number;
ToStatusId :number;
AssetDisplayName?: string;
FromStatusDisplayName?: string;
ToStatusDisplayName?: string;
ReasonCode :string;
Remarks :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}
