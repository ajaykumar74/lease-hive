import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantFeature } from './tenantFeature';
import { TenantFeatureService } from './tenantFeature.service';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';

@Component({
  selector: 'app-tenant-feature-edit',
  standalone: false,
  templateUrl: './tenantFeature-edit.component.html',
  providers: [MessageService]
})
export class TenantFeatureEditComponent implements OnInit {
  selectedId = 0;
  permission = {} as IPermission;
  Caption = 'Tenant Feature';
  tenantFeature = {} as ITenantFeature;
  tenantIdOptions: ISelectItem[] = [];
  featureIdOptions: ISelectItem[] = [];
  editForm: any;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly location: Location,
    private readonly tenantFeatureService: TenantFeatureService,
    private readonly lookups: PlatformAdminLookupService
  ) {}

  ngOnInit(): void {
    this.selectedId = Number(this.route.snapshot.params['id']);
    this.editForm = this.fb.group({
      TenantId: new FormControl(null, [Validators.required]),
      FeatureId: new FormControl(null, [Validators.required]),
      IsEnabled: new FormControl(true, [Validators.required]),
      EffectiveFrom: new FormControl(null, [Validators.required]),
      EffectiveTo: new FormControl(null)
    });
    this.load();
  }

  onOptionItemClicked(key: string): void {
    if (key === 'Save') this.save();
    if (key === 'Cancel') this.location.back();
    if (key === 'Refresh') this.load();
  }

  private load(): void {
    this.spinner.show();
    this.tenantFeatureService.getById(this.selectedId).subscribe({
      next: (response: any) => {
        this.tenantFeature = response.data;
        this.permission = response.permission;
        this.Caption = `Tenant Feature #${this.tenantFeature.Id}`;
        this.editForm.patchValue({ ...this.tenantFeature, EffectiveFrom: this.asDate(this.tenantFeature.EffectiveFrom), EffectiveTo: this.asDate(this.tenantFeature.EffectiveTo) });
        this.lookups.getTenants(this.tenantFeature.TenantId).subscribe(options => this.tenantIdOptions = options);
        this.lookups.getFeatureDefinitions(this.tenantFeature.FeatureId).subscribe(options => this.featureIdOptions = options);
      },
      error: error => this.messageService.showError(error),
      complete: () => this.spinner.hide()
    });
  }

  save(): void {
    if (this.editForm.invalid) {
      this.messageService.showError('Complete the required fields before saving.');
      return;
    }
    const value = this.editForm.value;
    const payload: ITenantFeature = {
      ...this.tenantFeature,
      TenantId: Number(value.TenantId),
      FeatureId: Number(value.FeatureId),
      IsEnabled: !!value.IsEnabled,
      EffectiveFrom: this.toDate(value.EffectiveFrom),
      EffectiveTo: this.toDate(value.EffectiveTo)
    };
    this.spinner.show();
    this.tenantFeatureService.update(this.selectedId, payload).subscribe({
      next: () => this.location.back(),
      error: error => { this.messageService.showError(error); this.spinner.hide(); },
      complete: () => this.spinner.hide()
    });
  }

  private asDate(value: Date | string | null): Date | null { return value ? new Date(value) : null; }
  private toDate(value: Date | string | null): string | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
  }
}
