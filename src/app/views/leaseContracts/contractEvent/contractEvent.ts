import { IBase } from "@/shared/IBase";

export interface IContractEvent extends IBase {
	Id :number;
ContractEventId :string;
TenantId :number;
LeaseContractId :number;
EventTypeCode :string;
EventDateTime :Date;
ReferenceType :string;
ReferenceId :number;
EventSummary :string;
EventPayloadJson :string;
PerformedBy :number;

}