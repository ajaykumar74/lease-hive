import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IRFQ } from './rFQ';
import { RFQService } from './rFQ.service';


@Component({
  selector: 'app-rFQ-edit',
  standalone: false,
  templateUrl: './rFQ-edit.component.html',
  providers: [ MessageService]
})
export class RFQEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  rFQ: IRFQ = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  purchaserequisitionidOptions: ISelectItem[] = [];
buyingorganisationidOptions: ISelectItem[] = [];
rfqstatuscodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IRFQ = {} as IRFQ;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private rFQService: RFQService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.rFQ };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
RFQNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
PurchaseRequisitionId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RFQStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IssueDateTime: new FormControl(new Date(), []),
ResponseDueDateTime: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
CommercialTerms: new FormControl('', [Validators.maxLength(2000), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyingOrganisationId', 'organisations',
      options => this.buyingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseRequisitionId', 'purchase-requisitions',
      options => this.purchaserequisitionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.rfqstatuscodeOptions = this.loggedInUserService.getPicklistOptions('RFQStatusCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
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
    this.rFQService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.rFQ = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.rFQ };
        this.populateUI(this.rFQ);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IRFQ): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQNo: obj.RFQNo || '',
PurchaseRequisitionId: obj.PurchaseRequisitionId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RFQStatusCode: obj.RFQStatusCode || '',
IssueDateTime:  obj.IssueDateTime || new Date(),
ResponseDueDateTime:  obj.ResponseDueDateTime || new Date(),
CurrencyCode: obj.CurrencyCode || '',
CommercialTerms: obj.CommercialTerms || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "RFQ Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/rfqs/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.rFQ = { ...this.objMaster };
	var obj  = this.rFQ;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQNo: obj.RFQNo || '',
PurchaseRequisitionId: obj.PurchaseRequisitionId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RFQStatusCode: obj.RFQStatusCode || '',
IssueDateTime:  obj.IssueDateTime || new Date(),
ResponseDueDateTime:  obj.ResponseDueDateTime || new Date(),
CurrencyCode: obj.CurrencyCode || '',
CommercialTerms: obj.CommercialTerms || '',
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
     RFQNo:  formValues.RFQNo || null,
PurchaseRequisitionId:  formValues.PurchaseRequisitionId || 0,
BuyingOrganisationId:  formValues.BuyingOrganisationId || 0,
RFQStatusCode:  formValues.RFQStatusCode || null,
IssueDateTime:  formValues.IssueDateTime || null,
ResponseDueDateTime:  formValues.ResponseDueDateTime || null,
CurrencyCode:  formValues.CurrencyCode || null,
CommercialTerms:  formValues.CommercialTerms || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IRFQ ;
	
	this.spinner.show();  	   
    this.rFQService.update(this.rFQ.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(RFQ +  'Details Updated sucessfully.');
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
