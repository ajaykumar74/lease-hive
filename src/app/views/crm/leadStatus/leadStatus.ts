import { IBase } from "@/shared/IBase";

export interface ILeadStatus extends IBase {
	Id :number;
LeadStatusId :string;
TenantId :number;
StatusCode :string;
StatusName :string;
IsQualified : boolean;
IsTerminal : boolean;
SortOrder :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}