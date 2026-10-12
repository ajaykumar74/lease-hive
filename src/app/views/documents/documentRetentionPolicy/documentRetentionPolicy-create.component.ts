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
import { IDocumentRetentionPolicy } from './documentRetentionPolicy';
import { DocumentRetentionPolicyService } from './documentRetentionPolicy.service';

@Component({
  selector: 'app-documentRetentionPolicy-create',
  standalone: false,
  templateUrl: './documentRetentionPolicy-create.component.html' ,
   providers: [ MessageService]
})
export class DocumentRetentionPolicyCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documentRetentionPolicy: IDocumentRetentionPolicy = null;
  
  editForm: any; 
  objMaster : IDocumentRetentionPolicy = {} as IDocumentRetentionPolicy;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private documentRetentionPolicyService: DocumentRetentionPolicyService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.documentRetentionPolicy };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
Code: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Name: new FormControl('', [Validators.required, Validators.maxLength(200), ]),
RetentionDays: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AllowUserDelete: new FormControl(false, [Validators.required]),
IsActive: new FormControl(false, [Validators.required]),

    });
    this.Caption = 'Create DocumentRetentionPolicy';
    
  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.documentRetentionPolicyService.getById(this.selectedId).subscribe({
      next: data => {
        this.documentRetentionPolicy = data;
        this.objMaster = { ...this.documentRetentionPolicy };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDocumentRetentionPolicy): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  Code: obj.Code || '',
Name: obj.Name || '',
RetentionDays: obj.RetentionDays || 0,
AllowUserDelete:  obj.AllowUserDelete || false,
IsActive:  obj.IsActive || false,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/document-retention-policies/create']);
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
    this.documentRetentionPolicy = { ...this.objMaster };
    var obj  = this.documentRetentionPolicy;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  Code: obj.Code || '',
Name: obj.Name || '',
RetentionDays: obj.RetentionDays || 0,
AllowUserDelete:  obj.AllowUserDelete || false,
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
      DocumentRetentionPolicyId: this.objMaster.DocumentRetentionPolicyId || '',
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     Code: formValues.Code || null,
Name: formValues.Name || null,
RetentionDays: formValues.RetentionDays || 0,
AllowUserDelete: formValues.AllowUserDelete || false,
IsActive: formValues.IsActive || false,

    } as IDocumentRetentionPolicy ; 
	
	  this.spinner.show(); 
    this.documentRetentionPolicyService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DocumentRetentionPolicy +  'Details Updated sucessfully.');
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



