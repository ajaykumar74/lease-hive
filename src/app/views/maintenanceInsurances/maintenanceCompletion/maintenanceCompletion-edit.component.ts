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
import { IMaintenanceCompletion } from './maintenanceCompletion';
import { MaintenanceCompletionService } from './maintenanceCompletion.service';


@Component({
  selector: 'app-maintenanceCompletion-edit',
  standalone: false,
  templateUrl: './maintenanceCompletion-edit.component.html',
  providers: [ MessageService]
})
export class MaintenanceCompletionEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  maintenanceCompletion: IMaintenanceCompletion = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceworkorderidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
conditiongradeidOptions: ISelectItem[] = [];
verifiedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IMaintenanceCompletion = {} as IMaintenanceCompletion;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private maintenanceCompletionService: MaintenanceCompletionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceCompletion };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId1', Value: 'MaintenanceWorkOrderId1' });
this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId2', Value: 'MaintenanceWorkOrderId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.conditiongradeidOptions.push({Text: 'ConditionGradeId1', Value: 'ConditionGradeId1' });
this.conditiongradeidOptions.push({Text: 'ConditionGradeId2', Value: 'ConditionGradeId2' });
this.verifiedbyuseridOptions.push({Text: 'VerifiedByUserId1', Value: 'VerifiedByUserId1' });
this.verifiedbyuseridOptions.push({Text: 'VerifiedByUserId2', Value: 'VerifiedByUserId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.maintenanceCompletionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenanceCompletion = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenanceCompletion };
        this.populateUI(this.maintenanceCompletion);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "MaintenanceCompletion Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceCompletion/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     MaintenanceWorkOrderId:  formValues.MaintenanceWorkOrderId || null,
AssetId:  formValues.AssetId || null,
CompletedAt:  formValues.CompletedAt || null,
CompletionMeasureValue:  formValues.CompletionMeasureValue || null,
ConditionGradeId:  formValues.ConditionGradeId || null,
CompletionSummary:  formValues.CompletionSummary || null,
NextDueDate:  formValues.NextDueDate || null,
NextDueMeasureValue:  formValues.NextDueMeasureValue || null,
VerifiedByUserId:  formValues.VerifiedByUserId || null,
VerifiedAt:  formValues.VerifiedAt || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenanceCompletion ;
	
	this.spinner.show();  	   
    this.maintenanceCompletionService.update(this.maintenanceCompletion.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenanceCompletion +  'Details Updated sucessfully.');
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
