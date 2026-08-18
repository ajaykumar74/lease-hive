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
import { IOriginationDocumentLink } from './originationDocumentLink';
import { OriginationDocumentLinkService } from './originationDocumentLink.service';


@Component({
  selector: 'app-originationDocumentLink-edit',
  standalone: false,
  templateUrl: './originationDocumentLink-edit.component.html',
  providers: [ MessageService]
})
export class OriginationDocumentLinkEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  originationDocumentLink: IOriginationDocumentLink = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  referencetypeOptions: ISelectItem[] = [];
documentpurposecodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IOriginationDocumentLink = {} as IOriginationDocumentLink;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private originationDocumentLinkService: OriginationDocumentLinkService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.originationDocumentLink };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentPurposeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IsPrimary: new FormControl(false, [Validators.required]),

    });

   this.referencetypeOptions.push({Text: 'LEAD', Value: 'LEAD' });
this.referencetypeOptions.push({Text: 'OPPORTUNITY', Value: 'OPPORTUNITY' });
this.referencetypeOptions.push({Text: 'REQUIREMENT', Value: 'REQUIREMENT' });
this.referencetypeOptions.push({Text: 'QUOTE', Value: 'QUOTE' });
this.referencetypeOptions.push({Text: 'CREDIT', Value: 'CREDIT' });
this.documentpurposecodeOptions.push({Text: 'FINANCIAL_STATEMENT', Value: 'FINANCIAL_STATEMENT' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.originationDocumentLinkService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.originationDocumentLink = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.originationDocumentLink };
        this.populateUI(this.originationDocumentLink);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IOriginationDocumentLink): void {  
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
   
	 this.Caption = "OriginationDocumentLink Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/originationDocumentLink/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.originationDocumentLink = { ...this.objMaster };
	var obj  = this.originationDocumentLink;
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
ReferenceId:  formValues.ReferenceId || null,
DocumentId:  formValues.DocumentId || null,
DocumentPurposeCode:  formValues.DocumentPurposeCode || null,
IsPrimary:  formValues.IsPrimary || null,

    } as IOriginationDocumentLink ;
	
	this.spinner.show();  	   
    this.originationDocumentLinkService.update(this.originationDocumentLink.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(OriginationDocumentLink +  'Details Updated sucessfully.');
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
