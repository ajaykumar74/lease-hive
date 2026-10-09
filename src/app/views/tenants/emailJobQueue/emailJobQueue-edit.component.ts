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
import { IEmailJobQueue } from './emailJobQueue';
import { EmailJobQueueService } from './emailJobQueue.service';


@Component({
  selector: 'app-emailJobQueue-edit',
  standalone: false,
  templateUrl: './emailJobQueue-edit.component.html',
  providers: [ MessageService]
})
export class EmailJobQueueEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  emailJobQueue: IEmailJobQueue = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  fromprofilecodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IEmailJobQueue = {} as IEmailJobQueue;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private emailJobQueueService: EmailJobQueueService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.emailJobQueue };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
EmailType: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
ReferenceType: new FormControl('', [Validators.maxLength(100), ]), 
ReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
FromProfileCode: new FormControl('', [Validators.maxLength(20), ]), 
ToRecipientsJson: new FormControl('', [Validators.required, Validators.maxLength(1000), ]),
CcRecipientsJson: new FormControl('', [Validators.maxLength(1000), ]), 
BccRecipientsJson: new FormControl('', [Validators.maxLength(1000), ]), 
Subject: new FormControl('', [Validators.required, Validators.maxLength(250), ]),
HtmlBody: new FormControl('', [Validators.required, Validators.maxLength(8000), ]),
AttachmentsJson: new FormControl('', [Validators.maxLength(8000), ]), 
Priority: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
ScheduledAtUtc: new FormControl(new Date(), [Validators.required]),
MaxAttempts: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.fromprofilecodeOptions.push({Text: 'Default', Value: 'Default' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.emailJobQueueService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.emailJobQueue = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.emailJobQueue };
        this.populateUI(this.emailJobQueue);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IEmailJobQueue): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EmailType: obj.EmailType || '',
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
FromProfileCode: obj.FromProfileCode || '',
ToRecipientsJson: obj.ToRecipientsJson || '',
CcRecipientsJson: obj.CcRecipientsJson || '',
BccRecipientsJson: obj.BccRecipientsJson || '',
Subject: obj.Subject || '',
HtmlBody: obj.HtmlBody || '',
AttachmentsJson: obj.AttachmentsJson || '',
Priority: obj.Priority || 0,
ScheduledAtUtc:  obj.ScheduledAtUtc || new Date(),
MaxAttempts: obj.MaxAttempts || 0,
 
      }
    );
   
	 this.Caption = "EmailJobQueue Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/emailJobQueue/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.emailJobQueue = { ...this.objMaster };
	var obj  = this.emailJobQueue;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EmailType: obj.EmailType || '',
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
FromProfileCode: obj.FromProfileCode || '',
ToRecipientsJson: obj.ToRecipientsJson || '',
CcRecipientsJson: obj.CcRecipientsJson || '',
BccRecipientsJson: obj.BccRecipientsJson || '',
Subject: obj.Subject || '',
HtmlBody: obj.HtmlBody || '',
AttachmentsJson: obj.AttachmentsJson || '',
Priority: obj.Priority || 0,
ScheduledAtUtc:  obj.ScheduledAtUtc || new Date(),
MaxAttempts: obj.MaxAttempts || 0,
 
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
     EmailType:  formValues.EmailType || null,
ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || null,
FromProfileCode:  formValues.FromProfileCode || null,
ToRecipientsJson:  formValues.ToRecipientsJson || null,
CcRecipientsJson:  formValues.CcRecipientsJson || null,
BccRecipientsJson:  formValues.BccRecipientsJson || null,
Subject:  formValues.Subject || null,
HtmlBody:  formValues.HtmlBody || null,
AttachmentsJson:  formValues.AttachmentsJson || null,
Priority:  formValues.Priority || null,
ScheduledAtUtc:  formValues.ScheduledAtUtc || null,
MaxAttempts:  formValues.MaxAttempts || null,

    } as IEmailJobQueue ;
	
	this.spinner.show();  	   
    this.emailJobQueueService.update(this.emailJobQueue.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(EmailJobQueue +  'Details Updated sucessfully.');
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
