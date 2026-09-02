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
import { IContractRenewalOption } from './contractRenewalOption';
import { ContractRenewalOptionService } from './contractRenewalOption.service';

@Component({
  selector: 'app-contractRenewalOption-create',
  standalone: false,
  templateUrl: './contractRenewalOption-create.component.html' ,
   providers: [ MessageService]
})
export class ContractRenewalOptionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractRenewalOption: IContractRenewalOption = null;
  leasecontractidOptions: ISelectItem[] = [];
optiontypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractRenewalOption = {} as IContractRenewalOption;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractRenewalOptionService: ContractRenewalOptionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractRenewalOption };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OptionTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EarliestExerciseDate: new FormControl(new Date(), []),
LatestExerciseDate: new FormControl(new Date(), []),
NoticeDays: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
TermsJson: new FormControl('', [Validators.maxLength(8000), ]), 
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create ContractRenewalOption';
    this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.optiontypecodeOptions.push({Text: 'RENEW', Value: 'RENEW' });
this.optiontypecodeOptions.push({Text: 'EXTEND', Value: 'EXTEND' });
this.optiontypecodeOptions.push({Text: 'PURCHASE', Value: 'PURCHASE' });
this.optiontypecodeOptions.push({Text: 'RETURN', Value: 'RETURN' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.statuscodeOptions.push({Text: 'AVAILABLE', Value: 'AVAILABLE' });
this.statuscodeOptions.push({Text: 'EXERCISED', Value: 'EXERCISED' });
this.statuscodeOptions.push({Text: 'EXPIRED', Value: 'EXPIRED' });
this.statuscodeOptions.push({Text: 'WAIVED', Value: 'WAIVED' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractRenewalOptionService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractRenewalOption = data;
        this.objMaster = { ...this.contractRenewalOption };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractRenewalOption): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
OptionTypeCode: obj.OptionTypeCode || '',
EarliestExerciseDate:  obj.EarliestExerciseDate || new Date(),
LatestExerciseDate:  obj.LatestExerciseDate || new Date(),
NoticeDays: obj.NoticeDays || 0,
CurrencyCode: obj.CurrencyCode || '',
TermsJson: obj.TermsJson || '',
StatusCode: obj.StatusCode || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractRenewalOptions/create']);
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
    this.contractRenewalOption = { ...this.objMaster };
    var obj  = this.contractRenewalOption;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
OptionTypeCode: obj.OptionTypeCode || '',
EarliestExerciseDate:  obj.EarliestExerciseDate || new Date(),
LatestExerciseDate:  obj.LatestExerciseDate || new Date(),
NoticeDays: obj.NoticeDays || 0,
CurrencyCode: obj.CurrencyCode || '',
TermsJson: obj.TermsJson || '',
StatusCode: obj.StatusCode || '',
 
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
OptionTypeCode: formValues.OptionTypeCode || null,
EarliestExerciseDate: formValues.EarliestExerciseDate || null,
LatestExerciseDate: formValues.LatestExerciseDate || null,
NoticeDays: formValues.NoticeDays || null,
OptionPriceAmount: formValues.OptionPriceAmount || null,
CurrencyCode: formValues.CurrencyCode || null,
TermsJson: formValues.TermsJson || null,
StatusCode: formValues.StatusCode || null,

    } as IContractRenewalOption ; 
	
	  this.spinner.show(); 
    this.contractRenewalOptionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractRenewalOption +  'Details Updated sucessfully.');
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



