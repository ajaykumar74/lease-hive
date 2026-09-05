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
import { IContractExecutionParty } from './contractExecutionParty';
import { ContractExecutionPartyService } from './contractExecutionParty.service';

@Component({
  selector: 'app-contractExecutionParty-create',
  standalone: false,
  templateUrl: './contractExecutionParty-create.component.html' ,
   providers: [ MessageService]
})
export class ContractExecutionPartyCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractExecutionParty: IContractExecutionParty = null;
  contractexecutionidOptions: ISelectItem[] = [];
leasecontractpartyidOptions: ISelectItem[] = [];
signerpartyidOptions: ISelectItem[] = [];
signaturestatuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractExecutionParty = {} as IContractExecutionParty;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractExecutionPartyService: ContractExecutionPartyService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractExecutionParty };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ContractExecutionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
SignerPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
SignerNameSnapshot: new FormControl('', [Validators.required, Validators.maxLength(200), ]),
SignerEmailSnapshot: new FormControl('', [Validators.maxLength(256), ]), 
SigningOrder: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
SignatureStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SignedOn: new FormControl(new Date(), []),
ExternalSignerId: new FormControl('', [Validators.maxLength(120), ]), 

    });
    this.Caption = 'Create ContractExecutionParty';
    this.contractexecutionidOptions.push({Text: 'ContractExecutionId1', Value: 'ContractExecutionId1' });
this.contractexecutionidOptions.push({Text: 'ContractExecutionId2', Value: 'ContractExecutionId2' });
this.leasecontractpartyidOptions.push({Text: 'LeaseContractPartyId1', Value: 'LeaseContractPartyId1' });
this.leasecontractpartyidOptions.push({Text: 'LeaseContractPartyId2', Value: 'LeaseContractPartyId2' });
this.signerpartyidOptions.push({Text: 'SignerPartyId1', Value: 'SignerPartyId1' });
this.signerpartyidOptions.push({Text: 'SignerPartyId2', Value: 'SignerPartyId2' });
this.signaturestatuscodeOptions = this.loggedInUserService.getPicklistOptions('SignatureStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractExecutionPartyService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractExecutionParty = data;
        this.objMaster = { ...this.contractExecutionParty };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractExecutionParty): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractExecutionId: obj.ContractExecutionId || 0,
LeaseContractPartyId: obj.LeaseContractPartyId || 0,
SignerPartyId: obj.SignerPartyId || 0,
SignerNameSnapshot: obj.SignerNameSnapshot || '',
SignerEmailSnapshot: obj.SignerEmailSnapshot || '',
SigningOrder: obj.SigningOrder || 0,
SignatureStatusCode: obj.SignatureStatusCode || '',
SignedOn:  obj.SignedOn || new Date(),
ExternalSignerId: obj.ExternalSignerId || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractExecutionPartys/create']);
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
    this.contractExecutionParty = { ...this.objMaster };
    var obj  = this.contractExecutionParty;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractExecutionId: obj.ContractExecutionId || 0,
LeaseContractPartyId: obj.LeaseContractPartyId || 0,
SignerPartyId: obj.SignerPartyId || 0,
SignerNameSnapshot: obj.SignerNameSnapshot || '',
SignerEmailSnapshot: obj.SignerEmailSnapshot || '',
SigningOrder: obj.SigningOrder || 0,
SignatureStatusCode: obj.SignatureStatusCode || '',
SignedOn:  obj.SignedOn || new Date(),
ExternalSignerId: obj.ExternalSignerId || '',
 
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
     ContractExecutionId: formValues.ContractExecutionId || 0,
LeaseContractPartyId: formValues.LeaseContractPartyId || 0,
SignerPartyId: formValues.SignerPartyId || 0,
SignerNameSnapshot: formValues.SignerNameSnapshot || null,
SignerEmailSnapshot: formValues.SignerEmailSnapshot || null,
SigningOrder: formValues.SigningOrder || null,
SignatureStatusCode: formValues.SignatureStatusCode || null,
SignedOn: formValues.SignedOn || null,
ExternalSignerId: formValues.ExternalSignerId || null,

    } as IContractExecutionParty ; 
	
	  this.spinner.show(); 
    this.contractExecutionPartyService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractExecutionParty +  'Details Updated sucessfully.');
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



