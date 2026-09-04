import { IBase } from "@/shared/IBase";

export interface IServiceAgreement extends IBase {
	Id :number;
TenantId :number;
ServiceAgreementNo :string;
OrganisationId :number;
ServiceProviderPartyId :number;
AgreementTypeCode :string;
StartDate :Date;
EndDate :Date;
CurrencyCode :string;
AgreementValue :number;
ResponseTimeHours :number;
ResolutionTimeHours :number;
StatusCode :string;
RecordStatus :string;

}