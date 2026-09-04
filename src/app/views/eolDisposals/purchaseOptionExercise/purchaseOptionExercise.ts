import { IBase } from "@/shared/IBase";

export interface IPurchaseOptionExercise extends IBase {
	Id :number;
TenantId :number;
EndOfLeaseCaseId :number;
LeaseContractAssetId :number;
AssetId :number;
CustomerPartyId :number;
ExerciseDate :Date;
OptionPriceAmount :number;
CurrencyCode :string;
StatusCode :string;
ApprovedByUserId :number;
CompletedAt :Date;
RecordStatus :string;

}