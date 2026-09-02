import { IBase } from "@/shared/IBase";

export interface IContractAmendment extends IBase {
	Id :number;
ContractAmendmentId :string;
TenantId :number;
LeaseContractId :number;
AmendmentNo :string;
FromVersionNo :number;
ToVersionNo :number;
AmendmentTypeCode :string;
RequestedDate :Date;
EffectiveDate :Date;
Reason :string;
AmendmentStatusCode :string;
ApprovalRequestId :number;
ExecutedOn :Date;

}