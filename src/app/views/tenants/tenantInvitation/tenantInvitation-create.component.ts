import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantInvitation } from './tenantInvitation';
import { TenantInvitationService } from './tenantInvitation.service';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';

@Component({ selector: 'app-tenant-invitation-create', standalone: false, templateUrl: './tenantInvitation-create.component.html', providers: [MessageService] })
export class TenantInvitationCreateComponent implements OnInit {
  permission = {} as IPermission; Caption = 'Create Tenant Invitation'; tenantIdOptions: ISelectItem[] = []; invitationStatusOptions: ISelectItem[] = []; editForm: any;
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent; @ViewChild(MessageComponent) messageService: MessageComponent;
  constructor(private readonly fb: FormBuilder, private readonly location: Location, private readonly service: TenantInvitationService, private readonly lookups: PlatformAdminLookupService) {}
  ngOnInit(): void { this.editForm = this.fb.group({ TenantId: new FormControl(null, Validators.required), Email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(320)]), InvitedUserName: new FormControl('', Validators.maxLength(100)), InvitationStatus: new FormControl('Pending', Validators.required), ExpiresAt: new FormControl(this.defaultExpiry(), Validators.required) }); this.lookups.getTenants().subscribe(options => this.tenantIdOptions = options); this.loadStatuses(); }
  onOptionItemClicked(key: string): void { if (key === 'Save') this.save(); if (key === 'Cancel') this.location.back(); }
  loadStatuses(): void { const tenantId = Number(this.editForm.get('TenantId')?.value); if (!tenantId) { this.invitationStatusOptions = this.defaultStatuses(); return; } this.lookups.getPicklistOptions(tenantId, 'InvitationStatus').subscribe({ next: options => this.invitationStatusOptions = options.length ? options : this.defaultStatuses(), error: () => this.invitationStatusOptions = this.defaultStatuses() }); }
  save(): void { if (this.editForm.invalid) { this.messageService.showError('Complete the required fields before saving.'); return; } const value = this.editForm.value; const payload: ITenantInvitation = { Id: 0, TenantInvitationId: '', TenantId: Number(value.TenantId), Email: value.Email.trim(), InvitedUserName: value.InvitedUserName?.trim() || '', InvitationTokenHash: '', InvitationStatus: value.InvitationStatus, ExpiresAt: this.toDate(value.ExpiresAt), AcceptedAt: null, InvitedByUserId: 0, ApplicationUserId: 0 }; this.spinner.show(); this.service.create(payload).subscribe({ next: () => this.location.back(), error: error => { this.messageService.showError(error); this.spinner.hide(); }, complete: () => this.spinner.hide() }); }
  private defaultStatuses(): ISelectItem[] { return ['Pending', 'Sent', 'Accepted', 'Expired', 'Revoked'].map(value => ({ Text: value, Value: value })); }
  private defaultExpiry(): Date { const expiry = new Date(); expiry.setDate(expiry.getDate() + 7); return expiry; }
  private toDate(value: Date | string | null): string | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date.toISOString(); }
}
