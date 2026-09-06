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
import { IProcurementDocumentLink } from './procurementDocumentLink';
import { ProcurementDocumentLinkService } from './procurementDocumentLink.service';


@Component({
  selector: 'app-procurementDocumentLink-edit',
  standalone: false,
  templateUrl: './procurementDocumentLink-edit.component.html',
  providers: [ MessageService]
})
export class ProcurementDocumentLinkEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  procurementDocumentLink: IProcurementDocumentLink = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  referencetypeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
documentpurposecodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IProcurementDocumentLink = {} as IProcurementDocumentLink;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private procurementDocumentLinkService: ProcurementDocumentLinkService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.procurementDocumentLink };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentPurposeCode: new FormControl('', [Validators.maxLength(20), ]), 
IsPrimary: new FormControl(false, [Validators.required]),

    });

   this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('ProcurementDocumentLinkReferenceType');
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentpurposecodeOptions = this.loggedInUserService.getPicklistOptions('ProcurementDocumentLinkDocumentPurposeCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.procurementDocumentLinkService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.procurementDocumentLink = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.procurementDocumentLink };
        this.populateUI(this.procurementDocumentLink);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IProcurementDocumentLink): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeCode: obj.DocumentPurposeCode || '',
IsPrimary:  obj.IsPrimary || false,
 
      }
    );
   
	 this.Caption = "ProcurementDocumentLink Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/documents/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.procurementDocumentLink = { ...this.objMaster };
	var obj  = this.procurementDocumentLink;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeCode: obj.DocumentPurposeCode || '',
IsPrimary:  obj.IsPrimary || false,
 
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
     ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || 0,
DocumentId:  formValues.DocumentId || 0,
DocumentPurposeCode:  formValues.DocumentPurposeCode || null,
IsPrimary:  formValues.IsPrimary || false,

    } as IProcurementDocumentLink ;
	
	this.spinner.show();  	   
    this.procurementDocumentLinkService.update(this.procurementDocumentLink.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ProcurementDocumentLink +  'Details Updated sucessfully.');
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
