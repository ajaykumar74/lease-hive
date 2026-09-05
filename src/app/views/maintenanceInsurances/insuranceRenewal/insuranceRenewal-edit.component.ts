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
import { IInsuranceRenewal } from './insuranceRenewal';
import { InsuranceRenewalService } from './insuranceRenewal.service';


@Component({
  selector: 'app-insuranceRenewal-edit',
  standalone: false,
  templateUrl: './insuranceRenewal-edit.component.html',
  providers: [ MessageService]
})
export class InsuranceRenewalEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  insuranceRenewal: IInsuranceRenewal = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insurancepolicyidOptions: ISelectItem[] = [];
renewalstatuscodeOptions: ISelectItem[] = [];
proposedinsurerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
newinsurancepolicyidOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IInsuranceRenewal = {} as IInsuranceRenewal;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private insuranceRenewalService: InsuranceRenewalService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.insuranceRenewal };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
InsurancePolicyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RenewalDueDate: new FormControl(new Date(), [Validators.required]),
RenewalStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ProposedInsurerPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ProposedPremiumAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
NewInsurancePolicyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'InsurancePolicyId', 'insurance-policies',
      options => this.insurancepolicyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.renewalstatuscodeOptions = this.loggedInUserService.getPicklistOptions('RenewalStatusCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'ProposedInsurerPartyId', 'parties',
      options => this.proposedinsurerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'NewInsurancePolicyId', 'insurance-policies',
      options => this.newinsurancepolicyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssignedToUserId', 'application-users',
      options => this.assignedtouseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
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
    this.insuranceRenewalService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.insuranceRenewal = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.insuranceRenewal };
        this.populateUI(this.insuranceRenewal);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IInsuranceRenewal): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsurancePolicyId: obj.InsurancePolicyId || 0,
RenewalDueDate:  obj.RenewalDueDate || new Date(),
RenewalStatusCode: obj.RenewalStatusCode || '',
ProposedInsurerPartyId: obj.ProposedInsurerPartyId || 0,
ProposedPremiumAmount: obj.ProposedPremiumAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
NewInsurancePolicyId: obj.NewInsurancePolicyId || 0,
AssignedToUserId: obj.AssignedToUserId || 0,
Remarks: obj.Remarks || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "InsuranceRenewal Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/insurance/renewals/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.insuranceRenewal = { ...this.objMaster };
	var obj  = this.insuranceRenewal;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsurancePolicyId: obj.InsurancePolicyId || 0,
RenewalDueDate:  obj.RenewalDueDate || new Date(),
RenewalStatusCode: obj.RenewalStatusCode || '',
ProposedInsurerPartyId: obj.ProposedInsurerPartyId || 0,
ProposedPremiumAmount: obj.ProposedPremiumAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
NewInsurancePolicyId: obj.NewInsurancePolicyId || 0,
AssignedToUserId: obj.AssignedToUserId || 0,
Remarks: obj.Remarks || '',
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
     InsurancePolicyId:  formValues.InsurancePolicyId || null,
RenewalDueDate:  formValues.RenewalDueDate || null,
RenewalStatusCode:  formValues.RenewalStatusCode || null,
ProposedInsurerPartyId:  formValues.ProposedInsurerPartyId || null,
ProposedPremiumAmount:  formValues.ProposedPremiumAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
NewInsurancePolicyId:  formValues.NewInsurancePolicyId || null,
AssignedToUserId:  formValues.AssignedToUserId || null,
Remarks:  formValues.Remarks || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IInsuranceRenewal ;
	
	this.spinner.show();  	   
    this.insuranceRenewalService.update(this.insuranceRenewal.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InsuranceRenewal +  'Details Updated sucessfully.');
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
