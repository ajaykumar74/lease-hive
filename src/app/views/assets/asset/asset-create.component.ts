import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { distinctUntilChanged } from 'rxjs';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAsset } from './asset';
import { AssetService } from './asset.service';

@Component({
  selector: 'app-asset-create',
  standalone: false,
  templateUrl: './asset-create.component.html',
  providers: [MessageService]
})
export class AssetCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);


  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset';
  asset: IAsset = null;
  assetcategoryidOptions: ISelectItem[] = [];
  assettypeidOptions: ISelectItem[] = [];
  assetmakeidOptions: ISelectItem[] = [];
  assetmodelidOptions: ISelectItem[] = [];
  private allAssetTypeOptions: ISelectItem[] = [];
  private readonly assetMakesByType = new Map<number, ISelectItem[]>();
  private readonly assetModelsByTypeAndMake = new Map<string, ISelectItem[]>();
  private assetMakeRequest = 0;
  private assetModelRequest = 0;
  owningorganisationidOptions: ISelectItem[] = [];
  responsibleorganisationunitidOptions: ISelectItem[] = [];
  currentlocationidOptions: ISelectItem[] = [];
  currentpartyidOptions: ISelectItem[] = [];
  currentpartylocationidOptions: ISelectItem[] = [];
  acquisitioncurrencycodeOptions: ISelectItem[] = [];
  AssetStatusIdOptions: ISelectItem[] = [];
  conditiongradecodeOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: IAsset = {} as IAsset;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private assetService: AssetService,
    private loggedInUserService: LoggedInUserService

  ) {
  }





  ngOnInit(): void {
    this.objMaster = { ...this.asset };

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      AssetNo: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      AssetCategoryId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      AssetTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      AssetMakeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      AssetModelId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      OwningOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      ResponsibleOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      CurrentLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      CurrentPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      CurrentPartyLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      PrimarySerialNo: new FormControl('', [Validators.maxLength(20),]),
      AcquisitionDate: new FormControl(new Date(), [Validators.required]),
      InServiceDate: new FormControl(new Date(), []),
      AcquisitionCurrencyCode: new FormControl('', [Validators.maxLength(20),]),
      AssetStatusId: new FormControl(0, [Validators.required]),
      ConditionGradeCode: new FormControl('', [Validators.maxLength(20),]),
      IsLeaseable: new FormControl(false, [Validators.required]),
      EffectiveFrom: new FormControl(new Date(), [Validators.required]),
      EffectiveTo: new FormControl(new Date(), []),
      AcquisitionCost: new FormControl(0, []),
      ResidualValueAmount: new FormControl(0, []),

    });
    this.configureAssetHierarchy();
    this.loggedInUserService.bindEntityLookup(this.editForm, 'OwningOrganisationId', 'organisations',
      options => this.owningorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'ResponsibleOrganisationUnitId', 'organisation-units',
      options => this.responsibleorganisationunitidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'CurrentLocationId', 'locations',
      options => this.currentlocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'CurrentPartyId', 'parties',
      options => this.currentpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'CurrentPartyLocationId', 'party-locations',
      options => this.currentpartylocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, { PartyId: 'CurrentPartyId' });
    this.acquisitioncurrencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetStatusId', 'asset-statuses',
      options => this.AssetStatusIdOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
    this.conditiongradecodeOptions.push({ Text: 'Condition1', Value: 'Condition1' });

  }

  private configureAssetHierarchy(): void {
    this.loggedInUserService.getEntityLookupOptions('asset-categories')
      .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe({
        next: options => this.assetcategoryidOptions = this.mergeLookupOptions(this.assetcategoryidOptions, options),
        error: error => this.showLookupError(error)
      });

    this.loggedInUserService.getEntityLookupOptions('asset-types')
      .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe({
        next: options => {
          this.allAssetTypeOptions = this.mergeLookupOptions(this.allAssetTypeOptions, options);
          this.applyAssetTypeFilter(this.getLookupId(this.editForm.get('AssetCategoryId')?.value));
        },
        error: error => this.showLookupError(error)
      });

    this.editForm.get('AssetCategoryId')?.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe(value => this.onAssetCategoryChanged(this.getLookupId(value)));
    this.editForm.get('AssetTypeId')?.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe(value => this.onAssetTypeChanged(this.getLookupId(value)));
    this.editForm.get('AssetMakeId')?.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe(value => this.onAssetMakeChanged(this.getLookupId(value)));
  }

  private onAssetCategoryChanged(assetCategoryId: number): void {
    this.assetMakeRequest++;
    this.assetModelRequest++;
    this.applyAssetTypeFilter(assetCategoryId);
    this.assetmakeidOptions = [];
    this.assetmodelidOptions = [];
    this.editForm.patchValue({ AssetTypeId: 0, AssetMakeId: 0, AssetModelId: 0 }, { emitEvent: false });
  }

  private onAssetTypeChanged(assetTypeId: number): void {
    this.assetModelRequest++;
    this.assetmakeidOptions = [];
    this.assetmodelidOptions = [];
    this.editForm.patchValue({ AssetMakeId: 0, AssetModelId: 0 }, { emitEvent: false });
    this.loadAssetMakes(assetTypeId);
  }

  private onAssetMakeChanged(assetMakeId: number): void {
    this.assetmodelidOptions = [];
    this.editForm.patchValue({ AssetModelId: 0 }, { emitEvent: false });
    this.loadAssetModels(this.getLookupId(this.editForm.get('AssetTypeId')?.value), assetMakeId);
  }

  private applyAssetTypeFilter(assetCategoryId: number): void {
    this.assettypeidOptions = assetCategoryId > 0
      ? this.allAssetTypeOptions.filter(option => this.getLookupId(option.ParentId) === assetCategoryId)
      : [];
  }

  private loadAssetMakes(assetTypeId: number, selectedMakeId = 0, afterLoad?: () => void): void {
    const request = ++this.assetMakeRequest;
    if (assetTypeId <= 0) {
      this.assetmakeidOptions = [];
      afterLoad?.();
      return;
    }

    const cached = selectedMakeId <= 0 ? this.assetMakesByType.get(assetTypeId) : undefined;
    if (cached) {
      this.assetmakeidOptions = cached;
      afterLoad?.();
      return;
    }

    this.loggedInUserService.getEntityLookupOptions('asset-makes', selectedMakeId || undefined, { AssetTypeId: assetTypeId })
      .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe({
        next: options => {
          if (request !== this.assetMakeRequest) return;
          this.assetmakeidOptions = options;
          if (selectedMakeId <= 0) this.assetMakesByType.set(assetTypeId, options);
          afterLoad?.();
        },
        error: error => {
          if (request === this.assetMakeRequest) this.showLookupError(error);
        }
      });
  }

  private loadAssetModels(assetTypeId: number, assetMakeId: number, selectedModelId = 0): void {
    const request = ++this.assetModelRequest;
    if (assetTypeId <= 0 || assetMakeId <= 0) {
      this.assetmodelidOptions = [];
      return;
    }

    const key = `${assetTypeId}:${assetMakeId}`;
    const cached = selectedModelId <= 0 ? this.assetModelsByTypeAndMake.get(key) : undefined;
    if (cached) {
      this.assetmodelidOptions = cached;
      return;
    }

    this.loggedInUserService.getEntityLookupOptions('asset-models', selectedModelId || undefined,
      { AssetTypeId: assetTypeId, AssetMakeId: assetMakeId })
      .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe({
        next: options => {
          if (request !== this.assetModelRequest) return;
          this.assetmodelidOptions = options;
          if (selectedModelId <= 0) this.assetModelsByTypeAndMake.set(key, options);
        },
        error: error => {
          if (request === this.assetModelRequest) this.showLookupError(error);
        }
      });
  }

  private hydrateAssetHierarchy(obj: IAsset): void {
    const assetCategoryId = this.getLookupId(obj.AssetCategoryId);
    const assetTypeId = this.getLookupId(obj.AssetTypeId);
    const assetMakeId = this.getLookupId(obj.AssetMakeId);
    const assetModelId = this.getLookupId(obj.AssetModelId);

    this.assetModelRequest++;
    this.assetmodelidOptions = [];
    this.ensureSelectedAssetCategory(assetCategoryId);
    this.ensureSelectedAssetType(assetTypeId);
    this.applyAssetTypeFilter(assetCategoryId);
    this.loadAssetMakes(assetTypeId, assetMakeId, () =>
      this.loadAssetModels(assetTypeId, assetMakeId, assetModelId));
  }

  private getLookupId(value: any): number {
    const id = Number(value);
    return Number.isFinite(id) && id > 0 ? id : 0;
  }

  private ensureSelectedAssetCategory(assetCategoryId: number): void {
    if (assetCategoryId <= 0 || this.assetcategoryidOptions.some(option => option.Id === assetCategoryId)) return;

    this.loggedInUserService.getEntityLookupOptions('asset-categories', assetCategoryId)
      .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe({
        next: options => this.assetcategoryidOptions = this.mergeLookupOptions(this.assetcategoryidOptions, options),
        error: error => this.showLookupError(error)
      });
  }

  private ensureSelectedAssetType(assetTypeId: number): void {
    if (assetTypeId <= 0 || this.allAssetTypeOptions.some(option => option.Id === assetTypeId)) return;

    this.loggedInUserService.getEntityLookupOptions('asset-types', assetTypeId)
      .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe({
        next: options => {
          this.allAssetTypeOptions = this.mergeLookupOptions(this.allAssetTypeOptions, options);
          this.applyAssetTypeFilter(this.getLookupId(this.editForm.get('AssetCategoryId')?.value));
        },
        error: error => this.showLookupError(error)
      });
  }

  private mergeLookupOptions(current: ISelectItem[], incoming: ISelectItem[]): ISelectItem[] {
    return [...new Map([...current, ...incoming].map(option => [option.Id, option])).values()]
      .sort((left, right) => left.Text.localeCompare(right.Text));
  }

  private showLookupError(error: any): void {
    setTimeout(() => this.messageService?.showError(error));
  }

  loadUI(): void {
    this.isLoading = true;
    this.assetService.getById(this.selectedId).subscribe({
      next: data => {
        this.asset = data;
        this.objMaster = { ...this.asset };
        this.populateUI(data);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }


  populateUI(obj: IAsset): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        AssetNo: obj.AssetNo || '',
        AssetCategoryId: obj.AssetCategoryId || 0,
        AssetTypeId: obj.AssetTypeId || 0,
        AssetMakeId: obj.AssetMakeId || 0,
        AssetModelId: obj.AssetModelId || 0,
        OwningOrganisationId: obj.OwningOrganisationId || 0,
        ResponsibleOrganisationUnitId: obj.ResponsibleOrganisationUnitId || 0,
        CurrentLocationId: obj.CurrentLocationId || 0,
        CurrentPartyId: obj.CurrentPartyId || 0,
        CurrentPartyLocationId: obj.CurrentPartyLocationId || 0,
        PrimarySerialNo: obj.PrimarySerialNo || '',
        AcquisitionDate: obj.AcquisitionDate || new Date(),
        InServiceDate: obj.InServiceDate || new Date(),
        AcquisitionCurrencyCode: obj.AcquisitionCurrencyCode || '',
        AssetStatusId: obj.AssetStatusId || '',
        ConditionGradeCode: obj.ConditionGradeCode || '',
        IsLeaseable: obj.IsLeaseable || false,

      },
      { emitEvent: false }
    );
    this.hydrateAssetHierarchy(obj);
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assets/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
    else if (key == "Refresh") {
      this.loadUI();
    }
  }

  onCancel(): void {
    this.asset = { ...this.objMaster };
    var obj = this.asset;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        AssetNo: obj.AssetNo || '',
        AssetCategoryId: obj.AssetCategoryId || 0,
        AssetTypeId: obj.AssetTypeId || 0,
        AssetMakeId: obj.AssetMakeId || 0,
        AssetModelId: obj.AssetModelId || 0,
        OwningOrganisationId: obj.OwningOrganisationId || 0,
        ResponsibleOrganisationUnitId: obj.ResponsibleOrganisationUnitId || 0,
        CurrentLocationId: obj.CurrentLocationId || 0,
        CurrentPartyId: obj.CurrentPartyId || 0,
        CurrentPartyLocationId: obj.CurrentPartyLocationId || 0,
        PrimarySerialNo: obj.PrimarySerialNo || '',
        AcquisitionDate: obj.AcquisitionDate || new Date(),
        InServiceDate: obj.InServiceDate || new Date(),
        AcquisitionCurrencyCode: obj.AcquisitionCurrencyCode || '',
        AssetStatusId: obj.AssetStatusId || '',
        ConditionGradeCode: obj.ConditionGradeCode || '',
        IsLeaseable: obj.IsLeaseable || false,

      }
    );
    this.editForm.reset();
  }

  Save(): void {

    if (!this.editForm.valid) {
      this.messageService.showError('One or more validation failed. Please clear error to continue...');
      return;
    }


    const formValues = this.editForm.value;
    var createdObj = {
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      AssetNo: formValues.AssetNo || null,
      AssetCategoryId: formValues.AssetCategoryId || 0,
      AssetTypeId: formValues.AssetTypeId || 0,
      AssetMakeId: formValues.AssetMakeId || 0,
      AssetModelId: formValues.AssetModelId || 0,
      OwningOrganisationId: formValues.OwningOrganisationId || 0,
      ResponsibleOrganisationUnitId: formValues.ResponsibleOrganisationUnitId || 0,
      CurrentLocationId: formValues.CurrentLocationId || 0,
      CurrentPartyId: formValues.CurrentPartyId || 0,
      CurrentPartyLocationId: formValues.CurrentPartyLocationId || 0,
      PrimarySerialNo: formValues.PrimarySerialNo || null,
      AcquisitionDate: formValues.AcquisitionDate || null,
      InServiceDate: formValues.InServiceDate || null,
      AcquisitionCurrencyCode: formValues.AcquisitionCurrencyCode || null,
      AcquisitionCost: formValues.AcquisitionCost || 0,
      ResidualValueAmount: formValues.ResidualValueAmount || 0,
      AssetStatusId: formValues.AssetStatusId || 0,
      ConditionGradeCode: formValues.ConditionGradeCode || null,
      IsLeaseable: formValues.IsLeaseable || false,
      EffectiveFrom: new Date(),
      EffectiveTo: null,
      RecordStatus: 'Active',

    } as IAsset;

    this.spinner.show();
    this.assetService.create(createdObj).subscribe({
      next: data => {
        // this.messageService.showSuccess(Asset +  'Details Updated sucessfully.');
        this._location.back();
      },
      error: err => {
        this.messageService.showError(err);
        this.spinner.hide();
      },
      complete: () => { this.spinner.hide(); }
    });
  }

}
