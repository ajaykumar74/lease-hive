import { IBase } from "@/shared/IBase";

export interface IPaymentAllocation extends IBase {
	Id :number;
TenantId :number;
PaymentReceiptId :number;
ReceivableId :number;
AllocationDate :Date;
AllocatedAmount :number;
ExchangeRate :number;
AllocationType :string;
ReversalOfAllocationId :number;
ReversedAtUtc :Date;
RecordStatus :string;

}