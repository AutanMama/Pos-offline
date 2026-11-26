# Tally

An offline-first point of sale for Nigerian shops. Scan or tap items, take cash, card or transfer, print a receipt, and keep selling when the network drops. Sales made offline wait on the till and sync when the connection comes back.

**Live demo:** https://pos-offline-tau.vercel.app

## What it does

- **Till:** one box for barcode scanners and name search (press `/` to jump to it), colour-coded categories, product tiles with live stock counts, and a sale panel with VAT at 7.5%.
- **Payment:** cash, card or transfer. For cash, quick amounts and the change to give back are worked out for the cashier.
- **Receipts:** a thermal-style receipt for every sale, printable on an 80 mm printer.
- **Offline first:** stock, sales and the sync queue live in the browser, so the till keeps working without a connection.
- **Sales:** today's takings, average sale, how customers paid, and every receipt.
- **Stock:** levels with low and out-of-stock states, search, and receiving deliveries.
- Light and dark themes, and a phone layout with the sale in a bottom sheet.

## Run it

```bash
npm install
npm run dev
```

The demo shop, products and a morning of sales are sample data. Clear the site's storage to start fresh.

## Stack

React 19, Vite, Tailwind CSS 4, lucide-react, IBM Plex Sans and Mono. No backend: the upload step of the sync queue is simulated.

Design decisions are in [BRAND.md](BRAND.md).
