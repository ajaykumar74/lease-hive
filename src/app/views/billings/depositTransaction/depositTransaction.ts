import { IBase } from "@/shared/IBase";

export interface IDepositTransaction extends IBase {
	Id :number;
TenantId :number;
CustomerDepositId :number;
TransactionType :string;
TransactionDate :Date;
Amount :number;
PaymentReceiptId :number;
ReceivableId :number;
ReferenceType :string;
ReferenceId :number;
ApprovalRequestId :number;
RecordStatus :string;

}