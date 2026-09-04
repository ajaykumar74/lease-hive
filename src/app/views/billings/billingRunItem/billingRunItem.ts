import { IBase } from "@/shared/IBase";

export interface IBillingRunItem extends IBase {
	Id :number;
TenantId :number;
BillingRunId :number;
LeaseContractId :number;
LeasePaymentScheduleLineId :number;
LeaseContractChargeId :number;
SourceType :string;
DueDate :Date;
Amount :number;
CurrencyCode :string;
ValidationStatus :string;
ExclusionReason :string;
CustomerInvoiceId :number;
RecordStatus :string;

}