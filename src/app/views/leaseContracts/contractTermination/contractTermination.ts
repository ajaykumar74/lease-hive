import { IBase } from "@/shared/IBase";

export interface IContractTermination extends IBase {
	Id :number;
ContractTerminationId :string;
TenantId :number;
LeaseContractId :number;
TerminationNo :string;
TerminationTypeCode :string;
RequestedDate :Date;
ProposedTerminationDate :Date;
ActualTerminationDate :Date;
ReasonCode :string;
Reason :string;
TerminationStatusCode :string;
ApprovalRequestId :number;

}