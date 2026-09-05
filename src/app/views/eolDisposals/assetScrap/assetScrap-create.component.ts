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
import { IAssetScrap } from './assetScrap';
import { AssetScrapService } from './assetScrap.service';

@Component({
  selector: 'app-assetScrap-create',
  standalone: false,
  templateUrl: './assetScrap-create.component.html' ,
   providers: [ MessageService]
})
export class AssetScrapCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetScrap: IAssetScrap = null;
  disposalcaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
recyclerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetScrap = {} as IAssetScrap;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetScrapService: AssetScrapService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetScrap };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RecyclerPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ScrapDate: new FormControl(new Date(), [Validators.required]),
ScrapValueAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
CertificateReference: new FormControl('', [Validators.maxLength(50), ]), 
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create AssetScrap';
    this.disposalcaseidOptions.push({Text: 'DisposalCaseId1', Value: 'DisposalCaseId1' });
this.disposalcaseidOptions.push({Text: 'DisposalCaseId2', Value: 'DisposalCaseId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.recyclerpartyidOptions.push({Text: 'RecyclerPartyId1', Value: 'RecyclerPartyId1' });
this.recyclerpartyidOptions.push({Text: 'RecyclerPartyId2', Value: 'RecyclerPartyId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('AssetScrapStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetScrapService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetScrap = data;
        this.objMaster = { ...this.assetScrap };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetScrap): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
RecyclerPartyId: obj.RecyclerPartyId || 0,
ScrapDate:  obj.ScrapDate || new Date(),
ScrapValueAmount: obj.ScrapValueAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
CertificateReference: obj.CertificateReference || '',
StatusCode: obj.StatusCode || '',
Remarks: obj.Remarks || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetScraps/create']);
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
    this.assetScrap = { ...this.objMaster };
    var obj  = this.assetScrap;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
RecyclerPartyId: obj.RecyclerPartyId || 0,
ScrapDate:  obj.ScrapDate || new Date(),
ScrapValueAmount: obj.ScrapValueAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
CertificateReference: obj.CertificateReference || '',
StatusCode: obj.StatusCode || '',
Remarks: obj.Remarks || '',
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     DisposalCaseId: formValues.DisposalCaseId || 0,
AssetId: formValues.AssetId || 0,
RecyclerPartyId: formValues.RecyclerPartyId || 0,
ScrapDate: formValues.ScrapDate || null,
ScrapValueAmount: formValues.ScrapValueAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
CertificateReference: formValues.CertificateReference || null,
StatusCode: formValues.StatusCode || null,
Remarks: formValues.Remarks || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetScrap ; 
	
	  this.spinner.show(); 
    this.assetScrapService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetScrap +  'Details Updated sucessfully.');
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



