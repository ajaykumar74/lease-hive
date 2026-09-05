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
import { IEndOfLeaseNotice } from './endOfLeaseNotice';
import { EndOfLeaseNoticeService } from './endOfLeaseNotice.service';


@Component({
  selector: 'app-endOfLeaseNotice-edit',
  standalone: false,
  templateUrl: './endOfLeaseNotice-edit.component.html',
  providers: [ MessageService]
})
export class EndOfLeaseNoticeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  endOfLeaseNotice: IEndOfLeaseNotice = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endofleasecaseidOptions: ISelectItem[] = [];
noticetypecodeOptions: ISelectItem[] = [];
deliverychannelcodeOptions: ISelectItem[] = [];
customerresponsecodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IEndOfLeaseNotice = {} as IEndOfLeaseNotice;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private endOfLeaseNoticeService: EndOfLeaseNoticeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.endOfLeaseNotice };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
EndOfLeaseCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
NoticeTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
NoticeDate: new FormControl(new Date(), [Validators.required]),
DeliveryChannelCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DeliveredAt: new FormControl(new Date(), []),
ResponseDueDate: new FormControl(new Date(), []),
CustomerResponseCode: new FormControl('', [Validators.maxLength(20), ]), 
ResponseAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId1', Value: 'EndOfLeaseCaseId1' });
this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId2', Value: 'EndOfLeaseCaseId2' });
this.noticetypecodeOptions = this.loggedInUserService.getPicklistOptions('EndOfLeaseNoticeNoticeTypeCode');
this.deliverychannelcodeOptions = this.loggedInUserService.getPicklistOptions('DeliveryChannelCode');
this.customerresponsecodeOptions = this.loggedInUserService.getPicklistOptions('CustomerResponseCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.endOfLeaseNoticeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.endOfLeaseNotice = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.endOfLeaseNotice };
        this.populateUI(this.endOfLeaseNotice);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IEndOfLeaseNotice): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
NoticeTypeCode: obj.NoticeTypeCode || '',
NoticeDate:  obj.NoticeDate || new Date(),
DeliveryChannelCode: obj.DeliveryChannelCode || '',
DeliveredAt:  obj.DeliveredAt || new Date(),
ResponseDueDate:  obj.ResponseDueDate || new Date(),
CustomerResponseCode: obj.CustomerResponseCode || '',
ResponseAt:  obj.ResponseAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "EndOfLeaseNotice Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/notices/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.endOfLeaseNotice = { ...this.objMaster };
	var obj  = this.endOfLeaseNotice;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
NoticeTypeCode: obj.NoticeTypeCode || '',
NoticeDate:  obj.NoticeDate || new Date(),
DeliveryChannelCode: obj.DeliveryChannelCode || '',
DeliveredAt:  obj.DeliveredAt || new Date(),
ResponseDueDate:  obj.ResponseDueDate || new Date(),
CustomerResponseCode: obj.CustomerResponseCode || '',
ResponseAt:  obj.ResponseAt || new Date(),
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
     EndOfLeaseCaseId:  formValues.EndOfLeaseCaseId || null,
NoticeTypeCode:  formValues.NoticeTypeCode || null,
NoticeDate:  formValues.NoticeDate || null,
DeliveryChannelCode:  formValues.DeliveryChannelCode || null,
DeliveredAt:  formValues.DeliveredAt || null,
ResponseDueDate:  formValues.ResponseDueDate || null,
CustomerResponseCode:  formValues.CustomerResponseCode || null,
ResponseAt:  formValues.ResponseAt || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IEndOfLeaseNotice ;
	
	this.spinner.show();  	   
    this.endOfLeaseNoticeService.update(this.endOfLeaseNotice.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(EndOfLeaseNotice +  'Details Updated sucessfully.');
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
