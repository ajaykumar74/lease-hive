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
import { IAssetScrap } from './assetScrap';
import { AssetScrapService } from './assetScrap.service';


@Component({
  selector: 'app-assetScrap-edit',
  standalone: false,
  templateUrl: './assetScrap-edit.component.html',
  providers: [ MessageService]
})
export class AssetScrapEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetScrap: IAssetScrap = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalcaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
recyclerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetScrap = {} as IAssetScrap;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetScrapService: AssetScrapService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetScrap };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.disposalcaseidOptions.push({Text: 'DisposalCaseId1', Value: 'DisposalCaseId1' });
this.disposalcaseidOptions.push({Text: 'DisposalCaseId2', Value: 'DisposalCaseId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.recyclerpartyidOptions.push({Text: 'RecyclerPartyId1', Value: 'RecyclerPartyId1' });
this.recyclerpartyidOptions.push({Text: 'RecyclerPartyId2', Value: 'RecyclerPartyId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.statuscodeOptions.push({Text: 'PLANNED', Value: 'PLANNED' });
this.statuscodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.statuscodeOptions.push({Text: 'COMPLETED', Value: 'COMPLETED' });
this.statuscodeOptions.push({Text: 'CANCELLED', Value: 'CANCELLED' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetScrapService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetScrap = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetScrap };
        this.populateUI(this.assetScrap);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "AssetScrap Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/disposition/scrap/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     DisposalCaseId:  formValues.DisposalCaseId || null,
AssetId:  formValues.AssetId || null,
RecyclerPartyId:  formValues.RecyclerPartyId || null,
ScrapDate:  formValues.ScrapDate || null,
ScrapValueAmount:  formValues.ScrapValueAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
CertificateReference:  formValues.CertificateReference || null,
StatusCode:  formValues.StatusCode || null,
Remarks:  formValues.Remarks || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetScrap ;
	
	this.spinner.show();  	   
    this.assetScrapService.update(this.assetScrap.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetScrap +  'Details Updated sucessfully.');
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
