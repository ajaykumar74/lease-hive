import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-maintenancePlan-edit',
  standalone: false,
  templateUrl: './maintenancePlan-edit.component.html',
  providers: [ MessageService]
})
export class MaintenancePlanEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  maintenancePlan: IMaintenancePlan = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenancetypeidOptions: ISelectItem[] = [];
assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
assetmodelidOptions: ISelectItem[] = [];
triggertypecodeOptions: ISelectItem[] = [];
measuredefinitionidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IMaintenancePlan = {} as IMaintenancePlan;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private maintenancePlanService: MaintenancePlanService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenancePlan };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.maintenancetypeidOptions.push({Text: 'MaintenanceTypeId1', Value: 'MaintenanceTypeId1' });
this.maintenancetypeidOptions.push({Text: 'MaintenanceTypeId2', Value: 'MaintenanceTypeId2' });
this.assetcategoryidOptions.push({Text: 'AssetCategoryId1', Value: 'AssetCategoryId1' });
this.assetcategoryidOptions.push({Text: 'AssetCategoryId2', Value: 'AssetCategoryId2' });
this.assettypeidOptions.push({Text: 'AssetTypeId1', Value: 'AssetTypeId1' });
this.assettypeidOptions.push({Text: 'AssetTypeId2', Value: 'AssetTypeId2' });
this.assetmodelidOptions.push({Text: 'AssetModelId1', Value: 'AssetModelId1' });
this.assetmodelidOptions.push({Text: 'AssetModelId2', Value: 'AssetModelId2' });
this.triggertypecodeOptions = this.loggedInUserService.getPicklistOptions('TriggerTypeCode');
this.measuredefinitionidOptions.push({Text: 'MeasureDefinitionId1', Value: 'MeasureDefinitionId1' });
this.measuredefinitionidOptions.push({Text: 'MeasureDefinitionId2', Value: 'MeasureDefinitionId2' });
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
    this.maintenancePlanService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenancePlan = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenancePlan };
        this.populateUI(this.maintenancePlan);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "MaintenancePlan Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/maintenance/plans/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     MaintenancePlanCode:  formValues.MaintenancePlanCode || null,
MaintenancePlanName:  formValues.MaintenancePlanName || null,
MaintenanceTypeId:  formValues.MaintenanceTypeId || null,
AssetCategoryId:  formValues.AssetCategoryId || null,
AssetTypeId:  formValues.AssetTypeId || null,
AssetModelId:  formValues.AssetModelId || null,
TriggerTypeCode:  formValues.TriggerTypeCode || null,
IntervalDays:  formValues.IntervalDays || null,
MeasureDefinitionId:  formValues.MeasureDefinitionId || null,
IntervalMeasureValue:  formValues.IntervalMeasureValue || null,
LeadDays:  formValues.LeadDays || null,
LeadMeasureValue:  formValues.LeadMeasureValue || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenancePlan ;
	
	this.spinner.show();  	   
    this.maintenancePlanService.update(this.maintenancePlan.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenancePlan +  'Details Updated sucessfully.');
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
