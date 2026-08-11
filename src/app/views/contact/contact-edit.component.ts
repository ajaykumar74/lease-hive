import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IContact } from './contact';
import { ContactService } from './contact.service';
import { PickListService } from '@/shared/PicklistService';


@Component({
  selector: 'app-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  providers: [MessageService]
})
export class ContactEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  contact: IContact = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  designationOptions: ISelectItem[] = [];
  departmentOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: IContact = {} as IContact;


  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private contactService: ContactService,
    private loggedInUserService: LoggedInUserService,
    private pickListService: PickListService
  ) {
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  designationList: any[] = [];
  departmentList: any[] = [];


  ngOnInit(): void {
    this.objMaster = { ...this.contact };
    this.departmentList = this.pickListService.departmentList;
    this.designationList = this.pickListService.designationList;
    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(35),]),
      LastName: new FormControl('', [Validators.required, Validators.maxLength(35),]),
      EmailId: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)]),
      Mobile: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern(/^[0-9]*$/)],),
      Designation: new FormControl('', [Validators.maxLength(20),]),
      Department: new FormControl('', [Validators.maxLength(20),]),
      IsConfidential: new FormControl(false),
      IsDeleted: new FormControl(false),
      DeletedReason: new FormControl('', [Validators.maxLength(100),])

    });

    this.designationOptions.push({ Text: '', Value: '' });
    this.departmentOptions.push({ Text: '', Value: '' });

    this.selectedId = this.activatedRouter.snapshot.params['id'];

    this.customValidators();
  }

  customValidators() {
    // Add conditional validators only when field is touched/edited
    const emailIdControl = this.editForm.get('EmailId');
    emailIdControl?.valueChanges.subscribe(() => {
      if (emailIdControl?.dirty) {
        emailIdControl.setValidators([Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)]);
      } else {
        emailIdControl?.clearValidators();
      }
      emailIdControl?.updateValueAndValidity({ emitEvent: false });
    });

    const mobileControl = this.editForm.get('Mobile');
    mobileControl?.valueChanges.subscribe(() => {
      if (mobileControl?.dirty) {
        mobileControl.setValidators([Validators.required, Validators.maxLength(10), Validators.minLength(11), Validators.pattern(/^[0-9]*$/)],);
      } else {
        mobileControl?.clearValidators();
      }
      mobileControl?.updateValueAndValidity({ emitEvent: false });
    });

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.contactService.getById(this.selectedId).subscribe({
      next: data => {
        this.contact = data.data;
        this.permission = data.permission;
        this.objMaster = { ...this.contact };
        this.populateUI(this.contact);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }

  populateUI(obj: IContact): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        FirstName: obj.FirstName || '',
        LastName: obj.LastName || '',
        EmailId: obj.EmailId || '',
        Mobile: obj.Mobile || '',
        Designation: obj.Designation || '',
        Department: obj.Department || '',
        IsDeleted: obj.IsDeleted || false,
        DeletedReason: obj.DeletedReason || '',
        IsConfidential: obj.IsConfidential || false,

      }
    );
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
    this.editForm.updateValueAndValidity();
    this.Caption = "Contact Details #" + obj.Id;
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contact/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
     this.editForm.reset();
    this.contact = { ...this.objMaster };
    this.populateUI(this.contact);
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
    this.editForm.updateValueAndValidity();
  }



  Save(): void {

    if (!this.editForm.valid) {
      this.messageService.showError('One or more validation failed. Please clear error to continue...');
      return;
    }

    const formValues = this.editForm.value;
    var updatedObj = {
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      FirstName: formValues.FirstName || null,
      LastName: formValues.LastName || null,
      EmailId: formValues.EmailId || null,
      Mobile: formValues.Mobile || null,
      Designation: formValues.Designation || null,
      Department: formValues.Department || null,
      IsDeleted: formValues.IsDeleted || false,
      DeletedReason: formValues.DeletedReason || null,
      IsConfidential: formValues.IsConfidential || false,
      RecordById: this.objMaster.RecordById,
      RecordByType: this.objMaster.RecordByType,
      ModifiedById: this.loggedInUserService.getRecordId,


    } as IContact;

    this.spinner.show();
    this.contactService.update(this.contact.Id, updatedObj).subscribe({
      next: data => {
        this.contactService.CacheData.IsLoaded = false;
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
