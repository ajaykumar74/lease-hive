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
import { IDisposalBid } from './disposalBid';
import { DisposalBidService } from './disposalBid.service';

@Component({
  selector: 'app-disposalBid-create',
  standalone: false,
  templateUrl: './disposalBid-create.component.html' ,
   providers: [ MessageService]
})
export class DisposalBidCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalBid: IDisposalBid = null;
  disposalauctionidOptions: ISelectItem[] = [];
bidderpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
bidstatuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDisposalBid = {} as IDisposalBid;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private disposalBidService: DisposalBidService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.disposalBid };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DisposalAuctionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BidderPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BidAt: new FormControl(new Date(), [Validators.required]),
BidAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
QualifiedFlag: new FormControl(false, [Validators.required]),
BidStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.Caption = 'Create DisposalBid';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalAuctionId', 'disposal-auctions',
      options => this.disposalauctionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'BidderPartyId', 'parties',
      options => this.bidderpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.bidstatuscodeOptions = this.loggedInUserService.getPicklistOptions('BidStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.disposalBidService.getById(this.selectedId).subscribe({
      next: data => {
        this.disposalBid = data;
        this.objMaster = { ...this.disposalBid };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDisposalBid): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalAuctionId: obj.DisposalAuctionId || 0,
BidderPartyId: obj.BidderPartyId || 0,
BidAt:  obj.BidAt || new Date(),
BidAmount: obj.BidAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
QualifiedFlag:  obj.QualifiedFlag || false,
BidStatusCode: obj.BidStatusCode || '',
Remarks: obj.Remarks || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/disposalBids/create']);
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
    this.disposalBid = { ...this.objMaster };
    var obj  = this.disposalBid;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalAuctionId: obj.DisposalAuctionId || 0,
BidderPartyId: obj.BidderPartyId || 0,
BidAt:  obj.BidAt || new Date(),
BidAmount: obj.BidAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
QualifiedFlag:  obj.QualifiedFlag || false,
BidStatusCode: obj.BidStatusCode || '',
Remarks: obj.Remarks || '',
 
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
     DisposalAuctionId: formValues.DisposalAuctionId || 0,
BidderPartyId: formValues.BidderPartyId || 0,
BidAt: formValues.BidAt || null,
BidAmount: formValues.BidAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
QualifiedFlag: formValues.QualifiedFlag || false,
BidStatusCode: formValues.BidStatusCode || null,
Remarks: formValues.Remarks || null,
RecordStatus: 'Active',

    } as IDisposalBid ; 
	
	  this.spinner.show(); 
    this.disposalBidService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DisposalBid +  'Details Updated sucessfully.');
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



