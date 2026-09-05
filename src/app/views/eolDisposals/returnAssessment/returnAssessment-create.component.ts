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
import { IReturnAssessment } from './returnAssessment';
import { ReturnAssessmentService } from './returnAssessment.service';

@Component({
  selector: 'app-returnAssessment-create',
  standalone: false,
  templateUrl: './returnAssessment-create.component.html' ,
   providers: [ MessageService]
})
export class ReturnAssessmentCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  returnAssessment: IReturnAssessment = null;
  endofleasecaseidOptions: ISelectItem[] = [];
assetreturnidOptions: ISelectItem[] = [];
assessedbyuseridOptions: ISelectItem[] = [];
returninspectionidOptions: ISelectItem[] = [];
assessmentstatuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IReturnAssessment = {} as IReturnAssessment;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private returnAssessmentService: ReturnAssessmentService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.returnAssessment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
EndOfLeaseCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetReturnId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssessmentNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
AssessedAt: new FormControl(new Date(), [Validators.required]),
AssessedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ContractAllowanceValue: new FormControl(0, []),
ActualUsageValue: new FormControl(0, []),
ExcessUsageValue: new FormControl(0, []),
ReturnInspectionId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssessmentStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create ReturnAssessment';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'EndOfLeaseCaseId', 'end-of-lease-cases',
      options => this.endofleasecaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetReturnId', 'asset-returns',
      options => this.assetreturnidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"EndOfLeaseCaseId":"EndOfLeaseCaseId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssessedByUserId', 'application-users',
      options => this.assessedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReturnInspectionId', 'asset-inspections',
      options => this.returninspectionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.assessmentstatuscodeOptions = this.loggedInUserService.getPicklistOptions('AssessmentStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.returnAssessmentService.getById(this.selectedId).subscribe({
      next: data => {
        this.returnAssessment = data;
        this.objMaster = { ...this.returnAssessment };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IReturnAssessment): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetReturnId: obj.AssetReturnId || 0,
AssessmentNo: obj.AssessmentNo || '',
AssessedAt:  obj.AssessedAt || new Date(),
AssessedByUserId: obj.AssessedByUserId || 0,
ContractAllowanceValue: obj.ContractAllowanceValue || 0,
ActualUsageValue: obj.ActualUsageValue || 0,
ExcessUsageValue: obj.ExcessUsageValue || 0,
ReturnInspectionId: obj.ReturnInspectionId || 0,
AssessmentStatusCode: obj.AssessmentStatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/returnAssessments/create']);
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
    this.returnAssessment = { ...this.objMaster };
    var obj  = this.returnAssessment;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetReturnId: obj.AssetReturnId || 0,
AssessmentNo: obj.AssessmentNo || '',
AssessedAt:  obj.AssessedAt || new Date(),
AssessedByUserId: obj.AssessedByUserId || 0,
ContractAllowanceValue: obj.ContractAllowanceValue || 0,
ActualUsageValue: obj.ActualUsageValue || 0,
ExcessUsageValue: obj.ExcessUsageValue || 0,
ReturnInspectionId: obj.ReturnInspectionId || 0,
AssessmentStatusCode: obj.AssessmentStatusCode || '',
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
     EndOfLeaseCaseId: formValues.EndOfLeaseCaseId || 0,
AssetReturnId: formValues.AssetReturnId || 0,
AssessmentNo: formValues.AssessmentNo || null,
AssessedAt: formValues.AssessedAt || null,
AssessedByUserId: formValues.AssessedByUserId || 0,
ContractAllowanceValue: formValues.ContractAllowanceValue || 0,
ActualUsageValue: formValues.ActualUsageValue || 0,
ExcessUsageValue: formValues.ExcessUsageValue || 0,
ReturnInspectionId: formValues.ReturnInspectionId || 0,
AssessmentStatusCode: formValues.AssessmentStatusCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IReturnAssessment ; 
	
	  this.spinner.show(); 
    this.returnAssessmentService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ReturnAssessment +  'Details Updated sucessfully.');
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



