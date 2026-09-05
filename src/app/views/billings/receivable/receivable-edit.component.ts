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
import { IReceivable } from './receivable';
import { ReceivableService } from './receivable.service';


@Component({
  selector: 'app-receivable-edit',
  standalone: false,
  templateUrl: './receivable-edit.component.html',
  providers: [ MessageService]
})
export class ReceivableEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  receivable: IReceivable = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  billingorganisationidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
sourcedocumenttypeOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
receivablestatusOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IReceivable = {} as IReceivable;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private receivableService: ReceivableService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.receivable };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SourceDocumentType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SourceDocumentId: new FormControl(0, [Validators.required, ]),
LeaseContractId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
DocumentDate: new FormControl(new Date(), [Validators.required]),
DueDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OriginalAmount: new FormControl(0, [Validators.required]),
AllocatedAmount: new FormControl(0, [Validators.required]),
CreditAppliedAmount: new FormControl(0, [Validators.required]),
WriteOffAmount: new FormControl(0, [Validators.required]),
OutstandingAmount: new FormControl(0, [Validators.required]),
ReceivableStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DisputeHoldFlag: new FormControl(false, [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.billingorganisationidOptions.push({Text: 'BillingOrganisationId1', Value: 'BillingOrganisationId1' });
this.billingorganisationidOptions.push({Text: 'BillingOrganisationId2', Value: 'BillingOrganisationId2' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId1', Value: 'CustomerPartyId1' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId2', Value: 'CustomerPartyId2' });
this.sourcedocumenttypeOptions = this.loggedInUserService.getPicklistOptions('SourceDocumentType');
this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.receivablestatusOptions = this.loggedInUserService.getPicklistOptions('ReceivableStatus');
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
    this.receivableService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.receivable = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.receivable };
        this.populateUI(this.receivable);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IReceivable): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
SourceDocumentType: obj.SourceDocumentType || '',
SourceDocumentId: obj.SourceDocumentId || 0,
LeaseContractId: obj.LeaseContractId || 0,
DocumentNo: obj.DocumentNo || '',
DocumentDate:  obj.DocumentDate || new Date(),
DueDate:  obj.DueDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
OriginalAmount: obj.OriginalAmount || 0,
AllocatedAmount: obj.AllocatedAmount || 0,
CreditAppliedAmount: obj.CreditAppliedAmount || 0,
WriteOffAmount: obj.WriteOffAmount || 0,
OutstandingAmount: obj.OutstandingAmount || 0,
ReceivableStatus: obj.ReceivableStatus || '',
DisputeHoldFlag:  obj.DisputeHoldFlag || false,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "Receivable Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/receivables/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.receivable = { ...this.objMaster };
	var obj  = this.receivable;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
SourceDocumentType: obj.SourceDocumentType || '',
SourceDocumentId: obj.SourceDocumentId || 0,
LeaseContractId: obj.LeaseContractId || 0,
DocumentNo: obj.DocumentNo || '',
DocumentDate:  obj.DocumentDate || new Date(),
DueDate:  obj.DueDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
OriginalAmount: obj.OriginalAmount || 0,
AllocatedAmount: obj.AllocatedAmount || 0,
CreditAppliedAmount: obj.CreditAppliedAmount || 0,
WriteOffAmount: obj.WriteOffAmount || 0,
OutstandingAmount: obj.OutstandingAmount || 0,
ReceivableStatus: obj.ReceivableStatus || '',
DisputeHoldFlag:  obj.DisputeHoldFlag || false,
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
SourceDocumentType:  formValues.SourceDocumentType || null,
SourceDocumentId:  formValues.SourceDocumentId || null,
LeaseContractId:  formValues.LeaseContractId || null,
DocumentNo:  formValues.DocumentNo || null,
DocumentDate:  formValues.DocumentDate || null,
DueDate:  formValues.DueDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
OriginalAmount:  formValues.OriginalAmount || null,
AllocatedAmount:  formValues.AllocatedAmount || null,
CreditAppliedAmount:  formValues.CreditAppliedAmount || null,
WriteOffAmount:  formValues.WriteOffAmount || null,
OutstandingAmount:  formValues.OutstandingAmount || null,
ReceivableStatus:  formValues.ReceivableStatus || null,
DisputeHoldFlag:  formValues.DisputeHoldFlag || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IReceivable ;
	
	this.spinner.show();  	   
    this.receivableService.update(this.receivable.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(Receivable +  'Details Updated sucessfully.');
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
