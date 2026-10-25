import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantSubscription } from './tenantSubscription';
import { TenantSubscriptionService } from './tenantSubscription.service';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';

@Component({ selector: 'app-tenant-subscription-edit', standalone: false, templateUrl: './tenantSubscription-edit.component.html', providers: [MessageService] })
export class TenantSubscriptionEditComponent implements OnInit {
  selectedId = 0; permission = {} as IPermission; Caption = 'Tenant Subscription'; tenantSubscription = {} as ITenantSubscription;
  tenantIdOptions: ISelectItem[] = []; subscriptionPlanIdOptions: ISelectItem[] = []; subscriptionStatusOptions: ISelectItem[] = []; editForm: any;
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent; @ViewChild(MessageComponent) messageService: MessageComponent;
  constructor(private readonly route: ActivatedRoute, private readonly fb: FormBuilder, private readonly location: Location, private readonly service: TenantSubscriptionService, private readonly lookups: PlatformAdminLookupService) {}
  ngOnInit(): void {
    this.selectedId = Number(this.route.snapshot.params['id']);
    this.editForm = this.fb.group({ TenantId: new FormControl(null, Validators.required), SubscriptionPlanId: new FormControl(null, Validators.required), SubscriptionStatus: new FormControl(null, Validators.required), StartDate: new FormControl(null, Validators.required), EndDate: new FormControl(null) });
    this.load();
  }
  onOptionItemClicked(key: string): void { if (key === 'Save') this.save(); if (key === 'Cancel') this.location.back(); if (key === 'Refresh') this.load(); }
  private load(): void {
    this.spinner.show();
    this.service.getById(this.selectedId).subscribe({ next: (response: any) => {
      this.tenantSubscription = response.data; this.permission = response.permission; this.Caption = `Tenant Subscription #${this.tenantSubscription.Id}`;
      this.editForm.patchValue({ ...this.tenantSubscription, StartDate: this.asDate(this.tenantSubscription.StartDate), EndDate: this.asDate(this.tenantSubscription.EndDate) });
      this.lookups.getTenants(this.tenantSubscription.TenantId).subscribe(options => this.tenantIdOptions = options);
      this.lookups.getSubscriptionPlans(this.tenantSubscription.SubscriptionPlanId).subscribe(options => this.subscriptionPlanIdOptions = options);
      this.lookups.getPicklistOptions(this.tenantSubscription.TenantId, 'SubscriptionStatus').subscribe({ next: options => this.subscriptionStatusOptions = options.length ? options : this.defaultStatuses(), error: () => this.subscriptionStatusOptions = this.defaultStatuses() });
    }, error: error => this.messageService.showError(error), complete: () => this.spinner.hide() });
  }
  save(): void {
    if (this.editForm.invalid) { this.messageService.showError('Complete the required fields before saving.'); return; }
    const value = this.editForm.value;
    const payload: ITenantSubscription = { ...this.tenantSubscription, TenantId: Number(value.TenantId), SubscriptionPlanId: Number(value.SubscriptionPlanId), SubscriptionStatus: value.SubscriptionStatus, StartDate: this.toDate(value.StartDate), EndDate: this.toDate(value.EndDate) };
    this.spinner.show(); this.service.update(this.selectedId, payload).subscribe({ next: () => this.location.back(), error: error => { this.messageService.showError(error); this.spinner.hide(); }, complete: () => this.spinner.hide() });
  }
  private defaultStatuses(): ISelectItem[] { return ['Active', 'Suspended', 'Expired'].map(value => ({ Text: value, Value: value })); }
  private asDate(value: Date | string | null): Date | null { return value ? new Date(value) : null; }
  private toDate(value: Date | string | null): string | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10); }
}
