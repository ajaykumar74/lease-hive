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
import { IFinanceDocumentLink } from './financeDocumentLink';
import { FinanceDocumentLinkService } from './financeDocumentLink.service';


@Component({
  selector: 'app-financeDocumentLink-edit',
  standalone: false,
  templateUrl: './financeDocumentLink-edit.component.html',
  providers: [ MessageService]
})
export class FinanceDocumentLinkEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  financeDocumentLink: IFinanceDocumentLink = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  referencetypeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
documentroleOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IFinanceDocumentLink = {} as IFinanceDocumentLink;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private financeDocumentLinkService: FinanceDocumentLinkService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.financeDocumentLink };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentRole: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
IsPrimary: new FormControl(false, [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.referencetypeOptions.push({Text: 'INVOICE', Value: 'INVOICE' });
this.referencetypeOptions.push({Text: 'RECEIPT', Value: 'RECEIPT' });
this.referencetypeOptions.push({Text: 'CREDIT_NOTE', Value: 'CREDIT_NOTE' });
this.referencetypeOptions.push({Text: 'BANK_STATEMENT', Value: 'BANK_STATEMENT' });
this.referencetypeOptions.push({Text: 'JOURNAL', Value: 'JOURNAL' });
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentroleOptions.push({Text: 'PDF', Value: 'PDF' });
this.documentroleOptions.push({Text: 'TAX_RESPONSE', Value: 'TAX_RESPONSE' });
this.documentroleOptions.push({Text: 'PAYMENT_PROOF', Value: 'PAYMENT_PROOF' });
this.documentroleOptions.push({Text: 'STATEMENT', Value: 'STATEMENT' });
this.documentroleOptions.push({Text: 'EXPORT', Value: 'EXPORT' });
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
    this.financeDocumentLinkService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.financeDocumentLink = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.financeDocumentLink };
        this.populateUI(this.financeDocumentLink);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IFinanceDocumentLink): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentRole: obj.DocumentRole || '',
IsPrimary:  obj.IsPrimary || false,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "FinanceDocumentLink Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/financeDocumentLink/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.financeDocumentLink = { ...this.objMaster };
	var obj  = this.financeDocumentLink;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentRole: obj.DocumentRole || '',
IsPrimary:  obj.IsPrimary || false,
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
     ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || null,
DocumentId:  formValues.DocumentId || null,
DocumentRole:  formValues.DocumentRole || null,
IsPrimary:  formValues.IsPrimary || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IFinanceDocumentLink ;
	
	this.spinner.show();  	   
    this.financeDocumentLinkService.update(this.financeDocumentLink.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(FinanceDocumentLink +  'Details Updated sucessfully.');
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
