import { IBase } from "@/shared/IBase";

export interface IPurchaseOrderLine extends IBase {
	Id :number;
PurchaseOrderLineId :string;
TenantId :number;
PurchaseOrderId :number;
LineNo :number;
PurchaseRequisitionLineId :number;
SupplierQuotationLineId :number;
LineTypeCode :string;
AssetCategoryId :number;
AssetTypeId :number;
Description :string;
OrderedQuantity :number;
UOMId :number;
UnitPrice :number;
DiscountAmount :number;
TaxAmount :number;
LineTotal :number;
RequiredByDate :Date;
SpecificationsJson :string;

}