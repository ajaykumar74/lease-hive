import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantSecurityPolicy } from './tenantSecurityPolicy';
import { TenantSecurityPolicyService } from './tenantSecurityPolicy.service';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';

@Component({ selector: 'app-tenant-security-policy-create', standalone: false, templateUrl: './tenantSecurityPolicy-create.component.html', providers: [MessageService] })
export class TenantSecurityPolicyCreateComponent implements OnInit {
  permission = {} as IPermission; Caption = 'Create Tenant Security Policy'; tenantIdOptions: ISelectItem[] = []; recordStatusOptions: ISelectItem[] = []; editForm: any;
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent; @ViewChild(MessageComponent) messageService: MessageComponent;
  constructor(private readonly fb: FormBuilder, private readonly location: Location, private readonly service: TenantSecurityPolicyService, private readonly lookups: PlatformAdminLookupService) {}
  ngOnInit(): void {
    this.editForm = this.fb.group({ TenantId: new FormControl(null, Validators.required), MFAEnabled: new FormControl(false), SessionTimeoutMinutes: new FormControl(30, [Validators.required, Validators.min(1), Validators.max(1440)]), RecordStatus: new FormControl('Active', Validators.required) });
    this.lookups.getTenants().subscribe(options => this.tenantIdOptions = options);
    this.loadRecordStatuses();
  }
  onOptionItemClicked(key: string): void { if (key === 'Save') this.save(); if (key === 'Cancel') this.location.back(); }
  loadRecordStatuses(): void {
    const tenantId = Number(this.editForm.get('TenantId')?.value);
    if (!tenantId) { this.recordStatusOptions = this.defaultStatuses(); return; }
    this.lookups.getPicklistOptions(tenantId, 'RecordStatus').subscribe({ next: options => this.recordStatusOptions = options.length ? options : this.defaultStatuses(), error: () => this.recordStatusOptions = this.defaultStatuses() });
  }
  save(): void {
    if (this.editForm.invalid) { this.messageService.showError('Complete the required fields before saving.'); return; }
    const value = this.editForm.value;
    const payload: ITenantSecurityPolicy = { Id: 0, TenantId: Number(value.TenantId), MFAEnabled: !!value.MFAEnabled, SessionTimeoutMinutes: Number(value.SessionTimeoutMinutes), RecordStatus: value.RecordStatus };
    this.spinner.show(); this.service.create(payload).subscribe({ next: () => this.location.back(), error: error => { this.messageService.showError(error); this.spinner.hide(); }, complete: () => this.spinner.hide() });
  }
  private defaultStatuses(): ISelectItem[] { return ['Active', 'Inactive'].map(value => ({ Text: value, Value: value })); }
}
