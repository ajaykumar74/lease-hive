import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ICreditDecision } from './creditDecision';
import { CreditDecisionService } from './creditDecision.service';

@Component({
  selector: 'app-creditDecision-create',
  standalone: false,
  templateUrl: './creditDecision-create.component.html' ,
   providers: [ MessageService]
})
export class CreditDecisionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  creditDecision: ICreditDecision = null;
  creditapplicationidOptions: ISelectItem[] = [];
creditassessmentidOptions: ISelectItem[] = [];
decisioncodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
riskratingcodeOptions: ISelectItem[] = [];
decisionreasoncodeOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];
decidedbyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ICreditDecision = {} as ICreditDecision;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private creditDecisionService: CreditDecisionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.creditDecision };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
CreditApplicationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CreditAssessmentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DecisionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DecisionDateTime: new FormControl(new Date(), [Validators.required]),
ApprovedLimitAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
ApprovedTermMonths: new FormControl(0, [Validators.min(0), Validators.max(255)]),
RiskRatingCode: new FormControl('', [Validators.maxLength(20), ]), 
DecisionReasonCode: new FormControl('', [Validators.maxLength(20), ]), 
DecisionSummary: new FormControl('', [Validators.maxLength(100), ]), 
ValidUntil: new FormControl(new Date(), []),
ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DecidedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create CreditDecision';
    this.creditapplicationidOptions.push({Text: 'CreditApp1', Value: 'CreditApp1' });
this.creditapplicationidOptions.push({Text: 'CreditApp2', Value: 'CreditApp2' });
this.creditassessmentidOptions.push({Text: 'CreditAsses1', Value: 'CreditAsses1' });
this.creditassessmentidOptions.push({Text: 'CreditAsses2', Value: 'CreditAsses2' });
this.decisioncodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.decisioncodeOptions.push({Text: 'DECLINED', Value: 'DECLINED' });
this.decisioncodeOptions.push({Text: 'REFERRED', Value: 'REFERRED' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.riskratingcodeOptions.push({Text: 'A1', Value: 'A1' });
this.riskratingcodeOptions.push({Text: 'A2', Value: 'A2' });
this.riskratingcodeOptions.push({Text: 'A3', Value: 'A3' });
this.decisionreasoncodeOptions.push({Text: 'WITH_CONDITIONS', Value: 'WITH_CONDITIONS' });
this.approvalrequestidOptions.push({Text: 'AppUser1', Value: 'AppUser1' });
this.approvalrequestidOptions.push({Text: 'AppUser2', Value: 'AppUser2' });
this.decidedbyOptions.push({Text: 'AppUser1', Value: 'AppUser1' });
this.decidedbyOptions.push({Text: 'AppUser2', Value: 'AppUser2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.creditDecisionService.getById(this.selectedId).subscribe({
      next: data => {
        this.creditDecision = data;
        this.objMaster = { ...this.creditDecision };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ICreditDecision): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CreditApplicationId: obj.CreditApplicationId || 0,
CreditAssessmentId: obj.CreditAssessmentId || 0,
DecisionCode: obj.DecisionCode || '',
DecisionDateTime:  obj.DecisionDateTime || new Date(),
ApprovedLimitAmount: obj.ApprovedLimitAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ApprovedTermMonths: obj.ApprovedTermMonths || 0,
RiskRatingCode: obj.RiskRatingCode || '',
DecisionReasonCode: obj.DecisionReasonCode || '',
DecisionSummary: obj.DecisionSummary || '',
ValidUntil:  obj.ValidUntil || new Date(),
ApprovalRequestId: obj.ApprovalRequestId || 0,
DecidedBy: obj.DecidedBy || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/creditDecisions/create']);
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
    this.creditDecision = { ...this.objMaster };
    var obj  = this.creditDecision;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CreditApplicationId: obj.CreditApplicationId || 0,
CreditAssessmentId: obj.CreditAssessmentId || 0,
DecisionCode: obj.DecisionCode || '',
DecisionDateTime:  obj.DecisionDateTime || new Date(),
ApprovedLimitAmount: obj.ApprovedLimitAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ApprovedTermMonths: obj.ApprovedTermMonths || 0,
RiskRatingCode: obj.RiskRatingCode || '',
DecisionReasonCode: obj.DecisionReasonCode || '',
DecisionSummary: obj.DecisionSummary || '',
ValidUntil:  obj.ValidUntil || new Date(),
ApprovalRequestId: obj.ApprovalRequestId || 0,
DecidedBy: obj.DecidedBy || 0,
 
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
     CreditApplicationId: formValues.CreditApplicationId || 0,
CreditAssessmentId: formValues.CreditAssessmentId || 0,
DecisionCode: formValues.DecisionCode || null,
DecisionDateTime: formValues.DecisionDateTime || null,
ApprovedLimitAmount: formValues.ApprovedLimitAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
ApprovedTermMonths: formValues.ApprovedTermMonths || null,
RiskRatingCode: formValues.RiskRatingCode || null,
DecisionReasonCode: formValues.DecisionReasonCode || null,
DecisionSummary: formValues.DecisionSummary || null,
ValidUntil: formValues.ValidUntil || null,
ApprovalRequestId: formValues.ApprovalRequestId || 0,
DecidedBy: formValues.DecidedBy || 0,

    } as ICreditDecision ; 
	
	  this.spinner.show(); 
    this.creditDecisionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(CreditDecision +  'Details Updated sucessfully.');
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



