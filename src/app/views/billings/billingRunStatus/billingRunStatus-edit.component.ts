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
import { IBillingRunStatus } from './billingRunStatus';
import { BillingRunStatusService } from './billingRunStatus.service';


@Component({
  selector: 'app-billingRunStatus-edit',
  standalone: false,
  templateUrl: './billingRunStatus-edit.component.html',
  providers: [ MessageService]
})
export class BillingRunStatusEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  billingRunStatus: IBillingRunStatus = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IBillingRunStatus = {} as IBillingRunStatus;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private billingRunStatusService: BillingRunStatusService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.billingRunStatus };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StatusName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
IsFinal: new FormControl(false, [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.statuscodeOptions.push({Text: 'DRAFT', Value: 'DRAFT' });
this.statuscodeOptions.push({Text: 'VALIDATED', Value: 'VALIDATED' });
this.statuscodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.statuscodeOptions.push({Text: 'PROCESSING', Value: 'PROCESSING' });
this.statuscodeOptions.push({Text: 'COMPLETED', Value: 'COMPLETED' });
this.statuscodeOptions.push({Text: 'FAILED', Value: 'FAILED' });
this.statuscodeOptions.push({Text: 'CANCELLED', Value: 'CANCELLED' });
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
    this.billingRunStatusService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.billingRunStatus = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.billingRunStatus };
        this.populateUI(this.billingRunStatus);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IBillingRunStatus): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
IsFinal:  obj.IsFinal || false,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "BillingRunStatus Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/configuration/billing-run-statuses/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.billingRunStatus = { ...this.objMaster };
	var obj  = this.billingRunStatus;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
IsFinal:  obj.IsFinal || false,
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
     StatusCode:  formValues.StatusCode || null,
StatusName:  formValues.StatusName || null,
IsFinal:  formValues.IsFinal || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IBillingRunStatus ;
	
	this.spinner.show();  	   
    this.billingRunStatusService.update(this.billingRunStatus.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(BillingRunStatus +  'Details Updated sucessfully.');
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
