import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, map, of, takeUntil } from 'rxjs';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { PartyProfileContext, PartyProfileContextService } from './party-profile-context.service';
import { PartyRoleService } from '../partyRole/partyRole.service';
import { PartyGSTRegistrationService } from '../partyGSTRegistration/partyGSTRegistration.service';
import { PartyLocationService } from '../partyLocation/partyLocation.service';
import { CustomerDepartmentService } from '../customerDepartment/customerDepartment.service';
import { PartyContactService } from '../partyContact/partyContact.service';
import { PartyTenantContactService } from '../partyTenantContact/partyTenantContact.service';
import { UserPartyAccessService } from '@/views/userPartyAccess/userPartyAccess.service';
import { PartyBankAccountService } from '../partyBankAccount/partyBankAccount.service';
import { PartyDocumentService } from '../partyDocument/partyDocument.service';
import { CustomerProfileService } from '../customerProfile/customerProfile.service';
import { SupplierProfileService } from '../supplierProfile/supplierProfile.service';
import { PartyCreditProfileService } from '../partyCreditProfile/partyCreditProfile.service';

interface Section { title: string; description: string; empty: string; icon: string; columns: { field: string; label: string }[]; service?: any; route?: any[]; role?: string; unavailable?: boolean; }

@Component({ templateUrl: './party-profile-records.component.html', styleUrls: ['./party-profile-records.component.scss'], standalone: false })
export class PartyProfileRecordsComponent implements OnInit, OnDestroy {
    context?: PartyProfileContext;
    sectionKey = ''; section?: Section; records: any[] = []; total = 0; loading = true;
    private readonly destroy$ = new Subject<void>();
    constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly profile: PartyProfileContextService, private readonly user: LoggedInUserService,
        private readonly roles: PartyRoleService, private readonly gst: PartyGSTRegistrationService, private readonly locations: PartyLocationService, private readonly departments: CustomerDepartmentService,
        private readonly contacts: PartyContactService, private readonly portalUsers: PartyTenantContactService, private readonly userAccess: UserPartyAccessService, private readonly banks: PartyBankAccountService, private readonly documents: PartyDocumentService,
        private readonly customerProfiles: CustomerProfileService, private readonly supplierProfiles: SupplierProfileService, private readonly creditProfiles: PartyCreditProfileService) {}

    ngOnInit(): void { this.sectionKey = this.route.snapshot.data['section']; this.profile.context$.pipe(takeUntil(this.destroy$)).subscribe(context => { if (!context || context.partyId === this.context?.partyId) return; this.context = context; this.section = this.sections()[this.sectionKey]; if (!this.section || (this.section.role && !this.hasRole(this.section.role))) { this.router.navigate(['../overview'], { relativeTo: this.route.parent }); return; } this.load(context.partyId); }); }
    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
    canEdit(record: any): boolean { return !!this.context?.permission?.CanUpdate && record?.CanUpdate !== false && record?.IsReadOnly !== true; }
    format(value: any, field: string): string { if (value === null || value === undefined || value === '') return '—'; if (/date|at$/i.test(field)) { const date = new Date(value); if (!Number.isNaN(date.getTime())) return date.toLocaleDateString(); } if (typeof value === 'boolean') return value ? 'Yes' : 'No'; return String(value); }
    openModule(): void { if (this.section?.route) this.router.navigate(this.section.route); }
    open(record: any, edit = false): void { if (this.section?.route && record?.Id) this.router.navigate([...this.section.route, edit ? 'edit' : 'view', record.Id]); }
    private hasRole(role: string): boolean { return this.context?.roles.some(x => x.toLowerCase().includes(role.toLowerCase())) || false; }
    private load(partyId: number): void {
        if (this.sectionKey === 'details' && this.context?.party) { this.records = [this.context.party]; this.total = 1; this.loading = false; return; }
        if (!this.section?.service) { this.loading = false; return; }
        this.loading = true;
        this.section.service.search({ Skip: 0, Take: 50, SortBy: 'Id', IsDescending: true, Conditions: [
            { DBName: 'RecordStatus', Value: 'Active', DataType: DataType.Text, Operator: Operator.EqualTo },
            { DBName: 'PartyId', Value: String(partyId), DataType: DataType.Int, Operator: Operator.EqualTo }
        ] }).pipe(map((response: any) => response?.data || { Records: [] }), catchError(() => of({ Records: [], TotalRecords: 0 })), takeUntil(this.destroy$)).subscribe(data => { this.records = data.Records || []; this.total = Number(data.TotalRecords ?? this.records.length); this.loading = false; });
    }
    private sections(): Record<string, Section> { const s = (title: string, description: string, empty: string, icon: string, columns: Section['columns'], service?: any, route?: any[], role?: string, unavailable = false): Section => ({ title, description, empty, icon, columns, service, route, role, unavailable }); return {
        details: s('Party Details', 'Registered identity and operational details for this party.', 'Party details are shown in the profile header.', 'pi pi-building', [{ field: 'PartyCode', label: 'Party code' }, { field: 'LegalName', label: 'Legal name' }, { field: 'TradeName', label: 'Trade name' }, { field: 'PAN', label: 'PAN' }]),
        gst: s('GST Registrations', 'GST registrations belonging to this party.', 'No GST registrations are recorded.', 'pi pi-receipt', [{ field: 'GSTIN', label: 'GSTIN' }, { field: 'LegalNameAsPerGST', label: 'Legal name' }, { field: 'StateCode', label: 'State' }, { field: 'VerificationStatus', label: 'Verification' }], this.gst, ['/business/parties/gst-registrations']),
        locations: s('Locations & Addresses', 'Registered, billing and delivery locations.', 'No locations are recorded.', 'pi pi-map-marker', [{ field: 'LocationName', label: 'Location' }, { field: 'LocationType', label: 'Type' }, { field: 'City', label: 'City' }, { field: 'StateCode', label: 'State' }], this.locations, ['/business/parties/locations']),
        departments: s('Departments', 'Departments configured for this party.', 'No departments are recorded.', 'pi pi-sitemap', [{ field: 'DepartmentCode', label: 'Code' }, { field: 'DepartmentName', label: 'Department' }, { field: 'CostCentreCode', label: 'Cost centre' }, { field: 'RecordStatus', label: 'Status' }], this.departments),
        contacts: s('Contacts', 'People authorised to act for this party.', 'No contacts are recorded.', 'pi pi-users', [{ field: 'FirstName', label: 'First name' }, { field: 'LastName', label: 'Last name' }, { field: 'Email', label: 'Email' }, { field: 'MobileNumber', label: 'Mobile' }], this.contacts, ['/business/parties/contacts']),
        users: s('Users / Assigned Users', 'Application users assigned to this party.', 'No assigned users are recorded.', 'pi pi-user-plus', [{ field: 'ApplicationUserId', label: 'User ID' }, { field: 'PartyRoleType', label: 'Party role' }, { field: 'AccessLevel', label: 'Access level' }, { field: 'RecordStatus', label: 'Status' }], this.userAccess, ['/dashboard/userPartyAccesss']),
        'app-users': s('Application Users / Portal Access', 'Portal and application-user access records.', 'No application users are recorded.', 'pi pi-id-card', [{ field: 'ApplicationUserId', label: 'User ID' }, { field: 'ContactRoleCode', label: 'Access role' }, { field: 'ReceivesSupportTickets', label: 'Support contact' }, { field: 'RecordStatus', label: 'Status' }], this.portalUsers),
        banks: s('Bank Accounts', 'Verified remittance and refund accounts.', 'No bank accounts are recorded.', 'pi pi-wallet', [{ field: 'BankName', label: 'Bank' }, { field: 'AccountNumberMasked', label: 'Account' }, { field: 'IFSCCode', label: 'IFSC' }, { field: 'VerificationStatus', label: 'Verification' }], this.banks, ['/business/parties/bank-accounts']),
        documents: s('Documents & KYC', 'KYC and compliance documents for this party.', 'No documents are recorded.', 'pi pi-folder-open', [{ field: 'DocumentType', label: 'Type' }, { field: 'DocumentNumber', label: 'Number' }, { field: 'ExpiryDate', label: 'Expires' }, { field: 'VerificationStatus', label: 'Verification' }], this.documents),
        assets: s('Assets & Assignments', 'Assets and assignments associated with this customer.', 'No Party-scoped asset API is available.', 'pi pi-box', [], undefined, undefined, 'Customer', true), contracts: s('Lease Contracts', 'Lease contracts associated with this customer.', 'No Party-scoped contract API is available.', 'pi pi-file-edit', [], undefined, undefined, 'Customer', true), billing: s('Billing Overview', 'Customer credit profile and billing configuration.', 'No credit profile is recorded.', 'pi pi-wallet', [{ field: 'CreditLimit', label: 'Credit limit' }, { field: 'CreditStatus', label: 'Credit status' }, { field: 'RecordStatus', label: 'Status' }], this.creditProfiles, ['/business/parties/credit-profiles'], 'Customer'), invoices: s('Invoices', 'Customer invoices.', 'No Party-scoped invoice API is available.', 'pi pi-file', [], undefined, undefined, 'Customer', true), payments: s('Payments & Allocations', 'Customer payment and allocation records.', 'No Party-scoped payment API is available.', 'pi pi-credit-card', [], undefined, undefined, 'Customer', true), tickets: s('Service Tickets', 'Customer support and service tickets.', 'No Party-scoped ticket API is available.', 'pi pi-ticket', [], undefined, ['/business/support/tickets'], 'Customer', true),
        rfqs: s('RFQs', 'Supplier requests for quotation.', 'No Party-scoped RFQ API is available.', 'pi pi-send', [], undefined, undefined, 'Supplier', true), 'purchase-orders': s('Purchase Orders', 'Supplier purchase orders.', 'No Party-scoped purchase-order API is available.', 'pi pi-shopping-cart', [], undefined, undefined, 'Supplier', true), deliveries: s('Deliveries', 'Supplier deliveries.', 'No Party-scoped delivery API is available.', 'pi pi-truck', [], undefined, undefined, 'Supplier', true), 'goods-receipts': s('Goods Receipts', 'Supplier goods receipts.', 'No Party-scoped goods-receipt API is available.', 'pi pi-check-square', [], undefined, undefined, 'Supplier', true), insurance: s('Insurance Policies', 'Policies associated with this insurer.', 'No Party-scoped insurance API is available.', 'pi pi-shield', [], undefined, undefined, 'Insurer', true), claims: s('Claims', 'Insurance claims associated with this insurer.', 'No Party-scoped claims API is available.', 'pi pi-exclamation-triangle', [], undefined, undefined, 'Insurer', true), funding: s('Funding Facilities', 'Funding facilities associated with this lender.', 'No Party-scoped funding API is available.', 'pi pi-chart-line', [], undefined, undefined, 'Lender', true), repayments: s('Repayment Schedules', 'Repayment schedules associated with this lender.', 'No Party-scoped repayment API is available.', 'pi pi-calendar', [], undefined, undefined, 'Lender', true), activity: s('Activity History', 'Activity history is not currently aggregated by Party.', 'No Party-scoped activity API is available.', 'pi pi-history', [], undefined, undefined, undefined, true)
    }; }
}
