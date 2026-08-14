import { IBase } from "@/shared/IBase";

export interface IAuditLog extends IBase {
	Id :number;
ApplicationUserId :number;
ActionType :string;
EntityType :string;
EntityId :number;
OrganisationUnitId :number;
PartyId :number;
OccurredAt :Date;
IPAddress :string;
UserAgent :string;
CorrelationId :string;
BeforeJson :string;
AfterJson :string;
Outcome :string;
FailureReason :string;
TenantId :number;

}