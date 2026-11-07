import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { IPricingSimulatorInput } from './pricing-simulator';

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
}
