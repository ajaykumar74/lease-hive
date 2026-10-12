import { IBase } from "@/shared/IBase";

export interface IDocumentVersion extends IBase {
	Id :number;
DocumentVersionId :string;
TenantId :number;
DocumentId :number;
VersionNumber :number;
StorageProvider :string;
StorageKey :string;
StorageETag :string;
OriginalFileName :string;
ContentType :string;
FileExtension :string;
ExpectedSizeBytes :number;
StoredSizeBytes :number;
Sha256 :string;
FileStatus :number;
ScanEngine :string;
ScanResult :string;
ScannedAtUtc :Date;
UploadedAtUtc :Date;
UploadedByUserId :number;
AvailableAtUtc :Date;
SupersededAtUtc :Date;

}