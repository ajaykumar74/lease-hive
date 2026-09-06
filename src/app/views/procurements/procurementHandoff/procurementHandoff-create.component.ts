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
import { IProcurementHandoff } from './procurementHandoff';
import { ProcurementHandoffService } from './procurementHandoff.service';

@Component({
  selector: 'app-procurementHandoff-create',
  standalone: false,
  templateUrl: './procurementHandoff-create.component.html' ,
   providers: [ MessageService]
})
export class ProcurementHandoffCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  procurementHandoff: IProcurementHandoff = null;
  referencetypeOptions: ISelectItem[] = [];
targetmodulecodeOptions: ISelectItem[] = [];
handoffstatuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IProcurementHandoff = {} as IProcurementHandoff;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private procurementHandoffService: ProcurementHandoffService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.procurementHandoff };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TargetModuleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
HandoffStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
HandoffDateTime: new FormControl(new Date(), [Validators.required]),
TargetReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ValidationJson: new FormControl('', [Validators.maxLength(8000), ]), 

    });
    this.Caption = 'Create ProcurementHandoff';
    this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('ProcurementHandoffReferenceType');
this.targetmodulecodeOptions = this.loggedInUserService.getPicklistOptions('ProcurementHandoffTargetModuleCode');
this.handoffstatuscodeOptions = this.loggedInUserService.getPicklistOptions('HandoffStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.procurementHandoffService.getById(this.selectedId).subscribe({
      next: data => {
        this.procurementHandoff = data;
        this.objMaster = { ...this.procurementHandoff };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IProcurementHandoff): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
TargetModuleCode: obj.TargetModuleCode || '',
HandoffStatusCode: obj.HandoffStatusCode || '',
HandoffDateTime:  obj.HandoffDateTime || new Date(),
TargetReferenceId: obj.TargetReferenceId || 0,
ValidationJson: obj.ValidationJson || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/handoffs/create']);
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
    this.procurementHandoff = { ...this.objMaster };
    var obj  = this.procurementHandoff;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
TargetModuleCode: obj.TargetModuleCode || '',
HandoffStatusCode: obj.HandoffStatusCode || '',
HandoffDateTime:  obj.HandoffDateTime || new Date(),
TargetReferenceId: obj.TargetReferenceId || 0,
ValidationJson: obj.ValidationJson || '',
 
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || 0,
TargetModuleCode: formValues.TargetModuleCode || null,
HandoffStatusCode: formValues.HandoffStatusCode || null,
HandoffDateTime: formValues.HandoffDateTime || null,
TargetReferenceId: formValues.TargetReferenceId || 0,
ValidationJson: formValues.ValidationJson || null,

    } as IProcurementHandoff ; 
	
	  this.spinner.show(); 
    this.procurementHandoffService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ProcurementHandoff +  'Details Updated sucessfully.');
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



