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
import { IJournalEntry } from './journalEntry';
import { JournalEntryService } from './journalEntry.service';


@Component({
  selector: 'app-journalEntry-edit',
  standalone: false,
  templateUrl: './journalEntry-edit.component.html',
  providers: [ MessageService]
})
export class JournalEntryEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  journalEntry: IJournalEntry = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  organisationidOptions: ISelectItem[] = [];
sourcemoduleOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
postingstatusOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IJournalEntry = {} as IJournalEntry;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private journalEntryService: JournalEntryService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.journalEntry };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
JournalDate: new FormControl(new Date(), [Validators.required]),
PeriodCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SourceModule: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TotalDebit: new FormControl(0, [Validators.required]),
TotalCredit: new FormControl(0, [Validators.required]),
PostingStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ExternalJournalRef: new FormControl('', [Validators.maxLength(100), ]), 
PostedAtUtc: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.organisationidOptions.push({Text: 'OrganisationId1', Value: 'OrganisationId1' });
this.organisationidOptions.push({Text: 'OrganisationId2', Value: 'OrganisationId2' });
this.sourcemoduleOptions.push({Text: 'BILLING', Value: 'BILLING' });
this.sourcemoduleOptions.push({Text: 'AR', Value: 'AR' });
this.sourcemoduleOptions.push({Text: 'AP', Value: 'AP' });
this.sourcemoduleOptions.push({Text: 'DEPOSIT', Value: 'DEPOSIT' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.postingstatusOptions.push({Text: 'DRAFT', Value: 'DRAFT' });
this.postingstatusOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.postingstatusOptions.push({Text: 'POSTED', Value: 'POSTED' });
this.postingstatusOptions.push({Text: 'FAILED', Value: 'FAILED' });
this.postingstatusOptions.push({Text: 'REVERSED', Value: 'REVERSED' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.journalEntryService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.journalEntry = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.journalEntry };
        this.populateUI(this.journalEntry);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IJournalEntry): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationId: obj.OrganisationId || 0,
JournalDate:  obj.JournalDate || new Date(),
PeriodCode: obj.PeriodCode || '',
SourceModule: obj.SourceModule || '',
CurrencyCode: obj.CurrencyCode || '',
TotalDebit: obj.TotalDebit || 0,
TotalCredit: obj.TotalCredit || 0,
PostingStatus: obj.PostingStatus || '',
ExternalJournalRef: obj.ExternalJournalRef || '',
PostedAtUtc:  obj.PostedAtUtc || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "JournalEntry Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/accounting/journals/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.journalEntry = { ...this.objMaster };
	var obj  = this.journalEntry;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationId: obj.OrganisationId || 0,
JournalDate:  obj.JournalDate || new Date(),
PeriodCode: obj.PeriodCode || '',
SourceModule: obj.SourceModule || '',
CurrencyCode: obj.CurrencyCode || '',
TotalDebit: obj.TotalDebit || 0,
TotalCredit: obj.TotalCredit || 0,
PostingStatus: obj.PostingStatus || '',
ExternalJournalRef: obj.ExternalJournalRef || '',
PostedAtUtc:  obj.PostedAtUtc || new Date(),
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
JournalDate:  formValues.JournalDate || null,
PeriodCode:  formValues.PeriodCode || null,
SourceModule:  formValues.SourceModule || null,
CurrencyCode:  formValues.CurrencyCode || null,
TotalDebit:  formValues.TotalDebit || null,
TotalCredit:  formValues.TotalCredit || null,
PostingStatus:  formValues.PostingStatus || null,
ExternalJournalRef:  formValues.ExternalJournalRef || null,
PostedAtUtc:  formValues.PostedAtUtc || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IJournalEntry ;
	
	this.spinner.show();  	   
    this.journalEntryService.update(this.journalEntry.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(JournalEntry +  'Details Updated sucessfully.');
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
