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
import { ICreditNoteLine } from './creditNoteLine';
import { CreditNoteLineService } from './creditNoteLine.service';


@Component({
  selector: 'app-creditNoteLine-edit',
  standalone: false,
  templateUrl: './creditNoteLine-edit.component.html',
  providers: [ MessageService]
})
export class CreditNoteLineEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  creditNoteLine: ICreditNoteLine = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  creditnoteidOptions: ISelectItem[] = [];
customerinvoicelineidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ICreditNoteLine = {} as ICreditNoteLine;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private creditNoteLineService: CreditNoteLineService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.creditNoteLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
CreditNoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerInvoiceLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Quantity: new FormControl(0, [Validators.required]),
NetAmount: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
GrossAmount: new FormControl(0, [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.creditnoteidOptions.push({Text: 'CreditNoteId1', Value: 'CreditNoteId1' });
this.creditnoteidOptions.push({Text: 'CreditNoteId2', Value: 'CreditNoteId2' });
this.customerinvoicelineidOptions.push({Text: 'CustomerInvoiceLineId1', Value: 'CustomerInvoiceLineId1' });
this.customerinvoicelineidOptions.push({Text: 'CustomerInvoiceLineId2', Value: 'CustomerInvoiceLineId2' });
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
    this.creditNoteLineService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.creditNoteLine = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.creditNoteLine };
        this.populateUI(this.creditNoteLine);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ICreditNoteLine): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CreditNoteId: obj.CreditNoteId || 0,
CustomerInvoiceLineId: obj.CustomerInvoiceLineId || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
NetAmount: obj.NetAmount || 0,
TaxAmount: obj.TaxAmount || 0,
GrossAmount: obj.GrossAmount || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "CreditNoteLine Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/creditNoteLine/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.creditNoteLine = { ...this.objMaster };
	var obj  = this.creditNoteLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CreditNoteId: obj.CreditNoteId || 0,
CustomerInvoiceLineId: obj.CustomerInvoiceLineId || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
NetAmount: obj.NetAmount || 0,
TaxAmount: obj.TaxAmount || 0,
GrossAmount: obj.GrossAmount || 0,
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
     CreditNoteId:  formValues.CreditNoteId || null,
CustomerInvoiceLineId:  formValues.CustomerInvoiceLineId || null,
Description:  formValues.Description || null,
Quantity:  formValues.Quantity || null,
NetAmount:  formValues.NetAmount || null,
TaxAmount:  formValues.TaxAmount || null,
GrossAmount:  formValues.GrossAmount || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ICreditNoteLine ;
	
	this.spinner.show();  	   
    this.creditNoteLineService.update(this.creditNoteLine.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(CreditNoteLine +  'Details Updated sucessfully.');
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
