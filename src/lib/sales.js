import { roundKobo } from "./money";
import { store } from "../data/store";

export function totalsFor(lines) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const vat = roundKobo(subtotal * store.vatRate);
  return { subtotal, vat, total: roundKobo(subtotal + vat), items: lines.reduce((n, l) => n + l.qty, 0) };
}

export const receiptNo = (number) => `S-${String(number).padStart(4, "0")}`;
