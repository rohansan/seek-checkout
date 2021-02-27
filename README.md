## SEEK Checkout App ##
This is my typescript implementation of the Checkout App which demonstrates how discounts are 
calculated for 2 scenarios :

- Percentage discount 
- Multi buy discount (BUY X GET Y FREE)


## Assumptions ##
- I have assumed that the Pricing rules are sought for the right customer when instantiating the Checkout class.

- I have used Big.js for $ amount fields, since the native number type doesn't have the decimal precision 
    needed for monetary amounts. 
    - Rounding method is HALF UP
    - Decimal precision is 2


## Commands ##

These commands should be executed in the root directory of the project.

```bash
# build the project 
npm install

# run unit tests 
npm test

```

