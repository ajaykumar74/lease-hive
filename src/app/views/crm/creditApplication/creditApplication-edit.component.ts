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
import { ICreditApplication } from './creditApplication';
import { CreditApplicationService } from './creditApplication.service';


@Component({
  selector: 'app-creditApplication-edit',
  standalone: false,
  templateUrl: './creditApplication-edit.component.html',
  providers: [ MessageService]
})
export class CreditApplicationEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  creditApplication: ICreditApplication = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  opportunityidOptions: ISelectItem[] = [];
partyidOptions: ISelectItem[] = [];
originatingorganisationidOptions: ISelectItem[] = [];
creditapplicationstatusidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
risksegmentcodeOptions: ISelectItem[] = [];
assignedanalystuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ICreditApplication = {} as ICreditApplication;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private creditApplicationService: CreditApplicationService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.creditApplication };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
OpportunityId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OriginatingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CreditApplicationStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApplicationDate: new FormControl(new Date(), [Validators.required]),
RequestedLimitAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequestedTermMonths: new FormControl(0, [Validators.min(0), Validators.max(255)]),
RiskSegmentCode: new FormControl('', [Validators.maxLength(20), ]), 
AssignedAnalystUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
SubmittedOn: new FormControl(new Date(), []),
DecisionOn: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });

   this.opportunityidOptions.push({Text: 'OpportunityId1', Value: 'OpportunityId1' });
this.opportunityidOptions.push({Text: 'OpportunityId2', Value: 'OpportunityId2' });
this.partyidOptions.push({Text: 'Party1', Value: 'Party1' });
this.partyidOptions.push({Text: 'Party2', Value: 'Party2' });
this.originatingorganisationidOptions.push({Text: 'Org1', Value: 'Org1' });
this.originatingorganisationidOptions.push({Text: 'Org2', Value: 'Org2' });
this.creditapplicationstatusidOptions.push({Text: 'CreditStatus1', Value: 'CreditStatus1' });
this.creditapplicationstatusidOptions.push({Text: 'CreditStatus2', Value: 'CreditStatus2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.risksegmentcodeOptions.push({Text: '', Value: '' });
this.assignedanalystuseridOptions.push({Text: 'User1', Value: 'User1' });
this.assignedanalystuseridOptions.push({Text: 'User2', Value: 'User2' });
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
    this.creditApplicationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.creditApplication = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.creditApplication };
        this.populateUI(this.creditApplication);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ICreditApplication): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OpportunityId: obj.OpportunityId || 0,
PartyId: obj.PartyId || 0,
OriginatingOrganisationId: obj.OriginatingOrganisationId || 0,
CreditApplicationStatusId: obj.CreditApplicationStatusId || 0,
ApplicationDate:  obj.ApplicationDate || new Date(),
RequestedLimitAmount: obj.RequestedLimitAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
RequestedTermMonths: obj.RequestedTermMonths || 0,
RiskSegmentCode: obj.RiskSegmentCode || '',
AssignedAnalystUserId: obj.AssignedAnalystUserId || 0,
SubmittedOn:  obj.SubmittedOn || new Date(),
DecisionOn:  obj.DecisionOn || new Date(),
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "CreditApplication Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/origination/credit/applications/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.creditApplication = { ...this.objMaster };
	var obj  = this.creditApplication;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OpportunityId: obj.OpportunityId || 0,
PartyId: obj.PartyId || 0,
OriginatingOrganisationId: obj.OriginatingOrganisationId || 0,
CreditApplicationStatusId: obj.CreditApplicationStatusId || 0,
ApplicationDate:  obj.ApplicationDate || new Date(),
RequestedLimitAmount: obj.RequestedLimitAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
RequestedTermMonths: obj.RequestedTermMonths || 0,
RiskSegmentCode: obj.RiskSegmentCode || '',
AssignedAnalystUserId: obj.AssignedAnalystUserId || 0,
SubmittedOn:  obj.SubmittedOn || new Date(),
DecisionOn:  obj.DecisionOn || new Date(),
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
     OpportunityId:  formValues.OpportunityId || null,
PartyId:  formValues.PartyId || null,
OriginatingOrganisationId:  formValues.OriginatingOrganisationId || null,
CreditApplicationStatusId:  formValues.CreditApplicationStatusId || null,
ApplicationDate:  formValues.ApplicationDate || null,
RequestedLimitAmount:  formValues.RequestedLimitAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
RequestedTermMonths:  formValues.RequestedTermMonths || null,
RiskSegmentCode:  formValues.RiskSegmentCode || null,
AssignedAnalystUserId:  formValues.AssignedAnalystUserId || null,
SubmittedOn:  formValues.SubmittedOn || null,
DecisionOn:  formValues.DecisionOn || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as ICreditApplication ;
	
	this.spinner.show();  	   
    this.creditApplicationService.update(this.creditApplication.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(CreditApplication +  'Details Updated sucessfully.');
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
