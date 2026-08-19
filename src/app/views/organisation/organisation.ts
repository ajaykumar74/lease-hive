import { IBase } from "@/shared/IBase";

export interface IOrganisation extends IBase {
	Id :number;
OrganisationId :string;
TenantId :number;
OrganisationCode :string;
LegalName :string;
TradeName :string;
OrganisationType :string;
RegistrationNumber :string;
PAN :string;
CountryCode :string;
FunctionalCurrency :string;
TimeZoneId :string;
FinancialYearStartMonth :number;
TaxSystem :string;
Status :string;
Description :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}
