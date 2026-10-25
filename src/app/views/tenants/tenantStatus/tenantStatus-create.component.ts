import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantStatus } from './tenantStatus';
import { TenantStatusService } from './tenantStatus.service';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';

@Component({
  selector: 'app-tenantStatus-create',
  standalone: false,
  templateUrl: './tenantStatus-create.component.html' ,
   providers: [ MessageService]
})
export class TenantStatusCreateComponent implements OnInit {

   
  permission = {} as IPermission;
  Caption: string = 'Create Tenant Status';
  tenantIdOptions: ISelectItem[] = [];
  statusOptions: ISelectItem[] = [];
  editForm: any; 
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private _location: Location, 
	private tenantStatusService: TenantStatusService,
	private lookups: PlatformAdminLookupService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
    this.editForm = this.fb.group({
TenantId: new FormControl(null, [Validators.required]),
Status: new FormControl('PendingActivation', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),

    });
    this.statusOptions = this.getStatusOptions();
    this.lookups.getTenants().subscribe({ next: options => this.tenantIdOptions = options, error: error => this.messageService.showError(error) });
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Save") {
      this.save();
    }
    else if (key == "Cancel") {
      this._location.back();
    }
  }

  save(): void {
   
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }	
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: 0,
      TenantId: Number(formValues.TenantId),
Status: formValues.Status?.trim(),
Description: formValues.Description?.trim(),

    } as ITenantStatus ; 
	
	  this.spinner.show(); 
    this.tenantStatusService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(TenantStatus +  'Details Updated sucessfully.');
		 this._location.back();     
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

  private getStatusOptions(): ISelectItem[] {
    return ['PendingActivation', 'Active', 'Suspended', 'Disabled']
      .map(value => ({ Text: value, Value: value }));
  }

}



