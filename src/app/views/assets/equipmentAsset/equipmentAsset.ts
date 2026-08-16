import { IBase } from "@/shared/IBase";

export interface IEquipmentAsset extends IBase {
	Id :number;
TenantId :number;
AssetId :number;
EquipmentSerialNo :string;
CapacityValue :number;
CapacityUOMId :number;
PowerRating :number;
PowerUOMId :number;
ManufactureDate :Date;
SafetyClass :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}