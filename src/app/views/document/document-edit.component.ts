import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


import { MessageService, ConfirmationService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { AppUtilityService } from '@/shared/utilities/utility-service';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { IDocument } from './document';
import { DocumentService } from './document.service';
import { IPicklistItem } from '../picklistItem/picklistItem';
import { PickListService } from '@/shared/PicklistService';
import { CombineCriteriaType, LoggedInUserService, Operator, IStateData, DataType, } from '@/shared/LoggedInUserService';
import { AppConstants } from '@/shared/constants/AppConstants'; 
import { CustomerService } from '../customer/customer.service';
import { ICustomer } from '../customer/customer';

@Component({
  selector: 'app-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  providers: [MessageService, ConfirmationService]
})
export class DocumentEditComponent implements OnInit {

  pickListServiceOptions: any;
  selectedId: number;
  isLoading: boolean = false;
  document: IDocument = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  discounttypeOptions: ISelectItem[] = [];
  brandPartners: IPicklistItem[];
  selectedBrandPartners: number[] = [];

  editForm: any;
  objMaster: IDocument = {} as IDocument;
  stateData: IStateData;
  recordType: string = '';
  isShowDeleteBtn: boolean = false;
  isBrandPartner: boolean;
  lstCustomer: ICustomer[];

  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private documentService: DocumentService,
    private appUtil: AppUtilityService,
    private pickListService: PickListService,
    private loggedInUserService: LoggedInUserService,
    private readonly appConst: AppConstants, 
    private confirmationService: ConfirmationService,
    private readonly customerService: CustomerService,
  ) {
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;



  ngOnInit(): void {
    this.isBrandPartner = this.loggedInUserService.IsBrandPartner;
    this.pickListServiceOptions = this.pickListService;
    this.objMaster = { ...this.document };
    this.isShowDeleteBtn = (this.loggedInUserService.loggedInUser.Role == this.appConst.Role.PartnerOwner
      || this.loggedInUserService.loggedInUser.Role == this.appConst.Role.MemberOwner);

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      RelatedTo: new FormControl('', [Validators.required]),
      DocumentType: new FormControl('', [Validators.required]),
      DocumentNumber: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      Description: new FormControl('', [Validators.maxLength(100),]),
      IssuedBy: new FormControl('', [Validators.maxLength(50),]),
      UploadedFiles: new FormControl(''),
      FileName: new FormControl(''),
      FileType: new FormControl(''),
      Size: 0,
      IssuedOnDate: new FormControl(null),
      ValidTillDate: new FormControl(null),
    });
this.discounttypeOptions = this.loggedInUserService.getPicklistOptions('DiscountType');
    this.selectedId = this.activatedRouter.snapshot.params['id'];

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.isBrandPartner) {
        this.loadCustomer();
      }
      this.loadUI();
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.documentService.getById(this.selectedId).subscribe({
      next: data => {
        this.document = data.data;
        this.permission = data.permission;
        this.objMaster = { ...this.document };
        this.populateUI(this.document);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }

  populateUI(obj: IDocument): void {
    this.recordType = obj.RecordByType;

    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        DocumentType: obj.DocumentType,
        DocumentNumber: obj.DocumentNumber,
        Description: obj.Description,
        IssuedBy: obj.IssuedBy,
        IssuedOnDate: obj.IssuedOnDate ? new Date(obj.IssuedOnDate) : null,
        ValidTillDate: obj.ValidTillDate ? new Date(obj.ValidTillDate) : null,

        DisplayName: obj.FileName || null,
        FileName: obj.FileName || null,
        FileType: obj.FileType || null,
        Size: obj.Size,
      }

    );

    if (this.document.RecordByType == this.appConst.RecordType.Vehicle) {
      this.Caption = this.document.RecordByType + ' Documents #' + this.document.DisplayName;
       
    }
    else if (this.document.RecordByType == this.appConst.RecordType.Customer) {
      this.Caption = 'My Documents'
    }
    else {
      this.Caption = 'My Documents'
    }
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/document/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Delete") {
      this.Delete();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.editForm.reset();
    this.document = { ...this.objMaster };
    this.populateUI(this.document);
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
    this.editForm.updateValueAndValidity();
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
        setTimeout(() => {
          const relatedTo = (this.isBrandPartner && this.document.RecordByType == this.appConst.RecordType.BrandPartner) ?
            0 : Number(this.document.RecordById);
          const control = this.editForm.get('RelatedTo');
          control?.setValue(relatedTo);
          control?.markAsDirty();
          control?.markAsTouched();
          control?.updateValueAndValidity();
        }, 100);

      },
      error: err => {
      },
      complete: () => { this.isLoading = false; }
    });

  }

  Save(): void {

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

    let RecordByType = this.objMaster.RecordByType;
    let RecordById = this.objMaster.RecordById;

    if (formValues.RelatedTo > 0) {
      RecordByType = this.appConst.RecordType.Customer;
      RecordById = formValues.RelatedTo;
    }
    else {
      RecordByType = this.appConst.RecordType.BrandPartner;
      RecordById = this.loggedInUserService.loggedInUser.RecordId;
    }


    var updatedObj = {
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      Version: this.objMaster.Version,
      RecordByType: RecordByType,
      RecordById: RecordById,
      DocumentNumber: formValues.DocumentNumber || null,
      IssuedBy: formValues.IssuedBy || null,
      IssuedOnDate: formValues.IssuedOnDate,
      ValidTillDate: formValues.ValidTillDate,
      DocumentType: formValues.DocumentType,
      UploadedPath: formValues.UploadedPath,
      UploadedFiles: formValues.UploadedFiles,
      DisplayName: formValues.FileName || null,
      FileName: formValues.FileName || null,
      FileType: formValues.FileType || null,
      Size: formValues.Size,
      Description: formValues.Description || null,
      Status: this.objMaster.Status
    } as IDocument;



    this.spinner.show();
    this.documentService.update(this.document.Id, updatedObj).subscribe({
      next: data => {
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

  Delete(): void {
    this.confirmationService.confirm({
      key: 'confirm1',
      message: 'Are you sure you want to delete the document "' + this.document.FileName + '"?',
      accept: () => {
        this.spinner.showLoadingMsg('Deleting document...');
        this.documentService.delete(this.document.Id).subscribe({
          next: data => {
            this.documentService.CacheData.IsLoaded = false;
            this._location.back();
          },
          error: err => {
            this.messageService.showError(err);
            this.spinner.hide();
          },
          complete: () => { this.spinner.hide(); }
        });
      },
      reject: () => { }
    });






  }


  normalizeDate(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
}
