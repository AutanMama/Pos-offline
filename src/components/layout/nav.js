import { Boxes, ReceiptText, ScanBarcode } from "lucide-react";

export const VIEWS = [
  { id: "till", label: "Till", icon: ScanBarcode },
  { id: "sales", label: "Sales", icon: ReceiptText },
  { id: "stock", label: "Stock", icon: Boxes },
];
