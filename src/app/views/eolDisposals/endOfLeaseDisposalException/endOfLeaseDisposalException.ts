import { IBase } from "@/shared/IBase";

export interface IEndOfLeaseDisposalException extends IBase {
	Id :number;
TenantId :number;
ExceptionNo :string;
ExceptionTypeCode :string;
ReferenceTypeCode :string;
ReferenceId :number;
SeverityCode :string;
Reason :string;
AssignedToUserId :number;
StatusCode :string;
ResolvedAt :Date;
RecordStatus :string;

}