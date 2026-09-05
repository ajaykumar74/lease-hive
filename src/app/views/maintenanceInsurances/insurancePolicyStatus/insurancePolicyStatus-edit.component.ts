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
import { IInsurancePolicyStatus } from './insurancePolicyStatus';
import { InsurancePolicyStatusService } from './insurancePolicyStatus.service';


@Component({
  selector: 'app-insurancePolicyStatus-edit',
  standalone: false,
  templateUrl: './insurancePolicyStatus-edit.component.html',
  providers: [ MessageService]
})
export class InsurancePolicyStatusEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  insurancePolicyStatus: IInsurancePolicyStatus = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IInsurancePolicyStatus = {} as IInsurancePolicyStatus;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private insurancePolicyStatusService: InsurancePolicyStatusService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.insurancePolicyStatus };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StatusName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('InsurancePolicyStatusStatusCode');
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
    this.insurancePolicyStatusService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.insurancePolicyStatus = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.insurancePolicyStatus };
        this.populateUI(this.insurancePolicyStatus);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IInsurancePolicyStatus): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
Description: obj.Description || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "InsurancePolicyStatus Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/insurance/configuration/policy-statuses/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.insurancePolicyStatus = { ...this.objMaster };
	var obj  = this.insurancePolicyStatus;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
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
     StatusCode:  formValues.StatusCode || null,
StatusName:  formValues.StatusName || null,
Description:  formValues.Description || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IInsurancePolicyStatus ;
	
	this.spinner.show();  	   
    this.insurancePolicyStatusService.update(this.insurancePolicyStatus.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InsurancePolicyStatus +  'Details Updated sucessfully.');
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
