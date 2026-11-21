import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, catchError, forkJoin, map, of, takeUntil } from 'rxjs';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { PartyProfileContext, PartyProfileContextService } from './party-profile-context.service';
import { PartyContactService } from '../partyContact/partyContact.service';
import { PartyGSTRegistrationService } from '../partyGSTRegistration/partyGSTRegistration.service';
import { PartyLocationService } from '../partyLocation/partyLocation.service';
import { PartyBankAccountService } from '../partyBankAccount/partyBankAccount.service';
import { PartyDocumentService } from '../partyDocument/partyDocument.service';
import { CustomerProfileService } from '../customerProfile/customerProfile.service';
import { SupplierProfileService } from '../supplierProfile/supplierProfile.service';

@Component({ templateUrl: './party-profile-overview.component.html', styleUrls: ['./party-profile-overview.component.scss'], standalone: false })
export class PartyProfileOverviewComponent implements OnInit, OnDestroy {
    context?: PartyProfileContext;
    loading = true;
    contacts: any[] = []; gst: any[] = []; locations: any[] = []; banks: any[] = []; documents: any[] = []; customers: any[] = []; suppliers: any[] = [];
    private readonly destroy$ = new Subject<void>();

    constructor(private readonly profile: PartyProfileContextService, private readonly user: LoggedInUserService,
        private readonly contactService: PartyContactService, private readonly gstService: PartyGSTRegistrationService,
        private readonly locationService: PartyLocationService, private readonly bankService: PartyBankAccountService,
        private readonly documentService: PartyDocumentService, private readonly customerService: CustomerProfileService,
        private readonly supplierService: SupplierProfileService) {}

    ngOnInit(): void { this.profile.context$.pipe(takeUntil(this.destroy$)).subscribe(context => { if (!context || context.partyId === this.context?.partyId) return; this.context = context; this.load(context.partyId); }); }
    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
    get primaryContact(): any { return this.contacts.find(x => x.IsPrimary) || this.contacts[0]; }
    get primaryLocation(): any { return this.locations.find(x => x.IsRegisteredOffice || x.IsDefaultBillTo || x.IsDefaultShipTo) || this.locations[0]; }
    hasRole(role: string): boolean { return this.context?.roles.some(x => x.toLowerCase().includes(role.toLowerCase())) || false; }

    private load(partyId: number): void {
        this.loading = true;
        forkJoin({ contacts: this.search(this.contactService, partyId), gst: this.search(this.gstService, partyId), locations: this.search(this.locationService, partyId), banks: this.search(this.bankService, partyId), documents: this.search(this.documentService, partyId), customers: this.search(this.customerService, partyId), suppliers: this.search(this.supplierService, partyId) }).subscribe((result: any) => {
            this.contacts = result.contacts; this.gst = result.gst; this.locations = result.locations; this.banks = result.banks; this.documents = result.documents; this.customers = result.customers; this.suppliers = result.suppliers; this.loading = false;
        });
    }
    private search(service: any, partyId: number): any { return service.search({ Skip: 0, Take: 25, SortBy: 'Id', IsDescending: true, Conditions: [{ DBName: 'RecordStatus', Value: 'Active', DataType: DataType.Text, Operator: Operator.EqualTo }, { DBName: 'PartyId', Value: String(partyId), DataType: DataType.Int, Operator: Operator.EqualTo }] }).pipe(map((response: any) => response?.data?.Records || []), catchError(() => of([])), takeUntil(this.destroy$)); }
}
