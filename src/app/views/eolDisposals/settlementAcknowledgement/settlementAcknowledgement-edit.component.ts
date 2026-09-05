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
import { ISettlementAcknowledgement } from './settlementAcknowledgement';
import { SettlementAcknowledgementService } from './settlementAcknowledgement.service';


@Component({
  selector: 'app-settlementAcknowledgement-edit',
  standalone: false,
  templateUrl: './settlementAcknowledgement-edit.component.html',
  providers: [ MessageService]
})
export class SettlementAcknowledgementEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  settlementAcknowledgement: ISettlementAcknowledgement = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endofleasesettlementidOptions: ISelectItem[] = [];
responsecodeOptions: ISelectItem[] = [];
respondedbypartyidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISettlementAcknowledgement = {} as ISettlementAcknowledgement;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private settlementAcknowledgementService: SettlementAcknowledgementService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.settlementAcknowledgement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
EndOfLeaseSettlementId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ResponseCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RespondedAt: new FormControl(new Date(), []),
RespondedByPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DisputeReason: new FormControl('', [Validators.maxLength(100), ]), 
ResolvedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.endofleasesettlementidOptions.push({Text: 'EndOfLeaseSettlementId1', Value: 'EndOfLeaseSettlementId1' });
this.endofleasesettlementidOptions.push({Text: 'EndOfLeaseSettlementId2', Value: 'EndOfLeaseSettlementId2' });
this.responsecodeOptions = this.loggedInUserService.getPicklistOptions('ResponseCode');
this.respondedbypartyidOptions.push({Text: 'RespondedByPartyId1', Value: 'RespondedByPartyId1' });
this.respondedbypartyidOptions.push({Text: 'RespondedByPartyId2', Value: 'RespondedByPartyId2' });
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
    this.settlementAcknowledgementService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.settlementAcknowledgement = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.settlementAcknowledgement };
        this.populateUI(this.settlementAcknowledgement);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ISettlementAcknowledgement): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseSettlementId: obj.EndOfLeaseSettlementId || 0,
ResponseCode: obj.ResponseCode || '',
RespondedAt:  obj.RespondedAt || new Date(),
RespondedByPartyId: obj.RespondedByPartyId || 0,
DisputeReason: obj.DisputeReason || '',
ResolvedAt:  obj.ResolvedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "SettlementAcknowledgement Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/settlements/acknowledgements/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.settlementAcknowledgement = { ...this.objMaster };
	var obj  = this.settlementAcknowledgement;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseSettlementId: obj.EndOfLeaseSettlementId || 0,
ResponseCode: obj.ResponseCode || '',
RespondedAt:  obj.RespondedAt || new Date(),
RespondedByPartyId: obj.RespondedByPartyId || 0,
DisputeReason: obj.DisputeReason || '',
ResolvedAt:  obj.ResolvedAt || new Date(),
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
     EndOfLeaseSettlementId:  formValues.EndOfLeaseSettlementId || null,
ResponseCode:  formValues.ResponseCode || null,
RespondedAt:  formValues.RespondedAt || null,
RespondedByPartyId:  formValues.RespondedByPartyId || null,
DisputeReason:  formValues.DisputeReason || null,
ResolvedAt:  formValues.ResolvedAt || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ISettlementAcknowledgement ;
	
	this.spinner.show();  	   
    this.settlementAcknowledgementService.update(this.settlementAcknowledgement.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SettlementAcknowledgement +  'Details Updated sucessfully.');
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
