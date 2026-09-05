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
import { IDisposalAward } from './disposalAward';
import { DisposalAwardService } from './disposalAward.service';


@Component({
  selector: 'app-disposalAward-edit',
  standalone: false,
  templateUrl: './disposalAward-edit.component.html',
  providers: [ MessageService]
})
export class DisposalAwardEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  disposalAward: IDisposalAward = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalcaseidOptions: ISelectItem[] = [];
awardsourcecodeOptions: ISelectItem[] = [];
disposalofferidOptions: ISelectItem[] = [];
disposalbididOptions: ISelectItem[] = [];
buyerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
approvedbyuseridOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDisposalAward = {} as IDisposalAward;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private disposalAwardService: DisposalAwardService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.disposalAward };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AwardSourceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DisposalOfferId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DisposalBidId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
BuyerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AwardAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AwardedAt: new FormControl(new Date(), [Validators.required]),
ApprovedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalCaseId', 'disposal-cases',
      options => this.disposalcaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.awardsourcecodeOptions = this.loggedInUserService.getPicklistOptions('AwardSourceCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalOfferId', 'disposal-offers',
      options => this.disposalofferidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"DisposalCaseId":"DisposalCaseId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalBidId', 'disposal-bids',
      options => this.disposalbididOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyerPartyId', 'parties',
      options => this.buyerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovedByUserId', 'application-users',
      options => this.approvedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('DisposalAwardStatusCode');
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
    this.disposalAwardService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.disposalAward = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.disposalAward };
        this.populateUI(this.disposalAward);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IDisposalAward): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AwardSourceCode: obj.AwardSourceCode || '',
DisposalOfferId: obj.DisposalOfferId || 0,
DisposalBidId: obj.DisposalBidId || 0,
BuyerPartyId: obj.BuyerPartyId || 0,
AwardAmount: obj.AwardAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
AwardedAt:  obj.AwardedAt || new Date(),
ApprovedByUserId: obj.ApprovedByUserId || 0,
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "DisposalAward Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/disposition/market/awards/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.disposalAward = { ...this.objMaster };
	var obj  = this.disposalAward;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AwardSourceCode: obj.AwardSourceCode || '',
DisposalOfferId: obj.DisposalOfferId || 0,
DisposalBidId: obj.DisposalBidId || 0,
BuyerPartyId: obj.BuyerPartyId || 0,
AwardAmount: obj.AwardAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
AwardedAt:  obj.AwardedAt || new Date(),
ApprovedByUserId: obj.ApprovedByUserId || 0,
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
AwardSourceCode:  formValues.AwardSourceCode || null,
DisposalOfferId:  formValues.DisposalOfferId || null,
DisposalBidId:  formValues.DisposalBidId || null,
BuyerPartyId:  formValues.BuyerPartyId || null,
AwardAmount:  formValues.AwardAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
AwardedAt:  formValues.AwardedAt || null,
ApprovedByUserId:  formValues.ApprovedByUserId || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IDisposalAward ;
	
	this.spinner.show();  	   
    this.disposalAwardService.update(this.disposalAward.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DisposalAward +  'Details Updated sucessfully.');
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
