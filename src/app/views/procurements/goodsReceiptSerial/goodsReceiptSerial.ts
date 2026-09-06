import { IBase } from "@/shared/IBase";

export interface IGoodsReceiptSerial extends IBase {
	Id :number;
GoodsReceiptSerialId :string;
TenantId :number;
GoodsReceiptLineId :number;
SerialNo :string;
ManufacturerSerialNo :string;
IMEIOrIdentifier :string;
AssetId :number;
AcceptanceCode :string;
ConditionCode :string;

}