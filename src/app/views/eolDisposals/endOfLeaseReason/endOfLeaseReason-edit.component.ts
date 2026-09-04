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
import { IEndOfLeaseReason } from './endOfLeaseReason';
import { EndOfLeaseReasonService } from './endOfLeaseReason.service';


@Component({
  selector: 'app-endOfLeaseReason-edit',
  standalone: false,
  templateUrl: './endOfLeaseReason-edit.component.html',
  providers: [ MessageService]
})
export class EndOfLeaseReasonEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  endOfLeaseReason: IEndOfLeaseReason = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IEndOfLeaseReason = {} as IEndOfLeaseReason;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private endOfLeaseReasonService: EndOfLeaseReasonService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.endOfLeaseReason };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReasonName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

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
    this.endOfLeaseReasonService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.endOfLeaseReason = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.endOfLeaseReason };
        this.populateUI(this.endOfLeaseReason);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IEndOfLeaseReason): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReasonCode: obj.ReasonCode || '',
ReasonName: obj.ReasonName || '',
Description: obj.Description || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "EndOfLeaseReason Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/endOfLeaseReason/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.endOfLeaseReason = { ...this.objMaster };
	var obj  = this.endOfLeaseReason;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReasonCode: obj.ReasonCode || '',
ReasonName: obj.ReasonName || '',
Description: obj.Description || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
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
     ReasonCode:  formValues.ReasonCode || null,
ReasonName:  formValues.ReasonName || null,
Description:  formValues.Description || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IEndOfLeaseReason ;
	
	this.spinner.show();  	   
    this.endOfLeaseReasonService.update(this.endOfLeaseReason.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(EndOfLeaseReason +  'Details Updated sucessfully.');
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
