import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
  selector: 'app-tenant-feature-create',
  standalone: false,
  templateUrl: './tenantFeature-create.component.html',
  providers: [MessageService]
})
export class TenantFeatureCreateComponent implements OnInit {
  permission = {} as IPermission;
  Caption = 'Create Tenant Feature';
  tenantIdOptions: ISelectItem[] = [];
  featureIdOptions: ISelectItem[] = [];
  editForm: any;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private readonly fb: FormBuilder,
    private readonly location: Location,
    private readonly tenantFeatureService: TenantFeatureService,
    private readonly lookups: PlatformAdminLookupService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      TenantId: new FormControl(null, [Validators.required]),
      FeatureId: new FormControl(null, [Validators.required]),
      IsEnabled: new FormControl(true, [Validators.required]),
      EffectiveFrom: new FormControl(new Date(), [Validators.required]),
      EffectiveTo: new FormControl(null)
    });
    this.loadLookups();
  }

  onOptionItemClicked(key: string): void {
    if (key === 'Save') this.save();
    if (key === 'Cancel') this.location.back();
  }

  save(): void {
    if (this.editForm.invalid) {
      this.messageService.showError('Complete the required fields before saving.');
      return;
    }
    const value = this.editForm.value;
    const payload: ITenantFeature = {
      Id: 0,
      TenantId: Number(value.TenantId),
      FeatureId: Number(value.FeatureId),
      IsEnabled: !!value.IsEnabled,
      EffectiveFrom: this.toDate(value.EffectiveFrom),
      EffectiveTo: this.toDate(value.EffectiveTo)
    };
    this.spinner.show();
    this.tenantFeatureService.create(payload).subscribe({
      next: () => this.location.back(),
      error: error => { this.messageService.showError(error); this.spinner.hide(); },
      complete: () => this.spinner.hide()
    });
  }

  private loadLookups(): void {
    this.lookups.getTenants().subscribe({ next: options => this.tenantIdOptions = options, error: error => this.messageService.showError(error) });
    this.lookups.getFeatureDefinitions().subscribe({ next: options => this.featureIdOptions = options, error: error => this.messageService.showError(error) });
  }

  private toDate(value: Date | string | null): string | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
  }
}
