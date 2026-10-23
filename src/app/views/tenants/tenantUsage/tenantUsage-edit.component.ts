import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantUsage } from './tenantUsage';
import { TenantUsageService } from './tenantUsage.service';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';

@Component({ selector: 'app-tenant-usage-edit', standalone: false, templateUrl: './tenantUsage-edit.component.html', providers: [MessageService] })
export class TenantUsageEditComponent implements OnInit {
  selectedId = 0; permission = {} as IPermission; Caption = 'Tenant Usage'; tenantUsage = {} as ITenantUsage; tenantIdOptions: ISelectItem[] = []; editForm: any;
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent; @ViewChild(MessageComponent) messageService: MessageComponent;
  constructor(private readonly route: ActivatedRoute, private readonly fb: FormBuilder, private readonly location: Location, private readonly service: TenantUsageService, private readonly lookups: PlatformAdminLookupService) {}
  ngOnInit(): void { this.selectedId = Number(this.route.snapshot.params['id']); this.editForm = this.fb.group({ TenantId: new FormControl(null, Validators.required), ActiveUsers: new FormControl(0, [Validators.required, Validators.min(0)]), ActiveAssets: new FormControl(0, [Validators.required, Validators.min(0)]), AiRequestsThisMonth: new FormControl(0, [Validators.required, Validators.min(0)]), LastCalculatedAt: new FormControl(null, Validators.required) }); this.load(); }
  onOptionItemClicked(key: string): void { if (key === 'Save') this.save(); if (key === 'Cancel') this.location.back(); if (key === 'Refresh') this.load(); }
  private load(): void { this.spinner.show(); this.service.getById(this.selectedId).subscribe({ next: (response: any) => { this.tenantUsage = response.data; this.permission = response.permission; this.Caption = `Tenant Usage #${this.tenantUsage.Id}`; this.editForm.patchValue({ ...this.tenantUsage, LastCalculatedAt: this.asDate(this.tenantUsage.LastCalculatedAt) }); this.lookups.getTenants(this.tenantUsage.TenantId).subscribe(options => this.tenantIdOptions = options); }, error: error => this.messageService.showError(error), complete: () => this.spinner.hide() }); }
  save(): void { if (this.editForm.invalid) { this.messageService.showError('Complete the required fields before saving.'); return; } const value = this.editForm.value; const payload: ITenantUsage = { ...this.tenantUsage, TenantId: Number(value.TenantId), ActiveUsers: Number(value.ActiveUsers), ActiveAssets: Number(value.ActiveAssets), AiRequestsThisMonth: Number(value.AiRequestsThisMonth), LastCalculatedAt: this.toDate(value.LastCalculatedAt) }; this.spinner.show(); this.service.update(this.selectedId, payload).subscribe({ next: () => this.location.back(), error: error => { this.messageService.showError(error); this.spinner.hide(); }, complete: () => this.spinner.hide() }); }
  private asDate(value: Date | string | null): Date | null { return value ? new Date(value) : null; }
  private toDate(value: Date | string | null): string | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date.toISOString(); }
}
