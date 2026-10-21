export type AiAskMode = 'AUTO' | 'DATABASE' | 'DOCUMENT';

export interface AiAskRequest {
    ConversationId: string | null;
    Mode: AiAskMode;
    Question: string;
    DocumentId: number | null;
}

export interface AiSource {
    SourceType: string;
    Title: string;
    EntityId: number | null;
    Url: string | null;
    DocumentId: number | null;
    DocumentVersionId: number | null;
    DocumentVersionNumber: number | null;
    PageNumber: number | null;
    ChunkIndex: number | null;
    OwnerType: string | null;
    OwnerId: number | null;
}

export interface AiAppliedFilter {
    Name: string;
    Value: string;
}

export interface AiAskResponse {
    RequestId: string;
    ConversationId: string | null;
    Mode: AiAskMode;
    Status: 'COMPLETED' | 'UNAVAILABLE';
    Answer: string | null;
    Sources: AiSource[];
    AppliedFilters: AiAppliedFilter[];
    ErrorCode: string | null;
    ErrorMessage: string | null;
}
