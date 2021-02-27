import {DiscountType, ICartItem, IPricingRules, IProduct} from "../src/interfaces";
import {Checkout} from "../src/Checkout";
import {Big} from 'big.js'

describe('Checkout', () => {
    it('calculates correct total & discount for a PERCENTAGE discount scenario', async () => {

        //given
        const product: IProduct = {id: 1, name: "Classic", price: Big(89.99)}
        const item: ICartItem = {product: product, quantity: 2}
        const pricingRules: IPricingRules = {
            discounts: [{
                discountType: DiscountType.PERCENTAGE,
                percentageDiscount: 10,
                productId: 1
            }]
        }
        //when
        const checkout = new Checkout(pricingRules);
        checkout.add(item);
        checkout.total();
        //then
        expect(checkout.total()).toEqual(Big(161.98));
        expect(checkout.discount()).toEqual(Big(18.00));
    });

    it('calculates correct total & discount for a BUY_X_GET_Y_FREE discount scenario', async () => {

        //given
        const product: IProduct = {id: 1, name: "Classic", price: Big(100)}
        const item: ICartItem = {product: product, quantity: 10}
        const pricingRules: IPricingRules = {
            discounts: [{
                discountType: DiscountType.BUY_X_GET_Y_FREE,
                x: 5,
                y: 2,
                productId: 1
            }]
        }
        //when
        const checkout = new Checkout(pricingRules);
        checkout.add(item);
        checkout.total();
        //then
        expect(checkout.total()).toEqual(Big(600));
        expect(checkout.discount()).toEqual(Big(400));

    });

    it('calculates 0 discount for a BUY_X_GET_Y_FREE scenario when quantity < X', async () => {

        //given
        const product: IProduct = {id: 1, name: "Classic", price: Big(100)}
        const item: ICartItem = {product: product, quantity: 3}
        const pricingRules: IPricingRules = {
            discounts: [{
                discountType: DiscountType.BUY_X_GET_Y_FREE,
                x: 5,
                y: 2,
                productId: 1
            }]
        }
        //when
        const checkout = new Checkout(pricingRules);
        checkout.add(item);
        checkout.total();
        //then
        expect(checkout.total()).toEqual(Big(300));
        expect(checkout.discount()).toEqual(Big(0));

    });

    it('calculates correct total & discount for a BUY_X_GET_Y_FREE & PERCENTAGE discount scenario', async () => {

        //given
        const classicProduct: IProduct = {id: 1, name: "Classic", price: Big(269.99)}
        const standOutProduct: IProduct = {id: 2, name: "Standout", price: Big(322.99)}

        const item1: ICartItem = {product: classicProduct, quantity: 5}
        const item2: ICartItem = {product: standOutProduct, quantity: 1}

        const pricingRules: IPricingRules = {
            discounts: [{
                discountType: DiscountType.BUY_X_GET_Y_FREE,
                x: 5,
                y: 2,
                productId: 1
            }, {
                discountType: DiscountType.PERCENTAGE,
                percentageDiscount: 10,
                productId: 2
            }]
        }
        //when
        const checkout = new Checkout(pricingRules);
        checkout.add(item1);
        checkout.add(item2);
        checkout.total();

        //then
        expect(checkout.total()).toEqual(Big(1100.66))
        expect(checkout.discount()).toEqual(Big(572.28));
    });

    it('it updates quantity in cart item when existing item is added again', async () => {

        //given
        const classicProduct: IProduct = {id: 1, name: "Classic", price: Big(269.99)}
        const item1: ICartItem = {product: classicProduct, quantity: 1}
        const item2: ICartItem = {product: classicProduct, quantity: 1}
        const pricingRules: IPricingRules = {
            discounts: []
        }

        //when
        const checkout = new Checkout(pricingRules);
        checkout.add(item1);
        checkout.add(item2);

        //then
        expect(checkout.items.length).toEqual(1)
        expect(checkout.items[0].quantity).toEqual(2)
    });
});
