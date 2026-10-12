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
import { IDocumentVersion } from './documentVersion';
import { DocumentVersionService } from './documentVersion.service';


@Component({
  selector: 'app-documentVersion-edit',
  standalone: false,
  templateUrl: './documentVersion-edit.component.html',
  providers: [ MessageService]
})
export class DocumentVersionEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  documentVersion: IDocumentVersion = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documentidOptions: ISelectItem[] = [];
storageproviderOptions: ISelectItem[] = [];
filestatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDocumentVersion = {} as IDocumentVersion;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private documentVersionService: DocumentVersionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.documentVersion };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
VersionNumber: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StorageProvider: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
StorageKey: new FormControl('', [Validators.required, Validators.maxLength(512), ]),
StorageETag: new FormControl('', [Validators.maxLength(256), ]), 
OriginalFileName: new FormControl('', [Validators.required, Validators.maxLength(260), ]),
ContentType: new FormControl('', [Validators.required, Validators.maxLength(150), ]),
FileExtension: new FormControl('', [Validators.maxLength(20), ]), 
ExpectedSizeBytes: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StoredSizeBytes: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Sha256: new FormControl('', [Validators.maxLength(64), ]), 
FileStatus: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
ScanEngine: new FormControl('', [Validators.maxLength(100), ]), 
ScanResult: new FormControl('', [Validators.maxLength(100), ]), 

    });

   this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.storageproviderOptions.push({Text: 'AzureBlob', Value: 'AzureBlob' });
this.storageproviderOptions.push({Text: 'S3', Value: 'S3' });
this.storageproviderOptions.push({Text: 'LocalDevelopment', Value: 'LocalDevelopment' });
this.filestatusOptions.push({Text: 'AwaitingUpload', Value: 'AwaitingUpload' });
this.filestatusOptions.push({Text: 'Uploaded', Value: 'Uploaded' });
this.filestatusOptions.push({Text: 'ScanPending', Value: 'ScanPending' });
this.filestatusOptions.push({Text: 'Available', Value: 'Available' });
this.filestatusOptions.push({Text: 'Quarantined', Value: 'Quarantined' });
this.filestatusOptions.push({Text: 'Failed', Value: 'Failed' });
this.filestatusOptions.push({Text: 'UploadExpired', Value: 'UploadExpired' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.documentVersionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.documentVersion = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.documentVersion };
        this.populateUI(this.documentVersion);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IDocumentVersion): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
VersionNumber: obj.VersionNumber || 0,
StorageProvider: obj.StorageProvider || '',
StorageKey: obj.StorageKey || '',
StorageETag: obj.StorageETag || '',
OriginalFileName: obj.OriginalFileName || '',
ContentType: obj.ContentType || '',
FileExtension: obj.FileExtension || '',
ExpectedSizeBytes: obj.ExpectedSizeBytes || 0,
StoredSizeBytes: obj.StoredSizeBytes || 0,
Sha256: obj.Sha256 || '',
FileStatus: obj.FileStatus || 0,
ScanEngine: obj.ScanEngine || '',
ScanResult: obj.ScanResult || '',
 
      }
    );
   
	 this.Caption = "DocumentVersion Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/documentVersion/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.documentVersion = { ...this.objMaster };
	var obj  = this.documentVersion;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
VersionNumber: obj.VersionNumber || 0,
StorageProvider: obj.StorageProvider || '',
StorageKey: obj.StorageKey || '',
StorageETag: obj.StorageETag || '',
OriginalFileName: obj.OriginalFileName || '',
ContentType: obj.ContentType || '',
FileExtension: obj.FileExtension || '',
ExpectedSizeBytes: obj.ExpectedSizeBytes || 0,
StoredSizeBytes: obj.StoredSizeBytes || 0,
Sha256: obj.Sha256 || '',
FileStatus: obj.FileStatus || 0,
ScanEngine: obj.ScanEngine || '',
ScanResult: obj.ScanResult || '',
 
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
VersionNumber:  formValues.VersionNumber || null,
StorageProvider:  formValues.StorageProvider || null,
StorageKey:  formValues.StorageKey || null,
StorageETag:  formValues.StorageETag || null,
OriginalFileName:  formValues.OriginalFileName || null,
ContentType:  formValues.ContentType || null,
FileExtension:  formValues.FileExtension || null,
ExpectedSizeBytes:  formValues.ExpectedSizeBytes || null,
StoredSizeBytes:  formValues.StoredSizeBytes || null,
Sha256:  formValues.Sha256 || null,
FileStatus:  formValues.FileStatus || null,
ScanEngine:  formValues.ScanEngine || null,
ScanResult:  formValues.ScanResult || null,

    } as IDocumentVersion ;
	
	this.spinner.show();  	   
    this.documentVersionService.update(this.documentVersion.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DocumentVersion +  'Details Updated sucessfully.');
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
