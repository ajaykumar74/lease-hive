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
import { IInsuranceClaimSettlement } from './insuranceClaimSettlement';
import { InsuranceClaimSettlementService } from './insuranceClaimSettlement.service';


@Component({
  selector: 'app-insuranceClaimSettlement-edit',
  standalone: false,
  templateUrl: './insuranceClaimSettlement-edit.component.html',
  providers: [ MessageService]
})
export class InsuranceClaimSettlementEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  insuranceClaimSettlement: IInsuranceClaimSettlement = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insuranceclaimidOptions: ISelectItem[] = [];
settlementtypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
payeepartyidOptions: ISelectItem[] = [];
financereferenceidOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IInsuranceClaimSettlement = {} as IInsuranceClaimSettlement;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private insuranceClaimSettlementService: InsuranceClaimSettlementService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.insuranceClaimSettlement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
InsuranceClaimId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SettlementNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
SettlementTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SettlementDate: new FormControl(new Date(), [Validators.required]),
GrossSettlementAmount: new FormControl(0, [Validators.required]),
DeductibleAmount: new FormControl(0, []),
NetSettlementAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PayeePartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
FinanceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.insuranceclaimidOptions.push({Text: 'InsuranceClaimId1', Value: 'InsuranceClaimId1' });
this.insuranceclaimidOptions.push({Text: 'InsuranceClaimId2', Value: 'InsuranceClaimId2' });
this.settlementtypecodeOptions = this.loggedInUserService.getPicklistOptions('SettlementTypeCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.payeepartyidOptions.push({Text: 'PayeePartyId1', Value: 'PayeePartyId1' });
this.payeepartyidOptions.push({Text: 'PayeePartyId2', Value: 'PayeePartyId2' });
this.financereferenceidOptions.push({Text: 'FinanceReferenceId1', Value: 'FinanceReferenceId1' });
this.financereferenceidOptions.push({Text: 'FinanceReferenceId2', Value: 'FinanceReferenceId2' });
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('InsuranceClaimSettlementStatusCode');
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
    this.insuranceClaimSettlementService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.insuranceClaimSettlement = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.insuranceClaimSettlement };
        this.populateUI(this.insuranceClaimSettlement);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IInsuranceClaimSettlement): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsuranceClaimId: obj.InsuranceClaimId || 0,
SettlementNo: obj.SettlementNo || '',
SettlementTypeCode: obj.SettlementTypeCode || '',
SettlementDate:  obj.SettlementDate || new Date(),
GrossSettlementAmount: obj.GrossSettlementAmount || 0,
DeductibleAmount: obj.DeductibleAmount || 0,
NetSettlementAmount: obj.NetSettlementAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
PayeePartyId: obj.PayeePartyId || 0,
FinanceReferenceId: obj.FinanceReferenceId || 0,
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "InsuranceClaimSettlement Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/insurance/settlements/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.insuranceClaimSettlement = { ...this.objMaster };
	var obj  = this.insuranceClaimSettlement;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsuranceClaimId: obj.InsuranceClaimId || 0,
SettlementNo: obj.SettlementNo || '',
SettlementTypeCode: obj.SettlementTypeCode || '',
SettlementDate:  obj.SettlementDate || new Date(),
GrossSettlementAmount: obj.GrossSettlementAmount || 0,
DeductibleAmount: obj.DeductibleAmount || 0,
NetSettlementAmount: obj.NetSettlementAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
PayeePartyId: obj.PayeePartyId || 0,
FinanceReferenceId: obj.FinanceReferenceId || 0,
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
     InsuranceClaimId:  formValues.InsuranceClaimId || null,
SettlementNo:  formValues.SettlementNo || null,
SettlementTypeCode:  formValues.SettlementTypeCode || null,
SettlementDate:  formValues.SettlementDate || null,
GrossSettlementAmount:  formValues.GrossSettlementAmount || null,
DeductibleAmount:  formValues.DeductibleAmount || null,
NetSettlementAmount:  formValues.NetSettlementAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
PayeePartyId:  formValues.PayeePartyId || null,
FinanceReferenceId:  formValues.FinanceReferenceId || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IInsuranceClaimSettlement ;
	
	this.spinner.show();  	   
    this.insuranceClaimSettlementService.update(this.insuranceClaimSettlement.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InsuranceClaimSettlement +  'Details Updated sucessfully.');
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
