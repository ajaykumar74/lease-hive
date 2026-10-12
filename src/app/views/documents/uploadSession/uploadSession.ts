import { IBase } from "@/shared/IBase";

export interface IUploadSession extends IBase {
	Id :number;
UploadSessionId :string;
TenantId :number;
DocumentId :number;
DocumentVersionId :number;
ExpiresAtUtc :Date;
Status :number;
ObjectETag :string;
ServerVerifiedAtUtc :Date;
CompletedAtUtc :Date;
FailureReason :string;

}