import { IBase } from "@/shared/IBase";

export interface ICustomerStatementSnapshot extends IBase {
	Id :number;
TenantId :number;
BillingOrganisationId :number;
CustomerPartyId :number;
StatementDate :Date;
CurrencyCode :string;
OpeningBalance :number;
DebitAmount :number;
CreditAmount :number;
ClosingBalance :number;
CurrentAmount :number;
Days1To30 :number;
Days31To60 :number;
Days61To90 :number;
Days90Plus :number;
DocumentId :number;
RecordStatus :string;

}