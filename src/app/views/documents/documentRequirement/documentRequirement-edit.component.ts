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
import { IDocumentRequirement } from './documentRequirement';
import { DocumentRequirementService } from './documentRequirement.service';
import { IDocumentType } from '../documentType/documentType';
import { DocumentTypeService } from '../documentType/documentType.service';
import { IDocumentRetentionPolicy } from '../documentRetentionPolicy/documentRetentionPolicy';
import { DocumentRetentionPolicyService } from '../documentRetentionPolicy/documentRetentionPolicy.service';


@Component({
  selector: 'app-documentRequirement-edit',
  standalone: false,
  templateUrl: './documentRequirement-edit.component.html',
  providers: [ MessageService]
})
export class DocumentRequirementEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  documentRequirement: IDocumentRequirement = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documenttypeidOptions: ISelectItem[] = [];
documentretentionpolicyidOptions: ISelectItem[] = [];
requiredmodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDocumentRequirement = {} as IDocumentRequirement;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private documentRequirementService: DocumentRequirementService, 
	private documentTypeService: DocumentTypeService,
	private documentRetentionPolicyService: DocumentRetentionPolicyService,
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.documentRequirement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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
RequiresIssueDate: new FormControl(false), 
RequiresExpiryDate: new FormControl(false), 
ExpiryWarningDays: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
IsActive: new FormControl(false), 

    });

   this.requiredmodeOptions = [
      { Text: 'Optional', Value: '0' },
      { Text: 'Required', Value: '1' },
      { Text: 'Conditionally required', Value: '2' }
    ];
    this.loadDocumentTypeOptions();
    this.loadRetentionPolicyOptions();

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.documentRequirementService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.documentRequirement = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.documentRequirement };
        this.populateUI(this.documentRequirement);
      },
      error: err => { this.messageService.showSuccess(err); },
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
 
      }
    );
   
	 this.Caption = "DocumentRequirement Details #" + obj.Id;
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
     OwnerType:  formValues.OwnerType || null,
Code:  formValues.Code || null,
DisplayName:  formValues.DisplayName || null,
Description:  formValues.Description || null,
DocumentTypeId:  Number(formValues.DocumentTypeId),
DocumentRetentionPolicyId:  Number(formValues.DocumentRetentionPolicyId || 0),
RequiredMode:  Number(formValues.RequiredMode),
ConditionCode:  formValues.ConditionCode || null,
MinCount:  formValues.MinCount || null,
MaxCount:  formValues.MaxCount || null,
AllowedContentTypesJson:  formValues.AllowedContentTypesJson || null,
AllowedExtensionsJson:  formValues.AllowedExtensionsJson || null,
MaxFileSizeBytes:  formValues.MaxFileSizeBytes || null,
RequiresIssueDate:  formValues.RequiresIssueDate,
RequiresExpiryDate:  formValues.RequiresExpiryDate,
ExpiryWarningDays:  formValues.ExpiryWarningDays || 0,
IsActive:  formValues.IsActive,

    } as IDocumentRequirement ;
	
	this.spinner.show();  	   
    this.documentRequirementService.update(this.documentRequirement.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DocumentRequirement +  'Details Updated sucessfully.');
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

  private loadDocumentTypeOptions(): void {
    this.documentTypeService.getAll().subscribe({
      next: (response: any) => {
        const documentTypes: IDocumentType[] = response?.data ?? response ?? [];
        this.documenttypeidOptions = documentTypes
          .map(documentType => ({
            Text: `${documentType.Code} — ${documentType.Name}${documentType.IsActive ? '' : ' (Inactive)'}`,
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
            .map(policy => ({
              Text: `${policy.Code} — ${policy.Name}${policy.IsActive ? '' : ' (Inactive)'}`,
              Value: policy.Id.toString()
            }))
            .sort((left, right) => left.Text.localeCompare(right.Text))
        ];
      },
      error: err => this.messageService?.showError(err)
    });
  }
}
