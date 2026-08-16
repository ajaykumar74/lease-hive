import { IBase } from "@/shared/IBase";

export interface IAssetConditionGrade extends IBase {
	Id :number;
ConditionGradeId :string;
TenantId :number;
GradeCode :string;
GradeName :string;
ScoreFrom :number;
ScoreTo :number;
IsLeaseable : boolean;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}