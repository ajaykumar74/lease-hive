import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { SpinnerComponent } from '@/shared/spinner.component';
import { IPermission } from '@/shared/IPermission';
import { ISelectItem } from '@/shared/ISelectItem';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';
import { TenantAssetCategoryService } from './tenant-asset-category.service';

interface TenantAssetCategory {
  Id: number;
  TenantId: number;
  CategoryCode: string;
  CategoryName: string;
  ParentCategoryId: number;
  ExtensionTypeCode: string;
  SupportsRegistration: boolean;
  SupportsMeasure: boolean;
  RecordStatus: string;
  IsSelected: boolean;
  IsSystemTemplate: boolean;
}

interface TenantAssetCategoryRow extends TenantAssetCategory {
  Depth: number;
}

@Component({
  selector: 'app-tenant-asset-category',
  standalone: false,
  templateUrl: './tenant-asset-category.component.html',
  providers: [MessageService]
})
export class TenantAssetCategoryComponent implements OnInit, OnDestroy {
  Caption = 'Tenant Asset Categories';
  permission = {} as IPermission;
  tenantOptions: ISelectItem[] = [];
  categories: TenantAssetCategoryRow[] = [];
  isLoading = false;
  editForm: any;

  private readonly destroy$ = new Subject<void>();
  private readonly openedTenantId: number;
  private categoryLoadVersion = 0;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly lookups: PlatformAdminLookupService,
    private readonly service: TenantAssetCategoryService
  ) {
    this.openedTenantId = Number(this.route.snapshot.params['tenantId']) || 0;
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      TenantId: new FormControl(this.openedTenantId ? String(this.openedTenantId) : null, Validators.required),
      CategorySelections: this.fb.array([])
    });

    this.editForm.get('TenantId')?.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((tenantId: number | string | null) => this.loadCategories(Number(tenantId)));

    this.lookups.getTenants(this.openedTenantId || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: options => {
          this.tenantOptions = options;
          if (this.openedTenantId > 0) {
            this.editForm.patchValue({ TenantId: String(this.openedTenantId) }, { emitEvent: true });
          }
        },
        error: error => this.messageService?.showError(error)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onOptionItemClicked(key: string): void {
    if (key === 'Save') this.save();
    if (key === 'Cancel') this.router.navigate(['/dashboard/tenants/list']);
  }

  onCategorySelectionChanged(category: TenantAssetCategoryRow, isSelected: boolean): void {
    category.IsSelected = isSelected;
    this.getDescendants(category.Id).forEach(child => this.setSelection(child, isSelected));
  }

  save(): void {
    const tenantId = Number(this.editForm.get('TenantId')?.value);
    if (!Number.isInteger(tenantId) || tenantId <= 0) {
      this.messageService.showError('Select a tenant before saving asset categories.');
      return;
    }

    const selectedCategoryCodes = this.categories
      .filter(category => category.IsSelected)
      .map(category => category.CategoryCode);

    this.spinner?.show('Save');
    this.service.saveSelections(tenantId, selectedCategoryCodes).subscribe({
      next: response => {
        this.messageService.showSuccess(response?.Message || 'Tenant asset categories saved successfully.');
        this.loadCategories(tenantId);
      },
      error: error => {
        this.messageService.showError(error);
        this.spinner?.hide();
      }
    });
  }

  private loadCategories(tenantId: number): void {
    if (!Number.isInteger(tenantId) || tenantId <= 0) {
      this.categoryLoadVersion++;
      this.categories = [];
      this.resetSelectionControls();
      return;
    }

    const loadVersion = ++this.categoryLoadVersion;
    this.isLoading = true;
    this.spinner?.show('Fetch');
    this.service.getCategories(tenantId).subscribe({
      next: response => {
        if (loadVersion !== this.categoryLoadVersion) return;
        this.permission = response?.permission || this.permission;
        this.categories = this.flattenHierarchy(response?.data || []);
        this.resetSelectionControls();
      },
      error: error => {
        if (loadVersion !== this.categoryLoadVersion) return;
        this.categories = [];
        this.resetSelectionControls();
        this.messageService?.showError(error);
      },
      complete: () => {
        if (loadVersion !== this.categoryLoadVersion) return;
        this.isLoading = false;
        this.spinner?.hide();
      }
    });
  }

  private getDescendants(categoryId: number): TenantAssetCategoryRow[] {
    const descendants: TenantAssetCategoryRow[] = [];
    const byParent = new Map<number, TenantAssetCategoryRow[]>();
    this.categories.forEach(category => {
      const siblings = byParent.get(category.ParentCategoryId) || [];
      siblings.push(category);
      byParent.set(category.ParentCategoryId, siblings);
    });

    const collect = (parentId: number): void => {
      (byParent.get(parentId) || []).forEach(child => {
        descendants.push(child);
        collect(child.Id);
      });
    };
    collect(categoryId);
    return descendants;
  }

  private get selectionControls(): FormArray {
    return this.editForm.get('CategorySelections') as FormArray;
  }

  private resetSelectionControls(): void {
    this.selectionControls.clear({ emitEvent: false });
    this.categories.forEach(category => this.selectionControls.push(new FormControl(category.IsSelected), { emitEvent: false }));
  }

  private setSelection(category: TenantAssetCategoryRow, isSelected: boolean): void {
    category.IsSelected = isSelected;
    const index = this.categories.indexOf(category);
    this.selectionControls.at(index)?.setValue(isSelected, { emitEvent: false });
  }

  private flattenHierarchy(categories: TenantAssetCategory[]): TenantAssetCategoryRow[] {
    const source = categories || [];
    const byId = new Map<number, TenantAssetCategory>();
    const byParent = new Map<number, TenantAssetCategory[]>();
    source.forEach(category => {
      byId.set(category.Id, category);
      const children = byParent.get(category.ParentCategoryId) || [];
      children.push(category);
      byParent.set(category.ParentCategoryId, children);
    });

    const sort = (items: TenantAssetCategory[]): TenantAssetCategory[] => [...items]
      .sort((left, right) => (left.CategoryName || left.CategoryCode || '').localeCompare(
        right.CategoryName || right.CategoryCode || '', 'en', { numeric: true, sensitivity: 'base' }));

    const flattened: TenantAssetCategoryRow[] = [];
    const visited = new Set<number>();
    const append = (category: TenantAssetCategory, depth: number): void => {
      if (visited.has(category.Id)) return;
      visited.add(category.Id);
      flattened.push({ ...category, Depth: depth });
      sort(byParent.get(category.Id) || []).forEach(child => append(child, depth + 1));
    };

    sort(source.filter(category => category.ParentCategoryId <= 0 || !byId.has(category.ParentCategoryId)))
      .forEach(category => append(category, 0));
    sort(source.filter(category => !visited.has(category.Id))).forEach(category => append(category, 0));
    return flattened;
  }
}
