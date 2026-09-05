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
import { IMaintenanceCompletion } from './maintenanceCompletion';
import { MaintenanceCompletionService } from './maintenanceCompletion.service';

@Component({
  selector: 'app-maintenanceCompletion-create',
  standalone: false,
  templateUrl: './maintenanceCompletion-create.component.html' ,
   providers: [ MessageService]
})
export class MaintenanceCompletionCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceCompletion: IMaintenanceCompletion = null;
  maintenanceworkorderidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
conditiongradeidOptions: ISelectItem[] = [];
verifiedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IMaintenanceCompletion = {} as IMaintenanceCompletion;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private maintenanceCompletionService: MaintenanceCompletionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceCompletion };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
MaintenanceWorkOrderId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CompletedAt: new FormControl(new Date(), [Validators.required]),
CompletionMeasureValue: new FormControl(0, []),
ConditionGradeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CompletionSummary: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
NextDueDate: new FormControl(new Date(), []),
NextDueMeasureValue: new FormControl(0, []),
VerifiedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
VerifiedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create MaintenanceCompletion';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenanceWorkOrderId', 'maintenance-work-orders',
      options => this.maintenanceworkorderidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ConditionGradeId', 'asset-condition-grades',
      options => this.conditiongradeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'VerifiedByUserId', 'application-users',
      options => this.verifiedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.maintenanceCompletionService.getById(this.selectedId).subscribe({
      next: data => {
        this.maintenanceCompletion = data;
        this.objMaster = { ...this.maintenanceCompletion };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IMaintenanceCompletion): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
AssetId: obj.AssetId || 0,
CompletedAt:  obj.CompletedAt || new Date(),
CompletionMeasureValue: obj.CompletionMeasureValue || 0,
ConditionGradeId: obj.ConditionGradeId || 0,
CompletionSummary: obj.CompletionSummary || '',
NextDueDate:  obj.NextDueDate || new Date(),
NextDueMeasureValue: obj.NextDueMeasureValue || 0,
VerifiedByUserId: obj.VerifiedByUserId || 0,
VerifiedAt:  obj.VerifiedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceCompletions/create']);
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
    this.maintenanceCompletion = { ...this.objMaster };
    var obj  = this.maintenanceCompletion;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
AssetId: obj.AssetId || 0,
CompletedAt:  obj.CompletedAt || new Date(),
CompletionMeasureValue: obj.CompletionMeasureValue || 0,
ConditionGradeId: obj.ConditionGradeId || 0,
CompletionSummary: obj.CompletionSummary || '',
NextDueDate:  obj.NextDueDate || new Date(),
NextDueMeasureValue: obj.NextDueMeasureValue || 0,
VerifiedByUserId: obj.VerifiedByUserId || 0,
VerifiedAt:  obj.VerifiedAt || new Date(),
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     MaintenanceWorkOrderId: formValues.MaintenanceWorkOrderId || 0,
AssetId: formValues.AssetId || 0,
CompletedAt: formValues.CompletedAt || null,
CompletionMeasureValue: formValues.CompletionMeasureValue || 0,
ConditionGradeId: formValues.ConditionGradeId || 0,
CompletionSummary: formValues.CompletionSummary || null,
NextDueDate: formValues.NextDueDate || null,
NextDueMeasureValue: formValues.NextDueMeasureValue || 0,
VerifiedByUserId: formValues.VerifiedByUserId || 0,
VerifiedAt: formValues.VerifiedAt || null,
RecordStatus: formValues.RecordStatus || null,

    } as IMaintenanceCompletion ; 
	
	  this.spinner.show(); 
    this.maintenanceCompletionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(MaintenanceCompletion +  'Details Updated sucessfully.');
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



