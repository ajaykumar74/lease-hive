import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-tenantNotification-edit',
  standalone: false,
  templateUrl: './tenantNotification-edit.component.html',
  providers: [ MessageService]
})
export class TenantNotificationEditComponent implements OnInit {

  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  tenantNotification: ITenantNotification = null;
  permission = { CanCreate: true, CanUpdate: true } as IPermission;
  Caption: string = 'Loading...';
  organisationidOptions: ISelectItem[] = [];
channelOptions: ISelectItem[] = [];
emailprofilecodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ITenantNotification = {} as ITenantNotification;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private tenantNotificationService: TenantNotificationService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.tenantNotification };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
OrganisationId: new FormControl(null, [Validators.min(-2147483648), Validators.max(2147483647)]),
Code: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Name: new FormControl('', [Validators.required, Validators.maxLength(200), ]),
Channel: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.maxLength(1000), ]), 
SubjectTemplate: new FormControl('', [Validators.required, Validators.maxLength(500), ]),
BodyTemplate: new FormControl('', [Validators.required, Validators.maxLength(8000), ]),
EmailProfileCode: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
UseTenantHeader: new FormControl(true, [Validators.required]),
UseTenantFooter: new FormControl(true, [Validators.required]),
TemplateVersion: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
IsActive: new FormControl(true, [Validators.required]),

    });

   this.channelOptions = [{ Text: 'Email', Value: 'Email' }];
   this.loggedInUserService.bindEntityLookup(this.editForm, 'OrganisationId', 'organisations',
     options => this.organisationidOptions = options, undefined, this.entityLookupDestroyRef);
   this.loggedInUserService.bindEntityLookup(this.editForm, 'EmailProfileCode', 'tenant-email-profiles',
     options => this.emailprofilecodeOptions = options, undefined, this.entityLookupDestroyRef,
     { OrganisationId: 'OrganisationId' }, 'reference');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.tenantNotificationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.tenantNotification = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.tenantNotification };
        this.populateUI(this.tenantNotification);
      },
      error: err => { this.messageService.showError(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ITenantNotification): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationId: obj.OrganisationId ?? null,
Code: obj.Code || '',
Name: obj.Name || '',
Channel: obj.Channel || 'Email',
Description: obj.Description || '',
SubjectTemplate: obj.SubjectTemplate || '',
BodyTemplate: obj.BodyTemplate || '',
EmailProfileCode: obj.EmailProfileCode || '',
UseTenantHeader: obj.UseTenantHeader,
UseTenantFooter: obj.UseTenantFooter,
TemplateVersion: obj.TemplateVersion || 1,
IsActive: obj.IsActive,
 
      }
    );
   
	 this.Caption = "TenantNotification Details #" + obj.Id;
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

  }



  onCancel(): void {
    this.tenantNotification = { ...this.objMaster };
	var obj  = this.tenantNotification;
   this.populateUI(obj);
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     OrganisationId: formValues.OrganisationId || null,
Code:  formValues.Code || null,
Name:  formValues.Name || null,
Channel:  formValues.Channel || null,
Description:  formValues.Description || null,
SubjectTemplate:  formValues.SubjectTemplate || null,
BodyTemplate:  formValues.BodyTemplate || null,
EmailProfileCode:  formValues.EmailProfileCode || null,
UseTenantHeader: formValues.UseTenantHeader,
UseTenantFooter: formValues.UseTenantFooter,
TemplateVersion: formValues.TemplateVersion,
IsActive: formValues.IsActive,

    } as ITenantNotification ;
	
	this.spinner.show();  	   
    this.tenantNotificationService.update(this.tenantNotification.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(TenantNotification +  'Details Updated sucessfully.');
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
