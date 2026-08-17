import { IBase } from "@/shared/IBase";

export interface IOpportunityStage extends IBase {
	Id :number;
OpportunityStageId :string;
TenantId :number;
StageCode :string;
StageName :string;
DefaultProbabilityPct :number;
IsWon : boolean;
IsLost : boolean;
SortOrder :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}