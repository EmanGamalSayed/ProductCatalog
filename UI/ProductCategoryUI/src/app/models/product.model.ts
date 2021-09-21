import { Guid } from "guid-typescript";

export interface  Product {
    id: Guid,
    name: string,
    price: number,
    photo: string,
    lastUpdate: Date
}

export interface ProductToCreate {
    name: string,
    price: number,
    photo: string
}