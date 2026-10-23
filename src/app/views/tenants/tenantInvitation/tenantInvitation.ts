import { IBase } from "@/shared/IBase";

export interface ITenantInvitation extends IBase {
	Id :number;
TenantInvitationId :string;
TenantId :number;
Email :string;
InvitedUserName :string;
InvitationTokenHash :string;
InvitationStatus :string;
ExpiresAt :Date | string | null;
AcceptedAt :Date | string | null;
InvitedByUserId :number;
ApplicationUserId :number;
TenantName?: string;

}
