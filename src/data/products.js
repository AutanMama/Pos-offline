// Demo catalogue for a Lagos neighbourhood shop. Prices are in naira.
export const CATEGORIES = [
  { id: "staples", label: "Staples" },
  { id: "drinks", label: "Drinks" },
  { id: "snacks", label: "Snacks" },
  { id: "fresh", label: "Fresh" },
  { id: "household", label: "Household" },
];

export const products = [
  { id: "p01", name: "Ofada rice", size: "5 kg", price: 14500, category: "staples", barcode: "6150001" },
  { id: "p02", name: "Yellow garri", size: "2 kg", price: 3200, category: "staples", barcode: "6150002" },
  { id: "p03", name: "Honey beans", size: "1 kg", price: 2800, category: "staples", barcode: "6150003" },
  { id: "p04", name: "Semolina", size: "1 kg", price: 2150, category: "staples", barcode: "6150004" },
  { id: "p05", name: "Palm oil", size: "1 L", price: 2600, category: "staples", barcode: "6150005" },
  { id: "p06", name: "Groundnut oil", size: "1 L", price: 3900, category: "staples", barcode: "6150006" },
  { id: "p07", name: "Tomato paste", size: "210 g", price: 950, category: "staples", barcode: "6150007" },
  { id: "p08", name: "Instant noodles", size: "70 g × 5", price: 1750, category: "staples", barcode: "6150008" },

  { id: "p09", name: "Bottled water", size: "75 cl", price: 300, category: "drinks", barcode: "6150101" },
  { id: "p10", name: "Malt drink", size: "33 cl", price: 700, category: "drinks", barcode: "6150102" },
  { id: "p11", name: "Zobo", size: "50 cl", price: 600, category: "drinks", barcode: "6150103" },
  { id: "p12", name: "Evaporated milk", size: "160 g", price: 550, category: "drinks", barcode: "6150104" },
  { id: "p13", name: "Orange juice", size: "1 L", price: 2400, category: "drinks", barcode: "6150105" },

  { id: "p14", name: "Plantain chips", size: "150 g", price: 1200, category: "snacks", barcode: "6150201" },
  { id: "p15", name: "Chin chin", size: "250 g", price: 1500, category: "snacks", barcode: "6150202" },
  { id: "p16", name: "Roasted groundnuts", size: "200 g", price: 800, category: "snacks", barcode: "6150203" },
  { id: "p17", name: "Meat pie", size: "1 piece", price: 900, category: "snacks", barcode: "6150204" },

  { id: "p18", name: "Agege bread", size: "Large", price: 1300, category: "fresh", barcode: "6150301" },
  { id: "p19", name: "Eggs", size: "Crate of 30", price: 5800, category: "fresh", barcode: "6150302" },
  { id: "p20", name: "Plantain", size: "Bunch", price: 3500, category: "fresh", barcode: "6150303" },

  { id: "p21", name: "Bar soap", size: "200 g", price: 650, category: "household", barcode: "6150401" },
  { id: "p22", name: "Detergent", size: "900 g", price: 2700, category: "household", barcode: "6150402" },
  { id: "p23", name: "Tissue paper", size: "4 rolls", price: 1900, category: "household", barcode: "6150403" },
  { id: "p24", name: "Kerosene", size: "1 L", price: 1800, category: "household", barcode: "6150404" },
];

export const productById = Object.fromEntries(products.map((p) => [p.id, p]));

// Opening stock. A few items start low or empty so the stock states show.
export const OPENING_STOCK = {
  p01: 18, p02: 40, p03: 32, p04: 26, p05: 22, p06: 15, p07: 90, p08: 60,
  p09: 240, p10: 96, p11: 4, p12: 120, p13: 24,
  p14: 45, p15: 30, p16: 55, p17: 0,
  p18: 20, p19: 7, p20: 12,
  p21: 70, p22: 34, p23: 0, p24: 3,
};

// Below this, an item counts as running low.
export const LOW_STOCK_AT = 10;
