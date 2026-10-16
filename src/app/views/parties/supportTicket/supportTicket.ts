export interface ISupportTicketMessage {
    Id: number;
    SenderName: string;
    SenderTypeCode: string;
    Message: string;
    IsInternalNote: boolean;
    CreatedDateTime: string;
}

export interface ISupportTicket {
    Id: number;
    TicketId: string;
    PartyId: number;
    PartyName: string;
    CategoryCode: string;
    TicketTypeCode: string;
    PriorityCode: string;
    StatusCode: string;
    Subject: string;
    RequesterName: string;
    AssignedToName: string;
    RaisedAtUtc: string;
    LastActivityAtUtc: string;
    SourceCode?: string;
    PartyLocationId?: number;
    CustomerProfileId?: number;
    LeaseContractId?: number;
    AssetId?: number;
    AssetUserId?: number;
    RequesterPartyContactId?: number;
    AssignedToApplicationUserId?: number;
    Description?: string;
    ResolutionSummary?: string;
    RowVersionStr?: string;
    Messages?: ISupportTicketMessage[];
}

export interface ISupportTicketInput {
    PartyId: number;
    PartyLocationId?: number | null;
    CustomerProfileId?: number | null;
    LeaseContractId?: number | null;
    AssetId?: number | null;
    AssetUserId?: number | null;
    RequesterPartyContactId?: number | null;
    AssignedToApplicationUserId?: number | null;
    TicketTypeCode: string;
    CategoryCode: string;
    PriorityCode: string;
    StatusCode: string;
    Subject: string;
    Description: string;
    ResolutionSummary?: string | null;
    RowVersionStr?: string;
}
