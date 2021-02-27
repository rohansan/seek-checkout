import {DiscountType, ICartItem, IDiscount, IPricingRules} from "./interfaces";
import {Big} from "big.js";

export class Checkout {
    items: Array<ICartItem>
    pricingRules: IPricingRules

    constructor(pricingRules: IPricingRules) {
        this.items = [];
        this.pricingRules = pricingRules;
        Big.DP = 2
        Big.RM = 1
    }

    add(item: ICartItem) {
        const foundIndex = this.items.findIndex(i => i.product.id === item.product.id);
        if (foundIndex >= 0) {
            this.items[foundIndex].quantity += item.quantity;
        } else {
            this.items.push(item);
        }
    }

    total(): Big {
        let total = Big(0);
        this.items.forEach(item => {
            total = total.plus(item.product.price.mul(item.quantity));
        })
        return total.minus(this.discount());
    }

    discount(): Big {
        let discountTotal = Big(0);
        this.pricingRules.discounts.forEach(discount => {
            discountTotal = discountTotal.plus(this.calculateDiscount(discount));
        })
        return discountTotal;
    }

    private calculateDiscount(discount: IDiscount): Big {

        let calculatedDiscount = Big(0);

        switch (discount.discountType) {

            case DiscountType.PERCENTAGE :
                this.items.filter(item => item.product.id === discount.productId)
                    .forEach(item => calculatedDiscount =
                        calculatedDiscount.plus(item.product.price.mul(item.quantity).mul(discount.percentageDiscount!).div(100)));
                break;

            case DiscountType.BUY_X_GET_Y_FREE :
                this.items.filter(item => item.product.id === discount.productId)
                    .forEach(item => calculatedDiscount =
                        calculatedDiscount.plus(Big(~~(item.quantity / discount.x!) * discount.y!).mul(item.product.price)));
                break

        }
        return calculatedDiscount;
    }
}
