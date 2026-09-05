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
import { IJournalEntryLine } from './journalEntryLine';
import { JournalEntryLineService } from './journalEntryLine.service';


@Component({
  selector: 'app-journalEntryLine-edit',
  standalone: false,
  templateUrl: './journalEntryLine-edit.component.html',
  providers: [ MessageService]
})
export class JournalEntryLineEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  journalEntryLine: IJournalEntryLine = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
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


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private journalEntryLineService: JournalEntryLineService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.journalEntryLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.journalentryidOptions.push({Text: 'JournalEntryId1', Value: 'JournalEntryId1' });
this.journalentryidOptions.push({Text: 'JournalEntryId2', Value: 'JournalEntryId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.costcentreidOptions.push({Text: 'CostCentreId1', Value: 'CostCentreId1' });
this.costcentreidOptions.push({Text: 'CostCentreId2', Value: 'CostCentreId2' });
this.profitcentreidOptions.push({Text: 'ProfitCentreId1', Value: 'ProfitCentreId1' });
this.profitcentreidOptions.push({Text: 'ProfitCentreId2', Value: 'ProfitCentreId2' });
this.organisationunitidOptions.push({Text: 'OrganisationUnitId1', Value: 'OrganisationUnitId1' });
this.organisationunitidOptions.push({Text: 'OrganisationUnitId2', Value: 'OrganisationUnitId2' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId1', Value: 'CustomerPartyId1' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId2', Value: 'CustomerPartyId2' });
this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
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
    this.journalEntryLineService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.journalEntryLine = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.journalEntryLine };
        this.populateUI(this.journalEntryLine);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "JournalEntryLine Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/accounting/journals/lines/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     JournalEntryId:  formValues.JournalEntryId || null,
LineNo:  formValues.LineNo || null,
GLAccountCode:  formValues.GLAccountCode || null,
DebitAmount:  formValues.DebitAmount || null,
CreditAmount:  formValues.CreditAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
CostCentreId:  formValues.CostCentreId || null,
ProfitCentreId:  formValues.ProfitCentreId || null,
OrganisationUnitId:  formValues.OrganisationUnitId || null,
CustomerPartyId:  formValues.CustomerPartyId || null,
LeaseContractId:  formValues.LeaseContractId || null,
AssetId:  formValues.AssetId || null,
TaxCode:  formValues.TaxCode || null,
Narration:  formValues.Narration || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IJournalEntryLine ;
	
	this.spinner.show();  	   
    this.journalEntryLineService.update(this.journalEntryLine.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(JournalEntryLine +  'Details Updated sucessfully.');
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
