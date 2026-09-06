import { IBase } from "@/shared/IBase";

export interface IPurchaseRequisitionLine extends IBase {
	Id :number;
PurchaseRequisitionLineId :string;
TenantId :number;
PurchaseRequisitionId :number;
LineNo :number;
LineTypeCode :string;
AssetCategoryId :number;
AssetTypeId :number;
Description :string;
Quantity :number;
UOMId :number;
EstimatedUnitCost :number;
CurrencyCode :string;
SpecificationsJson :string;
RequiredByDate :Date;
DeliveryLocationId :number;

}