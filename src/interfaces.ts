import Big from "big.js";

export interface ICartItem  {
    product: IProduct
    quantity: number
}

export interface IProduct {
    id: number
    name:string
    description?:string
    price:Big
}

export interface IPricingRules {
    discounts : IDiscount[]
}

export enum DiscountType  {PERCENTAGE, BUY_X_GET_Y_FREE}

export interface IDiscount {
    productId : number
    discountType : DiscountType
    percentageDiscount?: number
    x ?: number
    y ?: number
}


