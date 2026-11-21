import { Component, DestroyRef, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { DeliveryChecklistService } from './delivery-checklist.service';
import { DEFAULT_DELIVERY_CHECKLISTS, IDeliveryChecklistTemplate } from './delivery-checklist.models';

@Component({ templateUrl: './delivery-checklist-template.component.html', standalone: false })
export class DeliveryChecklistTemplateComponent {
  private readonly destroyRef = inject(DestroyRef);
  categoryOptions: ISelectItem[] = [];
  loading = false;
  saving = false;
  error = '';
  templateId?: number;
  form!: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly users: LoggedInUserService, private readonly checklists: DeliveryChecklistService) {
    this.form = this.fb.group({ AssetCategoryId: [null as number | null, [Validators.required, Validators.min(1)]], ParentAssetCategoryId: [null as number | null], Name: ['', Validators.required], Version: [1, [Validators.required, Validators.min(1)]], Active: [true], Items: this.fb.array([]) });
    this.users.bindEntityLookup(this.form, 'AssetCategoryId', 'asset-categories', options => this.categoryOptions = options, error => this.error = String(error), this.destroyRef);
    this.form.get('AssetCategoryId')?.valueChanges.subscribe(id => this.load(Number(id)));
  }

  get items(): FormArray { return this.form.get('Items') as FormArray; }
  addItem(item?: any): void { this.items.push(this.fb.group({ Name: [item?.Name || '', Validators.required], Description: [item?.Description || ''], Mandatory: [item?.Mandatory ?? true], EvidenceRequired: [item?.EvidenceRequired ?? false], SortOrder: [item?.SortOrder || (this.items.length + 1) * 10, Validators.required], Active: [item?.Active ?? true], AllowsNotApplicable: [item?.AllowsNotApplicable ?? false], NonWaivable: [item?.NonWaivable ?? false] })); }
  removeItem(index: number): void { this.items.removeAt(index); }

  useSystemDefaults(): void {
    const option = this.categoryOptions.find(item => String(item.Value) === String(this.form.get('AssetCategoryId')?.value));
    const category = String(option?.Text || '').toUpperCase();
    const key = category.includes('VEHICLE') ? 'VEHICLE' : category.includes('IT') ? 'IT' : category.includes('PLANT') || category.includes('EQUIPMENT') ? 'PLANT' : '';
    if (!key) { this.error = 'System defaults are available for Vehicles, IT Equipment, and Plant & Equipment. Select one of those categories first.'; return; }
    this.items.clear();
    DEFAULT_DELIVERY_CHECKLISTS[key].forEach(item => this.addItem(item));
    this.form.patchValue({ Name: `${option?.Text} delivery checklist`, Version: 1, Active: true });
    this.error = '';
  }

  load(categoryId: number): void {
    if (!categoryId) return;
    this.loading = true; this.error = '';
    this.checklists.getTemplate(categoryId).subscribe({
      next: response => this.apply(response.data),
      error: () => { this.templateId = undefined; this.items.clear(); this.form.patchValue({ Name: '', Version: 1, Active: true }); },
      complete: () => this.loading = false
    });
  }

  save(): void {
    if (this.form.invalid || !this.items.length) { this.form.markAllAsTouched(); this.error = 'Add at least one active checklist item and complete the required fields.'; return; }
    const value = this.form.getRawValue();
    const template = { ...value, Id: this.templateId, TenantId: this.users.loggedInUser.Tenant.Id, Items: value.Items } as IDeliveryChecklistTemplate;
    this.saving = true; this.error = '';
    this.checklists.saveTemplate(template).subscribe({ next: response => this.apply(response.data), error: error => { this.error = String(error); this.saving = false; }, complete: () => this.saving = false });
  }

  private apply(template: IDeliveryChecklistTemplate): void { this.templateId = template.Id; this.items.clear(); this.form.patchValue({ AssetCategoryId: template.AssetCategoryId, ParentAssetCategoryId: template.ParentAssetCategoryId || null, Name: template.Name, Version: template.Version, Active: template.Active }); template.Items.sort((a, b) => a.SortOrder - b.SortOrder).forEach(item => this.addItem(item)); }
}
