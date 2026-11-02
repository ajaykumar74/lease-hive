import { IBase } from '@/shared/IBase';
import { IBillingRunItem } from '../billingRunItem/billingRunItem';

export interface IBillingRun extends IBase {
    Id: number;
    TenantId: number;
    LeaseContractId?: number;
    BillingRunId?: string;
    // Retained for compatibility with older API responses.
    BillingRunNo?: string;
    BillingOrganisationId: number;
    BillingOrganisationName?: string;
    BillingDate: Date;
    PeriodFrom: Date;
    PeriodTo: Date;
    BillingRunStatusId: number;
    BillingRunStatusCode?: string;
    RunType: string;
    CandidateCount: number;
    InvoiceCount: number;
    TotalAmount: number;
    CurrencyCode: string;
    ApprovedByUserId: number;
    ApprovedByUserName?: string;
    ApprovedAtUtc: Date;
    RecordStatus: string;
    BillingRunItems: IBillingRunItem[];
}
