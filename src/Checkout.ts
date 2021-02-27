import {DiscountType, ICartItem, IDiscount, IPricingRules} from "./interfaces"
import {Big} from "big.js"

export class Checkout {
    items: Array<ICartItem>
    pricingRules: IPricingRules

    constructor(pricingRules: IPricingRules) {
        this.items = []
        this.pricingRules = pricingRules
        Big.DP = 2
        Big.RM = 1
    }

    add(item: ICartItem) {
        const foundIndex = this.items.findIndex(i => i.product.id === item.product.id)
        if (foundIndex >= 0) {
            this.items[foundIndex].quantity += item.quantity
        } else {
            this.items.push(item)
        }
    }

    total(): Big {
        let total = Big(0)
        this.items.forEach(item => {
            total = total.plus(item.product.price.mul(item.quantity))
        })
        return total.minus(this.discount())
    }

    discount(): Big {
        let discountTotal = Big(0)
        this.pricingRules.discounts.forEach(discount => {
            discountTotal = discountTotal.plus(this.calculateDiscount(discount))
        })
        return discountTotal
    }

    /**
     This method calculates the discount for 2 discount types

     PERCENTAGE - discount is calculated using formula : price * qty * (% discount/100)

     BUY_X_GET_Y_FREE - For every X purchases we discount Y purchases
     * To calculate how many times this discount is applicable we get the floor value of (qty / X)
          using the double NOT bitwise operator
     * To calculate the discount amount we use Y * price
     */
    private calculateDiscount(discount: IDiscount): Big {

        let calculatedDiscount = Big(0)

        switch (discount.discountType) {

            case DiscountType.PERCENTAGE :
                this.items.filter(item => item.product.id === discount.productId)
                    .forEach(item => calculatedDiscount =
                        calculatedDiscount.plus(item.product.price.mul(item.quantity).mul(discount.percentageDiscount!).div(100)))
                break

            case DiscountType.BUY_X_GET_Y_FREE :
                this.items.filter(item => item.product.id === discount.productId)
                    .forEach(item => calculatedDiscount =
                        calculatedDiscount.plus(Big(~~(item.quantity / discount.x!)).mul(discount.y!).mul(item.product.price)))
                break

        }
        return calculatedDiscount
    }
}
