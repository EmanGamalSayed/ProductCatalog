import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductToCreate } from '../models/product.model';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http:HttpClient) { }
  apiUrl = "https://localhost:44368/api/Product";
  localHostUrl = "https://localhost:44368";
  getAllProducts(){
    return this._http.get<Product[]>(this.apiUrl);
  }

  getProductById(id:Guid){
    return this._http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product : ProductToCreate){
    return this._http.post(this.apiUrl,product);
  }

  updateProduct(id:Guid , product:Product){
    return this._http.post(`${this.apiUrl}/UpdateProduct/`,product);
  }

  deleteProduct(id:Guid){
    return this._http.get(`${this.apiUrl}/DeleteProduct?id=${id}`);
  }
  public getPhotos() {
    return this._http.get(`${this.apiUrl}/getPhotos`);
  }
  public download(fileUrl: string) {
    return this._http.get(`${this.apiUrl}/download?fileUrl=${fileUrl}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }
}
