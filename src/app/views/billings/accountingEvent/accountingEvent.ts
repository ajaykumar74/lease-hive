import { IBase } from "@/shared/IBase";

export interface IAccountingEvent extends IBase {
	Id :number;
TenantId :number;
OrganisationId :number;
EventType :string;
SourceType :string;
SourceId :number;
EventDate :Date;
CurrencyCode :string;
EventAmount :number;
PostingStatus :string;
AccountingRuleCode :string;
JournalEntryId :number;
ErrorMessage :string;
RecordStatus :string;

}