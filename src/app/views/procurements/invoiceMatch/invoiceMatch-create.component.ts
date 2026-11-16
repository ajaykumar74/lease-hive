import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IInvoiceMatch } from './invoiceMatch';
import { InvoiceMatchService } from './invoiceMatch.service';
import { SupplierInvoiceService } from '../supplierInvoice/supplierInvoice.service';
import { ISupplierInvoice } from '../supplierInvoice/supplierInvoice';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-invoiceMatch-create',
    standalone: false,
    templateUrl: './invoiceMatch-create.component.html',
    providers: [MessageService]
})
export class InvoiceMatchCreateComponent implements OnInit {
    private readonly entityLookupDestroyRef = inject(DestroyRef);

    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    invoiceMatch: IInvoiceMatch = null;
    supplierinvoiceidOptions: ISelectItem[] = [];
    purchaseorderidOptions: ISelectItem[] = [];
    goodsreceiptidOptions: ISelectItem[] = [];
    matchtypecodeOptions: ISelectItem[] = [];
    matchedbyOptions: ISelectItem[] = [];
    matchresultcodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IInvoiceMatch = {} as IInvoiceMatch;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _location: Location,
        private invoiceMatchService: InvoiceMatchService,
        private supplierInvoiceService: SupplierInvoiceService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.invoiceMatch };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            SupplierInvoiceId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
            PurchaseOrderId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            GoodsReceiptId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            MatchTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            MatchedOn: new FormControl(new Date(), [Validators.required]),
            MatchedBy: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
            QuantityVariance: new FormControl(0, [Validators.required]),
            AmountVariance: new FormControl(0, [Validators.required]),
            TolerancePassed: new FormControl(false, [Validators.required]),
            MatchResultCode: new FormControl('', [Validators.required, Validators.maxLength(20)])
        });
        this.Caption = 'Create InvoiceMatch';
        this.loggedInUserService.bindEntityLookup(
            this.editForm,
            'GoodsReceiptId',
            'goods-receipts',
            (options) => (this.goodsreceiptidOptions = options),
            (error) => setTimeout(() => this.messageService?.showError(error)),
            this.entityLookupDestroyRef,
            { PurchaseOrderId: 'PurchaseOrderId' }
        );
        this.loggedInUserService.bindEntityLookup(
            this.editForm,
            'MatchedBy',
            'application-users',
            (options) => (this.matchedbyOptions = options),
            (error) => setTimeout(() => this.messageService?.showError(error)),
            this.entityLookupDestroyRef
        );
        this.loggedInUserService.bindEntityLookup(
            this.editForm,
            'PurchaseOrderId',
            'purchase-orders',
            (options) => (this.purchaseorderidOptions = options),
            (error) => setTimeout(() => this.messageService?.showError(error)),
            this.entityLookupDestroyRef,
            { SupplierInvoiceId: 'SupplierInvoiceId' }
        );
        this.loggedInUserService.bindEntityLookup(
            this.editForm,
            'SupplierInvoiceId',
            'supplier-invoices',
            (options) => (this.supplierinvoiceidOptions = options),
            (error) => setTimeout(() => this.messageService?.showError(error)),
            this.entityLookupDestroyRef
        );
        this.matchtypecodeOptions = this.loggedInUserService.getPicklistOptions('InvoiceMatchMatchTypeCode');
        this.matchresultcodeOptions = this.loggedInUserService.getPicklistOptions('InvoiceMatchMatchResultCode');
        this.populateCurrentMatcher();
        this.populateSupplierInvoiceContext();
    }

    private populateCurrentMatcher(): void {
        this.loggedInUserService.getCurrentApplicationUserId().subscribe({
            next: (userId) => this.editForm.get('MatchedBy')?.setValue(userId),
            error: (error) => setTimeout(() => this.messageService?.showError(error))
        });
    }

    private populateSupplierInvoiceContext(): void {
        const supplierInvoiceId = Number(this.activatedRoute.snapshot.queryParamMap.get('supplierInvoiceId')) || 0;
        if (supplierInvoiceId <= 0) return;

        this.isLoading = true;
        this.supplierInvoiceService.getById(supplierInvoiceId).subscribe({
            next: (response) => {
                const invoice = response?.data as ISupplierInvoice;
                if (
                    !invoice ||
                    String(invoice.MatchStatusCode || '')
                        .trim()
                        .toUpperCase() !== 'APPROVED'
                ) {
                    this.messageService.showError('Invoice matching can only be created for an approved supplier invoice.');
                    return;
                }
                this.editForm.patchValue(
                    {
                        SupplierInvoiceId: invoice.Id,
                        PurchaseOrderId: invoice.PurchaseOrderId || 0,
                        MatchedOn: new Date()
                    },
                    { emitEvent: false }
                );
                this.editForm.get('SupplierInvoiceId')?.disable({ emitEvent: false });
                this.editForm.get('PurchaseOrderId')?.disable({ emitEvent: false });
                this.Caption = `Create Invoice Match for ${invoice.SupplierInvoiceNo}`;
                this.populateGoodsReceipt(invoice);
            },
            error: (error) => this.messageService.showError(error),
            complete: () => (this.isLoading = false)
        });
    }

    private populateGoodsReceipt(invoice: ISupplierInvoice): void {
        const receiptLineIds = [...new Set((invoice.LineItems || []).map((line) => Number(line.GoodsReceiptLineId) || 0).filter((id) => id > 0))];
        if (!receiptLineIds.length) return;
        forkJoin(receiptLineIds.map((id) => this.supplierInvoiceService.getGoodsReceiptLine(id))).subscribe({
            next: (receiptLines) => {
                const goodsReceiptIds = [...new Set(receiptLines.map((line) => Number(line.GoodsReceiptId) || 0).filter((id) => id > 0))];
                if (goodsReceiptIds.length === 1) this.editForm.get('GoodsReceiptId')?.setValue(goodsReceiptIds[0]);
            },
            error: (error) => this.messageService.showError(error)
        });
    }

    loadUI(): void {
        this.isLoading = true;
        this.invoiceMatchService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.invoiceMatch = data;
                this.objMaster = { ...this.invoiceMatch };
                this.populateUI(data);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: IInvoiceMatch): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            SupplierInvoiceId: obj.SupplierInvoiceId || 0,
            PurchaseOrderId: obj.PurchaseOrderId || 0,
            GoodsReceiptId: obj.GoodsReceiptId || 0,
            MatchTypeCode: obj.MatchTypeCode || '',
            MatchedOn: obj.MatchedOn || new Date(),
            MatchedBy: obj.MatchedBy || 0,
            QuantityVariance: obj.QuantityVariance || 0,
            AmountVariance: obj.AmountVariance || 0,
            TolerancePassed: obj.TolerancePassed || false,
            MatchResultCode: obj.MatchResultCode || ''
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/business/procurement/invoice-matching/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.invoiceMatch = { ...this.objMaster };
        var obj = this.invoiceMatch;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            SupplierInvoiceId: obj.SupplierInvoiceId || 0,
            PurchaseOrderId: obj.PurchaseOrderId || 0,
            GoodsReceiptId: obj.GoodsReceiptId || 0,
            MatchTypeCode: obj.MatchTypeCode || '',
            MatchedOn: obj.MatchedOn || new Date(),
            MatchedBy: obj.MatchedBy || 0,
            QuantityVariance: obj.QuantityVariance || 0,
            AmountVariance: obj.AmountVariance || 0,
            TolerancePassed: obj.TolerancePassed || false,
            MatchResultCode: obj.MatchResultCode || ''
        });
        this.editForm.markAsPristine();
        this.editForm.markAsUntouched();
    }

    Save(): void {
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }

        const formValues = this.editForm.getRawValue();
        var createdObj = {
            Id: this.objMaster.Id,
            RowVersionStr: this.objMaster.RowVersionStr,
            TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
            SupplierInvoiceId: formValues.SupplierInvoiceId || 0,
            PurchaseOrderId: formValues.PurchaseOrderId || 0,
            GoodsReceiptId: formValues.GoodsReceiptId || 0,
            MatchTypeCode: formValues.MatchTypeCode || null,
            MatchedOn: formValues.MatchedOn || null,
            MatchedBy: formValues.MatchedBy || 0,
            QuantityVariance: formValues.QuantityVariance || 0,
            AmountVariance: formValues.AmountVariance || 0,
            TolerancePassed: formValues.TolerancePassed || false,
            MatchResultCode: formValues.MatchResultCode || null
        } as IInvoiceMatch;

        this.spinner.show();
        this.invoiceMatchService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(InvoiceMatch +  'Details Updated sucessfully.');
                this._location.back();
            },
            error: (err) => {
                this.messageService.showError(err);
                this.spinner.hide();
            },
            complete: () => {
                this.spinner.hide();
            }
        });
    }
}
