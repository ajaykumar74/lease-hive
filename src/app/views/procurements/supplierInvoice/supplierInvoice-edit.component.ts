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
import { ISupplierInvoice } from './supplierInvoice';
import { SupplierInvoiceService } from './supplierInvoice.service';


@Component({
  selector: 'app-supplierInvoice-edit',
  standalone: false,
  templateUrl: './supplierInvoice-edit.component.html',
  providers: [ MessageService]
})
export class SupplierInvoiceEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  supplierInvoice: ISupplierInvoice = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supplierpartyidOptions: ISelectItem[] = [];
buyingorganisationidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
matchstatuscodeOptions: ISelectItem[] = [];
invoicedocumentidOptions: ISelectItem[] = [];
capturedbyOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISupplierInvoice = {} as ISupplierInvoice;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private supplierInvoiceService: SupplierInvoiceService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.supplierInvoice };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierInvoiceNo: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
InvoiceDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Subtotal: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
TotalAmount: new FormControl(0, [Validators.required]),
MatchStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
InvoiceDocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
APReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CapturedOn: new FormControl(new Date(), [Validators.required]),
CapturedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.supplierpartyidOptions.push({Text: 'SupplierPartyId1', Value: 'SupplierPartyId1' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId2', Value: 'SupplierPartyId2' });
this.buyingorganisationidOptions.push({Text: 'BuyingOrganisationId1', Value: 'BuyingOrganisationId1' });
this.buyingorganisationidOptions.push({Text: 'BuyingOrganisationId2', Value: 'BuyingOrganisationId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.matchstatuscodeOptions.push({Text: 'UNMATCHED', Value: 'UNMATCHED' });
this.matchstatuscodeOptions.push({Text: 'MATCHED', Value: 'MATCHED' });
this.matchstatuscodeOptions.push({Text: 'EXCEPTION', Value: 'EXCEPTION' });
this.matchstatuscodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.invoicedocumentidOptions.push({Text: 'InvoiceDocumentId1', Value: 'InvoiceDocumentId1' });
this.invoicedocumentidOptions.push({Text: 'InvoiceDocumentId2', Value: 'InvoiceDocumentId2' });
this.capturedbyOptions.push({Text: 'CapturedBy1', Value: 'CapturedBy1' });
this.capturedbyOptions.push({Text: 'CapturedBy2', Value: 'CapturedBy2' });
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
    this.supplierInvoiceService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.supplierInvoice = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.supplierInvoice };
        this.populateUI(this.supplierInvoice);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ISupplierInvoice): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierPartyId: obj.SupplierPartyId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
SupplierInvoiceNo: obj.SupplierInvoiceNo || '',
InvoiceDate:  obj.InvoiceDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
TotalAmount: obj.TotalAmount || 0,
MatchStatusCode: obj.MatchStatusCode || '',
InvoiceDocumentId: obj.InvoiceDocumentId || 0,
APReferenceId: obj.APReferenceId || 0,
CapturedOn:  obj.CapturedOn || new Date(),
CapturedBy: obj.CapturedBy || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "SupplierInvoice Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supplierInvoice/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.supplierInvoice = { ...this.objMaster };
	var obj  = this.supplierInvoice;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierPartyId: obj.SupplierPartyId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
SupplierInvoiceNo: obj.SupplierInvoiceNo || '',
InvoiceDate:  obj.InvoiceDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
TotalAmount: obj.TotalAmount || 0,
MatchStatusCode: obj.MatchStatusCode || '',
InvoiceDocumentId: obj.InvoiceDocumentId || 0,
APReferenceId: obj.APReferenceId || 0,
CapturedOn:  obj.CapturedOn || new Date(),
CapturedBy: obj.CapturedBy || 0,
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
     SupplierPartyId:  formValues.SupplierPartyId || null,
BuyingOrganisationId:  formValues.BuyingOrganisationId || null,
SupplierInvoiceNo:  formValues.SupplierInvoiceNo || null,
InvoiceDate:  formValues.InvoiceDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
Subtotal:  formValues.Subtotal || null,
TaxAmount:  formValues.TaxAmount || null,
TotalAmount:  formValues.TotalAmount || null,
MatchStatusCode:  formValues.MatchStatusCode || null,
InvoiceDocumentId:  formValues.InvoiceDocumentId || null,
APReferenceId:  formValues.APReferenceId || null,
CapturedOn:  formValues.CapturedOn || null,
CapturedBy:  formValues.CapturedBy || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ISupplierInvoice ;
	
	this.spinner.show();  	   
    this.supplierInvoiceService.update(this.supplierInvoice.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SupplierInvoice +  'Details Updated sucessfully.');
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
