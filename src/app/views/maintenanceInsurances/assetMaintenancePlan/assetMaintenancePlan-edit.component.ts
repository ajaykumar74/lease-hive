import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAssetMaintenancePlan } from './assetMaintenancePlan';
import { AssetMaintenancePlanService } from './assetMaintenancePlan.service';


@Component({
  selector: 'app-assetMaintenancePlan-edit',
  standalone: false,
  templateUrl: './assetMaintenancePlan-edit.component.html',
  providers: [ MessageService]
})
export class AssetMaintenancePlanEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  assetMaintenancePlan: IAssetMaintenancePlan = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  scheduleMenuItems: MenuItem[] = [
    { label: 'Generate Maintenance Schedule', icon: 'pi pi-plus', command: () => this.openScheduleCreate() },
    { label: 'View Schedules', icon: 'pi pi-list', command: () => this.openScheduleList() }
  ];
  assetidOptions: ISelectItem[] = [];
  maintenanceplanidOptions: ISelectItem[] = [];
  recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetMaintenancePlan = {} as IAssetMaintenancePlan;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetMaintenancePlanService: AssetMaintenancePlanService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetMaintenancePlan };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetCategoryId: new FormControl(0),
MaintenancePlanId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StartDate: new FormControl(new Date(), [Validators.required]),
EndDate: new FormControl(new Date(), []),
BaselineDate: new FormControl(new Date(), []),
BaselineMeasureValue: new FormControl(0, []),
OverrideIntervalDays: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
OverrideMeasureValue: new FormControl(0, []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.setAssetOptions(options), error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenancePlanId', 'maintenance-plans',
      options => this.maintenanceplanidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, { AssetCategoryId: 'AssetCategoryId' }, 'id', false, true);
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetMaintenancePlanService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetMaintenancePlan = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetMaintenancePlan };
        this.populateUI(this.assetMaintenancePlan);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetMaintenancePlan): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenancePlanId: obj.MaintenancePlanId || 0,
StartDate:  obj.StartDate || null,
EndDate:  obj.EndDate || null,
BaselineDate:  obj.BaselineDate || null,
BaselineMeasureValue: obj.BaselineMeasureValue || 0,
OverrideIntervalDays: obj.OverrideIntervalDays || 0,
OverrideMeasureValue: obj.OverrideMeasureValue || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = 'Maintenance Plan';
  } 

  onAssetChanged(): void {
    this.syncAssetCategory();
  }

  private setAssetOptions(options: ISelectItem[]): void {
    this.assetidOptions = options;
    this.syncAssetCategory();
  }

  private syncAssetCategory(): void {
    const assetId = Number(this.editForm?.get('AssetId')?.value) || 0;
    const selectedAsset = this.assetidOptions.find(option => Number(option.Id) === assetId);
    const assetCategoryId = Number(selectedAsset?.ParentId) || 0;
    const categoryControl = this.editForm?.get('AssetCategoryId');

    if (categoryControl && categoryControl.value !== assetCategoryId) {
      categoryControl.setValue(assetCategoryId);
    }
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/maintenance/asset-plans/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }

  private openScheduleCreate(): void {
    const assetMaintenancePlanId = Number(this.assetMaintenancePlan?.Id ?? this.selectedId);
    if (assetMaintenancePlanId > 0) {
      this.router.navigate(['/maintenance-insurance/maintenance/schedules/plan', assetMaintenancePlanId, 'create']);
    }
  }

  private openScheduleList(): void {
    const assetMaintenancePlanId = Number(this.assetMaintenancePlan?.Id ?? this.selectedId);
    if (assetMaintenancePlanId > 0) {
      this.router.navigate(['/maintenance-insurance/maintenance/schedules/plan', assetMaintenancePlanId]);
    }
  }



  onCancel(): void {
    this.assetMaintenancePlan = { ...this.objMaster };
	var obj  = this.assetMaintenancePlan;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenancePlanId: obj.MaintenancePlanId || 0,
StartDate:  obj.StartDate || null,
EndDate:  obj.EndDate || null,
BaselineDate:  obj.BaselineDate || null,
BaselineMeasureValue: obj.BaselineMeasureValue || 0,
OverrideIntervalDays: obj.OverrideIntervalDays || 0,
OverrideMeasureValue: obj.OverrideMeasureValue || 0,
RecordStatus: obj.RecordStatus || '',
 
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
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId:  formValues.AssetId || 0,
MaintenancePlanId:  formValues.MaintenancePlanId || 0,
StartDate:  formValues.StartDate || null,
EndDate:  formValues.EndDate || null,
BaselineDate:  formValues.BaselineDate || null,
BaselineMeasureValue:  formValues.BaselineMeasureValue || 0,
OverrideIntervalDays:  formValues.OverrideIntervalDays || 0,
OverrideMeasureValue:  formValues.OverrideMeasureValue || 0,
StatusCode: 'Active',
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetMaintenancePlan ;
	
	this.spinner.show();  	   
    this.assetMaintenancePlanService.update(this.assetMaintenancePlan.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetMaintenancePlan +  'Details Updated sucessfully.');
		//this.editForm.reset();
		this._location.back();
      },
      error: err => { 
       this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide();}
    });
  }
}
