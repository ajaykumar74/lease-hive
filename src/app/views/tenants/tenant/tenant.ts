import { IBase } from "@/shared/IBase";

export interface ITenant extends IBase {
	Id :number;
TenantId :string;
TenantCode :string;
TenantName :string;
LegalName :string;
BaseCountry :string;
DefaultCurrency :string;
DefaultTimeZone :string;
DateFormat :string;
TimeFormat :string;
NumberFormat :string;
FinancialYearStartMonth :number;
BaseTaxSystem :string;
MultiOrganisationEnabled : boolean;
MultiCurrencyEnabled : boolean;
MultiCountryEnabled : boolean;
MultiLanguageEnabled : boolean;
Status :string;
Description :string;

}
