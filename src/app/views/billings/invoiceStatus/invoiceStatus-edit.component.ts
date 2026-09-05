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
import { IInvoiceStatus } from './invoiceStatus';
import { InvoiceStatusService } from './invoiceStatus.service';


@Component({
  selector: 'app-invoiceStatus-edit',
  standalone: false,
  templateUrl: './invoiceStatus-edit.component.html',
  providers: [ MessageService]
})
export class InvoiceStatusEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  invoiceStatus: IInvoiceStatus = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IInvoiceStatus = {} as IInvoiceStatus;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private invoiceStatusService: InvoiceStatusService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.invoiceStatus };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StatusName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
IsIssuedState: new FormControl(false, [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('InvoiceStatusStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.invoiceStatusService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.invoiceStatus = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.invoiceStatus };
        this.populateUI(this.invoiceStatus);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IInvoiceStatus): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
IsIssuedState:  obj.IsIssuedState || false,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "InvoiceStatus Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/configuration/invoice-statuses/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.invoiceStatus = { ...this.objMaster };
	var obj  = this.invoiceStatus;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
IsIssuedState:  obj.IsIssuedState || false,
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
     StatusCode:  formValues.StatusCode || null,
StatusName:  formValues.StatusName || null,
IsIssuedState:  formValues.IsIssuedState || false,
RecordStatus:  formValues.RecordStatus || null,

    } as IInvoiceStatus ;
	
	this.spinner.show();  	   
    this.invoiceStatusService.update(this.invoiceStatus.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InvoiceStatus +  'Details Updated sucessfully.');
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
