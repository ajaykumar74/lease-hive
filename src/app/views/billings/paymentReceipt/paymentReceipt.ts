import { IBase } from "@/shared/IBase";

export interface IPaymentReceipt extends IBase {
	Id :number;
TenantId :number;
ReceiptNo :string;
ReceiptStatusId :number;
ReceivingOrganisationId :number;
CustomerPartyId :number;
ReceiptDate :Date;
CurrencyCode :string;
ReceiptAmount :number;
AllocatedAmount :number;
UnappliedAmount :number;
PaymentMethod :string;
OrganisationBankAccountId :number;
ExternalTransactionRef :string;
PayerNameSnapshot :string;
VerifiedAtUtc :Date;
RecordStatus :string;

}