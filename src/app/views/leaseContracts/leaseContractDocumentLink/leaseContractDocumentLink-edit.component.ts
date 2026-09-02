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
import { ILeaseContractDocumentLink } from './leaseContractDocumentLink';
import { LeaseContractDocumentLinkService } from './leaseContractDocumentLink.service';


@Component({
  selector: 'app-leaseContractDocumentLink-edit',
  standalone: false,
  templateUrl: './leaseContractDocumentLink-edit.component.html',
  providers: [ MessageService]
})
export class LeaseContractDocumentLinkEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  leaseContractDocumentLink: ILeaseContractDocumentLink = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  referencetypeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
documentpurposecodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeaseContractDocumentLink = {} as ILeaseContractDocumentLink;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leaseContractDocumentLinkService: LeaseContractDocumentLinkService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leaseContractDocumentLink };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentPurposeCode: new FormControl('', [Validators.maxLength(20), ]), 
DocumentVersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
IsPrimary: new FormControl(false, [Validators.required]),

    });

   this.referencetypeOptions.push({Text: 'CONTRACT', Value: 'CONTRACT' });
this.referencetypeOptions.push({Text: 'AMENDMENT', Value: 'AMENDMENT' });
this.referencetypeOptions.push({Text: 'TERMINATION', Value: 'TERMINATION' });
this.referencetypeOptions.push({Text: 'CONDITION', Value: 'CONDITION' });
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentpurposecodeOptions.push({Text: 'AGREEMENT', Value: 'AGREEMENT' });
this.documentpurposecodeOptions.push({Text: 'KYC', Value: 'KYC' });
this.documentpurposecodeOptions.push({Text: 'GUARANTEE', Value: 'GUARANTEE' });
this.documentpurposecodeOptions.push({Text: 'SCHEDULE', Value: 'SCHEDULE' });
this.documentpurposecodeOptions.push({Text: 'NOTICE', Value: 'NOTICE' });
this.documentpurposecodeOptions.push({Text: 'OTHER', Value: 'OTHER' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.leaseContractDocumentLinkService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leaseContractDocumentLink = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leaseContractDocumentLink };
        this.populateUI(this.leaseContractDocumentLink);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ILeaseContractDocumentLink): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeCode: obj.DocumentPurposeCode || '',
DocumentVersionNo: obj.DocumentVersionNo || 0,
IsPrimary:  obj.IsPrimary || false,
 
      }
    );
   
	 this.Caption = "LeaseContractDocumentLink Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/leaseContractDocumentLink/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.leaseContractDocumentLink = { ...this.objMaster };
	var obj  = this.leaseContractDocumentLink;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeCode: obj.DocumentPurposeCode || '',
DocumentVersionNo: obj.DocumentVersionNo || 0,
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
ReferenceId:  formValues.ReferenceId || null,
DocumentId:  formValues.DocumentId || null,
DocumentPurposeCode:  formValues.DocumentPurposeCode || null,
DocumentVersionNo:  formValues.DocumentVersionNo || null,
IsPrimary:  formValues.IsPrimary || null,

    } as ILeaseContractDocumentLink ;
	
	this.spinner.show();  	   
    this.leaseContractDocumentLinkService.update(this.leaseContractDocumentLink.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeaseContractDocumentLink +  'Details Updated sucessfully.');
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
