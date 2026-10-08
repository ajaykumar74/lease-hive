import { IBase } from "@/shared/IBase";

export interface IUserDelegation extends IBase {
    Id: number;
    UserDelegationId: string;
    DelegatorUserId: number;
    DelegateUserId: number;
    DelegationType: string;
    ProcessCode: string;
    OrganisationUnitId: number;
    StartDateTime: Date;
    EndDateTime: Date;
    Reason: string;
    ApprovedById: number;
    ApprovedAt: Date;
    TenantId: number;
    RecordStatus: string;
    EffectiveFrom: Date;
    EffectiveTo: Date;
    DelegatorUserName?: string;
    DelegateUserName?: string;
    ApprovedByUserName?: string;
    OrganisationUnitCode?: string;
    OrganisationUnitName?: string;
    OrganisationUnitDisplayName?: string;
}

export interface IUserDelegationList {
    Id: number;
    UserDelegationId: string;
    DelegatorUserId: number;
    DelegatorUserName: string;
    DelegateUserId: number;
    DelegateUserName: string;
    DelegationType: string;
    ProcessCode: string;
    OrganisationUnitId: number;
    OrganisationUnitCode: string;
    OrganisationUnitName: string;
    OrganisationUnitDisplayName: string;
    StartDateTime: Date;
    EndDateTime: Date;
    ApprovedById: number;
    ApprovedByUserName: string;
    RecordStatus: string;
}
