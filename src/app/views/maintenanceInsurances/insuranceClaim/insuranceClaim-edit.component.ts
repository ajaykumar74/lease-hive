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
import { IInsuranceClaim } from './insuranceClaim';
import { InsuranceClaimService } from './insuranceClaim.service';


@Component({
  selector: 'app-insuranceClaim-edit',
  standalone: false,
  templateUrl: './insuranceClaim-edit.component.html',
  providers: [ MessageService]
})
export class InsuranceClaimEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  insuranceClaim: IInsuranceClaim = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insuranceincidentidOptions: ISelectItem[] = [];
insurancepolicyidOptions: ISelectItem[] = [];
insurancepolicyassetidOptions: ISelectItem[] = [];
insuranceclaimstatusidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IInsuranceClaim = {} as IInsuranceClaim;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private insuranceClaimService: InsuranceClaimService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.insuranceClaim };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ClaimNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
InsuranceIncidentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InsurancePolicyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InsurancePolicyAssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InsurerClaimReference: new FormControl('', [Validators.maxLength(50), ]), 
InsuranceClaimStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ClaimLodgedDate: new FormControl(new Date(), [Validators.required]),
ClaimedAmount: new FormControl(0, []),
ApprovedAmount: new FormControl(0, []),
DeductibleAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RejectionReason: new FormControl('', [Validators.maxLength(100), ]), 
ClosedDate: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.insuranceincidentidOptions.push({Text: 'InsuranceIncidentId1', Value: 'InsuranceIncidentId1' });
this.insuranceincidentidOptions.push({Text: 'InsuranceIncidentId2', Value: 'InsuranceIncidentId2' });
this.insurancepolicyidOptions.push({Text: 'InsurancePolicyId1', Value: 'InsurancePolicyId1' });
this.insurancepolicyidOptions.push({Text: 'InsurancePolicyId2', Value: 'InsurancePolicyId2' });
this.insurancepolicyassetidOptions.push({Text: 'InsurancePolicyAssetId1', Value: 'InsurancePolicyAssetId1' });
this.insurancepolicyassetidOptions.push({Text: 'InsurancePolicyAssetId2', Value: 'InsurancePolicyAssetId2' });
this.insuranceclaimstatusidOptions.push({Text: 'InsuranceClaimStatusId1', Value: 'InsuranceClaimStatusId1' });
this.insuranceclaimstatusidOptions.push({Text: 'InsuranceClaimStatusId2', Value: 'InsuranceClaimStatusId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.assignedtouseridOptions.push({Text: 'AssignedToUserId1', Value: 'AssignedToUserId1' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId2', Value: 'AssignedToUserId2' });
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
    this.insuranceClaimService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.insuranceClaim = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.insuranceClaim };
        this.populateUI(this.insuranceClaim);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IInsuranceClaim): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ClaimNo: obj.ClaimNo || '',
InsuranceIncidentId: obj.InsuranceIncidentId || 0,
InsurancePolicyId: obj.InsurancePolicyId || 0,
InsurancePolicyAssetId: obj.InsurancePolicyAssetId || 0,
InsurerClaimReference: obj.InsurerClaimReference || '',
InsuranceClaimStatusId: obj.InsuranceClaimStatusId || 0,
ClaimLodgedDate:  obj.ClaimLodgedDate || new Date(),
ClaimedAmount: obj.ClaimedAmount || 0,
ApprovedAmount: obj.ApprovedAmount || 0,
DeductibleAmount: obj.DeductibleAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
AssignedToUserId: obj.AssignedToUserId || 0,
RejectionReason: obj.RejectionReason || '',
ClosedDate:  obj.ClosedDate || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "InsuranceClaim Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/insurance/claims/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.insuranceClaim = { ...this.objMaster };
	var obj  = this.insuranceClaim;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ClaimNo: obj.ClaimNo || '',
InsuranceIncidentId: obj.InsuranceIncidentId || 0,
InsurancePolicyId: obj.InsurancePolicyId || 0,
InsurancePolicyAssetId: obj.InsurancePolicyAssetId || 0,
InsurerClaimReference: obj.InsurerClaimReference || '',
InsuranceClaimStatusId: obj.InsuranceClaimStatusId || 0,
ClaimLodgedDate:  obj.ClaimLodgedDate || new Date(),
ClaimedAmount: obj.ClaimedAmount || 0,
ApprovedAmount: obj.ApprovedAmount || 0,
DeductibleAmount: obj.DeductibleAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
AssignedToUserId: obj.AssignedToUserId || 0,
RejectionReason: obj.RejectionReason || '',
ClosedDate:  obj.ClosedDate || new Date(),
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
     ClaimNo:  formValues.ClaimNo || null,
InsuranceIncidentId:  formValues.InsuranceIncidentId || null,
InsurancePolicyId:  formValues.InsurancePolicyId || null,
InsurancePolicyAssetId:  formValues.InsurancePolicyAssetId || null,
InsurerClaimReference:  formValues.InsurerClaimReference || null,
InsuranceClaimStatusId:  formValues.InsuranceClaimStatusId || null,
ClaimLodgedDate:  formValues.ClaimLodgedDate || null,
ClaimedAmount:  formValues.ClaimedAmount || null,
ApprovedAmount:  formValues.ApprovedAmount || null,
DeductibleAmount:  formValues.DeductibleAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
AssignedToUserId:  formValues.AssignedToUserId || null,
RejectionReason:  formValues.RejectionReason || null,
ClosedDate:  formValues.ClosedDate || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IInsuranceClaim ;
	
	this.spinner.show();  	   
    this.insuranceClaimService.update(this.insuranceClaim.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InsuranceClaim +  'Details Updated sucessfully.');
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
