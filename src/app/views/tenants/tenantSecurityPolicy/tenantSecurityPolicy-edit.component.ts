import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantSecurityPolicy } from './tenantSecurityPolicy';
import { TenantSecurityPolicyService } from './tenantSecurityPolicy.service';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';

@Component({ selector: 'app-tenant-security-policy-edit', standalone: false, templateUrl: './tenantSecurityPolicy-edit.component.html', providers: [MessageService] })
export class TenantSecurityPolicyEditComponent implements OnInit {
  selectedId = 0; permission = {} as IPermission; Caption = 'Tenant Security Policy'; tenantSecurityPolicy = {} as ITenantSecurityPolicy; tenantIdOptions: ISelectItem[] = []; recordStatusOptions: ISelectItem[] = []; editForm: any;
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent; @ViewChild(MessageComponent) messageService: MessageComponent;
  constructor(private readonly route: ActivatedRoute, private readonly fb: FormBuilder, private readonly location: Location, private readonly service: TenantSecurityPolicyService, private readonly lookups: PlatformAdminLookupService) {}
  ngOnInit(): void { this.selectedId = Number(this.route.snapshot.params['id']); this.editForm = this.fb.group({ TenantId: new FormControl(null, Validators.required), MFAEnabled: new FormControl(false), SessionTimeoutMinutes: new FormControl(30, [Validators.required, Validators.min(1), Validators.max(1440)]), RecordStatus: new FormControl('Active', Validators.required) }); this.load(); }
  onOptionItemClicked(key: string): void { if (key === 'Save') this.save(); if (key === 'Cancel') this.location.back(); if (key === 'Refresh') this.load(); }
  private load(): void { this.spinner.show(); this.service.getById(this.selectedId).subscribe({ next: (response: any) => { this.tenantSecurityPolicy = response.data; this.permission = response.permission; this.Caption = `Tenant Security Policy #${this.tenantSecurityPolicy.Id}`; this.editForm.patchValue(this.tenantSecurityPolicy); this.lookups.getTenants(this.tenantSecurityPolicy.TenantId).subscribe(options => this.tenantIdOptions = options); this.lookups.getPicklistOptions(this.tenantSecurityPolicy.TenantId, 'RecordStatus').subscribe({ next: options => this.recordStatusOptions = options.length ? options : this.defaultStatuses(), error: () => this.recordStatusOptions = this.defaultStatuses() }); }, error: error => this.messageService.showError(error), complete: () => this.spinner.hide() }); }
  save(): void { if (this.editForm.invalid) { this.messageService.showError('Complete the required fields before saving.'); return; } const value = this.editForm.value; const payload: ITenantSecurityPolicy = { ...this.tenantSecurityPolicy, TenantId: Number(value.TenantId), MFAEnabled: !!value.MFAEnabled, SessionTimeoutMinutes: Number(value.SessionTimeoutMinutes), RecordStatus: value.RecordStatus }; this.spinner.show(); this.service.update(this.selectedId, payload).subscribe({ next: () => this.location.back(), error: error => { this.messageService.showError(error); this.spinner.hide(); }, complete: () => this.spinner.hide() }); }
  private defaultStatuses(): ISelectItem[] { return ['Active', 'Inactive'].map(value => ({ Text: value, Value: value })); }
}
