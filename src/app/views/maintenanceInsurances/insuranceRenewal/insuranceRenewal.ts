import { IBase } from "@/shared/IBase";

export interface IInsuranceRenewal extends IBase {
	Id :number;
TenantId :number;
InsurancePolicyId :number;
RenewalDueDate :Date;
RenewalStatusCode :string;
ProposedInsurerPartyId :number;
ProposedPremiumAmount :number;
CurrencyCode :string;
NewInsurancePolicyId :number;
AssignedToUserId :number;
Remarks :string;
RecordStatus :string;

}