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
import { IInsurancePolicyAsset } from './insurancePolicyAsset';
import { InsurancePolicyAssetService } from './insurancePolicyAsset.service';


@Component({
  selector: 'app-insurancePolicyAsset-edit',
  standalone: false,
  templateUrl: './insurancePolicyAsset-edit.component.html',
  providers: [ MessageService]
})
export class InsurancePolicyAssetEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  insurancePolicyAsset: IInsurancePolicyAsset = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insurancepolicyidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
coveragetypeidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
beneficiarypartyidOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IInsurancePolicyAsset = {} as IInsurancePolicyAsset;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private insurancePolicyAssetService: InsurancePolicyAssetService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.insurancePolicyAsset };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
InsurancePolicyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CoverageTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CoverageStartDate: new FormControl(new Date(), [Validators.required]),
CoverageEndDate: new FormControl(new Date(), [Validators.required]),
InsuredValue: new FormControl(0, [Validators.required]),
DeductibleAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
BeneficiaryPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.insurancepolicyidOptions.push({Text: 'InsurancePolicyId1', Value: 'InsurancePolicyId1' });
this.insurancepolicyidOptions.push({Text: 'InsurancePolicyId2', Value: 'InsurancePolicyId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.coveragetypeidOptions.push({Text: 'CoverageTypeId1', Value: 'CoverageTypeId1' });
this.coveragetypeidOptions.push({Text: 'CoverageTypeId2', Value: 'CoverageTypeId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.beneficiarypartyidOptions.push({Text: 'BeneficiaryPartyId1', Value: 'BeneficiaryPartyId1' });
this.beneficiarypartyidOptions.push({Text: 'BeneficiaryPartyId2', Value: 'BeneficiaryPartyId2' });
this.statuscodeOptions.push({Text: 'ACTIVE', Value: 'ACTIVE' });
this.statuscodeOptions.push({Text: 'SUSPENDED', Value: 'SUSPENDED' });
this.statuscodeOptions.push({Text: 'REMOVED', Value: 'REMOVED' });
this.statuscodeOptions.push({Text: 'EXPIRED', Value: 'EXPIRED' });
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
    this.insurancePolicyAssetService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.insurancePolicyAsset = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.insurancePolicyAsset };
        this.populateUI(this.insurancePolicyAsset);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IInsurancePolicyAsset): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsurancePolicyId: obj.InsurancePolicyId || 0,
AssetId: obj.AssetId || 0,
LeaseContractId: obj.LeaseContractId || 0,
CoverageTypeId: obj.CoverageTypeId || 0,
CoverageStartDate:  obj.CoverageStartDate || new Date(),
CoverageEndDate:  obj.CoverageEndDate || new Date(),
InsuredValue: obj.InsuredValue || 0,
DeductibleAmount: obj.DeductibleAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
BeneficiaryPartyId: obj.BeneficiaryPartyId || 0,
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "InsurancePolicyAsset Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/insurance/policies/assets/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.insurancePolicyAsset = { ...this.objMaster };
	var obj  = this.insurancePolicyAsset;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsurancePolicyId: obj.InsurancePolicyId || 0,
AssetId: obj.AssetId || 0,
LeaseContractId: obj.LeaseContractId || 0,
CoverageTypeId: obj.CoverageTypeId || 0,
CoverageStartDate:  obj.CoverageStartDate || new Date(),
CoverageEndDate:  obj.CoverageEndDate || new Date(),
InsuredValue: obj.InsuredValue || 0,
DeductibleAmount: obj.DeductibleAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
BeneficiaryPartyId: obj.BeneficiaryPartyId || 0,
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
     InsurancePolicyId:  formValues.InsurancePolicyId || null,
AssetId:  formValues.AssetId || null,
LeaseContractId:  formValues.LeaseContractId || null,
CoverageTypeId:  formValues.CoverageTypeId || null,
CoverageStartDate:  formValues.CoverageStartDate || null,
CoverageEndDate:  formValues.CoverageEndDate || null,
InsuredValue:  formValues.InsuredValue || null,
DeductibleAmount:  formValues.DeductibleAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
BeneficiaryPartyId:  formValues.BeneficiaryPartyId || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IInsurancePolicyAsset ;
	
	this.spinner.show();  	   
    this.insurancePolicyAssetService.update(this.insurancePolicyAsset.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InsurancePolicyAsset +  'Details Updated sucessfully.');
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
