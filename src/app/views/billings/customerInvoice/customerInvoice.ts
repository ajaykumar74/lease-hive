import { IBase } from "@/shared/IBase";

export interface ICustomerInvoice extends IBase {
	Id :number;
TenantId :number;
InvoiceNo :string;
InvoiceStatusId :number;
BillingOrganisationId :number;
CustomerPartyId :number;
LeaseContractId :number;
InvoiceDate :Date;
DueDate :Date;
CurrencyCode :string;
ExchangeRate :number;
SubtotalAmount :number;
TaxAmount :number;
GrossAmount :number;
OutstandingAmount :number;
PaymentTermDays :number;
BillingAddressSnapshot :string;
CustomerTaxRegistrationSnapshot :string;
OrganisationTaxRegistrationSnapshot :string;
PlaceOfSupplyCode :string;
IssuedAtUtc :Date;
ExternalEInvoiceRef :string;
RecordStatus :string;

}