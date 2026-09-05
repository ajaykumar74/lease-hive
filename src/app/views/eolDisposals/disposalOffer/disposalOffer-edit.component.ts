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
import { IDisposalOffer } from './disposalOffer';
import { DisposalOfferService } from './disposalOffer.service';


@Component({
  selector: 'app-disposalOffer-edit',
  standalone: false,
  templateUrl: './disposalOffer-edit.component.html',
  providers: [ MessageService]
})
export class DisposalOfferEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  disposalOffer: IDisposalOffer = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalcaseidOptions: ISelectItem[] = [];
buyerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDisposalOffer = {} as IDisposalOffer;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private disposalOfferService: DisposalOfferService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.disposalOffer };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OfferNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
BuyerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OfferDate: new FormControl(new Date(), [Validators.required]),
OfferAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ValidUntil: new FormControl(new Date(), []),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.disposalcaseidOptions.push({Text: 'DisposalCaseId1', Value: 'DisposalCaseId1' });
this.disposalcaseidOptions.push({Text: 'DisposalCaseId2', Value: 'DisposalCaseId2' });
this.buyerpartyidOptions.push({Text: 'BuyerPartyId1', Value: 'BuyerPartyId1' });
this.buyerpartyidOptions.push({Text: 'BuyerPartyId2', Value: 'BuyerPartyId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('DisposalOfferStatusCode');
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
    this.disposalOfferService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.disposalOffer = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.disposalOffer };
        this.populateUI(this.disposalOffer);
      },
      error: err => { this.messageService.showSuccess(err); },
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
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "DisposalOffer Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/disposition/market/offers/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
OfferNo:  formValues.OfferNo || null,
BuyerPartyId:  formValues.BuyerPartyId || null,
OfferDate:  formValues.OfferDate || null,
OfferAmount:  formValues.OfferAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
ValidUntil:  formValues.ValidUntil || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IDisposalOffer ;
	
	this.spinner.show();  	   
    this.disposalOfferService.update(this.disposalOffer.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DisposalOffer +  'Details Updated sucessfully.');
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
