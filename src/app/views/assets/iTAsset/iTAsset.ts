import { IBase } from "@/shared/IBase";

export interface IITAsset extends IBase {
	Id :number;
TenantId :number;
AssetId :number;
AssetDisplayName?: string;
DeviceSerialNo :string;
Processor :string;
RAMGB :number;
StorageGB :number;
OperatingSystem :string;
MACAddress :string;
IMEI :string;
WarrantyExpiryDate :Date;
MDMDeviceId :string;
EffectiveFrom :Date;
EffectiveTo :Date | null;
RecordStatus :string;

}
