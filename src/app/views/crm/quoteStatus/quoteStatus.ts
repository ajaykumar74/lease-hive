import { IBase } from "@/shared/IBase";

export interface IQuoteStatus extends IBase {
	Id :number;
QuoteStatusId :string;
TenantId :number;
StatusCode :string;
StatusName :string;
IsEditable : boolean;
IsTerminal : boolean;
SortOrder :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}