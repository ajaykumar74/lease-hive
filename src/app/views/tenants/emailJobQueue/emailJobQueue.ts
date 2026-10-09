import { IBase } from "@/shared/IBase";

export interface IEmailJobQueue extends IBase {
	Id :number;
TenantId :number;
EmailType :string;
ReferenceType :string;
ReferenceId :number;
FromProfileCode :string;
ToRecipientsJson :string;
CcRecipientsJson :string;
BccRecipientsJson :string;
Subject :string;
HtmlBody :string;
AttachmentsJson :string;
Priority :number;
Status :string;
ScheduledAtUtc :Date;
NextAttemptAtUtc :Date;
AttemptCount :number;
MaxAttempts :number;
HangfireJobId :string;
EnqueuedAtUtc :Date;
ProcessingStartedAtUtc :Date;
LockExpiresAtUtc :Date;
ProviderMessageId :string;
SentAtUtc :Date;
FailedAtUtc :Date;
LastError :string;

}