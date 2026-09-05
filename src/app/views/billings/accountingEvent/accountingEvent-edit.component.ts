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
import { IAccountingEvent } from './accountingEvent';
import { AccountingEventService } from './accountingEvent.service';


@Component({
  selector: 'app-accountingEvent-edit',
  standalone: false,
  templateUrl: './accountingEvent-edit.component.html',
  providers: [ MessageService]
})
export class AccountingEventEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  accountingEvent: IAccountingEvent = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  organisationidOptions: ISelectItem[] = [];
eventtypeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
postingstatusOptions: ISelectItem[] = [];
journalentryidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAccountingEvent = {} as IAccountingEvent;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private accountingEventService: AccountingEventService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.accountingEvent };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EventType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
SourceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
SourceId: new FormControl(0, [Validators.required, ]),
EventDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EventAmount: new FormControl(0, [Validators.required]),
PostingStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AccountingRuleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
JournalEntryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ErrorMessage: new FormControl('', [Validators.maxLength(1000), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.organisationidOptions.push({Text: 'OrganisationId1', Value: 'OrganisationId1' });
this.organisationidOptions.push({Text: 'OrganisationId2', Value: 'OrganisationId2' });
this.eventtypeOptions = this.loggedInUserService.getPicklistOptions('EventType');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.postingstatusOptions = this.loggedInUserService.getPicklistOptions('AccountingEventPostingStatus');
this.journalentryidOptions.push({Text: 'JournalEntryId1', Value: 'JournalEntryId1' });
this.journalentryidOptions.push({Text: 'JournalEntryId2', Value: 'JournalEntryId2' });
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
    this.accountingEventService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.accountingEvent = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.accountingEvent };
        this.populateUI(this.accountingEvent);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAccountingEvent): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationId: obj.OrganisationId || 0,
EventType: obj.EventType || '',
SourceType: obj.SourceType || '',
SourceId: obj.SourceId || 0,
EventDate:  obj.EventDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
EventAmount: obj.EventAmount || 0,
PostingStatus: obj.PostingStatus || '',
AccountingRuleCode: obj.AccountingRuleCode || '',
JournalEntryId: obj.JournalEntryId || 0,
ErrorMessage: obj.ErrorMessage || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AccountingEvent Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/accounting/events/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.accountingEvent = { ...this.objMaster };
	var obj  = this.accountingEvent;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationId: obj.OrganisationId || 0,
EventType: obj.EventType || '',
SourceType: obj.SourceType || '',
SourceId: obj.SourceId || 0,
EventDate:  obj.EventDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
EventAmount: obj.EventAmount || 0,
PostingStatus: obj.PostingStatus || '',
AccountingRuleCode: obj.AccountingRuleCode || '',
JournalEntryId: obj.JournalEntryId || 0,
ErrorMessage: obj.ErrorMessage || '',
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
     OrganisationId:  formValues.OrganisationId || null,
EventType:  formValues.EventType || null,
SourceType:  formValues.SourceType || null,
SourceId:  formValues.SourceId || null,
EventDate:  formValues.EventDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
EventAmount:  formValues.EventAmount || null,
PostingStatus:  formValues.PostingStatus || null,
AccountingRuleCode:  formValues.AccountingRuleCode || null,
JournalEntryId:  formValues.JournalEntryId || null,
ErrorMessage:  formValues.ErrorMessage || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAccountingEvent ;
	
	this.spinner.show();  	   
    this.accountingEventService.update(this.accountingEvent.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AccountingEvent +  'Details Updated sucessfully.');
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
