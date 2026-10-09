import { IBase } from "@/shared/IBase";

export interface ITenantNotificationRecipientRule extends IBase {
	Id :number;
TenantNotificationId :number;
TenantId :number;
RecipientType :string;
SourceType :string;
ContextKey :string;
DepartmentId :number | null;
RoleCode :string;
ContactId :number | null;
FixedEmail :string;
SortOrder :number;
IsRequired : boolean;
IsActive : boolean;

}
