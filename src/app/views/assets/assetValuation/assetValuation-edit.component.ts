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
import { IAssetValuation } from './assetValuation';
import { AssetValuationService } from './assetValuation.service';


@Component({
  selector: 'app-assetValuation-edit',
  standalone: false,
  templateUrl: './assetValuation-edit.component.html',
  providers: [ MessageService]
})
export class AssetValuationEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetValuation: IAssetValuation = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
valuationtypeidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
valuerpartyidOptions: ISelectItem[] = [];
referencedocumentidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetValuation = {} as IAssetValuation;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetValuationService: AssetValuationService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetValuation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ValuationTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ValuationDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ValuationAmount: new FormControl(0, [Validators.required]),
ValuerPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MethodCode: new FormControl('', [Validators.maxLength(20), ]), 
ReferenceDocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ValidTo: new FormControl(new Date(), []),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 

    });

   this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.valuationtypeidOptions.push({Text: 'ValuationTypeId1', Value: 'ValuationTypeId1' });
this.valuationtypeidOptions.push({Text: 'ValuationTypeId2', Value: 'ValuationTypeId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.valuerpartyidOptions.push({Text: 'ValuerPartyId1', Value: 'ValuerPartyId1' });
this.valuerpartyidOptions.push({Text: 'ValuerPartyId2', Value: 'ValuerPartyId2' });
this.referencedocumentidOptions.push({Text: 'ReferenceDocumentId1', Value: 'ReferenceDocumentId1' });
this.referencedocumentidOptions.push({Text: 'ReferenceDocumentId2', Value: 'ReferenceDocumentId2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetValuationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetValuation = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetValuation };
        this.populateUI(this.assetValuation);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetValuation): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
ValuationTypeId: obj.ValuationTypeId || 0,
ValuationDate:  obj.ValuationDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
ValuationAmount: obj.ValuationAmount || 0,
ValuerPartyId: obj.ValuerPartyId || 0,
MethodCode: obj.MethodCode || '',
ReferenceDocumentId: obj.ReferenceDocumentId || 0,
ValidTo:  obj.ValidTo || new Date(),
Remarks: obj.Remarks || '',
 
      }
    );
   
	 this.Caption = "AssetValuation Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetValuation/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetValuation = { ...this.objMaster };
	var obj  = this.assetValuation;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
ValuationTypeId: obj.ValuationTypeId || 0,
ValuationDate:  obj.ValuationDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
ValuationAmount: obj.ValuationAmount || 0,
ValuerPartyId: obj.ValuerPartyId || 0,
MethodCode: obj.MethodCode || '',
ReferenceDocumentId: obj.ReferenceDocumentId || 0,
ValidTo:  obj.ValidTo || new Date(),
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId:  formValues.AssetId || null,
ValuationTypeId:  formValues.ValuationTypeId || null,
ValuationDate:  formValues.ValuationDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
ValuationAmount:  formValues.ValuationAmount || null,
ValuerPartyId:  formValues.ValuerPartyId || null,
MethodCode:  formValues.MethodCode || null,
ReferenceDocumentId:  formValues.ReferenceDocumentId || null,
ValidTo:  formValues.ValidTo || null,
Remarks:  formValues.Remarks || null,

    } as IAssetValuation ;
	
	this.spinner.show();  	   
    this.assetValuationService.update(this.assetValuation.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetValuation +  'Details Updated sucessfully.');
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
