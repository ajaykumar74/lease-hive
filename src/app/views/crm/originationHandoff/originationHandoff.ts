import { IBase } from "@/shared/IBase";

export interface IOriginationHandoff extends IBase {
	Id :number;
OriginationHandoffId :string;
TenantId :number;
OpportunityId :string;
QuoteId :number;
CreditDecisionId :number;
PartyId :number;
HandoffStatusId :string;
HandoffDateTime :Date;
TargetModuleCode :string;
TargetReferenceId :number;
ValidationJson :string;

}