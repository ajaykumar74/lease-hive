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
import { ICustomerStatementSnapshot } from './customerStatementSnapshot';
import { CustomerStatementSnapshotService } from './customerStatementSnapshot.service';


@Component({
  selector: 'app-customerStatementSnapshot-edit',
  standalone: false,
  templateUrl: './customerStatementSnapshot-edit.component.html',
  providers: [ MessageService]
})
export class CustomerStatementSnapshotEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  customerStatementSnapshot: ICustomerStatementSnapshot = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  billingorganisationidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ICustomerStatementSnapshot = {} as ICustomerStatementSnapshot;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private customerStatementSnapshotService: CustomerStatementSnapshotService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.customerStatementSnapshot };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StatementDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OpeningBalance: new FormControl(0, [Validators.required]),
DebitAmount: new FormControl(0, [Validators.required]),
CreditAmount: new FormControl(0, [Validators.required]),
ClosingBalance: new FormControl(0, [Validators.required]),
CurrentAmount: new FormControl(0, [Validators.required]),
Days1To30: new FormControl(0, [Validators.required]),
Days31To60: new FormControl(0, [Validators.required]),
Days61To90: new FormControl(0, [Validators.required]),
Days90Plus: new FormControl(0, [Validators.required]),
DocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'BillingOrganisationId', 'organisations',
      options => this.billingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerPartyId', 'parties',
      options => this.customerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
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
    this.customerStatementSnapshotService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.customerStatementSnapshot = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.customerStatementSnapshot };
        this.populateUI(this.customerStatementSnapshot);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ICustomerStatementSnapshot): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
StatementDate:  obj.StatementDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
OpeningBalance: obj.OpeningBalance || 0,
DebitAmount: obj.DebitAmount || 0,
CreditAmount: obj.CreditAmount || 0,
ClosingBalance: obj.ClosingBalance || 0,
CurrentAmount: obj.CurrentAmount || 0,
Days1To30: obj.Days1To30 || 0,
Days31To60: obj.Days31To60 || 0,
Days61To90: obj.Days61To90 || 0,
Days90Plus: obj.Days90Plus || 0,
DocumentId: obj.DocumentId || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "CustomerStatementSnapshot Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/customer-statements/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.customerStatementSnapshot = { ...this.objMaster };
	var obj  = this.customerStatementSnapshot;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
StatementDate:  obj.StatementDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
OpeningBalance: obj.OpeningBalance || 0,
DebitAmount: obj.DebitAmount || 0,
CreditAmount: obj.CreditAmount || 0,
ClosingBalance: obj.ClosingBalance || 0,
CurrentAmount: obj.CurrentAmount || 0,
Days1To30: obj.Days1To30 || 0,
Days31To60: obj.Days31To60 || 0,
Days61To90: obj.Days61To90 || 0,
Days90Plus: obj.Days90Plus || 0,
DocumentId: obj.DocumentId || 0,
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
     BillingOrganisationId:  formValues.BillingOrganisationId || 0,
CustomerPartyId:  formValues.CustomerPartyId || 0,
StatementDate:  formValues.StatementDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
OpeningBalance:  formValues.OpeningBalance || 0,
DebitAmount:  formValues.DebitAmount || 0,
CreditAmount:  formValues.CreditAmount || 0,
ClosingBalance:  formValues.ClosingBalance || 0,
CurrentAmount:  formValues.CurrentAmount || 0,
Days1To30:  formValues.Days1To30 || 0,
Days31To60:  formValues.Days31To60 || 0,
Days61To90:  formValues.Days61To90 || 0,
Days90Plus:  formValues.Days90Plus || 0,
DocumentId:  formValues.DocumentId || 0,
RecordStatus:  formValues.RecordStatus || null,

    } as ICustomerStatementSnapshot ;
	
	this.spinner.show();  	   
    this.customerStatementSnapshotService.update(this.customerStatementSnapshot.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(CustomerStatementSnapshot +  'Details Updated sucessfully.');
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
