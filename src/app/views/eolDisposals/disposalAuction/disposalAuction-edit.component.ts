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
import { IDisposalAuction } from './disposalAuction';
import { DisposalAuctionService } from './disposalAuction.service';


@Component({
  selector: 'app-disposalAuction-edit',
  standalone: false,
  templateUrl: './disposalAuction-edit.component.html',
  providers: [ MessageService]
})
export class DisposalAuctionEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  disposalAuction: IDisposalAuction = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalcaseidOptions: ISelectItem[] = [];
auctionproviderpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDisposalAuction = {} as IDisposalAuction;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private disposalAuctionService: DisposalAuctionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.disposalAuction };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AuctionNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
AuctionProviderPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AuctionStartAt: new FormControl(new Date(), [Validators.required]),
AuctionEndAt: new FormControl(new Date(), [Validators.required]),
ReserveAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalCaseId', 'disposal-cases',
      options => this.disposalcaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AuctionProviderPartyId', 'parties',
      options => this.auctionproviderpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('DisposalAuctionStatusCode');
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
    this.disposalAuctionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.disposalAuction = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.disposalAuction };
        this.populateUI(this.disposalAuction);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IDisposalAuction): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AuctionNo: obj.AuctionNo || '',
AuctionProviderPartyId: obj.AuctionProviderPartyId || 0,
AuctionStartAt:  obj.AuctionStartAt || new Date(),
AuctionEndAt:  obj.AuctionEndAt || new Date(),
ReserveAmount: obj.ReserveAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "DisposalAuction Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/disposition/market/auctions/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.disposalAuction = { ...this.objMaster };
	var obj  = this.disposalAuction;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AuctionNo: obj.AuctionNo || '',
AuctionProviderPartyId: obj.AuctionProviderPartyId || 0,
AuctionStartAt:  obj.AuctionStartAt || new Date(),
AuctionEndAt:  obj.AuctionEndAt || new Date(),
ReserveAmount: obj.ReserveAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
StatusCode: obj.StatusCode || '',
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
     DisposalCaseId:  formValues.DisposalCaseId || null,
AuctionNo:  formValues.AuctionNo || null,
AuctionProviderPartyId:  formValues.AuctionProviderPartyId || null,
AuctionStartAt:  formValues.AuctionStartAt || null,
AuctionEndAt:  formValues.AuctionEndAt || null,
ReserveAmount:  formValues.ReserveAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IDisposalAuction ;
	
	this.spinner.show();  	   
    this.disposalAuctionService.update(this.disposalAuction.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DisposalAuction +  'Details Updated sucessfully.');
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
