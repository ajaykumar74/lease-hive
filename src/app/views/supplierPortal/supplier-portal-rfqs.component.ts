import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SupplierPortalRfqDetail, SupplierPortalRfqListItem, SupplierPortalService } from './supplier-portal.service';
import { SupplierPortalDocumentsComponent } from './supplier-portal-documents.component';

@Component({ selector: 'app-supplier-portal-rfqs', standalone: true, imports: [CommonModule, DatePipe, RouterLink, FormsModule, SupplierPortalDocumentsComponent], templateUrl: './supplier-portal-rfqs.component.html', styleUrls: ['./supplier-portal-rfqs.component.css'] })
export class SupplierPortalRfqsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef); readonly id: number;
    items: SupplierPortalRfqListItem[] = []; rfq?: SupplierPortalRfqDetail; loading = true; saving = false; error = ''; message = '';
    constructor(private readonly service: SupplierPortalService, private readonly route: ActivatedRoute, private readonly router: Router) { this.id = Number(route.snapshot.paramMap.get('id')); }
    ngOnInit(): void { this.id ? this.loadDetail() : this.loadList(); }
    loadList(): void { this.service.rfqs().pipe(finalize(() => this.loading=false), takeUntilDestroyed(this.destroyRef)).subscribe({ next: x => this.items=x, error: () => this.error='Unable to load RFQs.' }); }
    loadDetail(): void { this.loading=true; this.service.rfq(this.id).pipe(finalize(() => this.loading=false), takeUntilDestroyed(this.destroyRef)).subscribe({ next: x => { this.rfq=x; this.prepareLines(); }, error: () => this.error='Unable to load this RFQ.' }); }
    prepareLines(): void { if (!this.rfq) return; if (!this.rfq.Quotation && this.rfq.CanRespond) this.rfq.Quotation = { SupplierQuoteNo: '', Status: 'DRAFT', QuoteDate: '', CurrencyCode: this.rfq.CurrencyCode, PaymentTermCode: '', DeliveryDays: 0, Remarks: '', Subtotal: 0, TaxAmount: 0, TotalAmount: 0, Lines: [] }; this.rfq.Lines.forEach(line => line.QuotationLine ??= { RfqLineId: line.RfqLineId, Quantity: line.Quantity, UnitPrice: 0, DiscountAmount: 0, TaxAmount: 0, ComplianceCode: 'COMPLIANT', DeviationNotes: '' }); }
    save(submit: boolean): void { if (!this.rfq || this.saving) return; this.error=''; this.message=''; if (!this.rfq.Lines.length) { this.error='This RFQ has no response lines configured. Contact the buyer.'; return; } const payloadLines=this.rfq.Lines.map(x=>x.QuotationLine!).filter(x=>x.Quantity>0); if (!payloadLines.length) { this.error='Enter a quotation quantity for at least one RFQ line.'; return; } this.saving=true; const q=this.rfq.Quotation; const payload={ SupplierQuotationId:q?.SupplierQuotationId && q.SupplierQuotationId > 0 ? q.SupplierQuotationId : undefined, ValidUntil:q?.ValidUntil, CurrencyCode:q?.CurrencyCode || this.rfq.CurrencyCode, PaymentTermCode:q?.PaymentTermCode || '', DeliveryDays:q?.DeliveryDays || 0, Remarks:q?.Remarks || '', Submit:submit, Lines:payloadLines };
        this.service.saveQuotation(this.rfq.RfqId,payload).pipe(finalize(()=>this.saving=false), switchMap(()=>this.service.rfq(this.rfq!.RfqId)),takeUntilDestroyed(this.destroyRef)).subscribe({next:x=>{this.rfq=x;this.prepareLines();this.message=submit?'Quotation submitted.':'Draft saved.';},error:e=>this.error=e?.error?.message || e?.error?.Message || 'Quotation could not be saved.'}); }
    open(id: number): void { this.router.navigate(['/supplier/rfqs',id]); }
}
