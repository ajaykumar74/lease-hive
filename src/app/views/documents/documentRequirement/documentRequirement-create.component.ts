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

  editForm: any; 
  objMaster : IDocumentRequirement = {} as IDocumentRequirement;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private documentRequirementService: DocumentRequirementService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.documentRequirement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
OwnerType: new FormControl('', [Validators.maxLength(100), ]), 
Code: new FormControl('', [Validators.maxLength(20), ]), 
DisplayName: new FormControl('', [Validators.maxLength(200), ]), 
Description: new FormControl('', [Validators.maxLength(100), ]), 
DocumentTypeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentRetentionPolicyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequiredMode: new FormControl(0, [Validators.min(0), Validators.max(255)]),
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

    });
    this.Caption = 'Create DocumentRequirement';
    this.documenttypeidOptions.push({Text: 'DocumentTypeId1', Value: 'DocumentTypeId1' });
this.documenttypeidOptions.push({Text: 'DocumentTypeId2', Value: 'DocumentTypeId2' });
this.documentretentionpolicyidOptions.push({Text: 'DocumentRetentionPolicyId1', Value: 'DocumentRetentionPolicyId1' });
this.documentretentionpolicyidOptions.push({Text: 'DocumentRetentionPolicyId2', Value: 'DocumentRetentionPolicyId2' });
this.requiredmodeOptions.push({Text: 'Optional', Value: 'Optional' });
this.requiredmodeOptions.push({Text: 'Required', Value: 'Required' });
this.requiredmodeOptions.push({Text: 'ConditionallyRequired', Value: 'ConditionallyRequired' });

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
DocumentTypeId: obj.DocumentTypeId || 0,
DocumentRetentionPolicyId: obj.DocumentRetentionPolicyId || 0,
RequiredMode: obj.RequiredMode || 0,
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
DocumentTypeId: obj.DocumentTypeId || 0,
DocumentRetentionPolicyId: obj.DocumentRetentionPolicyId || 0,
RequiredMode: obj.RequiredMode || 0,
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
DocumentTypeId: formValues.DocumentTypeId || 0,
DocumentRetentionPolicyId: formValues.DocumentRetentionPolicyId || 0,
RequiredMode: formValues.RequiredMode || null,
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

}



