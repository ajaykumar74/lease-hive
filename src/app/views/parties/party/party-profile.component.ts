import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, forkJoin, map, of, takeUntil } from 'rxjs';
import { IPermission } from '@/shared/IPermission';
import { PartyService } from './party.service';
import { IParty } from './party';
import { PartyRoleService } from '../partyRole/partyRole.service';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { PartyProfileContextService } from './party-profile-context.service';
import { PartyContactService } from '../partyContact/partyContact.service';
import { PartyGSTRegistrationService } from '../partyGSTRegistration/partyGSTRegistration.service';
import { PartyLocationService } from '../partyLocation/partyLocation.service';

type PartyOrigin = 'party' | 'customer' | 'supplier' | 'insurer' | 'lender';

@Component({ templateUrl: './party-profile.component.html', styleUrls: ['./party-profile.component.scss'], standalone: false })
export class PartyProfileComponent implements OnInit, OnDestroy {
    party?: IParty;
    permission = {} as IPermission;
    roles: string[] = [];
    primaryContact?: any;
    primaryGst?: any;
    primaryLocation?: any;
    origin: PartyOrigin = 'party';
    loading = true;
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly parties: PartyService,
        private readonly partyRoles: PartyRoleService,
        private readonly contacts: PartyContactService,
        private readonly gst: PartyGSTRegistrationService,
        private readonly locations: PartyLocationService,
        private readonly user: LoggedInUserService,
        private readonly context: PartyProfileContextService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            const partyId = Number(params.get('id'));
            if (!Number.isInteger(partyId) || partyId <= 0) { this.router.navigate(['/business/parties']); return; }
            this.origin = this.readOrigin();
            this.load(partyId);
        });
    }

    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); this.context.clear(); }

    get title(): string {
        const label = this.origin === 'party' ? this.preferredRole() : this.origin;
        return `${label.charAt(0).toUpperCase()}${label.slice(1)} Profile`;
    }

    get primaryName(): string { return this.party?.TradeName || this.party?.LegalName || 'Unnamed party'; }

    edit(): void { if (this.party?.Id) this.router.navigate(['/business/parties/edit', this.party.Id], { state: { party: this.party } }); }

    back(): void { this.router.navigateByUrl(this.originRoute()); }

    statusClass(status?: string): string {
        const value = (status || '').toLowerCase();
        if (value.includes('active') || value.includes('approved')) return 'party-profile__status--success';
        if (value.includes('inactive') || value.includes('blocked') || value.includes('rejected')) return 'party-profile__status--danger';
        return 'party-profile__status--warning';
    }

    private load(partyId: number): void {
        this.loading = true;
        this.parties.getById(partyId).subscribe({
            next: response => {
                this.party = response.data;
                this.permission = response.permission || {} as IPermission;
                this.loadRoles(partyId);
                this.loadHeaderDetails(partyId);
            },
            error: () => this.router.navigate(['/business/parties']),
            complete: () => this.loading = false
        });
    }

    private loadRoles(partyId: number): void {
        this.partyRoles.search({ Skip: 0, Take: 100, SortBy: 'Id', IsDescending: false, Conditions: [
            { DBName: 'TenantId', Value: String(this.user.loggedInUser.Tenant.Id), DataType: DataType.Int, Operator: Operator.EqualTo },
            { DBName: 'PartyId', Value: String(partyId), DataType: DataType.Int, Operator: Operator.EqualTo },
            { DBName: 'RecordStatus', Value: 'Active', DataType: DataType.Text, Operator: Operator.EqualTo }
        ] }).pipe(
            map((response: any) => response?.data?.Records || []),
            catchError(() => of([]))
        ).subscribe((records: any[]) => {
            this.roles = [...new Set(records.map((record: any) => String(record.RoleCode || record.RoleType || '').trim()).filter(Boolean))];
            this.publish(partyId);
        });
    }

    private loadHeaderDetails(partyId: number): void {
        forkJoin({ contacts: this.related(this.contacts, partyId), gst: this.related(this.gst, partyId), locations: this.related(this.locations, partyId) }).subscribe((result: any) => {
            this.primaryContact = result.contacts.find((x: any) => x.IsPrimary) || result.contacts[0];
            this.primaryGst = result.gst.find((x: any) => x.IsDefault) || result.gst[0];
            this.primaryLocation = result.locations.find((x: any) => x.IsRegisteredOffice || x.IsDefaultBillTo || x.IsDefaultShipTo) || result.locations[0];
        });
    }

    private related(service: any, partyId: number): any {
        return service.search({ Skip: 0, Take: 10, SortBy: 'Id', IsDescending: false, Conditions: [
            { DBName: 'RecordStatus', Value: 'Active', DataType: DataType.Text, Operator: Operator.EqualTo },
            { DBName: 'PartyId', Value: String(partyId), DataType: DataType.Int, Operator: Operator.EqualTo }
        ] }).pipe(map((response: any) => response?.data?.Records || []), catchError(() => of([])));
    }

    private publish(partyId: number): void {
        if (this.party) this.context.set({ partyId, party: this.party, permission: this.permission, roles: this.roles, origin: this.origin });
    }

    private preferredRole(): string {
        const known = this.roles.map(role => role.toLowerCase()).find(role => ['customer', 'supplier', 'insurer', 'lender'].some(kind => role.includes(kind)));
        return known || 'party';
    }

    private readOrigin(): PartyOrigin {
        const value = String(this.route.snapshot.queryParamMap.get('origin') || 'party').toLowerCase();
        return ['party', 'customer', 'supplier', 'insurer', 'lender'].includes(value) ? value as PartyOrigin : 'party';
    }

    private originRoute(): string {
        const routes: Record<PartyOrigin, string> = {
            party: '/business/parties', customer: '/business/parties/customer-profiles', supplier: '/business/parties/supplier-profiles',
            insurer: '/business/parties', lender: '/business/parties'
        };
        return routes[this.origin];
    }
}
