import { IBase } from "@/shared/IBase";

export interface IJournalEntry extends IBase {
	Id :number;
TenantId :number;
JournalId :string;
OrganisationId :number;
JournalDate :Date;
PeriodCode :string;
SourceModule :string;
CurrencyCode :string;
TotalDebit :number;
TotalCredit :number;
PostingStatus :string;
ExternalJournalRef :string;
PostedAtUtc :Date;
RecordStatus :string;

}