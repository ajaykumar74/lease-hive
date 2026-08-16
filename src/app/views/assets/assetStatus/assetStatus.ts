import { IBase } from "@/shared/IBase";

export interface IAssetStatus extends IBase {
	Id :number;
TenantId :number;
AssetStatusId :string; 
StatusCode :string;
StatusName :string;
IsLeaseable : boolean;
IsTerminal : boolean;
SortOrder :number;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}