import { IBase } from "@/shared/IBase";

export interface ILeaseContractStatus extends IBase {
	Id :number;
LeaseContractStatusId :string;
TenantId :number;
StatusCode :string;
StatusName :string;
IsEditable : boolean;
IsTerminal : boolean;
SortOrder :number;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}