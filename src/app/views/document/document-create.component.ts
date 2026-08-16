import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { CombineCriteriaType, LoggedInUserService, Operator, IStateData, DataType, } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IDocument } from './document';
import { DocumentService } from './document.service';
import { IPicklistItem } from '../picklistItem/picklistItem';
import { PickListService } from '@/shared/PicklistService';
import { AppConstants } from '@/shared/constants/AppConstants';
import { CustomerService } from '../customer/customer.service';
import { ICustomer } from '../customer/customer';

@Component({
  selector: 'app-document-create',
  standalone: false,
  templateUrl: './document-create.component.html',
  providers: [MessageService]
})
export class DocumentCreateComponent implements OnInit {

  pickListServiceOptions: any;
  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Document';
  document: IDocument = null;
  discounttypeOptions: ISelectItem[] = [];
  brandPartners: IPicklistItem[];
  editForm: any;
  objMaster: IDocument = {} as IDocument;
  stateData: IStateData;
  recordType: string = '';
  isBrandPartner: boolean;
  lstCustomer: ICustomer[];

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private documentService: DocumentService,
    private loggedInUserService: LoggedInUserService,
    private pickListService: PickListService,
    private readonly appConst: AppConstants,
    private readonly customerService: CustomerService,
  ) {
  }

  ngOnInit(): void {
    this.isBrandPartner = this.loggedInUserService.IsBrandPartner;
    this.pickListServiceOptions = this.pickListService;
    this.objMaster = { ...this.document };
    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      RelatedTo: new FormControl('', [Validators.required]),
      DocumentType: new FormControl('', [Validators.required]),
      DocumentNumber: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      Description: new FormControl('', [Validators.maxLength(100),]),
      IssuedBy: new FormControl('', [Validators.maxLength(50),]),
      IssuedOnDate: new FormControl(null),
      ValidTillDate: new FormControl(null),
      UploadedFiles: new FormControl(''),
      FileName: new FormControl(''),
      FileType: new FormControl(''),
      Size: 0
    });
this.discounttypeOptions = this.loggedInUserService.getPicklistOptions('DiscountType');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.isBrandPartner) {
        this.loadCustomer();
      }
      var nState = this.router.lastSuccessfulNavigation?.extras.state;
      this.stateData = nState['stateData'] as IStateData;
      this.recordType = this.stateData.RecordType;
      if (this.recordType == this.appConst.RecordType.Vehicle) {
        this.Caption = "Upload Vehicle Document #" + this.stateData.Data.Vrm;
      }
      else {
        this.Caption = "Upload My Document ";
      }
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.documentService.getById(this.selectedId).subscribe({
      next: data => {
        this.document = data;
        this.objMaster = { ...this.document };
        this.populateUI(data);

      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });

  }

  loadCustomer(): void {
    let Items = [{ DBName: 'C.BrandPartnerId;C.BrandPartnerId', Value: this.loggedInUserService.loggedInUser.BrandPartner.Id.toString() + ';-1', DataType: DataType.Int, Operator: Operator.EqualTo, CombineCriteria: CombineCriteriaType.CombineOR },
    ];

    var searchParam = {
      Skip: 0,
      Take: 1000,
      SortBy: 'C.BusinessName',
      IsDescending: false,
      Conditions: Items,
    }
    this.isLoading = true;
    this.customerService.search(searchParam).subscribe({
      next: res => {
        this.permission = res.permission;
        this.permission.CanCreate = true;
        this.lstCustomer = [
          { Id: 0, BusinessName: 'Myself' },
          ...res.data.Records.filter(
            c => c.BusinessName && c.BusinessName.trim() !== ''
          )
        ];
        this.editForm.patchValue({
          RelatedTo: 0
        });
      },
      error: err => {
      },
      complete: () => { this.isLoading = false; }
    });

  }

  populateUI(obj: IDocument): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        DocumentNumber: null,
        IssuedBy: null,
        IssuedOnDate: null,
        ValidTillDate: null,
        DocumentType: null,
        Description: null,
        UploadedFiles: null,
        DisplayName: null,
        FileName: null,
        FileType: null,
        Size: null,
        RecordByType: this.stateData.RecordType,
        RecordById: this.stateData.Id,
      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/documents/create']);
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
  onFileError(event: any) {
    this.messageService.showError(event);
  }

  onUploadFinished(event: any) {
    debugger;
    var fileExt = event.FileName.split('.').pop();
    this.editForm.patchValue({
      UploadedFiles: event.UploadedFile,
      FileName: event.FileName,
      FileType: '.' + fileExt,
      Size: event.FileSize
    });

    if (this.document == null) {
      this.document = {} as IDocument;
    }
  }

  onCancel(): void {
    this.document = { ...this.objMaster };
    var obj = this.document;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        DocumentNumber: obj.DocumentNumber || null,
        IssuedBy: obj.IssuedBy || null,
        IssuedOnDate: obj.IssuedOnDate ? new Date(obj.IssuedOnDate) : null,
        ValidTillDate: obj.ValidTillDate ? new Date(obj.ValidTillDate) : null,
        DocumentType: obj.DocumentType,
        Description: obj.Description,
        UploadedFiles: obj.UploadedFiles || null,
        DisplayName: obj.FileName || null,
        FileName: obj.FileName || null,
        FileType: obj.FileType || null,
        Size: obj.Size,
      }
    );
  }


  Save(): void {
    debugger;
    if (!this.editForm.valid) {
      this.messageService.showError('One or more validation failed. Please clear error to continue...');
      return;
    }

    const formValues = this.editForm.value;

    const issued = formValues.IssuedOnDate;
    const validTill = formValues.ValidTillDate;

    if ((issued && !validTill) || (!issued && validTill)) {
      this.messageService.showError('Please select both Issued On and Valid Till dates.');
      return;
    }

    if (issued && validTill && new Date(validTill) < new Date(issued)) {
      this.messageService.showError('Issued On date cannot be greater than Valid Till date.');
      return;
    }

    if (formValues.FileName == '') {
      this.messageService.showError('Please attach a file before saving the document details.');
      return;
    }

    let RecordByType = this.stateData.RecordType;
    let RecordById = this.stateData.Id;

    if (formValues.RelatedTo > 0) {
      RecordByType = this.appConst.RecordType.Customer;
      RecordById = formValues.RelatedTo;
    }

    var createdObj = {
      Id: this.objMaster.Id,
      DocumentNumber: formValues.DocumentNumber || null,
      IssuedBy: formValues.IssuedBy || null,
      IssuedOnDate: formValues.IssuedOnDate,
      ValidTillDate: formValues.ValidTillDate,
      DocumentType: formValues.DocumentType,
      Description: formValues.Description,
      UploadedFiles: formValues.UploadedFiles,
      DisplayName: formValues.FileName || null,
      FileName: formValues.FileName || null,
      FileType: formValues.FileType || null,
      Size: formValues.Size,
      RecordByType: RecordByType,
      RecordById: RecordById,

    } as IDocument;


    this.spinner.show();
    this.documentService.create(createdObj).subscribe({
      next: data => {
        // this.messageService.showSuccess(Document +  'Details Updated sucessfully.');
        this.documentService.CacheData.IsLoaded = false;
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



