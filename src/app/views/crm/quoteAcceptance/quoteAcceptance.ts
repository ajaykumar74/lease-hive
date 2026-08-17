import { IBase } from "@/shared/IBase";

export interface IQuoteAcceptance extends IBase {
	Id :number;
QuoteAcceptanceId :string;
TenantId :number;
QuoteId :number;
DecisionCode :string;
DecisionDateTime :Date;
AcceptedByName :string;
AcceptedByPartyContactId :number;
AcceptanceMethodCode :string;
DocumentId :number;
Remarks :string;

}