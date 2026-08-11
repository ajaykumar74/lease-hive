import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IPortalUser } from './portalUser';
import { PortalUserService } from './portalUser.service';
import { PickListService } from '@/shared/PicklistService';
import { AppConstants } from '@/shared/constants/AppConstants';
import { AppUtilityService } from '@/shared/utilities/utility-service';

@Component({
  selector: 'app-portalUser-edit',
  standalone: false,
  templateUrl: './portalUser-edit.component.html',
  providers: [MessageService]
})
export class PortalUserEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  portalUser: IPortalUser = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  departmentOptions: ISelectItem[] = [];
  roleOptions: ISelectItem[] = [];
  pickListServiceOptions: any;
  editForm: any;
  objMaster: IPortalUser = {} as IPortalUser;
  isShowRolePermissions: boolean = false;

  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private portalUserService: PortalUserService,
    private loggedInUserService: LoggedInUserService,
    private pickListService: PickListService,
    readonly appConstants: AppConstants,
    private appUtil: AppUtilityService,
  ) {
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;


  ngOnInit(): void {
    this.objMaster = { ...this.portalUser };
    this.pickListServiceOptions = this.pickListService;
    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      Code: new FormControl('', [Validators.maxLength(20),]),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(35), Validators.pattern('^(?! )[A-Za-z ]*(?<! )$')]),
      LastName: new FormControl('', [Validators.required, Validators.maxLength(35),]),
      EmailId: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(254), , Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)]),
      Mobile: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern(/^[0-9]*$/)],),
      Department: new FormControl('', [Validators.maxLength(25),]),
      Role: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      Description: new FormControl('', [Validators.maxLength(255),]),
      IsDeleted: new FormControl(false),
      DeletedReason: new FormControl('', [Validators.maxLength(255),]),

    });
    this.customValidators();
    this.departmentOptions.push({ Text: '', Value: '' });
    if (this.loggedInUserService.loggedInUser.AccountType == 'Customer') {
      this.roleOptions.push({ Text: 'Member Owner', Value: 'MemberOwner' });
      this.roleOptions.push({ Text: 'Member Admin', Value: 'MemberAdmin' });
      this.roleOptions.push({ Text: 'Member User', Value: 'MemberUser' });

    }
    else {
      this.roleOptions.push({ Text: 'Partner Owner', Value: 'PartnerOwner' });
      this.roleOptions.push({ Text: 'Partner Admin', Value: 'PartnerAdmin' });
      this.roleOptions.push({ Text: 'Partner User', Value: 'PartnerUser' });
    }

    this.selectedId = this.activatedRouter.snapshot.params['id'];
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
        mobileControl.setValidators([Validators.required, Validators.maxLength(15), Validators.minLength(10), Validators.pattern(/^[0-9]*$/)],);
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
    this.portalUserService.getById(this.selectedId).subscribe({
      next: data => {
        this.portalUser = data.data;
        this.permission = data.permission;
        this.objMaster = { ...this.portalUser };
        this.populateUI(this.portalUser);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }

  populateUI(obj: IPortalUser): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        Code: obj.Code || '',
        FirstName: obj.FirstName || '',
        LastName: obj.LastName || '',
        EmailId: obj.EmailId || '',
        Mobile: obj.Mobile || '',
        Department: obj.Department || '',
        Role: obj.Role || '',
        Description: obj.Description || '',
        IsDeleted: obj.IsDeleted || false,
        DeletedReason: obj.DeletedReason || '',
      }
    );
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
    this.editForm.updateValueAndValidity();
    this.Caption = "PortalUser Details #" + obj.Id;
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/portalUser/create', { id: -1 }]);
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
    this.portalUser = { ...this.objMaster };
    this.populateUI(this.portalUser);
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
      RecordById: this.objMaster.RecordById,
      RecordByType: this.objMaster.RecordByType,
      FirstName: formValues.FirstName || null,
      LastName: formValues.LastName || null,
      EmailId: formValues.EmailId || null,
      Mobile: formValues.Mobile || null,
      Department: formValues.Department || null,
      Role: formValues.Role || null,
      Description: formValues.Description || null,
      IsDeleted: formValues.IsDeleted || false,
      DeletedReason: formValues.DeletedReason || null,
      ModifiedById: this.loggedInUserService.getRecordId,

    } as IPortalUser;

    this.spinner.show();
    this.portalUserService.update(this.portalUser.Id, updatedObj).subscribe({
      next: data => {
        this.portalUserService.CacheData.IsLoaded = false;
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
