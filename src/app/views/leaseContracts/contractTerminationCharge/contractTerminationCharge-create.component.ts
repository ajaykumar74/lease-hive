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
import { IContractTerminationCharge } from './contractTerminationCharge';
import { ContractTerminationChargeService } from './contractTerminationCharge.service';

@Component({
  selector: 'app-contractTerminationCharge-create',
  standalone: false,
  templateUrl: './contractTerminationCharge-create.component.html' ,
   providers: [ MessageService]
})
export class ContractTerminationChargeCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractTerminationCharge: IContractTerminationCharge = null;
  contractterminationidOptions: ISelectItem[] = [];
chargetypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractTerminationCharge = {} as IContractTerminationCharge;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractTerminationChargeService: ContractTerminationChargeService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractTerminationCharge };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ContractTerminationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ChargeTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
FinanceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create ContractTerminationCharge';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'ContractTerminationId', 'contract-terminations',
      options => this.contractterminationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.chargetypecodeOptions = this.loggedInUserService.getPicklistOptions('ContractTerminationChargeChargeTypeCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractTerminationChargeService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractTerminationCharge = data;
        this.objMaster = { ...this.contractTerminationCharge };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractTerminationCharge): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractTerminationId: obj.ContractTerminationId || 0,
ChargeTypeCode: obj.ChargeTypeCode || '',
Description: obj.Description || '',
CurrencyCode: obj.CurrencyCode || '',
FinanceReferenceId: obj.FinanceReferenceId || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractTerminationCharges/create']);
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
    this.contractTerminationCharge = { ...this.objMaster };
    var obj  = this.contractTerminationCharge;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractTerminationId: obj.ContractTerminationId || 0,
ChargeTypeCode: obj.ChargeTypeCode || '',
Description: obj.Description || '',
CurrencyCode: obj.CurrencyCode || '',
FinanceReferenceId: obj.FinanceReferenceId || 0,
 
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
     ContractTerminationId: formValues.ContractTerminationId || 0,
ChargeTypeCode: formValues.ChargeTypeCode || null,
Description: formValues.Description || null,
Amount: formValues.Amount || null,
CurrencyCode: formValues.CurrencyCode || null,
TaxAmount: formValues.TaxAmount || null,
FinanceReferenceId: formValues.FinanceReferenceId || 0,

    } as IContractTerminationCharge ; 
	
	  this.spinner.show(); 
    this.contractTerminationChargeService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractTerminationCharge +  'Details Updated sucessfully.');
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



