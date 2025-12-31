# Monetra - Personal Finance Tracker

A modern, frontend-only personal finance tracker built with Next.js 16, TypeScript, and Tailwind CSS. All data is stored locally in your browser using LocalStorage.

## Features

### Dashboard
- Overview of total money, available funds, and lent amounts
- Quick access to all money sections
- Recent transaction history

### Money Sections
- **Cash** - Physical cash on hand
- **Bank** - Bank accounts (Brac Bank, DBBL, etc.)
- **Mobile Banking** - Mobile wallets (bKash, Nagad, etc.)
- **Lend** - Money lent to friends/family

Each section supports:
- Add/Edit/Delete sub-entries
- Automatic total calculation
- Click-through to detailed view

### Add/Spend Money
- Add earnings with purpose tracking
- Record spending with descriptions
- Prevents negative balances
- Automatic transaction logging

### Money Transfer
- Transfer between any sub-entries
- Source balance validation
- Complete transfer history

### Transaction History
- Full transaction log
- Filter by section or type
- Detailed transaction cards

### Reports
- Summary cards with key metrics
- Section-wise breakdown table
- Earnings vs spending analysis
- Net change tracking

### Visualization
- Savings distribution (Pie Chart)
- Earned vs Spent (Bar Chart)
- Available vs Loans comparison
- Recent transactions panel

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State Management | React Context + Hooks |
| Storage | LocalStorage (browser) |
| Theme | next-themes |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── layout.tsx            # Root layout with navigation
│   ├── add-spend/page.tsx    # Add/Spend money
│   ├── transfer/page.tsx     # Transfer money
│   ├── history/page.tsx      # Transaction history
│   ├── report/page.tsx       # Financial report
│   ├── visualization/page.tsx # Charts
│   ├── settings/page.tsx     # Settings & theme
│   └── section/[type]/page.tsx # Section details
├── components/
│   ├── Icons.tsx             # SVG icon components
│   ├── Navigation.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── SectionCard.tsx
│   ├── TransactionItem.tsx
│   ├── LoadingSpinner.tsx
│   └── Modal.tsx
├── context/
│   ├── AppContext.tsx        # Global state + LocalStorage
│   ├── ThemeContext.tsx      # Theme management
│   └── SidebarContext.tsx    # Sidebar state
└── types/
    └── index.ts              # TypeScript definitions
```

## Responsive Design

Monetra is fully responsive with:
- Mobile-first bottom navigation
- Collapsible sidebar navigation on desktop
- Adaptive card layouts
- Touch-friendly controls

## Theme Support

- Light mode
- Dark mode  
- System preference detection

## Privacy

All your financial data stays in your browser:

| Feature | Status |
|---------|--------|
| No backend servers | Yes |
| No authentication required | Yes |
| No external databases | Yes |
| 100% client-side storage | Yes |

## License

MIT
