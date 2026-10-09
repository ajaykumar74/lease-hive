import { IBase } from "@/shared/IBase";

export interface ITenantNotification extends IBase {
	Id :number;
TenantId :number;
OrganisationId :number | null;
Code :string;
Name :string;
Channel :string;
Description :string;
SubjectTemplate :string;
BodyTemplate :string;
EmailProfileCode :string;
UseTenantHeader : boolean;
UseTenantFooter : boolean;
TemplateVersion :number;
IsActive : boolean;

}
