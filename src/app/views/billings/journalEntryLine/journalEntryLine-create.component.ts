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
import { IJournalEntryLine } from './journalEntryLine';
import { JournalEntryLineService } from './journalEntryLine.service';

@Component({
  selector: 'app-journalEntryLine-create',
  standalone: false,
  templateUrl: './journalEntryLine-create.component.html' ,
   providers: [ MessageService]
})
export class JournalEntryLineCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  journalEntryLine: IJournalEntryLine = null;
  journalentryidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
costcentreidOptions: ISelectItem[] = [];
profitcentreidOptions: ISelectItem[] = [];
organisationunitidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IJournalEntryLine = {} as IJournalEntryLine;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private journalEntryLineService: JournalEntryLineService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.journalEntryLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
JournalEntryId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
GLAccountCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DebitAmount: new FormControl(0, [Validators.required]),
CreditAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CostCentreId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ProfitCentreId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
TaxCode: new FormControl('', [Validators.maxLength(20), ]), 
Narration: new FormControl('', [Validators.maxLength(300), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create JournalEntryLine';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'JournalEntryId', 'journal-entries',
      options => this.journalentryidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'CostCentreId', 'cost-centres',
      options => this.costcentreidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"OrganisationUnitId":"OrganisationUnitId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'ProfitCentreId', 'profit-centres',
      options => this.profitcentreidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"OrganisationUnitId":"OrganisationUnitId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'OrganisationUnitId', 'organisation-units',
      options => this.organisationunitidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerPartyId', 'parties',
      options => this.customerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"CustomerPartyId":"CustomerPartyId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.journalEntryLineService.getById(this.selectedId).subscribe({
      next: data => {
        this.journalEntryLine = data;
        this.objMaster = { ...this.journalEntryLine };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IJournalEntryLine): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  JournalEntryId: obj.JournalEntryId || 0,
LineNo: obj.LineNo || 0,
GLAccountCode: obj.GLAccountCode || '',
DebitAmount: obj.DebitAmount || 0,
CreditAmount: obj.CreditAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
CostCentreId: obj.CostCentreId || 0,
ProfitCentreId: obj.ProfitCentreId || 0,
OrganisationUnitId: obj.OrganisationUnitId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
LeaseContractId: obj.LeaseContractId || 0,
AssetId: obj.AssetId || 0,
TaxCode: obj.TaxCode || '',
Narration: obj.Narration || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/journalEntryLines/create']);
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
    this.journalEntryLine = { ...this.objMaster };
    var obj  = this.journalEntryLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  JournalEntryId: obj.JournalEntryId || 0,
LineNo: obj.LineNo || 0,
GLAccountCode: obj.GLAccountCode || '',
DebitAmount: obj.DebitAmount || 0,
CreditAmount: obj.CreditAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
CostCentreId: obj.CostCentreId || 0,
ProfitCentreId: obj.ProfitCentreId || 0,
OrganisationUnitId: obj.OrganisationUnitId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
LeaseContractId: obj.LeaseContractId || 0,
AssetId: obj.AssetId || 0,
TaxCode: obj.TaxCode || '',
Narration: obj.Narration || '',
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
     JournalEntryId: formValues.JournalEntryId || 0,
LineNo: formValues.LineNo || null,
GLAccountCode: formValues.GLAccountCode || null,
DebitAmount: formValues.DebitAmount || 0,
CreditAmount: formValues.CreditAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
CostCentreId: formValues.CostCentreId || 0,
ProfitCentreId: formValues.ProfitCentreId || 0,
OrganisationUnitId: formValues.OrganisationUnitId || 0,
CustomerPartyId: formValues.CustomerPartyId || 0,
LeaseContractId: formValues.LeaseContractId || 0,
AssetId: formValues.AssetId || 0,
TaxCode: formValues.TaxCode || null,
Narration: formValues.Narration || null,
RecordStatus: formValues.RecordStatus || null,

    } as IJournalEntryLine ; 
	
	  this.spinner.show(); 
    this.journalEntryLineService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(JournalEntryLine +  'Details Updated sucessfully.');
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



