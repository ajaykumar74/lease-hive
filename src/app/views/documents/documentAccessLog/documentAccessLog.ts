import { IBase } from "@/shared/IBase";

export interface IDocumentAccessLog extends IBase {
	Id :number;
DocumentAccessLogId :string;
TenantId :number;
DocumentId :number;
DocumentVersionId :number;
AccessAction :number;
AccessedByUserId :number;
AccessedAtUtc :Date;
ClientIpAddress :string;

}