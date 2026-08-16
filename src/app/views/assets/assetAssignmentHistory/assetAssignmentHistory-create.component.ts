import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAssetAssignmentHistory } from './assetAssignmentHistory';
import { AssetAssignmentHistoryService } from './assetAssignmentHistory.service';

@Component({
  selector: 'app-assetAssignmentHistory-create',
  standalone: false,
  templateUrl: './assetAssignmentHistory-create.component.html' ,
   providers: [ MessageService]
})
export class AssetAssignmentHistoryCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset Assignment History';
  assetAssignmentHistory: IAssetAssignmentHistory = null;
  eventtypeidOptions: ISelectItem[] = [];
fromassetuseridOptions: ISelectItem[] = [];
toassetuseridOptions: ISelectItem[] = [];
frompartylocationidOptions: ISelectItem[] = [];
topartylocationidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetAssignmentHistory = {} as IAssetAssignmentHistory;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetAssignmentHistoryService: AssetAssignmentHistoryService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetAssignmentHistory };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
EventTypeId: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EventDateTime: new FormControl(new Date(), [Validators.required]),
FromAssetUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ToAssetUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
FromPartyLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ToPartyLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
Remarks: new FormControl('', [Validators.required, Validators.maxLength(100), ]),

    });
    this.eventtypeidOptions.push({Text: 'Created', Value: 'Created' });
this.eventtypeidOptions.push({Text: 'Changed', Value: 'Changed' });
this.eventtypeidOptions.push({Text: 'Ended', Value: 'Ended' });
this.eventtypeidOptions.push({Text: 'Transferred', Value: 'Transferred' });
this.fromassetuseridOptions.push({Text: 'Assetuser1', Value: 'Assetuser1' });
this.fromassetuseridOptions.push({Text: 'Assetuser2', Value: 'Assetuser2' });
this.toassetuseridOptions.push({Text: 'Assetuser1', Value: 'Assetuser1' });
this.toassetuseridOptions.push({Text: 'Assetuser2', Value: 'Assetuser2' });
this.frompartylocationidOptions.push({Text: 'PartLocation1', Value: 'PartLocation1' });
this.frompartylocationidOptions.push({Text: 'PartyLocation2', Value: 'PartyLocation2' });
this.topartylocationidOptions.push({Text: 'Lease', Value: 'Lease' });
this.topartylocationidOptions.push({Text: 'Custody', Value: 'Custody' });
this.topartylocationidOptions.push({Text: 'Demo', Value: 'Demo' });
this.topartylocationidOptions.push({Text: 'Internal', Value: 'Internal' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetAssignmentHistoryService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetAssignmentHistory = data;
        this.objMaster = { ...this.assetAssignmentHistory };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetAssignmentHistory): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EventTypeId: obj.EventTypeId || '',
EventDateTime:  obj.EventDateTime || new Date(),
FromAssetUserId: obj.FromAssetUserId || 0,
ToAssetUserId: obj.ToAssetUserId || 0,
FromPartyLocationId: obj.FromPartyLocationId || 0,
ToPartyLocationId: obj.ToPartyLocationId || 0,
Remarks: obj.Remarks || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetAssignmentHistorys/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
    else if (key == "Refresh") {
      this.loadUI();
    }
  }

  onCancel(): void {
    this.assetAssignmentHistory = { ...this.objMaster };
    var obj  = this.assetAssignmentHistory;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EventTypeId: obj.EventTypeId || '',
EventDateTime:  obj.EventDateTime || new Date(),
FromAssetUserId: obj.FromAssetUserId || 0,
ToAssetUserId: obj.ToAssetUserId || 0,
FromPartyLocationId: obj.FromPartyLocationId || 0,
ToPartyLocationId: obj.ToPartyLocationId || 0,
Remarks: obj.Remarks || '',
 
      }
    );
    this.editForm.reset(); 
  } 

  Save(): void {    
   
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }	
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     EventTypeId: formValues.EventTypeId || null,
EventDateTime: formValues.EventDateTime || null,
FromAssetUserId: formValues.FromAssetUserId || 0,
ToAssetUserId: formValues.ToAssetUserId || 0,
FromPartyLocationId: formValues.FromPartyLocationId || 0,
ToPartyLocationId: formValues.ToPartyLocationId || 0,
Remarks: formValues.Remarks || null,

    } as IAssetAssignmentHistory ; 
	
	  this.spinner.show(); 
    this.assetAssignmentHistoryService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetAssignmentHistory +  'Details Updated sucessfully.');
		 this._location.back();     
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

}



