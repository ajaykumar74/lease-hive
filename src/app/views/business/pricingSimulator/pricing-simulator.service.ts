import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { IPricingSimulatorInput, PricingSimulatorMethodOptions } from './pricing-simulator';

@Injectable({ providedIn: 'root' })
export class PricingSimulatorService {
  constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {}

  calculate(input: IPricingSimulatorInput): Observable<any> {
    return this.http.post<any>(`${this.baseService.C_APP_URL}/PricingSimulator/calculate`, input, {
      headers: this.baseService.getHeaders()
    }).pipe(
      tap(response => this.baseService.onTapData(response)),
      catchError(this.baseService.handleError)
    );
  }

  getMethodOptions(assetCategoryId: number): Observable<PricingSimulatorMethodOptions> {
    return this.http.get<{ data: PricingSimulatorMethodOptions }>(`${this.baseService.C_APP_URL}/PricingSimulator/method-options`, {
      headers: this.baseService.getHeaders(),
      params: { assetCategoryId: String(assetCategoryId || 0) }
    }).pipe(
      tap(response => this.baseService.onTapData(response)),
      map(response => response.data),
      catchError(this.baseService.handleError)
    );
  }
}
