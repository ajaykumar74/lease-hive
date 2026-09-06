import { IBase } from "@/shared/IBase";

export interface IPurchaseOrder extends IBase {
	Id :number;
PurchaseOrderId :string;
TenantId :number;
PONo :string;
VersionNo :number;
BuyingOrganisationId :number;
SupplierPartyId :number;
SupplierAwardId :number;
PurchaseOrderStatusId :number;
PODate :Date;
CurrencyCode :string;
Subtotal :number;
TaxAmount :number;
ChargeAmount :number;
TotalAmount :number;
PaymentTermCode :string;
DeliveryLocationId :number;
SupplierNameSnapshot :string;
SupplierTaxSnapshot :string;
ApprovalRequestId :number;
IssuedOn :Date;
RecordStatus :string;

}