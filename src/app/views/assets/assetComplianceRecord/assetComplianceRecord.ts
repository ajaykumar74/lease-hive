import { IBase } from "@/shared/IBase";

export interface IAssetComplianceRecord extends IBase {
	Id :number;
AssetComplianceRecordId :string;
TenantId :number;
AssetId :number;
AssetComplianceTypeId :number;
CertificateNo :string;
IssuedByPartyId :number;
IssueDate :Date;
ValidFrom :Date;
ValidTo :Date;
DocumentId :number;
VerificationStatusId :number;
VerifiedBy :number;
VerifiedOn :Date;
AssetDisplayName?: string;
AssetComplianceTypeDisplayName?: string;
IssuedByPartyDisplayName?: string;
DocumentDisplayName?: string;
VerificationStatusDisplayName?: string;
VerifiedByDisplayName?: string;

}
