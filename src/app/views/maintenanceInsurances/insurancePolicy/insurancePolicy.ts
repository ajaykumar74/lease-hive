import { IBase } from "@/shared/IBase";

export interface IInsurancePolicy extends IBase {
	Id :number;
TenantId :number;
PolicyNo :string;
OrganisationId :number;
InsurerPartyId :number;
BrokerPartyId :number;
InsurancePolicyStatusId :number;
PolicyTypeCode :string;
CoverageTypeId :number;
PolicyStartDate :Date;
PolicyEndDate :Date;
CurrencyCode :string;
TotalInsuredValue :number;
PremiumAmount :number;
TaxAmount :number;
PaymentReferenceId :number;
PreviousPolicyId :number;
IssuedDate :Date;
RecordStatus :string;

}