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
import { IContractObligation } from './contractObligation';
import { ContractObligationService } from './contractObligation.service';

@Component({
  selector: 'app-contractObligation-create',
  standalone: false,
  templateUrl: './contractObligation-create.component.html' ,
   providers: [ MessageService]
})
export class ContractObligationCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractObligation: IContractObligation = null;
  leasecontractidOptions: ISelectItem[] = [];
obligationtypecodeOptions: ISelectItem[] = [];
responsiblepartycodeOptions: ISelectItem[] = [];
frequencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractObligation = {} as IContractObligation;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractObligationService: ContractObligationService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractObligation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ObligationTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ResponsiblePartyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
StartDate: new FormControl(new Date(), []),
EndDate: new FormControl(new Date(), []),
FrequencyCode: new FormControl('', [Validators.maxLength(20), ]), 
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TargetModuleCode: new FormControl('', [Validators.maxLength(20), ]), 

    });
    this.Caption = 'Create ContractObligation';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.obligationtypecodeOptions = this.loggedInUserService.getPicklistOptions('ObligationTypeCode');
this.responsiblepartycodeOptions = this.loggedInUserService.getPicklistOptions('ResponsiblePartyCode');
this.frequencycodeOptions = this.loggedInUserService.getPicklistOptions('ContractObligationFrequencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('ContractObligationStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractObligationService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractObligation = data;
        this.objMaster = { ...this.contractObligation };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractObligation): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ObligationTypeCode: obj.ObligationTypeCode || '',
ResponsiblePartyCode: obj.ResponsiblePartyCode || '',
Description: obj.Description || '',
StartDate:  obj.StartDate || new Date(),
EndDate:  obj.EndDate || new Date(),
FrequencyCode: obj.FrequencyCode || '',
StatusCode: obj.StatusCode || '',
TargetModuleCode: obj.TargetModuleCode || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractObligations/create']);
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
    this.contractObligation = { ...this.objMaster };
    var obj  = this.contractObligation;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ObligationTypeCode: obj.ObligationTypeCode || '',
ResponsiblePartyCode: obj.ResponsiblePartyCode || '',
Description: obj.Description || '',
StartDate:  obj.StartDate || new Date(),
EndDate:  obj.EndDate || new Date(),
FrequencyCode: obj.FrequencyCode || '',
StatusCode: obj.StatusCode || '',
TargetModuleCode: obj.TargetModuleCode || '',
 
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
     LeaseContractId: formValues.LeaseContractId || 0,
ObligationTypeCode: formValues.ObligationTypeCode || null,
ResponsiblePartyCode: formValues.ResponsiblePartyCode || null,
Description: formValues.Description || null,
StartDate: formValues.StartDate || null,
EndDate: formValues.EndDate || null,
FrequencyCode: formValues.FrequencyCode || null,
StatusCode: formValues.StatusCode || null,
TargetModuleCode: formValues.TargetModuleCode || null,

    } as IContractObligation ; 
	
	  this.spinner.show(); 
    this.contractObligationService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractObligation +  'Details Updated sucessfully.');
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



