// All amounts are integers in minor units (pence). Floats only appear when formatting.

export const toMinorUnits = (pounds: number) => Math.round(pounds * 100)

export const applyDiscount = (price: number, discountPercent: number) =>
    Math.round(price * (100 - discountPercent) / 100)

export const formatPrice = (amount: number, currency: string = "gbp") =>
    new Intl.NumberFormat("en-GB", {style: "currency", currency: currency.toUpperCase()}).format(amount / 100)
