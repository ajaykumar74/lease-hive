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
import { IDocumentRequirement } from './documentRequirement';
import { DocumentRequirementService } from './documentRequirement.service';
import { IDocumentType } from '../documentType/documentType';
import { DocumentTypeService } from '../documentType/documentType.service';
import { IDocumentRetentionPolicy } from '../documentRetentionPolicy/documentRetentionPolicy';
import { DocumentRetentionPolicyService } from '../documentRetentionPolicy/documentRetentionPolicy.service';

@Component({
  selector: 'app-documentRequirement-create',
  standalone: false,
  templateUrl: './documentRequirement-create.component.html' ,
   providers: [ MessageService]
})
export class DocumentRequirementCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documentRequirement: IDocumentRequirement = null;
  documenttypeidOptions: ISelectItem[] = [];
documentretentionpolicyidOptions: ISelectItem[] = [];
requiredmodeOptions: ISelectItem[] = [];
customerPortalAccessOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDocumentRequirement = {} as IDocumentRequirement;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private documentRequirementService: DocumentRequirementService,
	private documentTypeService: DocumentTypeService,
	private documentRetentionPolicyService: DocumentRetentionPolicyService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.documentRequirement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
OwnerType: new FormControl('', [Validators.required, Validators.maxLength(100)]),
Code: new FormControl('', [Validators.required, Validators.maxLength(20)]),
DisplayName: new FormControl('', [Validators.required, Validators.maxLength(200)]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
DocumentTypeId: new FormControl<string | null>(null, [Validators.required]),
DocumentRetentionPolicyId: new FormControl('0'),
RequiredMode: new FormControl('0', [Validators.required]),
ConditionCode: new FormControl('', [Validators.maxLength(20), ]), 
MinCount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MaxCount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AllowedContentTypesJson: new FormControl('', [Validators.maxLength(8000), ]), 
AllowedExtensionsJson: new FormControl('', [Validators.maxLength(8000), ]), 
MaxFileSizeBytes: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequiresIssueDate: new FormControl(false, []),
RequiresExpiryDate: new FormControl(false, []),
ExpiryWarningDays: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
IsActive: new FormControl(false, []),
CustomerPortalAccess: new FormControl<'Internal' | 'View' | 'Upload'>('Internal', [Validators.required]),

    });
    this.Caption = 'Create DocumentRequirement';
    this.requiredmodeOptions = [
      { Text: 'Optional', Value: '0' },
      { Text: 'Required', Value: '1' },
      { Text: 'Conditionally required', Value: '2' }
    ];
    this.customerPortalAccessOptions = [
      { Text: 'Internal only', Value: 'Internal' },
      { Text: 'Customer can view', Value: 'View' },
      { Text: 'Customer administrator can upload', Value: 'Upload' }
    ];
    this.loadDocumentTypeOptions();
    this.loadRetentionPolicyOptions();

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.documentRequirementService.getById(this.selectedId).subscribe({
      next: data => {
        this.documentRequirement = data;
        this.objMaster = { ...this.documentRequirement };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDocumentRequirement): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OwnerType: obj.OwnerType || '',
Code: obj.Code || '',
DisplayName: obj.DisplayName || '',
Description: obj.Description || '',
DocumentTypeId: obj.DocumentTypeId ? obj.DocumentTypeId.toString() : null,
DocumentRetentionPolicyId: (obj.DocumentRetentionPolicyId || 0).toString(),
RequiredMode: (obj.RequiredMode || 0).toString(),
ConditionCode: obj.ConditionCode || '',
MinCount: obj.MinCount || 0,
MaxCount: obj.MaxCount || 0,
AllowedContentTypesJson: obj.AllowedContentTypesJson || '',
AllowedExtensionsJson: obj.AllowedExtensionsJson || '',
MaxFileSizeBytes: obj.MaxFileSizeBytes || 0,
RequiresIssueDate:  obj.RequiresIssueDate || false,
RequiresExpiryDate:  obj.RequiresExpiryDate || false,
ExpiryWarningDays: obj.ExpiryWarningDays || 0,
IsActive:  obj.IsActive || false,
CustomerPortalAccess: obj.CustomerPortalAccess || 'Internal',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/document-requirements/create']);
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
    this.documentRequirement = { ...this.objMaster };
    var obj  = this.documentRequirement;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OwnerType: obj.OwnerType || '',
Code: obj.Code || '',
DisplayName: obj.DisplayName || '',
Description: obj.Description || '',
DocumentTypeId: obj.DocumentTypeId ? obj.DocumentTypeId.toString() : null,
DocumentRetentionPolicyId: (obj.DocumentRetentionPolicyId || 0).toString(),
RequiredMode: (obj.RequiredMode || 0).toString(),
ConditionCode: obj.ConditionCode || '',
MinCount: obj.MinCount || 0,
MaxCount: obj.MaxCount || 0,
AllowedContentTypesJson: obj.AllowedContentTypesJson || '',
AllowedExtensionsJson: obj.AllowedExtensionsJson || '',
MaxFileSizeBytes: obj.MaxFileSizeBytes || 0,
RequiresIssueDate:  obj.RequiresIssueDate || false,
RequiresExpiryDate:  obj.RequiresExpiryDate || false,
ExpiryWarningDays: obj.ExpiryWarningDays || 0,
IsActive:  obj.IsActive || false,
CustomerPortalAccess: obj.CustomerPortalAccess || 'Internal',
 
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
     OwnerType: formValues.OwnerType || null,
Code: formValues.Code || null,
DisplayName: formValues.DisplayName || null,
Description: formValues.Description || null,
DocumentTypeId: Number(formValues.DocumentTypeId),
DocumentRetentionPolicyId: Number(formValues.DocumentRetentionPolicyId || 0),
RequiredMode: Number(formValues.RequiredMode),
ConditionCode: formValues.ConditionCode || null,
MinCount: formValues.MinCount || 0,
MaxCount: formValues.MaxCount || 0,
AllowedContentTypesJson: formValues.AllowedContentTypesJson || null,
AllowedExtensionsJson: formValues.AllowedExtensionsJson || null,
MaxFileSizeBytes: formValues.MaxFileSizeBytes || 0,
RequiresIssueDate: formValues.RequiresIssueDate || false,
RequiresExpiryDate: formValues.RequiresExpiryDate || false,
ExpiryWarningDays: formValues.ExpiryWarningDays || 0,
IsActive: formValues.IsActive || false,
CustomerPortalAccess: formValues.CustomerPortalAccess || 'Internal',

    } as IDocumentRequirement ; 
	
	  this.spinner.show(); 
    this.documentRequirementService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DocumentRequirement +  'Details Updated sucessfully.');
		 this._location.back();     
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

  private loadDocumentTypeOptions(): void {
    this.documentTypeService.getAll().subscribe({
      next: (response: any) => {
        const documentTypes: IDocumentType[] = response?.data ?? response ?? [];
        this.documenttypeidOptions = documentTypes
          .filter(documentType => documentType.IsActive)
          .map(documentType => ({
            Text: `${documentType.Code} — ${documentType.Name}`,
            Value: documentType.Id.toString()
          }))
          .sort((left, right) => left.Text.localeCompare(right.Text));
      },
      error: err => this.messageService?.showError(err)
    });
  }

  private loadRetentionPolicyOptions(): void {
    this.documentRetentionPolicyService.getAll().subscribe({
      next: (response: any) => {
        const retentionPolicies: IDocumentRetentionPolicy[] = response?.data ?? response ?? [];
        this.documentretentionpolicyidOptions = [
          { Text: 'No retention policy', Value: '0' },
          ...retentionPolicies
            .filter(policy => policy.IsActive)
            .map(policy => ({ Text: `${policy.Code} — ${policy.Name}`, Value: policy.Id.toString() }))
            .sort((left, right) => left.Text.localeCompare(right.Text))
        ];
      },
      error: err => this.messageService?.showError(err)
    });
  }

}



