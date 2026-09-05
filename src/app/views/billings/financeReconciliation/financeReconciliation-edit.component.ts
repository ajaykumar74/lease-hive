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
import { IFinanceReconciliation } from './financeReconciliation';
import { FinanceReconciliationService } from './financeReconciliation.service';


@Component({
  selector: 'app-financeReconciliation-edit',
  standalone: false,
  templateUrl: './financeReconciliation-edit.component.html',
  providers: [ MessageService]
})
export class FinanceReconciliationEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  financeReconciliation: IFinanceReconciliation = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  reconciliationtypeOptions: ISelectItem[] = [];
targettypeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
matchedbyuseridOptions: ISelectItem[] = [];
matchmethodOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IFinanceReconciliation = {} as IFinanceReconciliation;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private financeReconciliationService: FinanceReconciliationService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.financeReconciliation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReconciliationType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
SourceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
SourceId: new FormControl(0, [Validators.required, ]),
TargetType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
TargetId: new FormControl(0, [Validators.required, ]),
MatchedAmount: new FormControl(0, [Validators.required]),
ReconciliationDate: new FormControl(new Date(), [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
MatchedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MatchMethod: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.reconciliationtypeOptions = this.loggedInUserService.getPicklistOptions('ReconciliationType');
this.targettypeOptions = this.loggedInUserService.getPicklistOptions('TargetType');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('FinanceReconciliationStatusCode');
this.matchedbyuseridOptions.push({Text: 'MatchedByUserId1', Value: 'MatchedByUserId1' });
this.matchedbyuseridOptions.push({Text: 'MatchedByUserId2', Value: 'MatchedByUserId2' });
this.matchmethodOptions = this.loggedInUserService.getPicklistOptions('MatchMethod');
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
    this.financeReconciliationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.financeReconciliation = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.financeReconciliation };
        this.populateUI(this.financeReconciliation);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IFinanceReconciliation): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReconciliationType: obj.ReconciliationType || '',
SourceType: obj.SourceType || '',
SourceId: obj.SourceId || 0,
TargetType: obj.TargetType || '',
TargetId: obj.TargetId || 0,
MatchedAmount: obj.MatchedAmount || 0,
ReconciliationDate:  obj.ReconciliationDate || new Date(),
StatusCode: obj.StatusCode || '',
MatchedByUserId: obj.MatchedByUserId || 0,
MatchMethod: obj.MatchMethod || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "FinanceReconciliation Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/reconciliation/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.financeReconciliation = { ...this.objMaster };
	var obj  = this.financeReconciliation;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReconciliationType: obj.ReconciliationType || '',
SourceType: obj.SourceType || '',
SourceId: obj.SourceId || 0,
TargetType: obj.TargetType || '',
TargetId: obj.TargetId || 0,
MatchedAmount: obj.MatchedAmount || 0,
ReconciliationDate:  obj.ReconciliationDate || new Date(),
StatusCode: obj.StatusCode || '',
MatchedByUserId: obj.MatchedByUserId || 0,
MatchMethod: obj.MatchMethod || '',
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
     ReconciliationType:  formValues.ReconciliationType || null,
SourceType:  formValues.SourceType || null,
SourceId:  formValues.SourceId || null,
TargetType:  formValues.TargetType || null,
TargetId:  formValues.TargetId || null,
MatchedAmount:  formValues.MatchedAmount || null,
ReconciliationDate:  formValues.ReconciliationDate || null,
StatusCode:  formValues.StatusCode || null,
MatchedByUserId:  formValues.MatchedByUserId || null,
MatchMethod:  formValues.MatchMethod || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IFinanceReconciliation ;
	
	this.spinner.show();  	   
    this.financeReconciliationService.update(this.financeReconciliation.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(FinanceReconciliation +  'Details Updated sucessfully.');
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
