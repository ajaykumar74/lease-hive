import { IBase } from "@/shared/IBase";

export interface IProcurementException extends IBase {
	Id :number;
ProcurementExceptionId :string;
TenantId :number;
ReferenceType :string;
ReferenceId :number;
ExceptionTypeCode :string;
SeverityCode :string;
Description :string;
StatusCode :string;
AssignedToUserId :number;
Resolution :string;
ResolvedOn :Date;

}