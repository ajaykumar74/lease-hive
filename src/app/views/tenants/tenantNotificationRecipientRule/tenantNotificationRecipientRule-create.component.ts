import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantNotificationRecipientRule } from './tenantNotificationRecipientRule';
import { TenantNotificationRecipientRuleService } from './tenantNotificationRecipientRule.service';

@Component({
  selector: 'app-tenantNotificationRecipientRule-create',
  standalone: false,
  templateUrl: './tenantNotificationRecipientRule-create.component.html' ,
   providers: [ MessageService]
})
export class TenantNotificationRecipientRuleCreateComponent implements OnInit {

  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = { CanCreate: true, CanUpdate: true } as IPermission;
  Caption: string = 'Loading...';
  tenantNotificationRecipientRule: ITenantNotificationRecipientRule = null;
  tenantnotificationidOptions: ISelectItem[] = [];
recipienttypeOptions: ISelectItem[] = [];
sourcetypeOptions: ISelectItem[] = [];
departmentidOptions: ISelectItem[] = [];
rolecodeOptions: ISelectItem[] = [];
contactidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ITenantNotificationRecipientRule = {} as ITenantNotificationRecipientRule;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private tenantNotificationRecipientRuleService: TenantNotificationRecipientRuleService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.tenantNotificationRecipientRule };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
TenantNotificationId: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
RecipientType: new FormControl('To', [Validators.required, Validators.maxLength(3), ]),
SourceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ContextKey: new FormControl('', [Validators.maxLength(100), ]), 
DepartmentId: new FormControl(null, [Validators.min(1), Validators.max(2147483647)]),
RoleCode: new FormControl('', [Validators.maxLength(20), ]), 
ContactId: new FormControl(null, [Validators.min(1), Validators.max(2147483647)]),
FixedEmail: new FormControl('', [Validators.maxLength(320),  Validators.email]), 
SortOrder: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
IsRequired: new FormControl(false, [Validators.required]),
IsActive: new FormControl(true, [Validators.required]),

    });
    this.Caption = 'Create TenantNotificationRecipientRule';
    this.recipienttypeOptions = [
      { Text: 'To', Value: 'To' }, { Text: 'Cc', Value: 'Cc' }, { Text: 'Bcc', Value: 'Bcc' }
    ];
    this.sourcetypeOptions = [
      { Text: 'Context value', Value: 'ContextValue' },
      { Text: 'Department role', Value: 'DepartmentRole' },
      { Text: 'Application role', Value: 'ApplicationRole' },
      { Text: 'Contact', Value: 'Contact' },
      { Text: 'Record owner', Value: 'RecordOwner' },
      { Text: 'Manager', Value: 'Manager' },
      { Text: 'Fixed email address', Value: 'FixedEmail' }
    ];
    this.loggedInUserService.bindEntityLookup(this.editForm, 'TenantNotificationId', 'tenant-notifications',
      options => this.tenantnotificationidOptions = options, undefined, this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'DepartmentId', 'departments',
      options => this.departmentidOptions = options, undefined, this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'RoleCode', 'roles',
      options => this.rolecodeOptions = options, undefined, this.entityLookupDestroyRef, {}, 'reference');
    this.loggedInUserService.bindEntityLookup(this.editForm, 'ContactId', 'party-contacts',
      options => this.contactidOptions = options, undefined, this.entityLookupDestroyRef);
    this.editForm.get('SourceType')?.valueChanges
      .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe((sourceType: string) => this.clearUnusedSourceValues(sourceType));

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.tenantNotificationRecipientRuleService.getById(this.selectedId).subscribe({
      next: data => {
        this.tenantNotificationRecipientRule = data;
        this.objMaster = { ...this.tenantNotificationRecipientRule };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ITenantNotificationRecipientRule): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  TenantNotificationId: obj.TenantNotificationId || 0,
RecipientType: obj.RecipientType || '',
SourceType: obj.SourceType || '',
ContextKey: obj.ContextKey || '',
DepartmentId: obj.DepartmentId || 0,
RoleCode: obj.RoleCode || '',
ContactId: obj.ContactId || 0,
FixedEmail: obj.FixedEmail || '',
SortOrder: obj.SortOrder || 0,
IsRequired:  obj.IsRequired || false,
IsActive:  obj.IsActive || false,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/notificationRecipientRules/create']);
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
    this.router.navigate(['/dashboard/notificationRecipientRules']);
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
TenantNotificationId: formValues.TenantNotificationId,
RecipientType: formValues.RecipientType || null,
SourceType: formValues.SourceType || null,
ContextKey: formValues.ContextKey || null,
DepartmentId: formValues.DepartmentId || null,
RoleCode: formValues.RoleCode || null,
ContactId: formValues.ContactId || null,
FixedEmail: formValues.FixedEmail || null,
SortOrder: formValues.SortOrder,
IsRequired: formValues.IsRequired,
IsActive: formValues.IsActive,

    } as ITenantNotificationRecipientRule ; 
	
	  this.spinner.show(); 
    this.tenantNotificationRecipientRuleService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(TenantNotificationRecipientRule +  'Details Updated sucessfully.');
		 this.router.navigate(['/dashboard/notificationRecipientRules']);
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

  usesSource(...sourceTypes: string[]): boolean {
    return sourceTypes.includes(this.editForm?.get('SourceType')?.value);
  }

  private clearUnusedSourceValues(sourceType: string): void {
    const fieldsForSource: Record<string, string[]> = {
      ContextValue: ['ContextKey'],
      DepartmentRole: ['DepartmentId', 'RoleCode'],
      ApplicationRole: ['RoleCode'],
      Contact: ['ContactId'],
      FixedEmail: ['FixedEmail'],
      RecordOwner: [],
      Manager: []
    };
    const fieldsToKeep = fieldsForSource[sourceType] ?? [];
    ['ContextKey', 'DepartmentId', 'RoleCode', 'ContactId', 'FixedEmail'].forEach(field => {
      if (!fieldsToKeep.includes(field)) this.editForm.get(field)?.setValue(null, { emitEvent: false });
    });
  }

}



