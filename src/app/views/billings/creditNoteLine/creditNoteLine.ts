import { IBase } from "@/shared/IBase";

export interface ICreditNoteLine extends IBase {
	Id :number;
TenantId :number;
CreditNoteId :number;
CustomerInvoiceLineId :number;
Description :string;
Quantity :number;
NetAmount :number;
TaxAmount :number;
GrossAmount :number;
RecordStatus :string;

}