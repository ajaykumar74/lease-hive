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
import { ISupportTicketStatusHistory } from './supportTicketStatusHistory';
import { SupportTicketStatusHistoryService } from './supportTicketStatusHistory.service';


@Component({
  selector: 'app-supportTicketStatusHistory-edit',
  standalone: false,
  templateUrl: './supportTicketStatusHistory-edit.component.html',
  providers: [ MessageService]
})
export class SupportTicketStatusHistoryEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  supportTicketStatusHistory: ISupportTicketStatusHistory = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supportticketidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISupportTicketStatusHistory = {} as ISupportTicketStatusHistory;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private supportTicketStatusHistoryService: SupportTicketStatusHistoryService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.supportTicketStatusHistory };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
SupportTicketId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.supportticketidOptions.push({Text: 'SupportTicketId1', Value: 'SupportTicketId1' });
this.supportticketidOptions.push({Text: 'SupportTicketId2', Value: 'SupportTicketId2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.supportTicketStatusHistoryService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.supportTicketStatusHistory = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.supportTicketStatusHistory };
        this.populateUI(this.supportTicketStatusHistory);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ISupportTicketStatusHistory): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupportTicketId: obj.SupportTicketId || 0,
 
      }
    );
   
	 this.Caption = "SupportTicketStatusHistory Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supportTicketStatusHistory/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.supportTicketStatusHistory = { ...this.objMaster };
	var obj  = this.supportTicketStatusHistory;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupportTicketId: obj.SupportTicketId || 0,
 
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
     SupportTicketId:  formValues.SupportTicketId || null,

    } as ISupportTicketStatusHistory ;
	
	this.spinner.show();  	   
    this.supportTicketStatusHistoryService.update(this.supportTicketStatusHistory.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SupportTicketStatusHistory +  'Details Updated sucessfully.');
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
