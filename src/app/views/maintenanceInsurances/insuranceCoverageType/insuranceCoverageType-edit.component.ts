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
import { IInsuranceCoverageType } from './insuranceCoverageType';
import { InsuranceCoverageTypeService } from './insuranceCoverageType.service';


@Component({
  selector: 'app-insuranceCoverageType-edit',
  standalone: false,
  templateUrl: './insuranceCoverageType-edit.component.html',
  providers: [ MessageService]
})
export class InsuranceCoverageTypeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  insuranceCoverageType: IInsuranceCoverageType = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IInsuranceCoverageType = {} as IInsuranceCoverageType;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private insuranceCoverageTypeService: InsuranceCoverageTypeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.insuranceCoverageType };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
CoverageTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CoverageTypeName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

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
    this.insuranceCoverageTypeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.insuranceCoverageType = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.insuranceCoverageType };
        this.populateUI(this.insuranceCoverageType);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IInsuranceCoverageType): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CoverageTypeCode: obj.CoverageTypeCode || '',
CoverageTypeName: obj.CoverageTypeName || '',
Description: obj.Description || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "InsuranceCoverageType Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/insurance/configuration/coverage-types/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.insuranceCoverageType = { ...this.objMaster };
	var obj  = this.insuranceCoverageType;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CoverageTypeCode: obj.CoverageTypeCode || '',
CoverageTypeName: obj.CoverageTypeName || '',
Description: obj.Description || '',
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
     CoverageTypeCode:  formValues.CoverageTypeCode || null,
CoverageTypeName:  formValues.CoverageTypeName || null,
Description:  formValues.Description || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IInsuranceCoverageType ;
	
	this.spinner.show();  	   
    this.insuranceCoverageTypeService.update(this.insuranceCoverageType.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InsuranceCoverageType +  'Details Updated sucessfully.');
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
