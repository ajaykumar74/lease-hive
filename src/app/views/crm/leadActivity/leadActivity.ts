import { IBase } from "@/shared/IBase";

export interface ILeadActivity extends IBase {
	Id :number;
LeadActivityId :string;
TenantId :number;
LeadId :number;
OpportunityId :number;
ActivityType :string;
Subject :string;
ActivityDateTime :Date;
DueDateTime :Date;
AssignedUserId :number;
OutcomeCode :string;
Notes :string;
CompletedOn :Date;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Description :string;

}