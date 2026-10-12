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
import { IDocumentType } from './documentType';
import { DocumentTypeService } from './documentType.service';


@Component({
  selector: 'app-documentType-edit',
  standalone: false,
  templateUrl: './documentType-edit.component.html',
  providers: [ MessageService]
})
export class DocumentTypeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  documentType: IDocumentType = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  sensitivitylevelOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDocumentType = {} as IDocumentType;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private documentTypeService: DocumentTypeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.documentType };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
Code: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Name: new FormControl('', [Validators.required, Validators.maxLength(200), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
SensitivityLevel: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
IsActive: new FormControl(false, [Validators.required]),

    });

   this.sensitivitylevelOptions.push({Text: 'Public', Value: 'Public' });
this.sensitivitylevelOptions.push({Text: 'Internal', Value: 'Internal' });
this.sensitivitylevelOptions.push({Text: 'Confidential', Value: 'Confidential' });
this.sensitivitylevelOptions.push({Text: 'HighlySensitive', Value: 'HighlySensitive' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.documentTypeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.documentType = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.documentType };
        this.populateUI(this.documentType);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IDocumentType): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  Code: obj.Code || '',
Name: obj.Name || '',
Description: obj.Description || '',
SensitivityLevel: obj.SensitivityLevel || 0,
IsActive:  obj.IsActive || false,
 
      }
    );
   
	 this.Caption = "DocumentType Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/document-types/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.documentType = { ...this.objMaster };
	var obj  = this.documentType;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  Code: obj.Code || '',
Name: obj.Name || '',
Description: obj.Description || '',
SensitivityLevel: obj.SensitivityLevel || 0,
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
     Code:  formValues.Code || null,
Name:  formValues.Name || null,
Description:  formValues.Description || null,
SensitivityLevel:  formValues.SensitivityLevel || null,
IsActive:  formValues.IsActive || null,

    } as IDocumentType ;
	
	this.spinner.show();  	   
    this.documentTypeService.update(this.documentType.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DocumentType +  'Details Updated sucessfully.');
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
