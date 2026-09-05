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
import { IDisposalBid } from './disposalBid';
import { DisposalBidService } from './disposalBid.service';


@Component({
  selector: 'app-disposalBid-edit',
  standalone: false,
  templateUrl: './disposalBid-edit.component.html',
  providers: [ MessageService]
})
export class DisposalBidEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  disposalBid: IDisposalBid = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalauctionidOptions: ISelectItem[] = [];
bidderpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
bidstatuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDisposalBid = {} as IDisposalBid;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private disposalBidService: DisposalBidService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.disposalBid };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DisposalAuctionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BidderPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BidAt: new FormControl(new Date(), [Validators.required]),
BidAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
QualifiedFlag: new FormControl(false, [Validators.required]),
BidStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalAuctionId', 'disposal-auctions',
      options => this.disposalauctionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'BidderPartyId', 'parties',
      options => this.bidderpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.bidstatuscodeOptions = this.loggedInUserService.getPicklistOptions('BidStatusCode');
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
    this.disposalBidService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.disposalBid = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.disposalBid };
        this.populateUI(this.disposalBid);
      },
      error: err => { this.messageService.showSuccess(err); },
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
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "DisposalBid Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/disposition/market/bids/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
     DisposalAuctionId:  formValues.DisposalAuctionId || null,
BidderPartyId:  formValues.BidderPartyId || null,
BidAt:  formValues.BidAt || null,
BidAmount:  formValues.BidAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
QualifiedFlag:  formValues.QualifiedFlag || null,
BidStatusCode:  formValues.BidStatusCode || null,
Remarks:  formValues.Remarks || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IDisposalBid ;
	
	this.spinner.show();  	   
    this.disposalBidService.update(this.disposalBid.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DisposalBid +  'Details Updated sucessfully.');
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
