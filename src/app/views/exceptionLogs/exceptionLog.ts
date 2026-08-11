import { IBase } from "@/shared/IBase";

export interface IExceptionLog extends IBase {
    Id: number;
    OccurredAtUtc: Date;
    ExceptionType: string;
    Message: string;
    StackTrace?: string;
    InnerException?: string;
    
    // Request
    RequestPath?: string;
    RequestMethod?: string;
    QueryString?: string;
    
    // User
    UserId?: string;
    IpAddress?: string;
    UserAgent?: string;
    
    // Tracking
    CorrelationId?: string;
    StatusCode: number;
    
    // Additional
    AdditionalDataJson?: string;
}