import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {


  }

  public async Load<T>() {
    return await this.http.get<T[]>(this.baseUrl + 'api/save');
  }

  public async Save(data: any) {
    let body = JSON.stringify(data);
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });

    return await this.http.post(this.baseUrl + 'api/save', body, { headers: header })
  }
}
