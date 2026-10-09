import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantNotification } from './tenantNotification';
import { TenantNotificationService } from './tenantNotification.service';

@Component({
  selector: 'app-tenantNotification-create',
  standalone: false,
  templateUrl: './tenantNotification-create.component.html' ,
   providers: [ MessageService]
})
export class TenantNotificationCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = { CanCreate: true, CanUpdate: true } as IPermission;
  Caption: string = 'Loading...';
  tenantNotification: ITenantNotification = null;
  organisationidOptions: ISelectItem[] = [];
channelOptions: ISelectItem[] = [];
emailprofilecodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ITenantNotification = {} as ITenantNotification;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private tenantNotificationService: TenantNotificationService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.tenantNotification };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
OrganisationId: new FormControl<number | null>(null),
Code: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Name: new FormControl('', [Validators.required, Validators.maxLength(200), ]),
Channel: new FormControl('Email', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.maxLength(1000), ]), 
SubjectTemplate: new FormControl('', [Validators.required, Validators.maxLength(500), ]),
BodyTemplate: new FormControl('', [Validators.required, Validators.maxLength(8000), ]),
EmailProfileCode: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
UseTenantHeader: new FormControl(true),
UseTenantFooter: new FormControl(true),
TemplateVersion: new FormControl(1, [Validators.required, Validators.min(1)]),
IsActive: new FormControl(true),

    });
    this.Caption = 'Create email notification';
    this.channelOptions = [{ Text: 'Email', Value: 'Email' }];
    this.loggedInUserService.bindEntityLookup(this.editForm, 'OrganisationId', 'organisations',
      options => this.organisationidOptions = options,
      error => setTimeout(() => this.messageService?.showError(error)), this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'EmailProfileCode', 'tenant-email-profiles',
      options => this.emailprofilecodeOptions = options,
      error => setTimeout(() => this.messageService?.showError(error)), this.entityLookupDestroyRef,
      { OrganisationId: 'OrganisationId' }, 'reference');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.tenantNotificationService.getById(this.selectedId).subscribe({
      next: data => {
        this.tenantNotification = data;
        this.objMaster = { ...this.tenantNotification };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ITenantNotification): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationId: obj.OrganisationId || 0,
Code: obj.Code || '',
Name: obj.Name || '',
Channel: obj.Channel || '',
Description: obj.Description || '',
SubjectTemplate: obj.SubjectTemplate || '',
BodyTemplate: obj.BodyTemplate || '',
EmailProfileCode: obj.EmailProfileCode || '',
UseTenantHeader:  obj.UseTenantHeader || false,
UseTenantFooter:  obj.UseTenantFooter || false,
TemplateVersion: obj.TemplateVersion || 0,
IsActive:  obj.IsActive || false,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/tenantNotifications/create']);
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
    this.router.navigate(['/dashboard/tenantNotifications']);
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
     OrganisationId: formValues.OrganisationId || null,
Code: formValues.Code || null,
Name: formValues.Name || null,
Channel: formValues.Channel || null,
Description: formValues.Description || null,
SubjectTemplate: formValues.SubjectTemplate || null,
BodyTemplate: formValues.BodyTemplate || null,
EmailProfileCode: formValues.EmailProfileCode || null,
UseTenantHeader: formValues.UseTenantHeader || false,
UseTenantFooter: formValues.UseTenantFooter || false,
TemplateVersion: formValues.TemplateVersion,
IsActive: formValues.IsActive,

    } as ITenantNotification ; 
	
	  this.spinner.show(); 
    this.tenantNotificationService.create(createdObj).subscribe({
      next: data => {	   
         this.router.navigate(['/dashboard/tenantNotifications']);
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

}



