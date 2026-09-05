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
import { IContractExecutionParty } from './contractExecutionParty';
import { ContractExecutionPartyService } from './contractExecutionParty.service';


@Component({
  selector: 'app-contractExecutionParty-edit',
  standalone: false,
  templateUrl: './contractExecutionParty-edit.component.html',
  providers: [ MessageService]
})
export class ContractExecutionPartyEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  contractExecutionParty: IContractExecutionParty = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractexecutionidOptions: ISelectItem[] = [];
leasecontractpartyidOptions: ISelectItem[] = [];
signerpartyidOptions: ISelectItem[] = [];
signaturestatuscodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IContractExecutionParty = {} as IContractExecutionParty;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private contractExecutionPartyService: ContractExecutionPartyService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.contractExecutionParty };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.contractexecutionidOptions.push({Text: 'ContractExecutionId1', Value: 'ContractExecutionId1' });
this.contractexecutionidOptions.push({Text: 'ContractExecutionId2', Value: 'ContractExecutionId2' });
this.leasecontractpartyidOptions.push({Text: 'LeaseContractPartyId1', Value: 'LeaseContractPartyId1' });
this.leasecontractpartyidOptions.push({Text: 'LeaseContractPartyId2', Value: 'LeaseContractPartyId2' });
this.signerpartyidOptions.push({Text: 'SignerPartyId1', Value: 'SignerPartyId1' });
this.signerpartyidOptions.push({Text: 'SignerPartyId2', Value: 'SignerPartyId2' });
this.signaturestatuscodeOptions = this.loggedInUserService.getPicklistOptions('SignatureStatusCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.contractExecutionPartyService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.contractExecutionParty = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.contractExecutionParty };
        this.populateUI(this.contractExecutionParty);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "ContractExecutionParty Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/execution/parties/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     ContractExecutionId:  formValues.ContractExecutionId || null,
LeaseContractPartyId:  formValues.LeaseContractPartyId || null,
SignerPartyId:  formValues.SignerPartyId || null,
SignerNameSnapshot:  formValues.SignerNameSnapshot || null,
SignerEmailSnapshot:  formValues.SignerEmailSnapshot || null,
SigningOrder:  formValues.SigningOrder || null,
SignatureStatusCode:  formValues.SignatureStatusCode || null,
SignedOn:  formValues.SignedOn || null,
ExternalSignerId:  formValues.ExternalSignerId || null,

    } as IContractExecutionParty ;
	
	this.spinner.show();  	   
    this.contractExecutionPartyService.update(this.contractExecutionParty.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ContractExecutionParty +  'Details Updated sucessfully.');
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
