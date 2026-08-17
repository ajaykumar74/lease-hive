import { IBase } from "@/shared/IBase";

export interface ICreditApplicantParty extends IBase {
	Id :number;
CreditApplicantPartyId :string;
TenantId :number;
CreditApplicationId :number;
PartyId :number;
CreditPartyRoleId :number;
IsPrimary : boolean;
GuaranteeAmount :number;
CurrencyCode :string;

}