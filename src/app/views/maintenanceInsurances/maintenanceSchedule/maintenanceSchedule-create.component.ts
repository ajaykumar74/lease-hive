import { Component, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IMaintenanceSchedule } from './maintenanceSchedule';
import { MaintenanceScheduleService } from './maintenanceSchedule.service';
import { AssetMaintenancePlanService } from '../assetMaintenancePlan/assetMaintenancePlan.service';

@Component({
  selector: 'app-maintenanceSchedule-create',
  standalone: false,
  templateUrl: './maintenanceSchedule-create.component.html' ,
   providers: [ MessageService]
})
export class MaintenanceScheduleCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);
  private assetMaintenancePlanRequest = 0;

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetId?: number;
  assetMaintenancePlanId?: number;
  assetDisplayName = '';
  maintenancePlanDisplayName = '';
  maintenanceSchedule: IMaintenanceSchedule = null;
  assetmaintenanceplanidOptions: ISelectItem[] = [];
duestatuscodeOptions: ISelectItem[] = [];
plannedorganisationunitidOptions: ISelectItem[] = [];
preferredserviceproviderpartyidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IMaintenanceSchedule = {} as IMaintenanceSchedule;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router,
	private activatedRoute: ActivatedRoute,
	private maintenanceScheduleService: MaintenanceScheduleService,
	private loggedInUserService : LoggedInUserService,
  private assetMaintenancePlanService: AssetMaintenancePlanService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceSchedule };
   const routeAssetId = Number(this.activatedRoute.snapshot.paramMap.get('assetId'));
   this.assetId = Number.isInteger(routeAssetId) && routeAssetId > 0 ? routeAssetId : undefined;
   const routeAssetMaintenancePlanId = Number(this.activatedRoute.snapshot.paramMap.get('assetMaintenancePlanId'));
   this.assetMaintenancePlanId = Number.isInteger(routeAssetMaintenancePlanId) && routeAssetMaintenancePlanId > 0
     ? routeAssetMaintenancePlanId
     : undefined;

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetMaintenancePlanId: new FormControl(this.assetMaintenancePlanId ?? 0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(this.assetId ?? 0, []),
MaintenancePlanId: new FormControl(0, []),
ScheduleNo: new FormControl('', [Validators.maxLength(30), ]),
DueDate: new FormControl(new Date(), []),
DueMeasureValue: new FormControl(0, []),
CurrentMeasureValue: new FormControl(0, []),
DueStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PlannedOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PreferredServiceProviderPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
GeneratedFromCode: new FormControl('MANUAL', [Validators.maxLength(20), ]),

    });
    this.Caption = 'Create Maintenance Schedule';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetMaintenancePlanId', 'asset-maintenance-plans',
      options => this.assetmaintenanceplanidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, { AssetId: 'AssetId' }, 'id', true);
this.duestatuscodeOptions = this.loggedInUserService.getPicklistOptions('DueStatusCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'PlannedOrganisationUnitId', 'organisation-units',
      options => this.plannedorganisationunitidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PreferredServiceProviderPartyId', 'parties',
      options => this.preferredserviceproviderpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.editForm.get('AssetMaintenancePlanId')?.valueChanges
      .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe((id: number) => this.onAssetMaintenancePlanChanged(id));

    if (this.assetMaintenancePlanId) {
      this.onAssetMaintenancePlanChanged(this.assetMaintenancePlanId);
    }

  }

  onAssetMaintenancePlanChanged(id: number): void {
    const planId = Number(id);
    const requestId = ++this.assetMaintenancePlanRequest;
    this.assetDisplayName = '';
    this.maintenancePlanDisplayName = '';
    this.editForm.patchValue({ AssetId: 0, MaintenancePlanId: 0 }, { emitEvent: false });

    if (!Number.isInteger(planId) || planId <= 0) {
      return;
    }

    this.assetMaintenancePlanService.getById(planId)
      .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe({
        next: response => {
          if (requestId !== this.assetMaintenancePlanRequest) {
            return;
          }
          const selectedPlan = response?.data ?? response;
          const assetId = Number(selectedPlan?.AssetId) || 0;
          const maintenancePlanId = Number(selectedPlan?.MaintenancePlanId) || 0;
          this.editForm.patchValue({ AssetId: assetId, MaintenancePlanId: maintenancePlanId }, { emitEvent: false });
          this.loadPlanDetails(assetId, maintenancePlanId, requestId);
        },
        error: err => this.messageService?.showError(err)
      });
  }

  private loadPlanDetails(assetId: number, maintenancePlanId: number, requestId: number): void {
    forkJoin({
      assets: this.loggedInUserService.getEntityLookupOptions('assets', assetId),
      maintenancePlans: this.loggedInUserService.getEntityLookupOptions('maintenance-plans', maintenancePlanId)
    }).pipe(takeUntilDestroyed(this.entityLookupDestroyRef)).subscribe({
      next: lookups => {
        if (requestId !== this.assetMaintenancePlanRequest) {
          return;
        }
        this.assetDisplayName = this.lookupText(lookups.assets, assetId);
        this.maintenancePlanDisplayName = this.lookupText(lookups.maintenancePlans, maintenancePlanId);
      },
      error: err => this.messageService?.showError(err)
    });
  }

  private lookupText(options: ISelectItem[], id: number): string {
    return options.find(option => Number(option.Value) === id)?.Text ?? '';
  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.maintenanceScheduleService.getById(this.selectedId).subscribe({
      next: data => {
        this.maintenanceSchedule = data;
        this.objMaster = { ...this.maintenanceSchedule };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IMaintenanceSchedule): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetMaintenancePlanId: obj.AssetMaintenancePlanId || 0,
AssetId: obj.AssetId || 0,
MaintenancePlanId: obj.MaintenancePlanId || 0,
ScheduleNo: obj.ScheduleNo || '',
DueDate:  obj.DueDate || new Date(),
DueMeasureValue: obj.DueMeasureValue || 0,
CurrentMeasureValue: obj.CurrentMeasureValue || 0,
DueStatusCode: obj.DueStatusCode || '',
PlannedOrganisationUnitId: obj.PlannedOrganisationUnitId || 0,
PreferredServiceProviderPartyId: obj.PreferredServiceProviderPartyId || 0,
GeneratedFromCode: obj.GeneratedFromCode || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceSchedules/create']);
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
    this.maintenanceSchedule = { ...this.objMaster };
    var obj  = this.maintenanceSchedule;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetMaintenancePlanId: obj.AssetMaintenancePlanId || 0,
AssetId: obj.AssetId || 0,
MaintenancePlanId: obj.MaintenancePlanId || 0,
ScheduleNo: obj.ScheduleNo || '',
DueDate:  obj.DueDate || new Date(),
DueMeasureValue: obj.DueMeasureValue || 0,
CurrentMeasureValue: obj.CurrentMeasureValue || 0,
DueStatusCode: obj.DueStatusCode || '',
PlannedOrganisationUnitId: obj.PlannedOrganisationUnitId || 0,
PreferredServiceProviderPartyId: obj.PreferredServiceProviderPartyId || 0,
GeneratedFromCode: obj.GeneratedFromCode || '',
 
      }
    );
    this.editForm.reset(); 
  } 

  Save(): void {    
   
        const formValues = this.editForm.value;
        if (!formValues.DueDate && Number(formValues.DueMeasureValue) <= 0) {
            this.messageService.showError('Enter a due date or a positive due measure value.');
            return;
        }
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }	
  
  
	var createdObj = { 
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetMaintenancePlanId: formValues.AssetMaintenancePlanId || 0,
AssetId: 0,
MaintenancePlanId: 0,
ScheduleNo: null,
DueDate: formValues.DueDate || null,
DueMeasureValue: formValues.DueMeasureValue || 0,
CurrentMeasureValue: formValues.CurrentMeasureValue || 0,
DueStatusCode: formValues.DueStatusCode || null,
PlannedOrganisationUnitId: formValues.PlannedOrganisationUnitId || 0,
PreferredServiceProviderPartyId: formValues.PreferredServiceProviderPartyId || 0,
GeneratedFromCode: 'MANUAL',
RecordStatus: 'Active',

    } as IMaintenanceSchedule ; 
	
	  this.spinner.show(); 
    this.maintenanceScheduleService.create(createdObj).subscribe({
      next: data => {	   
         this.maintenanceScheduleService.CacheData.IsLoaded = false;
         const selectedAssetMaintenancePlanId = Number(formValues.AssetMaintenancePlanId) || this.assetMaintenancePlanId;
         this.router.navigate(selectedAssetMaintenancePlanId
          ? ['/maintenance-insurance/maintenance/schedules/plan', selectedAssetMaintenancePlanId]
          : this.assetId
            ? ['/maintenance-insurance/maintenance/schedules/asset', this.assetId]
            : ['/maintenance-insurance/maintenance/schedules']);
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

}



