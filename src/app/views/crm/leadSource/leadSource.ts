import { IBase } from "@/shared/IBase";

export interface ILeadSource extends IBase {
	Id :number;
LeadSourceId :string;
TenantId :number;
SourceCode :string;
SourceName :string;
IsDigital : boolean;
SortOrder :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}