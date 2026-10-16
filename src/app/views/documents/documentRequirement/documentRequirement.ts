import { IBase } from "@/shared/IBase";

export interface IDocumentRequirement extends IBase {
	Id :number;
DocumentRequirementId :string;
TenantId :number;
OwnerType :string;
Code :string;
DisplayName :string;
Description :string;
DocumentTypeId :number;
DocumentRetentionPolicyId :number;
RequiredMode :number;
ConditionCode :string;
MinCount :number;
MaxCount :number;
AllowedContentTypesJson :string;
AllowedExtensionsJson :string;
MaxFileSizeBytes :number;
RequiresIssueDate : boolean;
RequiresExpiryDate : boolean;
ExpiryWarningDays :number;
IsActive : boolean;
CustomerPortalAccess : 'Internal' | 'View' | 'Upload';

}
