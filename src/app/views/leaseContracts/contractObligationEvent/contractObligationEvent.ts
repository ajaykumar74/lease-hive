import { IBase } from "@/shared/IBase";

export interface IContractObligationEvent extends IBase {
	Id :number;
ContractObligationEventId :string;
TenantId :number;
ContractObligationId :number;
EventTypeCode :string;
EventDateTime :Date;
DocumentId :number;
ReferenceType :string;
ReferenceId :number;
Notes :string;
PerformedBy :number;

}