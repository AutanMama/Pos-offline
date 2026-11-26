const whole = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
const exact = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 });

// ₦14,500 on shelves and tiles; ₦15,587.50 wherever kobo matter.
export function naira(amount, { kobo = false } = {}) {
  return (kobo ? exact : whole).format(amount);
}

export const roundKobo = (n) => Math.round(n * 100) / 100;
