import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ISelectItem } from '@/shared/ISelectItem';
import { IPermission } from '@/shared/IPermission';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { MessageComponent } from '@/shared/message.component';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISupportTicket, ISupportTicketInput } from './supportTicket';
import { SupportTicketService } from './supportTicket.service';

@Component({
    selector: 'app-support-ticket-edit',
    standalone: false,
    templateUrl: './supportTicket-edit.component.html'
})
export class SupportTicketEditComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly fb = inject(FormBuilder);

    id = 0;
    ticket?: ISupportTicket;
    loading = true;
    saving = false;
    error = '';
    Caption = 'Edit Support Ticket';
    permission = { CanCreate: false, CanUpdate: true, CanDelete: false } as IPermission;

    form = this.fb.group({
        PartyId: [null as number | null, Validators.required],
        PartyLocationId: [null as number | null],
        CustomerProfileId: [null as number | null],
        LeaseContractId: [null as number | null],
        AssetId: [null as number | null],
        AssetUserId: [null as number | null],
        RequesterPartyContactId: [null as number | null],
        AssignedToApplicationUserId: [null as number | null],
        TicketTypeCode: ['', Validators.required],
        CategoryCode: ['', Validators.required],
        PriorityCode: ['', Validators.required],
        StatusCode: ['', Validators.required],
        Subject: ['', [Validators.required, Validators.maxLength(250)]],
        Description: ['', [Validators.required, Validators.maxLength(4000)]],
        ResolutionSummary: ['']
    });

    partyOptions: ISelectItem[] = [];
    locationOptions: ISelectItem[] = [];
    profileOptions: ISelectItem[] = [];
    contractOptions: ISelectItem[] = [];
    assetOptions: ISelectItem[] = [];
    assetUserOptions: ISelectItem[] = [];
    contactOptions: ISelectItem[] = [];
    assigneeOptions: ISelectItem[] = [];
    typeOptions: ISelectItem[] = [];
    categoryOptions: ISelectItem[] = [];
    priorityOptions: ISelectItem[] = [];
    statusOptions: ISelectItem[] = [];

    @ViewChild(SpinnerComponent) spinner?: SpinnerComponent;
    @ViewChild(MessageComponent) messageService?: MessageComponent;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly users: LoggedInUserService,
        private readonly service: SupportTicketService
    ) {}

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadLookups();
        this.reload();
    }

    private loadLookups(): void {
        this.users.getPartyOptions().subscribe(items => this.partyOptions = items);
        this.typeOptions = this.users.getPicklistOptions('SupportTicketType');
        this.categoryOptions = this.users.getPicklistOptions('SupportTicketCategory');
        this.priorityOptions = this.users.getPicklistOptions('SupportTicketPriority');
        this.statusOptions = this.users.getPicklistOptions('SupportTicketStatus');

        const bind = (
            field: string,
            type: string,
            assign: (items: ISelectItem[]) => void,
            parents: Record<string, string> = {}
        ) => this.users.bindEntityLookup(this.form, field, type, assign, () => {}, this.destroyRef, parents);

        bind('PartyLocationId', 'party-locations', items => this.locationOptions = items, { PartyId: 'PartyId' });
        bind('CustomerProfileId', 'customer-profiles', items => this.profileOptions = items, { PartyId: 'PartyId' });
        bind('LeaseContractId', 'lease-contracts', items => this.contractOptions = items, { PartyId: 'CustomerPartyId' });
        bind('AssetId', 'assets', items => this.assetOptions = items, { PartyId: 'PartyId' });
        bind('AssetUserId', 'asset-users', items => this.assetUserOptions = items, { AssetId: 'AssetId' });
        bind('RequesterPartyContactId', 'party-contacts', items => this.contactOptions = items, { PartyId: 'PartyId' });
        bind('AssignedToApplicationUserId', 'internal-application-users', items => this.assigneeOptions = items);
    }

    reload(): void {
        this.loading = true;
        this.spinner?.show();
        this.service.getById(this.id).subscribe({
            next: ticket => {
                this.ticket = ticket;
                this.form.patchValue(ticket);
                this.form.markAsPristine();
                this.form.markAsUntouched();
                this.Caption = `Support Ticket Details: ${ticket.TicketId}`;
            },
            error: () => {
                this.error = 'Unable to load the support ticket.';
                this.messageService?.showError(this.error);
                this.loading = false;
                this.spinner?.hide();
            },
            complete: () => {
                this.loading = false;
                this.spinner?.hide();
            }
        });
    }

    save(): void {
        if (this.form.invalid || !this.ticket) {
            this.form.markAllAsTouched();
            this.messageService?.showError('Complete all required fields before saving.');
            return;
        }

        this.saving = true;
        this.error = '';
        this.spinner?.show();
        const payload = { ...this.form.getRawValue(), RowVersionStr: this.ticket.RowVersionStr } as ISupportTicketInput;

        this.service.update(this.id, payload).subscribe({
            next: ticket => {
                this.ticket = ticket;
                this.form.patchValue(ticket);
                this.form.markAsPristine();
                this.form.markAsUntouched();
            },
            error: error => {
                this.error = typeof error === 'string' ? error : 'Unable to save the ticket.';
                this.messageService?.showError(this.error);
            },
            complete: () => {
                this.saving = false;
                this.spinner?.hide();
            }
        });
    }

    cancel(): void {
        if (!this.ticket) return;

        this.form.patchValue(this.ticket);
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.error = '';
    }

    onOptionItemClicked(action: string): void {
        if (action === 'Save') this.save();
        else if (action === 'Cancel') this.cancel();
        else if (action === 'Back') this.back();
    }

    onTicketChanged(ticket: ISupportTicket): void {
        this.ticket = ticket;
        this.form.patchValue(ticket);
        this.form.markAsPristine();
        this.form.markAsUntouched();
    }

    back(): void {
        this.router.navigate(['/business/support/tickets']);
    }
}
