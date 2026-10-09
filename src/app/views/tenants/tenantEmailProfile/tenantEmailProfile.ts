import { IBase } from "@/shared/IBase";

export interface ITenantEmailProfile extends IBase {
	Id :number;
TenantId :number;
OrganisationId :number | null;
ProfileCode :string;
FromEmail :string;
FromDisplayName :string;
ReplyToEmail :string;
CompanyName :string;
AddressLine1 :string;
AddressLine2 :string;
City :string;
State :string;
Pin :string;
Phone :string;
Mobile :string;
LogoDocumentId :number | null;
HeaderHtml :string;
FooterHtml :string;
IsActive : boolean;

}
