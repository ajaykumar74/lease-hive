import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-disposalAuction-create',
  standalone: false,
  templateUrl: './disposalAuction-create.component.html' ,
   providers: [ MessageService]
})
export class DisposalAuctionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalAuction: IDisposalAuction = null;
  disposalcaseidOptions: ISelectItem[] = [];
auctionproviderpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDisposalAuction = {} as IDisposalAuction;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private disposalAuctionService: DisposalAuctionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.disposalAuction };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
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
    this.Caption = 'Create DisposalAuction';
    this.disposalcaseidOptions.push({Text: 'DisposalCaseId1', Value: 'DisposalCaseId1' });
this.disposalcaseidOptions.push({Text: 'DisposalCaseId2', Value: 'DisposalCaseId2' });
this.auctionproviderpartyidOptions.push({Text: 'AuctionProviderPartyId1', Value: 'AuctionProviderPartyId1' });
this.auctionproviderpartyidOptions.push({Text: 'AuctionProviderPartyId2', Value: 'AuctionProviderPartyId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.statuscodeOptions.push({Text: 'PLANNED', Value: 'PLANNED' });
this.statuscodeOptions.push({Text: 'OPEN', Value: 'OPEN' });
this.statuscodeOptions.push({Text: 'CLOSED', Value: 'CLOSED' });
this.statuscodeOptions.push({Text: 'CANCELLED', Value: 'CANCELLED' });
this.statuscodeOptions.push({Text: 'AWARDED', Value: 'AWARDED' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.disposalAuctionService.getById(this.selectedId).subscribe({
      next: data => {
        this.disposalAuction = data;
        this.objMaster = { ...this.disposalAuction };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
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
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/disposalAuctions/create']);
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     DisposalCaseId: formValues.DisposalCaseId || 0,
AuctionNo: formValues.AuctionNo || null,
AuctionProviderPartyId: formValues.AuctionProviderPartyId || 0,
AuctionStartAt: formValues.AuctionStartAt || null,
AuctionEndAt: formValues.AuctionEndAt || null,
ReserveAmount: formValues.ReserveAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
StatusCode: formValues.StatusCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IDisposalAuction ; 
	
	  this.spinner.show(); 
    this.disposalAuctionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DisposalAuction +  'Details Updated sucessfully.');
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



