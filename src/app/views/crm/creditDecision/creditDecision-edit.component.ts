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
import { ICreditDecision } from './creditDecision';
import { CreditDecisionService } from './creditDecision.service';


@Component({
  selector: 'app-creditDecision-edit',
  standalone: false,
  templateUrl: './creditDecision-edit.component.html',
  providers: [ MessageService]
})
export class CreditDecisionEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  creditDecision: ICreditDecision = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
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


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private creditDecisionService: CreditDecisionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.creditDecision };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.creditDecisionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.creditDecision = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.creditDecision };
        this.populateUI(this.creditDecision);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "CreditDecision Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['origination/credit/decision/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     CreditApplicationId:  formValues.CreditApplicationId || null,
CreditAssessmentId:  formValues.CreditAssessmentId || null,
DecisionCode:  formValues.DecisionCode || null,
DecisionDateTime:  formValues.DecisionDateTime || null,
ApprovedLimitAmount:  formValues.ApprovedLimitAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
ApprovedTermMonths:  formValues.ApprovedTermMonths || null,
RiskRatingCode:  formValues.RiskRatingCode || null,
DecisionReasonCode:  formValues.DecisionReasonCode || null,
DecisionSummary:  formValues.DecisionSummary || null,
ValidUntil:  formValues.ValidUntil || null,
ApprovalRequestId:  formValues.ApprovalRequestId || null,
DecidedBy:  formValues.DecidedBy || null,

    } as ICreditDecision ;
	
	this.spinner.show();  	   
    this.creditDecisionService.update(this.creditDecision.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(CreditDecision +  'Details Updated sucessfully.');
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
