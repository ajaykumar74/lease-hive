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
import { IExcessUsageAssessment } from './excessUsageAssessment';
import { ExcessUsageAssessmentService } from './excessUsageAssessment.service';


@Component({
  selector: 'app-excessUsageAssessment-edit',
  standalone: false,
  templateUrl: './excessUsageAssessment-edit.component.html',
  providers: [ MessageService]
})
export class ExcessUsageAssessmentEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  excessUsageAssessment: IExcessUsageAssessment = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  returnassessmentidOptions: ISelectItem[] = [];
measuredefinitionidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IExcessUsageAssessment = {} as IExcessUsageAssessment;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private excessUsageAssessmentService: ExcessUsageAssessmentService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.excessUsageAssessment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReturnAssessmentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MeasureDefinitionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BaselineValue: new FormControl(0, []),
FinalValue: new FormControl(0, [Validators.required]),
AllowedUsageValue: new FormControl(0, [Validators.required]),
ActualUsageValue: new FormControl(0, [Validators.required]),
ExcessUsageValue: new FormControl(0, [Validators.required]),
RatePerUnit: new FormControl(0, []),
CalculatedAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'ReturnAssessmentId', 'return-assessments',
      options => this.returnassessmentidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'MeasureDefinitionId', 'asset-measure-definitions',
      options => this.measuredefinitionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
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
    this.excessUsageAssessmentService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.excessUsageAssessment = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.excessUsageAssessment };
        this.populateUI(this.excessUsageAssessment);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IExcessUsageAssessment): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReturnAssessmentId: obj.ReturnAssessmentId || 0,
MeasureDefinitionId: obj.MeasureDefinitionId || 0,
BaselineValue: obj.BaselineValue || 0,
FinalValue: obj.FinalValue || 0,
AllowedUsageValue: obj.AllowedUsageValue || 0,
ActualUsageValue: obj.ActualUsageValue || 0,
ExcessUsageValue: obj.ExcessUsageValue || 0,
RatePerUnit: obj.RatePerUnit || 0,
CalculatedAmount: obj.CalculatedAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "ExcessUsageAssessment Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/assessments/excess-usage/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.excessUsageAssessment = { ...this.objMaster };
	var obj  = this.excessUsageAssessment;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReturnAssessmentId: obj.ReturnAssessmentId || 0,
MeasureDefinitionId: obj.MeasureDefinitionId || 0,
BaselineValue: obj.BaselineValue || 0,
FinalValue: obj.FinalValue || 0,
AllowedUsageValue: obj.AllowedUsageValue || 0,
ActualUsageValue: obj.ActualUsageValue || 0,
ExcessUsageValue: obj.ExcessUsageValue || 0,
RatePerUnit: obj.RatePerUnit || 0,
CalculatedAmount: obj.CalculatedAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
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
     ReturnAssessmentId:  formValues.ReturnAssessmentId || 0,
MeasureDefinitionId:  formValues.MeasureDefinitionId || 0,
BaselineValue:  formValues.BaselineValue || 0,
FinalValue:  formValues.FinalValue || 0,
AllowedUsageValue:  formValues.AllowedUsageValue || 0,
ActualUsageValue:  formValues.ActualUsageValue || 0,
ExcessUsageValue:  formValues.ExcessUsageValue || 0,
RatePerUnit:  formValues.RatePerUnit || 0,
CalculatedAmount:  formValues.CalculatedAmount || 0,
CurrencyCode:  formValues.CurrencyCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IExcessUsageAssessment ;
	
	this.spinner.show();  	   
    this.excessUsageAssessmentService.update(this.excessUsageAssessment.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ExcessUsageAssessment +  'Details Updated sucessfully.');
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
