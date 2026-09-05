import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAssetConditionGrade } from './assetConditionGrade';
import { AssetConditionGradeService } from './assetConditionGrade.service';

@Component({
  selector: 'app-assetConditionGrade-create',
  standalone: false,
  templateUrl: './assetConditionGrade-create.component.html' ,
   providers: [ MessageService]
})
export class AssetConditionGradeCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset Condition Grade';
  assetConditionGrade: IAssetConditionGrade = null;
  recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetConditionGrade = {} as IAssetConditionGrade;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetConditionGradeService: AssetConditionGradeService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetConditionGrade };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
GradeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
GradeName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
ScoreFrom: new FormControl(0, [Validators.required, ]),
ScoreTo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
IsLeaseable: new FormControl(false, [Validators.required]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetConditionGradeService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetConditionGrade = data;
        this.objMaster = { ...this.assetConditionGrade };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetConditionGrade): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GradeCode: obj.GradeCode || '',
GradeName: obj.GradeName || '',
ScoreFrom: obj.ScoreFrom || 0,
ScoreTo: obj.ScoreTo || 0,
IsLeaseable:  obj.IsLeaseable || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetConditionGrades/create']);
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
    this.assetConditionGrade = { ...this.objMaster };
    var obj  = this.assetConditionGrade;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GradeCode: obj.GradeCode || '',
GradeName: obj.GradeName || '',
ScoreFrom: obj.ScoreFrom || 0,
ScoreTo: obj.ScoreTo || 0,
IsLeaseable:  obj.IsLeaseable || false,
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     GradeCode: formValues.GradeCode || null,
GradeName: formValues.GradeName || null,
ScoreFrom: formValues.ScoreFrom || null,
ScoreTo: formValues.ScoreTo || null,
IsLeaseable: formValues.IsLeaseable || false,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetConditionGrade ; 
	
	  this.spinner.show(); 
    this.assetConditionGradeService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetConditionGrade +  'Details Updated sucessfully.');
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



