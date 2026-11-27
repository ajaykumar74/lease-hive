import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SupplierPortalRfqDetail, SupplierPortalRfqLine, SupplierPortalRfqListItem, SupplierPortalService } from './supplier-portal.service';
import { SupplierPortalDocumentsComponent } from './supplier-portal-documents.component';

@Component({
    selector: 'app-supplier-portal-rfqs',
    standalone: true,
    imports: [CommonModule, DatePipe, RouterLink, FormsModule, SupplierPortalDocumentsComponent],
    templateUrl: './supplier-portal-rfqs.component.html',
    styleUrls: ['./supplier-portal-rfqs.component.css']
})
export class SupplierPortalRfqsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    readonly id: number;
    items: SupplierPortalRfqListItem[] = [];
    rfq?: SupplierPortalRfqDetail;
    loading = true;
    saving = false;
    error = '';
    message = '';
    pendingQuotationDocuments: File[] = [];
    constructor(
        private readonly service: SupplierPortalService,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {
        this.id = Number(route.snapshot.paramMap.get('id'));
    }
    ngOnInit(): void {
        this.id ? this.loadDetail() : this.loadList();
    }
    loadList(): void {
        this.service
            .rfqs()
            .pipe(
                finalize(() => (this.loading = false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({ next: (x) => (this.items = x), error: () => (this.error = 'Unable to load RFQs.') });
    }
    loadDetail(): void {
        this.loading = true;
        this.service
            .rfq(this.id)
            .pipe(
                finalize(() => (this.loading = false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (x) => {
                    this.rfq = x;
                    this.prepareLines();
                },
                error: () => (this.error = 'Unable to load this RFQ.')
            });
    }
    prepareLines(): void {
        if (!this.rfq) return;
        if (!this.rfq.Quotation && this.rfq.CanRespond)
            this.rfq.Quotation = { SupplierQuoteNo: '', Status: 'DRAFT', QuoteDate: '', CurrencyCode: this.rfq.CurrencyCode, PaymentTermCode: '', DeliveryDays: 0, Remarks: '', Subtotal: 0, TaxAmount: 0, TotalAmount: 0, Lines: [] };
        this.rfq.Lines.forEach(
            (line) => (line.QuotationLine ??= { RfqLineId: line.RfqLineId, Quantity: line.Quantity, UnitPrice: 0, DiscountAmount: 0, TaxAmount: 0, ComplianceCode: 'COMPLIANT', DeviationNotes: '', AssetMakeId: 0, AssetModelId: 0 })
        );
    }
    modelsFor(line: SupplierPortalRfqLine) {
        const makeId = Number(line.QuotationLine?.AssetMakeId) || 0;
        return line.AvailableAssetModels.filter((model) => model.AssetMakeId === makeId);
    }
    makeChanged(line: SupplierPortalRfqLine): void {
        if (line.QuotationLine) line.QuotationLine.AssetModelId = 0;
    }
    isAssetLine(line: SupplierPortalRfqLine): boolean {
        return line.AssetCategoryId > 0 || line.AssetTypeId > 0;
    }
    get canUploadQuotationDocuments(): boolean {
        const status = this.rfq?.Quotation?.Status?.toUpperCase();
        return !!this.rfq?.Quotation?.SupplierQuotationId && (status === 'DRAFT' || status === 'SUBMITTED');
    }
    queueQuotationDocuments(event: Event): void {
        const input = event.target as HTMLInputElement;
        const files = Array.from(input.files ?? []);
        if (!files.length) return;
        this.pendingQuotationDocuments = [...this.pendingQuotationDocuments, ...files];
        input.value = '';
    }
    removePendingQuotationDocument(index: number): void {
        this.pendingQuotationDocuments = this.pendingQuotationDocuments.filter((_, current) => current !== index);
    }
    save(submit: boolean): void {
        if (!this.rfq || this.saving) return;
        this.error = '';
        this.message = '';
        if (!this.rfq.Lines.length) {
            this.error = 'This RFQ has no response lines configured. Contact the buyer.';
            return;
        }
        const payloadLines = this.rfq.Lines.map((x) => x.QuotationLine!).filter((x) => x.Quantity > 0);
        if (!payloadLines.length) {
            this.error = 'Enter a quotation quantity for at least one RFQ line.';
            return;
        }
        if (this.rfq.Lines.some((line) => line.QuotationLine!.Quantity > 0 && this.isAssetLine(line) && (!line.QuotationLine!.AssetMakeId || !line.QuotationLine!.AssetModelId))) {
            this.error = 'Select the offered Make and Model for every asset line before saving.';
            return;
        }
        const payload = this.quotationPayload(submit, payloadLines);
        if (this.pendingQuotationDocuments.length && !payload.SupplierQuotationId) {
            this.saveAndUploadNewQuotation(submit, payloadLines);
            return;
        }
        this.saving = true;
        this.service
            .saveQuotation(this.rfq.RfqId, payload)
            .pipe(
                finalize(() => (this.saving = false)),
                switchMap(() => this.service.rfq(this.rfq!.RfqId)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (x) => {
                    this.rfq = x;
                    this.prepareLines();
                    this.message = submit ? 'Quotation submitted.' : 'Draft saved.';
                },
                error: (e) => (this.error = e?.error?.message || e?.error?.Message || 'Quotation could not be saved.')
            });
    }
    private quotationPayload(submit: boolean, lines: SupplierPortalRfqLine['QuotationLine'][]): any {
        const quotation = this.rfq?.Quotation;
        return {
            SupplierQuotationId: quotation?.SupplierQuotationId && quotation.SupplierQuotationId > 0 ? quotation.SupplierQuotationId : undefined,
            ValidUntil: quotation?.ValidUntil,
            CurrencyCode: quotation?.CurrencyCode || this.rfq?.CurrencyCode,
            PaymentTermCode: quotation?.PaymentTermCode || '',
            DeliveryDays: quotation?.DeliveryDays || 0,
            Remarks: quotation?.Remarks || '',
            Submit: submit,
            Lines: lines
        };
    }
    private saveAndUploadNewQuotation(submit: boolean, lines: SupplierPortalRfqLine['QuotationLine'][]): void {
        if (!this.rfq) return;
        this.saving = true;
        this.service
            .saveQuotation(this.rfq.RfqId, this.quotationPayload(false, lines))
            .pipe(
                switchMap(() => this.service.rfq(this.rfq!.RfqId)),
                switchMap((rfq) => {
                    const quotationId = rfq.Quotation?.SupplierQuotationId;
                    if (!quotationId) throw new Error('The quotation draft was saved but could not be loaded for document upload.');
                    return this.service.documentRequirements('SupplierQuotation', quotationId).pipe(
                        switchMap((requirements) => {
                            const requirement = requirements.find((item) => item.Code === 'SUPPLIER_QUOTATION_DOCUMENT') ?? requirements[0];
                            if (!requirement) throw new Error('Document upload is not configured for supplier quotations.');
                            return forkJoin(this.pendingQuotationDocuments.map((file) => this.service.uploadQuotationDocument(quotationId, requirement.Id, file))).pipe(map(() => rfq));
                        })
                    );
                }),
                switchMap((rfq) => {
                    this.rfq = rfq;
                    this.prepareLines();
                    this.pendingQuotationDocuments = [];
                    return submit
                        ? this.service.saveQuotation(rfq.RfqId, this.quotationPayload(true, lines)).pipe(switchMap(() => this.service.rfq(rfq.RfqId)))
                        : of(rfq);
                }),
                finalize(() => (this.saving = false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (rfq) => {
                    this.rfq = rfq;
                    this.prepareLines();
                    this.message = submit ? 'Quotation and documents submitted.' : 'Draft and documents saved.';
                },
                error: (error) => (this.error = error?.error?.message || error?.error?.Message || error?.message || 'The quotation draft could not be saved with its documents.')
            });
    }
    open(id: number): void {
        this.router.navigate(['/supplier/rfqs', id]);
    }
}
