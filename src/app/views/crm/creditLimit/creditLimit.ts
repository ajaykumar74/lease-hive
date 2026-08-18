import { IBase } from "@/shared/IBase";

export interface ICreditLimit extends IBase {
	Id :number;
CreditLimitId :string;
TenantId :number;
PartyId :number;
OrganisationId :number;
CreditDecisionId :number;
CurrencyCode :string;
LimitAmount :number;
EffectiveFrom :Date;
EffectiveTo :Date;
LimitStatus :string;
Remarks :string;
RecordStatus :string;

}