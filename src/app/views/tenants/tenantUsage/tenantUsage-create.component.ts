import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantUsage } from './tenantUsage';
import { TenantUsageService } from './tenantUsage.service';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';

@Component({ selector: 'app-tenant-usage-create', standalone: false, templateUrl: './tenantUsage-create.component.html', providers: [MessageService] })
export class TenantUsageCreateComponent implements OnInit {
  permission = {} as IPermission; Caption = 'Create Tenant Usage'; tenantIdOptions: ISelectItem[] = []; editForm: any;
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent; @ViewChild(MessageComponent) messageService: MessageComponent;
  constructor(private readonly fb: FormBuilder, private readonly location: Location, private readonly service: TenantUsageService, private readonly lookups: PlatformAdminLookupService) {}
  ngOnInit(): void { this.editForm = this.fb.group({ TenantId: new FormControl(null, Validators.required), ActiveUsers: new FormControl(0, [Validators.required, Validators.min(0)]), ActiveAssets: new FormControl(0, [Validators.required, Validators.min(0)]), AiRequestsThisMonth: new FormControl(0, [Validators.required, Validators.min(0)]), LastCalculatedAt: new FormControl(new Date(), Validators.required) }); this.lookups.getTenants().subscribe(options => this.tenantIdOptions = options); }
  onOptionItemClicked(key: string): void { if (key === 'Save') this.save(); if (key === 'Cancel') this.location.back(); }
  save(): void { if (this.editForm.invalid) { this.messageService.showError('Complete the required fields before saving.'); return; } const value = this.editForm.value; const payload: ITenantUsage = { Id: 0, TenantId: Number(value.TenantId), ActiveUsers: Number(value.ActiveUsers), ActiveAssets: Number(value.ActiveAssets), AiRequestsThisMonth: Number(value.AiRequestsThisMonth), LastCalculatedAt: this.toDate(value.LastCalculatedAt) }; this.spinner.show(); this.service.create(payload).subscribe({ next: () => this.location.back(), error: error => { this.messageService.showError(error); this.spinner.hide(); }, complete: () => this.spinner.hide() }); }
  private toDate(value: Date | string | null): string | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date.toISOString(); }
}
