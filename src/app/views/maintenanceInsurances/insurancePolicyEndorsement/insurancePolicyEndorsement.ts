import { IBase } from "@/shared/IBase";

export interface IInsurancePolicyEndorsement extends IBase {
	Id :number;
TenantId :number;
InsurancePolicyId :number;
EndorsementNo :string;
EndorsementTypeCode :string;
EffectiveDate :Date;
PremiumDeltaAmount :number;
CurrencyCode :string;
Description :string;
StatusCode :string;
RecordStatus :string;

}