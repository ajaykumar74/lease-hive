import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantSubscription } from './tenantSubscription';
import { TenantSubscriptionService } from './tenantSubscription.service';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';

@Component({ selector: 'app-tenant-subscription-create', standalone: false, templateUrl: './tenantSubscription-create.component.html', providers: [MessageService] })
export class TenantSubscriptionCreateComponent implements OnInit {
  permission = {} as IPermission;
  Caption = 'Create Tenant Subscription';
  tenantIdOptions: ISelectItem[] = [];
  subscriptionPlanIdOptions: ISelectItem[] = [];
  subscriptionStatusOptions: ISelectItem[] = [];
  editForm: any;
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;
  constructor(private readonly fb: FormBuilder, private readonly location: Location, private readonly service: TenantSubscriptionService, private readonly lookups: PlatformAdminLookupService) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      TenantId: new FormControl(null, Validators.required),
      SubscriptionPlanId: new FormControl(null, Validators.required),
      SubscriptionStatus: new FormControl(null, Validators.required),
      StartDate: new FormControl(new Date(), Validators.required),
      EndDate: new FormControl(null)
    });
    this.lookups.getTenants().subscribe(options => this.tenantIdOptions = options);
    this.lookups.getSubscriptionPlans().subscribe(options => this.subscriptionPlanIdOptions = options);
    this.loadStatuses();
  }
  onOptionItemClicked(key: string): void { if (key === 'Save') this.save(); if (key === 'Cancel') this.location.back(); }
  loadStatuses(): void {
    const tenantId = Number(this.editForm.get('TenantId')?.value);
    if (!tenantId) { this.subscriptionStatusOptions = this.defaultStatuses(); return; }
    this.lookups.getPicklistOptions(tenantId, 'SubscriptionStatus').subscribe({ next: options => this.subscriptionStatusOptions = options.length ? options : this.defaultStatuses(), error: () => this.subscriptionStatusOptions = this.defaultStatuses() });
  }
  save(): void {
    if (this.editForm.invalid) { this.messageService.showError('Complete the required fields before saving.'); return; }
    const value = this.editForm.value;
    const payload: ITenantSubscription = { Id: 0, TenantId: Number(value.TenantId), SubscriptionPlanId: Number(value.SubscriptionPlanId), SubscriptionStatus: value.SubscriptionStatus, StartDate: this.toDate(value.StartDate), EndDate: this.toDate(value.EndDate) };
    this.spinner.show();
    this.service.create(payload).subscribe({ next: () => this.location.back(), error: error => { this.messageService.showError(error); this.spinner.hide(); }, complete: () => this.spinner.hide() });
  }
  private defaultStatuses(): ISelectItem[] { return ['Active', 'Suspended', 'Expired'].map(value => ({ Text: value, Value: value })); }
  private toDate(value: Date | string | null): string | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10); }
}
