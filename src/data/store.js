// The demo shop this till belongs to.
export const store = {
  name: "Adunni Stores",
  address: "14 Allen Avenue, Ikeja, Lagos",
  phone: "0803 000 4412",
  till: "Till 2",
  cashier: "Ada",
  vatRate: 0.075,
};

export const PAYMENT_METHODS = ["Cash", "Card", "Transfer"];

// Notes a cashier can tap when a customer pays cash.
export const CASH_NOTES = [1000, 2000, 5000, 10000, 20000];

// Likely cash amounts for a total: the next round figures a customer hands over.
export function cashOptions(total) {
  const steps = [1000, 5000, 10000];
  const rounded = steps.map((s) => Math.ceil(total / s) * s);
  return [...new Set([...rounded, ...CASH_NOTES])].filter((n) => n > total).sort((a, b) => a - b).slice(0, 3);
}
