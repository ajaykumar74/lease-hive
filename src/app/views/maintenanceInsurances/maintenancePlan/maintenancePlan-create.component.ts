import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IMaintenancePlan } from './maintenancePlan';
import { MaintenancePlanService } from './maintenancePlan.service';

@Component({
  selector: 'app-maintenancePlan-create',
  standalone: false,
  templateUrl: './maintenancePlan-create.component.html' ,
   providers: [ MessageService]
})
export class MaintenancePlanCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenancePlan: IMaintenancePlan = null;
  maintenancetypeidOptions: ISelectItem[] = [];
assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
assetmodelidOptions: ISelectItem[] = [];
triggertypecodeOptions: ISelectItem[] = [];
measuredefinitionidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IMaintenancePlan = {} as IMaintenancePlan;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private maintenancePlanService: MaintenancePlanService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.maintenancePlan };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
MaintenancePlanCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
MaintenancePlanName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
MaintenanceTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetModelId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
TriggerTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IntervalDays: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MeasureDefinitionId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
IntervalMeasureValue: new FormControl(0, []),
LeadDays: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
LeadMeasureValue: new FormControl(0, []),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create MaintenancePlan';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenanceTypeId', 'maintenance-types',
      options => this.maintenancetypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories',
      options => this.assetcategoryidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetTypeId', 'asset-types',
      options => this.assettypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetModelId', 'asset-models',
      options => this.assetmodelidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.triggertypecodeOptions = this.loggedInUserService.getPicklistOptions('TriggerTypeCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'MeasureDefinitionId', 'asset-measure-definitions',
      options => this.measuredefinitionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetCategoryId":"AssetCategoryId"});
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.maintenancePlanService.getById(this.selectedId).subscribe({
      next: data => {
        this.maintenancePlan = data;
        this.objMaster = { ...this.maintenancePlan };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IMaintenancePlan): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenancePlanCode: obj.MaintenancePlanCode || '',
MaintenancePlanName: obj.MaintenancePlanName || '',
MaintenanceTypeId: obj.MaintenanceTypeId || 0,
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
AssetModelId: obj.AssetModelId || 0,
TriggerTypeCode: obj.TriggerTypeCode || '',
IntervalDays: obj.IntervalDays || 0,
MeasureDefinitionId: obj.MeasureDefinitionId || 0,
IntervalMeasureValue: obj.IntervalMeasureValue || 0,
LeadDays: obj.LeadDays || 0,
LeadMeasureValue: obj.LeadMeasureValue || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenancePlans/create']);
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
    this.maintenancePlan = { ...this.objMaster };
    var obj  = this.maintenancePlan;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenancePlanCode: obj.MaintenancePlanCode || '',
MaintenancePlanName: obj.MaintenancePlanName || '',
MaintenanceTypeId: obj.MaintenanceTypeId || 0,
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
AssetModelId: obj.AssetModelId || 0,
TriggerTypeCode: obj.TriggerTypeCode || '',
IntervalDays: obj.IntervalDays || 0,
MeasureDefinitionId: obj.MeasureDefinitionId || 0,
IntervalMeasureValue: obj.IntervalMeasureValue || 0,
LeadDays: obj.LeadDays || 0,
LeadMeasureValue: obj.LeadMeasureValue || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     MaintenancePlanCode: formValues.MaintenancePlanCode || null,
MaintenancePlanName: formValues.MaintenancePlanName || null,
MaintenanceTypeId: formValues.MaintenanceTypeId || 0,
AssetCategoryId: formValues.AssetCategoryId || 0,
AssetTypeId: formValues.AssetTypeId || 0,
AssetModelId: formValues.AssetModelId || 0,
TriggerTypeCode: formValues.TriggerTypeCode || null,
IntervalDays: formValues.IntervalDays || 0,
MeasureDefinitionId: formValues.MeasureDefinitionId || 0,
IntervalMeasureValue: formValues.IntervalMeasureValue || 0,
LeadDays: formValues.LeadDays || null,
LeadMeasureValue: formValues.LeadMeasureValue || 0,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IMaintenancePlan ; 
	
	  this.spinner.show(); 
    this.maintenancePlanService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(MaintenancePlan +  'Details Updated sucessfully.');
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



