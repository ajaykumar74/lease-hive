import { IBase } from "@/shared/IBase";

export interface ICreditExposure extends IBase {
	Id :number;
CreditExposureId :string;
TenantId :number;
CreditAssessmentId :number;
PartyId :number;
OrganisationId :number;
ExposureType :string;
CurrencyCode :string;
PrincipalOutstanding :number;
UndrawnCommitment :number;
ProposedExposure :number;
TotalExposure :number;
AsOfDate :Date;

}