export const splitPayment = (amtInCents: number, installments: number) => {
    return Math.round(amtInCents / installments)
}