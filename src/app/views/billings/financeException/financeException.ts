import { IBase } from "@/shared/IBase";

export interface IFinanceException extends IBase {
	Id :number;
TenantId :number;
ExceptionNo :string;
ExceptionType :string;
ReferenceType :string;
ReferenceId :number;
Severity :string;
StatusCode :string;
ReasonCode :string;
Description :string;
AssignedToUserId :number;
ResolvedAtUtc :Date;
ResolutionNote :string;
RecordStatus :string;

}