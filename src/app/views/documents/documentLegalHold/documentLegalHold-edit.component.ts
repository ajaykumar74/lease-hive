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
import { IDocumentLegalHold } from './documentLegalHold';
import { DocumentLegalHoldService } from './documentLegalHold.service';


@Component({
  selector: 'app-documentLegalHold-edit',
  standalone: false,
  templateUrl: './documentLegalHold-edit.component.html',
  providers: [ MessageService]
})
export class DocumentLegalHoldEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  documentLegalHold: IDocumentLegalHold = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documentidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDocumentLegalHold = {} as IDocumentLegalHold;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private documentLegalHoldService: DocumentLegalHoldService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.documentLegalHold };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
HoldReference: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Reason: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
ReleaseReason: new FormControl('', [Validators.maxLength(100), ]), 

    });

   this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.documentLegalHoldService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.documentLegalHold = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.documentLegalHold };
        this.populateUI(this.documentLegalHold);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IDocumentLegalHold): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
HoldReference: obj.HoldReference || '',
Reason: obj.Reason || '',
ReleaseReason: obj.ReleaseReason || '',
 
      }
    );
   
	 this.Caption = "DocumentLegalHold Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/documentLegalHold/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.documentLegalHold = { ...this.objMaster };
	var obj  = this.documentLegalHold;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
HoldReference: obj.HoldReference || '',
Reason: obj.Reason || '',
ReleaseReason: obj.ReleaseReason || '',
 
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
     DocumentId:  formValues.DocumentId || null,
HoldReference:  formValues.HoldReference || null,
Reason:  formValues.Reason || null,
ReleaseReason:  formValues.ReleaseReason || null,

    } as IDocumentLegalHold ;
	
	this.spinner.show();  	   
    this.documentLegalHoldService.update(this.documentLegalHold.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DocumentLegalHold +  'Details Updated sucessfully.');
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
