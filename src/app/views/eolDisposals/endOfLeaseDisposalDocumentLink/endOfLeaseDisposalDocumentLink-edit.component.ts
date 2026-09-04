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
import { IEndOfLeaseDisposalDocumentLink } from './endOfLeaseDisposalDocumentLink';
import { EndOfLeaseDisposalDocumentLinkService } from './endOfLeaseDisposalDocumentLink.service';


@Component({
  selector: 'app-endOfLeaseDisposalDocumentLink-edit',
  standalone: false,
  templateUrl: './endOfLeaseDisposalDocumentLink-edit.component.html',
  providers: [ MessageService]
})
export class EndOfLeaseDisposalDocumentLinkEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  endOfLeaseDisposalDocumentLink: IEndOfLeaseDisposalDocumentLink = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  referencetypecodeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
documentrolecodeOptions: ISelectItem[] = [];
linkedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IEndOfLeaseDisposalDocumentLink = {} as IEndOfLeaseDisposalDocumentLink;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private endOfLeaseDisposalDocumentLinkService: EndOfLeaseDisposalDocumentLinkService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.endOfLeaseDisposalDocumentLink };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReferenceTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentRoleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
LinkedAt: new FormControl(new Date(), [Validators.required]),
LinkedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.referencetypecodeOptions.push({Text: 'CASE', Value: 'CASE' });
this.referencetypecodeOptions.push({Text: 'RETURN', Value: 'RETURN' });
this.referencetypecodeOptions.push({Text: 'SETTLEMENT', Value: 'SETTLEMENT' });
this.referencetypecodeOptions.push({Text: 'DISPOSAL', Value: 'DISPOSAL' });
this.referencetypecodeOptions.push({Text: 'SALE', Value: 'SALE' });
this.referencetypecodeOptions.push({Text: 'SCRAP', Value: 'SCRAP' });
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentrolecodeOptions.push({Text: 'NOTICE', Value: 'NOTICE' });
this.documentrolecodeOptions.push({Text: 'RETURN_FORM', Value: 'RETURN_FORM' });
this.documentrolecodeOptions.push({Text: 'APPROVAL', Value: 'APPROVAL' });
this.documentrolecodeOptions.push({Text: 'SALE_CERT', Value: 'SALE_CERT' });
this.documentrolecodeOptions.push({Text: 'CERTIFICATE', Value: 'CERTIFICATE' });
this.linkedbyuseridOptions.push({Text: 'LinkedByUserId1', Value: 'LinkedByUserId1' });
this.linkedbyuseridOptions.push({Text: 'LinkedByUserId2', Value: 'LinkedByUserId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.endOfLeaseDisposalDocumentLinkService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.endOfLeaseDisposalDocumentLink = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.endOfLeaseDisposalDocumentLink };
        this.populateUI(this.endOfLeaseDisposalDocumentLink);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IEndOfLeaseDisposalDocumentLink): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentRoleCode: obj.DocumentRoleCode || '',
LinkedAt:  obj.LinkedAt || new Date(),
LinkedByUserId: obj.LinkedByUserId || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "EndOfLeaseDisposalDocumentLink Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/endOfLeaseDisposalDocumentLink/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.endOfLeaseDisposalDocumentLink = { ...this.objMaster };
	var obj  = this.endOfLeaseDisposalDocumentLink;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentRoleCode: obj.DocumentRoleCode || '',
LinkedAt:  obj.LinkedAt || new Date(),
LinkedByUserId: obj.LinkedByUserId || 0,
RecordStatus: obj.RecordStatus || '',
 
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
     ReferenceTypeCode:  formValues.ReferenceTypeCode || null,
ReferenceId:  formValues.ReferenceId || null,
DocumentId:  formValues.DocumentId || null,
DocumentRoleCode:  formValues.DocumentRoleCode || null,
LinkedAt:  formValues.LinkedAt || null,
LinkedByUserId:  formValues.LinkedByUserId || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IEndOfLeaseDisposalDocumentLink ;
	
	this.spinner.show();  	   
    this.endOfLeaseDisposalDocumentLinkService.update(this.endOfLeaseDisposalDocumentLink.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(EndOfLeaseDisposalDocumentLink +  'Details Updated sucessfully.');
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
