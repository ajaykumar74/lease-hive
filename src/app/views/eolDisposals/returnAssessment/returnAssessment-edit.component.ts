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
import { IReturnAssessment } from './returnAssessment';
import { ReturnAssessmentService } from './returnAssessment.service';


@Component({
  selector: 'app-returnAssessment-edit',
  standalone: false,
  templateUrl: './returnAssessment-edit.component.html',
  providers: [ MessageService]
})
export class ReturnAssessmentEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  returnAssessment: IReturnAssessment = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endofleasecaseidOptions: ISelectItem[] = [];
assetreturnidOptions: ISelectItem[] = [];
assessedbyuseridOptions: ISelectItem[] = [];
returninspectionidOptions: ISelectItem[] = [];
assessmentstatuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IReturnAssessment = {} as IReturnAssessment;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private returnAssessmentService: ReturnAssessmentService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.returnAssessment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId1', Value: 'EndOfLeaseCaseId1' });
this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId2', Value: 'EndOfLeaseCaseId2' });
this.assetreturnidOptions.push({Text: 'AssetReturnId1', Value: 'AssetReturnId1' });
this.assetreturnidOptions.push({Text: 'AssetReturnId2', Value: 'AssetReturnId2' });
this.assessedbyuseridOptions.push({Text: 'AssessedByUserId1', Value: 'AssessedByUserId1' });
this.assessedbyuseridOptions.push({Text: 'AssessedByUserId2', Value: 'AssessedByUserId2' });
this.returninspectionidOptions.push({Text: 'ReturnInspectionId1', Value: 'ReturnInspectionId1' });
this.returninspectionidOptions.push({Text: 'ReturnInspectionId2', Value: 'ReturnInspectionId2' });
this.assessmentstatuscodeOptions = this.loggedInUserService.getPicklistOptions('AssessmentStatusCode');
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
    this.returnAssessmentService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.returnAssessment = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.returnAssessment };
        this.populateUI(this.returnAssessment);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "ReturnAssessment Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/assessments/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     EndOfLeaseCaseId:  formValues.EndOfLeaseCaseId || null,
AssetReturnId:  formValues.AssetReturnId || null,
AssessmentNo:  formValues.AssessmentNo || null,
AssessedAt:  formValues.AssessedAt || null,
AssessedByUserId:  formValues.AssessedByUserId || null,
ContractAllowanceValue:  formValues.ContractAllowanceValue || null,
ActualUsageValue:  formValues.ActualUsageValue || null,
ExcessUsageValue:  formValues.ExcessUsageValue || null,
ReturnInspectionId:  formValues.ReturnInspectionId || null,
AssessmentStatusCode:  formValues.AssessmentStatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IReturnAssessment ;
	
	this.spinner.show();  	   
    this.returnAssessmentService.update(this.returnAssessment.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ReturnAssessment +  'Details Updated sucessfully.');
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
