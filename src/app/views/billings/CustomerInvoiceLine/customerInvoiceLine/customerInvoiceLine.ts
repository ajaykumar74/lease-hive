import { IBase } from "@/shared/IBase";

export interface ICustomerInvoiceLine extends IBase {
	Id :number;
TenantId :number;
CustomerInvoiceId :number;
LineNo :number;
LeaseContractId :number;
LeasePaymentScheduleLineId :number;
LeaseContractChargeId :number;
LeaseContractAssetId :number;
ChargeTypeCode :string;
Description :string;
ServicePeriodFrom :Date;
ServicePeriodTo :Date;
Quantity :number;
UOMId :number;
UnitPrice :number;
DiscountAmount :number;
TaxableAmount :number;
TaxAmount :number;
LineGrossAmount :number;
RecordStatus :string;

}