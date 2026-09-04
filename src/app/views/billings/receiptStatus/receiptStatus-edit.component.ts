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
import { IReceiptStatus } from './receiptStatus';
import { ReceiptStatusService } from './receiptStatus.service';


@Component({
  selector: 'app-receiptStatus-edit',
  standalone: false,
  templateUrl: './receiptStatus-edit.component.html',
  providers: [ MessageService]
})
export class ReceiptStatusEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  receiptStatus: IReceiptStatus = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IReceiptStatus = {} as IReceiptStatus;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private receiptStatusService: ReceiptStatusService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.receiptStatus };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StatusName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.statuscodeOptions.push({Text: 'RECEIVED', Value: 'RECEIVED' });
this.statuscodeOptions.push({Text: 'VERIFIED', Value: 'VERIFIED' });
this.statuscodeOptions.push({Text: 'PART_ALLOCATED', Value: 'PART_ALLOCATED' });
this.statuscodeOptions.push({Text: 'ALLOCATED', Value: 'ALLOCATED' });
this.statuscodeOptions.push({Text: 'REVERSED', Value: 'REVERSED' });
this.statuscodeOptions.push({Text: 'FAILED', Value: 'FAILED' });
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
    this.receiptStatusService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.receiptStatus = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.receiptStatus };
        this.populateUI(this.receiptStatus);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IReceiptStatus): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "ReceiptStatus Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/receiptStatus/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.receiptStatus = { ...this.objMaster };
	var obj  = this.receiptStatus;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
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
RecordStatus:  formValues.RecordStatus || null,

    } as IReceiptStatus ;
	
	this.spinner.show();  	   
    this.receiptStatusService.update(this.receiptStatus.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ReceiptStatus +  'Details Updated sucessfully.');
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
