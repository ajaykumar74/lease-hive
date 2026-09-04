import { IBase } from "@/shared/IBase";

export interface IDebitNoteLine extends IBase {
	Id :number;
TenantId :number;
DebitNoteId :number;
CustomerInvoiceLineId :number;
Description :string;
Quantity :number;
NetAmount :number;
TaxAmount :number;
GrossAmount :number;
RecordStatus :string;

}