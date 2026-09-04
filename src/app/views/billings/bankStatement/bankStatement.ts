import { IBase } from "@/shared/IBase";

export interface IBankStatement extends IBase {
	Id :number;
TenantId :number;
OrganisationBankAccountId :number;
StatementNo :string;
StatementDate :Date;
CurrencyCode :string;
OpeningBalance :number;
ClosingBalance :number;
ImportSource :string;
ImportBatchRef :string;
ReconciliationStatus :string;
RecordStatus :string;

}