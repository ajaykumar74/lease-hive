import { Component, DestroyRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IQuoteService } from './quoteService';
import { QuoteServiceService } from './quoteService.service';


@Component({
  selector: 'app-quoteService-edit',
  standalone: false,
  templateUrl: './quoteService-edit.component.html',
  providers: [ MessageService]
})
export class QuoteServiceEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  quoteService: IQuoteService = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  quoteidOptions: ISelectItem[] = [];
quoteassetidOptions: ISelectItem[] = [];
leaseserviceidOptions: ISelectItem[] = [];
chargefrequencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IQuoteService = {} as IQuoteService;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private quoteServiceService: QuoteServiceService, 
	private loggedInUserService : LoggedInUserService,
    private destroyRef: DestroyRef
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.quoteService };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
QuoteAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseServiceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
IsIncluded: new FormControl(false, [Validators.required]),
IsSeparatelyChargeable: new FormControl(false, [Validators.required]),
ChargeFrequencyCode: new FormControl('', [Validators.maxLength(20), ]), 
UnitAmount: new FormControl(0, []),
Quantity: new FormControl(0, [Validators.required]),
ServiceTerms: new FormControl('', [Validators.maxLength(1000), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'QuoteId', 'quotes', options => this.quoteidOptions = options, error => this.messageService?.showError(error), this.destroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'QuoteAssetId', 'quote-assets', options => this.quoteassetidOptions = options, error => this.messageService?.showError(error), this.destroyRef, { QuoteId: 'QuoteId' });
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseServiceId', 'lease-services', options => this.leaseserviceidOptions = options, error => this.messageService?.showError(error), this.destroyRef);
this.chargefrequencycodeOptions = this.loggedInUserService.getPicklistOptions('ChargeFrequencyCode');
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
    this.quoteServiceService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.quoteService = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.quoteService };
        this.populateUI(this.quoteService);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IQuoteService): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  QuoteId: obj.QuoteId || 0,
QuoteAssetId: obj.QuoteAssetId || 0,
LeaseServiceId: obj.LeaseServiceId || 0,
IsIncluded:  obj.IsIncluded || false,
IsSeparatelyChargeable:  obj.IsSeparatelyChargeable || false,
ChargeFrequencyCode: obj.ChargeFrequencyCode || '',
UnitAmount: obj.UnitAmount || 0,
Quantity: obj.Quantity || 0,
ServiceTerms: obj.ServiceTerms || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "QuoteService Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/origination/quotes/services/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.quoteService = { ...this.objMaster };
	var obj  = this.quoteService;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  QuoteId: obj.QuoteId || 0,
QuoteAssetId: obj.QuoteAssetId || 0,
LeaseServiceId: obj.LeaseServiceId || 0,
IsIncluded:  obj.IsIncluded || false,
IsSeparatelyChargeable:  obj.IsSeparatelyChargeable || false,
ChargeFrequencyCode: obj.ChargeFrequencyCode || '',
UnitAmount: obj.UnitAmount || 0,
Quantity: obj.Quantity || 0,
ServiceTerms: obj.ServiceTerms || '',
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
     QuoteId:  formValues.QuoteId || null,
QuoteAssetId:  formValues.QuoteAssetId || null,
LeaseServiceId:  formValues.LeaseServiceId || null,
IsIncluded:  formValues.IsIncluded || null,
IsSeparatelyChargeable:  formValues.IsSeparatelyChargeable || null,
ChargeFrequencyCode:  formValues.ChargeFrequencyCode || null,
UnitAmount:  formValues.UnitAmount || null,
Quantity:  formValues.Quantity || null,
ServiceTerms:  formValues.ServiceTerms || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IQuoteService ;
	
	this.spinner.show();  	   
    this.quoteServiceService.update(this.quoteService.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(QuoteService +  'Details Updated sucessfully.');
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
