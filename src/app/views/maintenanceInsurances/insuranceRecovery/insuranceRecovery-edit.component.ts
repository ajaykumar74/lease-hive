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
import { IInsuranceRecovery } from './insuranceRecovery';
import { InsuranceRecoveryService } from './insuranceRecovery.service';


@Component({
  selector: 'app-insuranceRecovery-edit',
  standalone: false,
  templateUrl: './insuranceRecovery-edit.component.html',
  providers: [ MessageService]
})
export class InsuranceRecoveryEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  insuranceRecovery: IInsuranceRecovery = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insuranceclaimidOptions: ISelectItem[] = [];
recoverytypecodeOptions: ISelectItem[] = [];
recoverypartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
financereferenceidOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IInsuranceRecovery = {} as IInsuranceRecovery;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private insuranceRecoveryService: InsuranceRecoveryService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.insuranceRecovery };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
InsuranceClaimId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RecoveryTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecoveryPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ExpectedAmount: new FormControl(0, []),
RecoveredAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecoveryDate: new FormControl(new Date(), []),
FinanceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'InsuranceClaimId', 'insurance-claims',
      options => this.insuranceclaimidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.recoverytypecodeOptions = this.loggedInUserService.getPicklistOptions('RecoveryTypeCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'RecoveryPartyId', 'parties',
      options => this.recoverypartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.financereferenceidOptions.push({Text: 'FinanceReferenceId1', Value: 'FinanceReferenceId1' });
this.financereferenceidOptions.push({Text: 'FinanceReferenceId2', Value: 'FinanceReferenceId2' });
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('InsuranceRecoveryStatusCode');
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
    this.insuranceRecoveryService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.insuranceRecovery = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.insuranceRecovery };
        this.populateUI(this.insuranceRecovery);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IInsuranceRecovery): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsuranceClaimId: obj.InsuranceClaimId || 0,
RecoveryTypeCode: obj.RecoveryTypeCode || '',
RecoveryPartyId: obj.RecoveryPartyId || 0,
ExpectedAmount: obj.ExpectedAmount || 0,
RecoveredAmount: obj.RecoveredAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
RecoveryDate:  obj.RecoveryDate || new Date(),
FinanceReferenceId: obj.FinanceReferenceId || 0,
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "InsuranceRecovery Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/insurance/recoveries/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.insuranceRecovery = { ...this.objMaster };
	var obj  = this.insuranceRecovery;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsuranceClaimId: obj.InsuranceClaimId || 0,
RecoveryTypeCode: obj.RecoveryTypeCode || '',
RecoveryPartyId: obj.RecoveryPartyId || 0,
ExpectedAmount: obj.ExpectedAmount || 0,
RecoveredAmount: obj.RecoveredAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
RecoveryDate:  obj.RecoveryDate || new Date(),
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
     InsuranceClaimId:  formValues.InsuranceClaimId || 0,
RecoveryTypeCode:  formValues.RecoveryTypeCode || null,
RecoveryPartyId:  formValues.RecoveryPartyId || 0,
ExpectedAmount:  formValues.ExpectedAmount || 0,
RecoveredAmount:  formValues.RecoveredAmount || 0,
CurrencyCode:  formValues.CurrencyCode || null,
RecoveryDate:  formValues.RecoveryDate || null,
FinanceReferenceId:  formValues.FinanceReferenceId || 0,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IInsuranceRecovery ;
	
	this.spinner.show();  	   
    this.insuranceRecoveryService.update(this.insuranceRecovery.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InsuranceRecovery +  'Details Updated sucessfully.');
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
