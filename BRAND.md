# Tally brand guide

Tally is a tool a cashier stares at all day, so the design is calm, dense and fast to read. Colour does work: green means money moves, amber means low, red means out, and each category has its own colour so items are found by colour, not reading.

## Colour

Tokens live in `src/styles/index.css`. Components only use token names.

| Token        | Light     | Dark      | Use                                     |
| ------------ | --------- | --------- | --------------------------------------- |
| `page`       | `#ECEEF1` | `#0F1114` | Background                              |
| `panel`      | `#FFFFFF` | `#181B20` | Tiles, sale panel, tables               |
| `ink`        | `#14171C` | `#ECEEF1` | Text                                    |
| `muted`      | `#59606B` | `#9AA1AC` | Supporting text                         |
| `rail`       | `#14171C` | `#0A0C0E` | Side rail                               |
| `go`         | `#0B7A50` | `#3FCF8E` | Charge, change due, synced, the brand   |
| `low`        | `#8F5600` | `#F0B44C` | Running low, offline                    |
| `out`        | `#B3261E` | `#F28B82` | Out of stock, short payment             |
| `paper`      | `#FFFDF8` | `#FFFDF8` | Receipt paper, the same in both themes  |

Category colours: staples `#86651A`, drinks `#1D6A86`, snacks `#A8431C`, fresh `#3B7A36`, household `#6A4C9C` (lighter versions in dark mode).

All text colours pass WCAG AA (4.5:1) on their panels in both themes; white on `go` is 5.4:1.

## Type

- **IBM Plex Sans** for the interface: clear at small sizes and made for tools.
- **IBM Plex Mono** for every figure (prices, totals, receipt numbers), so columns of money line up, and for the receipt itself.
- Nothing is smaller than 12px.

## Patterns

- **Mark:** four strokes crossed by a fifth, the way a count is kept by hand.
- **Tiles:** a category colour bar, name and size, price in mono, and stock left.
- **Receipt:** thermal paper with a torn edge. Only the receipt prints.
- **Notices:** short messages at the top instead of browser alerts.
