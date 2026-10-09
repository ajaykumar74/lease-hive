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
import { ITenantEmailProfile } from './tenantEmailProfile';
import { TenantEmailProfileService } from './tenantEmailProfile.service';


@Component({
  selector: 'app-tenantEmailProfile-edit',
  standalone: false,
  templateUrl: './tenantEmailProfile-edit.component.html',
  providers: [ MessageService]
})
export class TenantEmailProfileEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  tenantEmailProfile: ITenantEmailProfile = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  organisationidOptions: ISelectItem[] = [];
logodocumentidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ITenantEmailProfile = {} as ITenantEmailProfile;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private tenantEmailProfileService: TenantEmailProfileService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.tenantEmailProfile };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
OrganisationId: new FormControl<number | null>(null),
ProfileCode: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
FromEmail: new FormControl('', [Validators.required, Validators.maxLength(320),  Validators.email]),
FromDisplayName: new FormControl('', [Validators.required, Validators.maxLength(200), ]),
ReplyToEmail: new FormControl('', [Validators.maxLength(320),  Validators.email]), 
CompanyName: new FormControl('', [Validators.required, Validators.maxLength(250), ]),
AddressLine1: new FormControl('', [Validators.maxLength(250), ]), 
AddressLine2: new FormControl('', [Validators.maxLength(250), ]), 
City: new FormControl('', [Validators.maxLength(100), ]), 
State: new FormControl('', [Validators.maxLength(100), ]), 
Pin: new FormControl('', [Validators.maxLength(20), ]), 
Phone: new FormControl('', [Validators.maxLength(30), ]), 
Mobile: new FormControl('', [Validators.maxLength(30), ]), 
LogoDocumentId: new FormControl<number | null>(null),
HeaderHtml: new FormControl('', [Validators.maxLength(8000), ]), 
FooterHtml: new FormControl('', [Validators.maxLength(8000), ]), 
IsActive: new FormControl(true),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'OrganisationId', 'organisations',
      options => this.organisationidOptions = options,
      error => setTimeout(() => this.messageService?.showError(error)), this.entityLookupDestroyRef);
   this.loggedInUserService.bindEntityLookup(this.editForm, 'LogoDocumentId', 'documents',
      options => this.logodocumentidOptions = options,
      error => setTimeout(() => this.messageService?.showError(error)), this.entityLookupDestroyRef);

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.tenantEmailProfileService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.tenantEmailProfile = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.tenantEmailProfile };
        this.populateUI(this.tenantEmailProfile);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ITenantEmailProfile): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationId: obj.OrganisationId || 0,
ProfileCode: obj.ProfileCode || '',
FromEmail: obj.FromEmail || '',
FromDisplayName: obj.FromDisplayName || '',
ReplyToEmail: obj.ReplyToEmail || '',
CompanyName: obj.CompanyName || '',
AddressLine1: obj.AddressLine1 || '',
AddressLine2: obj.AddressLine2 || '',
City: obj.City || '',
State: obj.State || '',
Pin: obj.Pin || '',
Phone: obj.Phone || '',
Mobile: obj.Mobile || '',
LogoDocumentId: obj.LogoDocumentId || 0,
HeaderHtml: obj.HeaderHtml || '',
FooterHtml: obj.FooterHtml || '',
IsActive:  obj.IsActive || false,
 
      }
    );
   
	 this.Caption = "TenantEmailProfile Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/emailProfiles/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.populateUI(this.objMaster);
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
     OrganisationId:  formValues.OrganisationId || null,
ProfileCode:  formValues.ProfileCode || null,
FromEmail:  formValues.FromEmail || null,
FromDisplayName:  formValues.FromDisplayName || null,
ReplyToEmail:  formValues.ReplyToEmail || null,
CompanyName:  formValues.CompanyName || null,
AddressLine1:  formValues.AddressLine1 || null,
AddressLine2:  formValues.AddressLine2 || null,
City:  formValues.City || null,
State:  formValues.State || null,
Pin:  formValues.Pin || null,
Phone:  formValues.Phone || null,
Mobile:  formValues.Mobile || null,
LogoDocumentId:  formValues.LogoDocumentId || null,
HeaderHtml:  formValues.HeaderHtml || null,
FooterHtml:  formValues.FooterHtml || null,
IsActive:  formValues.IsActive,

    } as ITenantEmailProfile ;
	
	this.spinner.show();  	   
    this.tenantEmailProfileService.update(this.tenantEmailProfile.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(TenantEmailProfile +  'Details Updated sucessfully.');
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
