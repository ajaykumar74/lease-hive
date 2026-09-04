import { IBase } from "@/shared/IBase";

export interface IJournalEntryLine extends IBase {
	Id :number;
TenantId :number;
JournalEntryId :number;
LineNo :number;
GLAccountCode :string;
DebitAmount :number;
CreditAmount :number;
CurrencyCode :string;
CostCentreId :number;
ProfitCentreId :number;
OrganisationUnitId :number;
CustomerPartyId :number;
LeaseContractId :number;
AssetId :number;
TaxCode :string;
Narration :string;
RecordStatus :string;

}