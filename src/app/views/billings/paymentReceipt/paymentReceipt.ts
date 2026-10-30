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

export interface IEligibleReceivable {
  ReceivableId: number;
  InvoiceReference: string;
  DueDate: Date;
  OriginalAmount: number;
  AllocatedAmount: number;
  OutstandingAmount: number;
}

export interface IPaymentAllocationHistory {
  PaymentAllocationId: number;
  ReceivableId: number;
  InvoiceReference: string;
  AllocationDate: Date;
  AllocatedAmount: number;
  AllocationType: string;
}

export interface IPaymentReceiptAllocationWorkspace {
  PaymentReceiptId: number;
  ReceiptStatusCode: string;
  IsConfirmed: boolean;
  ReceiptAmount: number;
  AllocatedAmount: number;
  UnallocatedAmount: number;
  EligibleReceivables: IEligibleReceivable[];
  AllocationHistory: IPaymentAllocationHistory[];
}
