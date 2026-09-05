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
import { IReturnAssessmentDamage } from './returnAssessmentDamage';
import { ReturnAssessmentDamageService } from './returnAssessmentDamage.service';


@Component({
  selector: 'app-returnAssessmentDamage-edit',
  standalone: false,
  templateUrl: './returnAssessmentDamage-edit.component.html',
  providers: [ MessageService]
})
export class ReturnAssessmentDamageEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  returnAssessmentDamage: IReturnAssessmentDamage = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  returnassessmentidOptions: ISelectItem[] = [];
inspectionitemreferenceidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IReturnAssessmentDamage = {} as IReturnAssessmentDamage;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private returnAssessmentDamageService: ReturnAssessmentDamageService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.returnAssessmentDamage };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReturnAssessmentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
InspectionItemReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DamageCode: new FormControl('', [Validators.maxLength(20), ]), 
DamageDescription: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
ChargeableFlag: new FormControl(false, [Validators.required]),
EstimatedRepairAmount: new FormControl(0, []),
ApprovedChargeAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
WaiverReason: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'ReturnAssessmentId', 'return-assessments',
      options => this.returnassessmentidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.inspectionitemreferenceidOptions.push({Text: 'InspectionItemReferenceId1', Value: 'InspectionItemReferenceId1' });
this.inspectionitemreferenceidOptions.push({Text: 'InspectionItemReferenceId2', Value: 'InspectionItemReferenceId2' });
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
    this.returnAssessmentDamageService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.returnAssessmentDamage = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.returnAssessmentDamage };
        this.populateUI(this.returnAssessmentDamage);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IReturnAssessmentDamage): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReturnAssessmentId: obj.ReturnAssessmentId || 0,
LineNo: obj.LineNo || 0,
InspectionItemReferenceId: obj.InspectionItemReferenceId || 0,
DamageCode: obj.DamageCode || '',
DamageDescription: obj.DamageDescription || '',
ChargeableFlag:  obj.ChargeableFlag || false,
EstimatedRepairAmount: obj.EstimatedRepairAmount || 0,
ApprovedChargeAmount: obj.ApprovedChargeAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
WaiverReason: obj.WaiverReason || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "ReturnAssessmentDamage Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/assessments/damages/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.returnAssessmentDamage = { ...this.objMaster };
	var obj  = this.returnAssessmentDamage;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReturnAssessmentId: obj.ReturnAssessmentId || 0,
LineNo: obj.LineNo || 0,
InspectionItemReferenceId: obj.InspectionItemReferenceId || 0,
DamageCode: obj.DamageCode || '',
DamageDescription: obj.DamageDescription || '',
ChargeableFlag:  obj.ChargeableFlag || false,
EstimatedRepairAmount: obj.EstimatedRepairAmount || 0,
ApprovedChargeAmount: obj.ApprovedChargeAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
WaiverReason: obj.WaiverReason || '',
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
LineNo:  formValues.LineNo || 0,
InspectionItemReferenceId:  formValues.InspectionItemReferenceId || 0,
DamageCode:  formValues.DamageCode || null,
DamageDescription:  formValues.DamageDescription || null,
ChargeableFlag:  formValues.ChargeableFlag || false,
EstimatedRepairAmount:  formValues.EstimatedRepairAmount || 0,
ApprovedChargeAmount:  formValues.ApprovedChargeAmount || 0,
CurrencyCode:  formValues.CurrencyCode || null,
WaiverReason:  formValues.WaiverReason || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IReturnAssessmentDamage ;
	
	this.spinner.show();  	   
    this.returnAssessmentDamageService.update(this.returnAssessmentDamage.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ReturnAssessmentDamage +  'Details Updated sucessfully.');
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
