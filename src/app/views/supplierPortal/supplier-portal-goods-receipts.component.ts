import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SupplierPortalGoodsReceipt, SupplierPortalService } from './supplier-portal.service';

@Component({selector:'app-supplier-portal-goods-receipts',standalone:true,imports:[CommonModule,DatePipe,RouterLink],templateUrl:'./supplier-portal-goods-receipts.component.html',styleUrls:['./supplier-portal-rfqs.component.css']})
export class SupplierPortalGoodsReceiptsComponent implements OnInit {
  private readonly destroyRef=inject(DestroyRef);readonly id:number;receipts:SupplierPortalGoodsReceipt[]=[];detail?:SupplierPortalGoodsReceipt;loading=true;error='';
  constructor(private readonly service:SupplierPortalService,private readonly route:ActivatedRoute,private readonly router:Router){this.id=Number(route.snapshot.paramMap.get('id'));}
  ngOnInit():void{this.id?this.loadDetail():this.loadList();}
  loadList():void{this.service.goodsReceipts().pipe(finalize(()=>this.loading=false),takeUntilDestroyed(this.destroyRef)).subscribe({next:x=>this.receipts=x,error:()=>this.error='Unable to load goods receipts.'});}
  loadDetail():void{this.service.goodsReceipt(this.id).pipe(finalize(()=>this.loading=false),takeUntilDestroyed(this.destroyRef)).subscribe({next:x=>this.detail=x,error:()=>this.error='Unable to load this goods receipt.'});}
  open(id:number):void{this.router.navigate(['/supplier/goods-receipts',id]);}
}
