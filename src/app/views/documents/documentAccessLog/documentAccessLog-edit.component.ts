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
import { IDocumentAccessLog } from './documentAccessLog';
import { DocumentAccessLogService } from './documentAccessLog.service';


@Component({
  selector: 'app-documentAccessLog-edit',
  standalone: false,
  templateUrl: './documentAccessLog-edit.component.html',
  providers: [ MessageService]
})
export class DocumentAccessLogEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  documentAccessLog: IDocumentAccessLog = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documentidOptions: ISelectItem[] = [];
documentversionidOptions: ISelectItem[] = [];
accessactionOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDocumentAccessLog = {} as IDocumentAccessLog;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private documentAccessLogService: DocumentAccessLogService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.documentAccessLog };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentVersionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AccessAction: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
ClientIpAddress: new FormControl('', [Validators.maxLength(45), ]), 

    });

   this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentversionidOptions.push({Text: 'DocumentVersionId1', Value: 'DocumentVersionId1' });
this.documentversionidOptions.push({Text: 'DocumentVersionId2', Value: 'DocumentVersionId2' });
this.accessactionOptions.push({Text: 'Preview', Value: 'Preview' });
this.accessactionOptions.push({Text: 'Download', Value: 'Download' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.documentAccessLogService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.documentAccessLog = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.documentAccessLog };
        this.populateUI(this.documentAccessLog);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IDocumentAccessLog): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
DocumentVersionId: obj.DocumentVersionId || 0,
AccessAction: obj.AccessAction || 0,
ClientIpAddress: obj.ClientIpAddress || '',
 
      }
    );
   
	 this.Caption = "DocumentAccessLog Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/documentAccessLog/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.documentAccessLog = { ...this.objMaster };
	var obj  = this.documentAccessLog;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
DocumentVersionId: obj.DocumentVersionId || 0,
AccessAction: obj.AccessAction || 0,
ClientIpAddress: obj.ClientIpAddress || '',
 
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
AccessAction:  formValues.AccessAction || null,
CorrelationId:  formValues.CorrelationId || null,
ClientIpAddress:  formValues.ClientIpAddress || null,

    } as IDocumentAccessLog ;
	
	this.spinner.show();  	   
    this.documentAccessLogService.update(this.documentAccessLog.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DocumentAccessLog +  'Details Updated sucessfully.');
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
