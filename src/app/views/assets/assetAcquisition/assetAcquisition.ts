import { IBase } from "@/shared/IBase";

export interface IAssetAcquisition extends IBase {
	Id :number;
AssetAcquisitionId :string;
TenantId :number;
AssetId :number;
SupplierPartyId :number;
SupplierPartyLocationId :number;
PurchaseOrderReference :string;
GoodsReceiptReference :string;
SupplierInvoiceReference :string;
AcquisitionDate :Date;
CurrencyCode :string;
BasicAmount :number;
TaxAmount :number;
OtherCapitalizableCost :number;
TotalAcquisitionCost :number;
CapitalizationDate :Date;
ProcurementSourceId :number;

}