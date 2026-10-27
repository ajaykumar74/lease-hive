import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantInvitation } from './tenantInvitation';
import { TenantInvitationService } from './tenantInvitation.service';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';

@Component({ selector: 'app-tenant-invitation-edit', standalone: false, templateUrl: './tenantInvitation-edit.component.html', providers: [MessageService] })
export class TenantInvitationEditComponent implements OnInit {
  selectedId = 0;
  permission = {} as IPermission;
  Caption = 'Tenant Invitation';
  tenantInvitation = {} as ITenantInvitation;
  tenantIdOptions: ISelectItem[] = [];
  invitationStatusOptions: ISelectItem[] = [];
  editForm: any;
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent; @ViewChild(MessageComponent) messageService: MessageComponent;
  constructor(private readonly route: ActivatedRoute, private readonly fb: FormBuilder, private readonly location: Location, private readonly service: TenantInvitationService, private readonly lookups: PlatformAdminLookupService) {}
  ngOnInit(): void { this.selectedId = Number(this.route.snapshot.params['id']); this.editForm = this.fb.group({ TenantId: new FormControl(null, Validators.required), Email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(320)]), InvitedUserName: new FormControl('', Validators.maxLength(100)), InvitationStatus: new FormControl('Pending', Validators.required), ExpiresAt: new FormControl(null, Validators.required), AcceptedAt: new FormControl(null) }); this.load(); }
  onOptionItemClicked(key: string): void { if (key === 'Save') this.save(); if (key === 'Cancel') this.location.back(); if (key === 'Refresh') this.load(); }
  private load(): void { this.spinner.show(); this.service.getById(this.selectedId).subscribe({ next: (response: any) => { this.tenantInvitation = response.data; this.permission = response.permission; this.Caption = `Tenant Invitation #${this.tenantInvitation.Id}`; this.editForm.patchValue({ ...this.tenantInvitation, ExpiresAt: this.asDate(this.tenantInvitation.ExpiresAt), AcceptedAt: this.asDate(this.tenantInvitation.AcceptedAt) }); this.lookups.getTenants(this.tenantInvitation.TenantId).subscribe(options => this.tenantIdOptions = options); this.lookups.getPicklistOptions(this.tenantInvitation.TenantId, 'InvitationStatus').subscribe({ next: options => this.invitationStatusOptions = options.length ? options : this.defaultStatuses(), error: () => this.invitationStatusOptions = this.defaultStatuses() }); }, error: error => this.messageService.showError(error), complete: () => this.spinner.hide() }); }
  save(): void { if (this.editForm.invalid) { this.messageService.showError('Complete the required fields before saving.'); return; } const value = this.editForm.value; const payload: ITenantInvitation = { ...this.tenantInvitation, TenantId: Number(value.TenantId), Email: value.Email.trim(), InvitedUserName: value.InvitedUserName?.trim() || '', InvitationStatus: value.InvitationStatus, ExpiresAt: this.toDate(value.ExpiresAt), AcceptedAt: this.toDate(value.AcceptedAt) }; this.spinner.show(); this.service.update(this.selectedId, payload).subscribe({ next: () => this.location.back(), error: error => { this.messageService.showError(error); this.spinner.hide(); }, complete: () => this.spinner.hide() }); }
  private defaultStatuses(): ISelectItem[] { return ['Pending', 'Sent', 'Accepted', 'Expired', 'Revoked'].map(value => ({ Text: value, Value: value })); }
  private asDate(value: Date | string | null): Date | null { return value ? new Date(value) : null; }
  private toDate(value: Date | string | null): string | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date.toISOString(); }
}
