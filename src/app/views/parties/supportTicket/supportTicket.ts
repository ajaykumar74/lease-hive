import { IBase } from "@/shared/IBase";

export interface ISupportTicket extends IBase {
	Id :number;
SupportTicketId :string;
TenantId :number;
PartyId :number;
PartyLocationId :number;
CustomerProfileId :number;
LeaseContractId :number;
AssetId :number;
AssetUserId :number;
RequesterApplicationUserId :number;
RequesterPartyContactId :number;
AssignedToApplicationUserId :number;
SourceCode :string;
TicketTypeCode :string;
CategoryCode :string;
PriorityCode :string;
StatusCode :string;
Subject :string;
Description :string;
RaisedAtUtc :Date;
AcknowledgedAtUtc :Date;
FirstResponseAtUtc :Date;
ResolvedAtUtc :Date;
ClosedAtUtc :Date;
LastActivityAtUtc :Date;
ResolutionSummary :string;
RecordStatus :string;

}