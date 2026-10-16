import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { SupportTicketService } from './supportTicket.service';
import { ISupportTicketInput } from './supportTicket';
import { IPermission } from '@/shared/IPermission';
import { MessageComponent } from '@/shared/message.component';
import { SpinnerComponent } from '@/shared/spinner.component';

@Component({ selector: 'app-support-ticket-create', standalone: false, templateUrl: './supportTicket-create.component.html' })
export class SupportTicketCreateComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly fb = inject(FormBuilder);
    form = this.fb.group({ PartyId: [null as number | null, Validators.required], PartyLocationId: [null as number | null], CustomerProfileId: [null as number | null], LeaseContractId: [null as number | null], AssetId: [null as number | null], AssetUserId: [null as number | null], RequesterPartyContactId: [null as number | null], AssignedToApplicationUserId: [null as number | null], TicketTypeCode: ['', Validators.required], CategoryCode: ['', Validators.required], PriorityCode: ['NORMAL', Validators.required], StatusCode: ['OPEN', Validators.required], Subject: ['', [Validators.required, Validators.maxLength(250)]], Description: ['', [Validators.required, Validators.maxLength(4000)]], ResolutionSummary: [''] });
    partyOptions: ISelectItem[]=[]; locationOptions: ISelectItem[]=[]; profileOptions: ISelectItem[]=[]; contractOptions: ISelectItem[]=[]; assetOptions: ISelectItem[]=[]; assetUserOptions: ISelectItem[]=[]; contactOptions: ISelectItem[]=[]; assigneeOptions: ISelectItem[]=[];
    typeOptions: ISelectItem[]=[]; categoryOptions: ISelectItem[]=[]; priorityOptions: ISelectItem[]=[]; saving=false; error='';
    Caption = 'Create Support Ticket';
    permission = { CanCreate: true, CanUpdate: false, CanDelete: false } as IPermission;
    @ViewChild(SpinnerComponent) spinner?: SpinnerComponent;
    @ViewChild(MessageComponent) messageService?: MessageComponent;
    constructor(private readonly users: LoggedInUserService, private readonly service: SupportTicketService, private readonly router: Router) { }
    ngOnInit(): void { this.loadLookups(); }
    loadLookups(): void {
        this.users.getPartyOptions().subscribe(options => this.partyOptions=options);
        this.typeOptions=this.users.getPicklistOptions('SupportTicketType'); this.categoryOptions=this.users.getPicklistOptions('SupportTicketCategory'); this.priorityOptions=this.users.getPicklistOptions('SupportTicketPriority');
        const bind=(field:string,type:string,assign:(items:ISelectItem[])=>void,parents:Record<string,string>={})=>this.users.bindEntityLookup(this.form,field,type,assign,()=>{},this.destroyRef,parents);
        bind('PartyLocationId','party-locations',items=>this.locationOptions=items,{PartyId:'PartyId'}); bind('CustomerProfileId','customer-profiles',items=>this.profileOptions=items,{PartyId:'PartyId'}); bind('LeaseContractId','lease-contracts',items=>this.contractOptions=items,{PartyId:'CustomerPartyId'}); bind('AssetId','assets',items=>this.assetOptions=items,{PartyId:'PartyId'}); bind('AssetUserId','asset-users',items=>this.assetUserOptions=items,{AssetId:'AssetId'}); bind('RequesterPartyContactId','party-contacts',items=>this.contactOptions=items,{PartyId:'PartyId'}); bind('AssignedToApplicationUserId','internal-application-users',items=>this.assigneeOptions=items);
    }
    save(): void { if (this.form.invalid) { this.form.markAllAsTouched(); this.messageService?.showError('Complete all required fields before saving.'); return; } this.saving=true; this.error=''; this.spinner?.show(); this.service.create(this.form.getRawValue() as ISupportTicketInput).subscribe({ next: ticket=>this.router.navigate(['/business/support/tickets/edit',ticket.Id]), error:error=>{this.error=typeof error==='string'?error:'Unable to create the ticket.';this.messageService?.showError(this.error);this.saving=false;this.spinner?.hide();}, complete:()=>{this.saving=false;this.spinner?.hide();} }); }
    cancel(): void { this.router.navigate(['/business/support/tickets']); }
    onOptionItemClicked(action: string): void { if (action === 'Save') this.save(); else if (action === 'Cancel') this.cancel(); }
}
