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
import { ICreditNote } from './creditNote';
import { CreditNoteService } from './creditNote.service';


@Component({
  selector: 'app-creditNote-edit',
  standalone: false,
  templateUrl: './creditNote-edit.component.html',
  providers: [ MessageService]
})
export class CreditNoteEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  creditNote: ICreditNote = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  billingorganisationidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
customerinvoiceidOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
reasoncodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ICreditNote = {} as ICreditNote;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private creditNoteService: CreditNoteService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.creditNote };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerInvoiceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CreditNoteDate: new FormControl(new Date(), [Validators.required]),
ReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
NetAmount: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
GrossAmount: new FormControl(0, [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ExternalEInvoiceRef: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.billingorganisationidOptions.push({Text: 'BillingOrganisationId1', Value: 'BillingOrganisationId1' });
this.billingorganisationidOptions.push({Text: 'BillingOrganisationId2', Value: 'BillingOrganisationId2' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId1', Value: 'CustomerPartyId1' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId2', Value: 'CustomerPartyId2' });
this.customerinvoiceidOptions.push({Text: 'CustomerInvoiceId1', Value: 'CustomerInvoiceId1' });
this.customerinvoiceidOptions.push({Text: 'CustomerInvoiceId2', Value: 'CustomerInvoiceId2' });
this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.reasoncodeOptions.push({Text: 'RATE_CORRECTION', Value: 'RATE_CORRECTION' });
this.reasoncodeOptions.push({Text: 'SERVICE_CREDIT', Value: 'SERVICE_CREDIT' });
this.reasoncodeOptions.push({Text: 'CANCELLATION', Value: 'CANCELLATION' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.statuscodeOptions.push({Text: 'DRAFT', Value: 'DRAFT' });
this.statuscodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.statuscodeOptions.push({Text: 'ISSUED', Value: 'ISSUED' });
this.statuscodeOptions.push({Text: 'CANCELLED', Value: 'CANCELLED' });
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
    this.creditNoteService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.creditNote = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.creditNote };
        this.populateUI(this.creditNote);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ICreditNote): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
CustomerInvoiceId: obj.CustomerInvoiceId || 0,
LeaseContractId: obj.LeaseContractId || 0,
CreditNoteDate:  obj.CreditNoteDate || new Date(),
ReasonCode: obj.ReasonCode || '',
CurrencyCode: obj.CurrencyCode || '',
NetAmount: obj.NetAmount || 0,
TaxAmount: obj.TaxAmount || 0,
GrossAmount: obj.GrossAmount || 0,
StatusCode: obj.StatusCode || '',
ExternalEInvoiceRef: obj.ExternalEInvoiceRef || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "CreditNote Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/creditNote/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.creditNote = { ...this.objMaster };
	var obj  = this.creditNote;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
CustomerInvoiceId: obj.CustomerInvoiceId || 0,
LeaseContractId: obj.LeaseContractId || 0,
CreditNoteDate:  obj.CreditNoteDate || new Date(),
ReasonCode: obj.ReasonCode || '',
CurrencyCode: obj.CurrencyCode || '',
NetAmount: obj.NetAmount || 0,
TaxAmount: obj.TaxAmount || 0,
GrossAmount: obj.GrossAmount || 0,
StatusCode: obj.StatusCode || '',
ExternalEInvoiceRef: obj.ExternalEInvoiceRef || '',
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
     BillingOrganisationId:  formValues.BillingOrganisationId || null,
CustomerPartyId:  formValues.CustomerPartyId || null,
CustomerInvoiceId:  formValues.CustomerInvoiceId || null,
LeaseContractId:  formValues.LeaseContractId || null,
CreditNoteDate:  formValues.CreditNoteDate || null,
ReasonCode:  formValues.ReasonCode || null,
CurrencyCode:  formValues.CurrencyCode || null,
NetAmount:  formValues.NetAmount || null,
TaxAmount:  formValues.TaxAmount || null,
GrossAmount:  formValues.GrossAmount || null,
StatusCode:  formValues.StatusCode || null,
ExternalEInvoiceRef:  formValues.ExternalEInvoiceRef || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ICreditNote ;
	
	this.spinner.show();  	   
    this.creditNoteService.update(this.creditNote.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(CreditNote +  'Details Updated sucessfully.');
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
