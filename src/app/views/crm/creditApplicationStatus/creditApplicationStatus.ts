import { IBase } from "@/shared/IBase";

export interface ICreditApplicationStatus extends IBase {
	Id :number;
CreditApplicationStatusId :string;
TenantId :number;
StatusCode :string;
StatusName :string;
IsTerminal : boolean;
SortOrder :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}