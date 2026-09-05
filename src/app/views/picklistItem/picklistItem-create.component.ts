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
import { IPicklistItem } from './picklistItem';
import { PicklistItemService } from './picklistItem.service';

@Component({
  selector: 'app-picklistItem-create',
  standalone: false,
  templateUrl: './picklistItem-create.component.html' ,
   providers: [ MessageService]
})
export class PicklistItemCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Picklist Item';
  picklistItem: IPicklistItem = null;
  
  editForm: any; 
  objMaster : IPicklistItem = {} as IPicklistItem;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private picklistItemService: PicklistItemService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.picklistItem };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
Category: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
ItemName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
IsSystem: new FormControl(false, []),
TenantId: new FormControl(null, []),

    });
    
  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.picklistItemService.getById(this.selectedId).subscribe({
      next: data => {
        this.picklistItem = data;
        this.objMaster = { ...this.picklistItem };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPicklistItem): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  Category: obj.Category || '',
ItemName: obj.ItemName || '',
Description: obj.Description || '',
IsSystem:  obj.IsSystem || false,
TenantId: obj.TenantId || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/picklistItems/create']);
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
    this.picklistItem = { ...this.objMaster };
    var obj  = this.picklistItem;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  Category: obj.Category || '',
ItemName: obj.ItemName || '',
Description: obj.Description || '',
IsSystem:  obj.IsSystem || false,
TenantId: obj.TenantId || 0,
 
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
     Category: formValues.Category || null,
ItemName: formValues.ItemName || null,
Description: formValues.Description || null,
IsSystem: formValues.IsSystem || null,
TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,

    } as IPicklistItem ; 
	
	  this.spinner.show(); 
    this.picklistItemService.create(createdObj).subscribe({
      next: data => {
        this.picklistItemService.CacheData.IsLoaded = false;
        this.loggedInUserService.refreshPicklistCache().subscribe({
          next: () => this._location.back(),
          error: err => this.messageService.showError(err)
        });
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

}



