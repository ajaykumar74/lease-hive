import { IBase } from "@/shared/IBase";

export interface IParty extends IBase {
	Id :number;
PartyId :string;
TenantId :number;
PartyCode :string;
PartyKind :string;
LegalName :string;
TradeName :string;
PAN :string;
RegistrationNumber :string;
IncorporationDate :Date;
CountryOfRegistration :string;
IndustryCode :string;
WebsiteUrl :string;
PreferredCurrencyCode :string;
TaxResidencyCountryCode :string;
IsRelatedParty : boolean;
RiskClassification :string;
OnboardingStatus :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Description :string;

}
