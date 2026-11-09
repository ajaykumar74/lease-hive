import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SupplierPortalPurchaseOrderDetail, SupplierPortalPurchaseOrderListItem, SupplierPortalService } from './supplier-portal.service';
import { SupplierPortalDocumentsComponent } from './supplier-portal-documents.component';

@Component({ selector: 'app-supplier-portal-purchase-orders', standalone: true, imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink, FormsModule, SupplierPortalDocumentsComponent], templateUrl: './supplier-portal-purchase-orders.component.html', styleUrls: ['./supplier-portal-rfqs.component.css'] })
export class SupplierPortalPurchaseOrdersComponent implements OnInit {
    private readonly destroyRef=inject(DestroyRef); readonly id: number; items: SupplierPortalPurchaseOrderListItem[]=[]; order?:SupplierPortalPurchaseOrderDetail; loading=true; saving=false; error=''; message=''; rejectionReason='';
    constructor(private readonly service:SupplierPortalService,private readonly route:ActivatedRoute,private readonly router:Router){this.id=Number(route.snapshot.paramMap.get('id'));}
    ngOnInit():void{this.id?this.loadDetail():this.loadList();}
    loadList():void{this.service.purchaseOrders().pipe(finalize(()=>this.loading=false),takeUntilDestroyed(this.destroyRef)).subscribe({next:x=>this.items=x,error:()=>this.error='Unable to load purchase orders.'});}
    loadDetail():void{this.loading=true;this.service.purchaseOrder(this.id).pipe(finalize(()=>this.loading=false),takeUntilDestroyed(this.destroyRef)).subscribe({next:x=>this.order=x,error:()=>this.error='Unable to load this purchase order.'});}
    open(id:number):void{this.router.navigate(['/supplier/purchase-orders',id]);}
    acknowledge(status:'ACCEPTED'|'REJECTED'):void{if(!this.order||this.saving)return;if(status==='REJECTED'&&!this.rejectionReason.trim()){this.error='A reason is required when rejecting a purchase order.';return;}this.saving=true;this.error='';this.service.acknowledgePurchaseOrder(this.order.PurchaseOrderId,status,status==='REJECTED'?this.rejectionReason:'').pipe(finalize(()=>this.saving=false),switchMap(()=>this.service.purchaseOrder(this.order!.PurchaseOrderId)),takeUntilDestroyed(this.destroyRef)).subscribe({next:x=>{this.order=x;this.message='Acknowledgement recorded.';},error:e=>this.error=e?.error?.message||e?.error?.Message||'Acknowledgement could not be recorded.'});}
}
