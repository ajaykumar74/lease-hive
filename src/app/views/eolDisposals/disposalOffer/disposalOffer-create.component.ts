import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IDisposalOffer } from './disposalOffer';
import { DisposalOfferService } from './disposalOffer.service';

@Component({
  selector: 'app-disposalOffer-create',
  standalone: false,
  templateUrl: './disposalOffer-create.component.html' ,
   providers: [ MessageService]
})
export class DisposalOfferCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalOffer: IDisposalOffer = null;
  disposalcaseidOptions: ISelectItem[] = [];
buyerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDisposalOffer = {} as IDisposalOffer;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private disposalOfferService: DisposalOfferService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.disposalOffer };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OfferNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
BuyerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OfferDate: new FormControl(new Date(), [Validators.required]),
OfferAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ValidUntil: new FormControl(new Date(), []),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create DisposalOffer';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalCaseId', 'disposal-cases',
      options => this.disposalcaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyerPartyId', 'parties',
      options => this.buyerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('DisposalOfferStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.disposalOfferService.getById(this.selectedId).subscribe({
      next: data => {
        this.disposalOffer = data;
        this.objMaster = { ...this.disposalOffer };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDisposalOffer): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
OfferNo: obj.OfferNo || '',
BuyerPartyId: obj.BuyerPartyId || 0,
OfferDate:  obj.OfferDate || new Date(),
OfferAmount: obj.OfferAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ValidUntil:  obj.ValidUntil || new Date(),
StatusCode: obj.StatusCode || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/disposalOffers/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
    else if (key == "Refresh") {
      this.loadUI();
    }
  }

  onCancel(): void {
    this.disposalOffer = { ...this.objMaster };
    var obj  = this.disposalOffer;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
OfferNo: obj.OfferNo || '',
BuyerPartyId: obj.BuyerPartyId || 0,
OfferDate:  obj.OfferDate || new Date(),
OfferAmount: obj.OfferAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ValidUntil:  obj.ValidUntil || new Date(),
StatusCode: obj.StatusCode || '',
 
      }
    );
    this.editForm.reset(); 
  } 

  Save(): void {    
   
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }	
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     DisposalCaseId: formValues.DisposalCaseId || 0,
OfferNo: formValues.OfferNo || null,
BuyerPartyId: formValues.BuyerPartyId || 0,
OfferDate: formValues.OfferDate || null,
OfferAmount: formValues.OfferAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
ValidUntil: formValues.ValidUntil || null,
StatusCode: formValues.StatusCode || null,
RecordStatus: 'Active',

    } as IDisposalOffer ; 
	
	  this.spinner.show(); 
    this.disposalOfferService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DisposalOffer +  'Details Updated sucessfully.');
		 this._location.back();     
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

}



