import { IBase } from "@/shared/IBase";

export interface IDocumentAuditEvent extends IBase {
	Id :number;
DocumentAuditEventId :string;
TenantId :number;
DocumentId :number;
DocumentVersionId :number;
DocumentLinkId :number;
ActionCode :string;
ActorUserId :number;
OccurredAtUtc :Date;
Reason :string;
MetadataJson :string;

}