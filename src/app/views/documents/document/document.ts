import { IBase } from "@/shared/IBase";

export interface IDocument extends IBase {
	Id :number;
DocumentId :string;
TenantId :number;
DocumentTypeId :number;
Title :string;
IssuedOn :Date;
ExpiresOn :Date;
ExternalReferenceNumber :string;
CurrentDocumentVersionId :number;
Status :number;
DeletedAtUtc :Date;
DeletedByUserId :number;
DeleteReason :string;

}