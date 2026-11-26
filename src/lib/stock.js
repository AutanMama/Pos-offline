import { LOW_STOCK_AT } from "../data/products";

export function stockState(count) {
  if (count <= 0) return "out";
  if (count < LOW_STOCK_AT) return "low";
  return "ok";
}
