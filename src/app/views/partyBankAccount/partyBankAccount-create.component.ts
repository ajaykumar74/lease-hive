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
import { IPartyBankAccount } from './partyBankAccount';
import { PartyBankAccountService } from './partyBankAccount.service';

@Component({
  selector: 'app-partyBankAccount-create',
  standalone: false,
  templateUrl: './partyBankAccount-create.component.html' ,
   providers: [ MessageService]
})
export class PartyBankAccountCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyBankAccount: IPartyBankAccount = null;
  partyidOptions: ISelectItem[] = [];
accounttypeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
verificationstatusOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPartyBankAccount = {} as IPartyBankAccount;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private partyBankAccountService: PartyBankAccountService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.partyBankAccount };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BankName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
BranchName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
AccountHolderName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
AccountNumber: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AccountNumberMasked: new FormControl('', [Validators.maxLength(20), ]), 
AccountNumberEncrypted: new FormControl('', [Validators.maxLength(20), ]), 
AccountType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IFSCCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SWIFTCode: new FormControl('', [Validators.maxLength(20), ]), 
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
IsDefaultForPayments: new FormControl(false, [Validators.required]),
IsDefaultForRefunds: new FormControl(false, [Validators.required]),
VerificationStatus: new FormControl('', [Validators.maxLength(20), ]), 
VerifiedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.loadPartyOptions();
this.accounttypeOptions.push({Text: 'Current', Value: 'Current' });
this.accounttypeOptions.push({Text: 'Savings', Value: 'Savings' });
this.accounttypeOptions.push({Text: 'Escrow', Value: 'Escrow' });
this.accounttypeOptions.push({Text: 'Nodal', Value: 'Nodal' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.verificationstatusOptions.push({Text: 'Pending', Value: 'Pending' });
this.verificationstatusOptions.push({Text: 'Verified', Value: 'Verified' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

  }

  private loadPartyOptions(): void {
    this.loggedInUserService.getPartyOptions().subscribe({
      next: options => this.partyidOptions = options,
      error: err => this.messageService?.showError(err)
    });
  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.partyBankAccountService.getById(this.selectedId).subscribe({
      next: data => {
        this.partyBankAccount = data;
        this.objMaster = { ...this.partyBankAccount };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPartyBankAccount): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
BankName: obj.BankName || '',
BranchName: obj.BranchName || '',
AccountHolderName: obj.AccountHolderName || '',
AccountNumber: obj.AccountNumber || '',
AccountNumberMasked: obj.AccountNumberMasked || '',
AccountNumberEncrypted: obj.AccountNumberEncrypted || '',
AccountType: obj.AccountType || '',
IFSCCode: obj.IFSCCode || '',
SWIFTCode: obj.SWIFTCode || '',
CurrencyCode: obj.CurrencyCode || '',
IsDefaultForPayments:  obj.IsDefaultForPayments || false,
IsDefaultForRefunds:  obj.IsDefaultForRefunds || false,
VerificationStatus: obj.VerificationStatus || '',
VerifiedAt:  obj.VerifiedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/partyBankAccounts/create']);
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
    this.partyBankAccount = { ...this.objMaster };
    var obj  = this.partyBankAccount;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
BankName: obj.BankName || '',
BranchName: obj.BranchName || '',
AccountHolderName: obj.AccountHolderName || '',
AccountNumber: obj.AccountNumber || '',
AccountNumberMasked: obj.AccountNumberMasked || '',
AccountNumberEncrypted: obj.AccountNumberEncrypted || '',
AccountType: obj.AccountType || '',
IFSCCode: obj.IFSCCode || '',
SWIFTCode: obj.SWIFTCode || '',
CurrencyCode: obj.CurrencyCode || '',
IsDefaultForPayments:  obj.IsDefaultForPayments || false,
IsDefaultForRefunds:  obj.IsDefaultForRefunds || false,
VerificationStatus: obj.VerificationStatus || '',
VerifiedAt:  obj.VerifiedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
     PartyId: formValues.PartyId || 0,
BankName: formValues.BankName || null,
BranchName: formValues.BranchName || null,
AccountHolderName: formValues.AccountHolderName || null,
AccountNumber: formValues.AccountNumber || null,
AccountNumberMasked: formValues.AccountNumberMasked || null,
AccountNumberEncrypted: formValues.AccountNumberEncrypted || null,
AccountType: formValues.AccountType || null,
IFSCCode: formValues.IFSCCode || null,
SWIFTCode: formValues.SWIFTCode || null,
CurrencyCode: formValues.CurrencyCode || null,
IsDefaultForPayments: formValues.IsDefaultForPayments || false,
IsDefaultForRefunds: formValues.IsDefaultForRefunds || false,
VerificationStatus: formValues.VerificationStatus || null,
VerifiedAt: formValues.VerifiedAt || null,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IPartyBankAccount ; 
	
	  this.spinner.show(); 
    this.partyBankAccountService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PartyBankAccount +  'Details Updated sucessfully.');
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



