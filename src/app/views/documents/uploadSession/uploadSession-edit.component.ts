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
import { IUploadSession } from './uploadSession';
import { UploadSessionService } from './uploadSession.service';


@Component({
  selector: 'app-uploadSession-edit',
  standalone: false,
  templateUrl: './uploadSession-edit.component.html',
  providers: [ MessageService]
})
export class UploadSessionEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  uploadSession: IUploadSession = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documentidOptions: ISelectItem[] = [];
documentversionidOptions: ISelectItem[] = [];
statusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IUploadSession = {} as IUploadSession;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private uploadSessionService: UploadSessionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.uploadSession };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentVersionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ExpiresAtUtc: new FormControl(new Date(), [Validators.required]),
Status: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
ObjectETag: new FormControl('', [Validators.maxLength(256), ]), 
FailureReason: new FormControl('', [Validators.maxLength(100), ]), 

    });

   this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentversionidOptions.push({Text: 'DocumentVersionId1', Value: 'DocumentVersionId1' });
this.documentversionidOptions.push({Text: 'DocumentVersionId2', Value: 'DocumentVersionId2' });
this.statusOptions.push({Text: 'Created', Value: 'Created' });
this.statusOptions.push({Text: 'FileUploaded', Value: 'FileUploaded' });
this.statusOptions.push({Text: 'Completed', Value: 'Completed' });
this.statusOptions.push({Text: 'Expired', Value: 'Expired' });
this.statusOptions.push({Text: 'Failed', Value: 'Failed' });
this.statusOptions.push({Text: 'Cancelled', Value: 'Cancelled' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.uploadSessionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.uploadSession = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.uploadSession };
        this.populateUI(this.uploadSession);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IUploadSession): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
DocumentVersionId: obj.DocumentVersionId || 0,
ExpiresAtUtc:  obj.ExpiresAtUtc || null,
Status: obj.Status || 0,
ObjectETag: obj.ObjectETag || '',
FailureReason: obj.FailureReason || '',
 
      }
    );
   
	 this.Caption = "UploadSession Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/upload-sessions/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.uploadSession = { ...this.objMaster };
	var obj  = this.uploadSession;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
DocumentVersionId: obj.DocumentVersionId || 0,
ExpiresAtUtc:  obj.ExpiresAtUtc || null,
Status: obj.Status || 0,
ObjectETag: obj.ObjectETag || '',
FailureReason: obj.FailureReason || '',
 
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
DocumentVersionId:  formValues.DocumentVersionId || null,
ExpiresAtUtc:  formValues.ExpiresAtUtc || null,
Status:  formValues.Status || null,
ObjectETag:  formValues.ObjectETag || null,
FailureReason:  formValues.FailureReason || null,

    } as IUploadSession ;
	
	this.spinner.show();  	   
    this.uploadSessionService.update(this.uploadSession.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(UploadSession +  'Details Updated sucessfully.');
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
