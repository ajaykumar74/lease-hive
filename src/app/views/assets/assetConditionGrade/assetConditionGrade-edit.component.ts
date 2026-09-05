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
import { IAssetConditionGrade } from './assetConditionGrade';
import { AssetConditionGradeService } from './assetConditionGrade.service';


@Component({
  selector: 'app-assetConditionGrade-edit',
  standalone: false,
  templateUrl: './assetConditionGrade-edit.component.html',
  providers: [ MessageService]
})
export class AssetConditionGradeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetConditionGrade: IAssetConditionGrade = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetConditionGrade = {} as IAssetConditionGrade;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetConditionGradeService: AssetConditionGradeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetConditionGrade };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetConditionGradeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetConditionGrade = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetConditionGrade };
        this.populateUI(this.assetConditionGrade);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "AssetConditionGrade Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetConditionGrade/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     GradeCode:  formValues.GradeCode || null,
GradeName:  formValues.GradeName || null,
ScoreFrom:  formValues.ScoreFrom || 0,
ScoreTo:  formValues.ScoreTo || 0,
IsLeaseable:  formValues.IsLeaseable || false,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetConditionGrade ;
	
	this.spinner.show();  	   
    this.assetConditionGradeService.update(this.assetConditionGrade.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetConditionGrade +  'Details Updated sucessfully.');
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
