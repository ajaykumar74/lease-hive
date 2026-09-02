import { IBase } from "@/shared/IBase";

export interface IContractRenewalOption extends IBase {
	Id :number;
ContractRenewalOptionId :string;
TenantId :number;
LeaseContractId :number;
OptionTypeCode :string;
EarliestExerciseDate :Date;
LatestExerciseDate :Date;
NoticeDays :number;
OptionPriceAmount :number;
CurrencyCode :string;
TermsJson :string;
StatusCode :string;

}