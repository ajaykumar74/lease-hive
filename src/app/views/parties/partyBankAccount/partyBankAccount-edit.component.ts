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
import { IPartyBankAccount } from './partyBankAccount';
import { PartyBankAccountService } from './partyBankAccount.service';


@Component({
  selector: 'app-partyBankAccount-edit',
  standalone: false,
  templateUrl: './partyBankAccount-edit.component.html',
  providers: [ MessageService]
})
export class PartyBankAccountEditComponent implements OnInit {

  selectedId: number;
  partyId: number | null = null;
  isLoading: boolean = false;
  partyBankAccount: IPartyBankAccount = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyidOptions: ISelectItem[] = [];
accounttypeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
verificationstatusOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPartyBankAccount = {} as IPartyBankAccount;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private partyBankAccountService: PartyBankAccountService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.partyBankAccount };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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
this.accounttypeOptions = this.loggedInUserService.getPicklistOptions('AccountType');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.verificationstatusOptions = this.loggedInUserService.getPicklistOptions('VerificationStatus');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
     const routePartyId = Number(this.activatedRouter.snapshot.paramMap.get('partyId'));
     this.partyId = routePartyId > 0 ? routePartyId : null;
     if (this.partyId) this.editForm.controls.PartyId.disable();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.partyBankAccountService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.partyBankAccount = data.data;
		if (this.partyId && this.partyBankAccount.PartyId !== this.partyId) {
		  this.messageService.showError('This record does not belong to the selected party.');
		  this.router.navigate(['/business/parties/bank-accounts/party', this.partyId]);
		  return;
		}
		this.permission = data.permission;
        this.objMaster = { ...this.partyBankAccount };
        this.loadPartyOptions(this.partyBankAccount.PartyId);
        this.populateUI(this.partyBankAccount);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  private loadPartyOptions(selectedId?: number): void {
    this.loggedInUserService.getPartyOptions(selectedId).subscribe({
      next: options => this.partyidOptions = options,
      error: err => this.messageService?.showError(err)
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
   
	 this.Caption = "PartyBankAccount Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/parties/bank-accounts/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PartyId:  this.partyId ?? formValues.PartyId ?? this.objMaster.PartyId,
BankName:  formValues.BankName || null,
BranchName:  formValues.BranchName || null,
AccountHolderName:  formValues.AccountHolderName || null,
AccountNumber:  formValues.AccountNumber || null,
AccountNumberMasked:  formValues.AccountNumberMasked || null,
AccountNumberEncrypted:  formValues.AccountNumberEncrypted || null,
AccountType:  formValues.AccountType || null,
IFSCCode:  formValues.IFSCCode || null,
SWIFTCode:  formValues.SWIFTCode || null,
CurrencyCode:  formValues.CurrencyCode || null,
IsDefaultForPayments:  formValues.IsDefaultForPayments || null,
IsDefaultForRefunds:  formValues.IsDefaultForRefunds || null,
VerificationStatus:  formValues.VerificationStatus || null,
VerifiedAt:  formValues.VerifiedAt || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IPartyBankAccount ;
	
	this.spinner.show();  	   
    this.partyBankAccountService.update(this.partyBankAccount.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PartyBankAccount +  'Details Updated sucessfully.');
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
