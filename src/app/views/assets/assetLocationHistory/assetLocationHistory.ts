import { IBase } from "@/shared/IBase";

export interface IAssetLocationHistory extends IBase {
	Id :number;
AssetLocationHistoryId :string;
TenantId :number;
AssetId :number;
FromLocationId :number;
ToLocationId :number;
PartyLocationId :number;
MovementType :string;
MovementDateTime :Date;
ReferenceType :string;
ReferenceId :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}