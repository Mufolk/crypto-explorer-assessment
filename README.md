# Cryptocurrency Explorer

A modern, responsive web application for exploring cryptocurrency assets with real-time data from CoinGecko API. Users can browse top cryptocurrencies, add favorites, and track their preferred assets with a clean, mobile-first interface.

## Features

- **Asset Browsing**: View top 50 cryptocurrencies with real-time price data
- **Favorites System**: Save and manage favorite assets with persistent storage
- **Responsive Design**: Mobile-first design that works on all device sizes
- **Smart Caching**: 60-second server-side and client-side caching for optimal performance
- **Anonymous Usage**: No registration required - uses localStorage for user identification
- **Real-time Data**: Live price updates and 24h change percentages
- **Error Handling**: Graceful error states and loading indicators

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with mobile-first responsive design
- **Database**: Supabase (PostgreSQL) for favorites storage
- **External API**: CoinGecko API for cryptocurrency data
- **Icons**: Heroicons for UI elements
- **Caching**: In-memory server cache + client-side cache

## Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Supabase account (free tier available)

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-explorer-assessment
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Setup

1. In your Supabase project dashboard, go to SQL Editor
2. Run the schema from `src/lib/supabase/schema.sql`:

```sql
-- Favorites table schema for Crypto Explorer
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  asset_id text not null,
  created_at timestamp with time zone not null default now(),
  unique (client_id, asset_id)
);

alter table public.favorites enable row level security;

-- RLS policies: allow public read and write by client-provided client_id
create policy if not exists "Favorites are readable by anyone" on public.favorites
  for select using (true);

create policy if not exists "Insert favorites by anyone" on public.favorites
  for insert with check (true);

create policy if not exists "Delete favorites by anyone" on public.favorites
  for delete using (true);
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── assets/        # Cryptocurrency data endpoint
│   │   ├── favorites/     # Favorites CRUD operations
│   │   └── health/        # Health check endpoint
│   ├── favorites/         # Favorites page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── features/          # Feature-specific components
│   │   └── crypto/        # Crypto-related components
│   ├── layout/            # Layout components
│   └── ui/                # Generic UI components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── supabase/          # Database client and schema
│   ├── client-cache.ts    # Client-side caching
│   └── constants.ts       # App constants
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## API Endpoints

### GET /api/assets
Returns cryptocurrency market data from CoinGecko API.

**Response:**
```json
{
  "source": "cache|network",
  "data": [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "image": "https://...",
      "priceUsd": 45000,
      "changePercent24Hr": 2.5
    }
  ]
}
```

### GET /api/favorites?userId={userId}
Returns user's favorite assets.

### POST /api/favorites
Adds an asset to favorites.

**Body:**
```json
{
  "userId": "user123",
  "assetId": "bitcoin"
}
```

### DELETE /api/favorites
Removes an asset from favorites.

**Body:**
```json
{
  "userId": "user123",
  "assetId": "bitcoin"
}
```

## Key Architectural Decisions

### 1. Anonymous User System
- Uses localStorage to generate and persist anonymous user IDs
- No authentication complexity, zero friction for users
- Favorites persist across browser sessions

### 2. Caching Strategy
- **Server-side**: 60-second TTL for CoinGecko API responses
- **Client-side**: 60-second TTL for API calls to reduce network requests
- **Next.js**: Static generation where possible for optimal performance

### 3. Responsive Design
- Mobile-first approach with Tailwind CSS
- Breakpoints: mobile (default), tablet (md:), desktop (lg:)
- Touch-friendly interface with adequate tap targets

### 4. Error Handling
- Graceful degradation with error states
- Retry mechanisms for failed requests
- User-friendly error messages

## Performance Features

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component for crypto logos
- **Caching**: Multi-layer caching strategy
- **Bundle Size**: Optimized with tree shaking and dynamic imports

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

### Adding New Features
1. Create components in appropriate directories
2. Add TypeScript interfaces in `types/`
3. Update API routes as needed
4. Test responsive design on multiple viewports

### Database Schema
The favorites table uses Row Level Security (RLS) with public access policies. For production, consider implementing proper user authentication and scoped access.

### API Rate Limits
CoinGecko API has rate limits. The application implements caching to minimize API calls. For high-traffic applications, consider implementing additional rate limiting or upgrading to a paid CoinGecko plan.

## AI-Assisted Development

This project was developed with significant assistance from AI tools to accelerate development while maintaining high code quality:

### AI Tools Used
- **Perplexity Search**: Initial research and draft planning docs
- **Perplexity Deep thinking**: Deeper search and well documented planning for AI execution
- **Perplexity Project generation**: Documentation and architetural suggestions in detail with boileplate examples
- **Cursor IDE**: Primary development environment with AI-powered code completion and suggestions, using Perplexity docs
- **Perplexity Search**: Code review, architecture decisions, and complex problem solving, for specific snippets
- **GitHub Copilot**: Code review and security checks

### Specific AI Contributions
1. **Component Architecture**: AI helped design the component structure and prop interfaces
2. **TypeScript Types**: Generated comprehensive type definitions for crypto data structures
3. **API Integration**: Assisted with CoinGecko API integration and error handling patterns
4. **Testing Setup**: Created comprehensive test suites including unit, integration, and E2E tests
5. **Docker Configuration**: Generated production-ready Docker and docker-compose configurations
6. **CI/CD Pipeline**: Created GitHub Actions workflow for automated testing and deployment
7. **Performance Optimization**: Implemented caching strategies and performance monitoring

### Manual Development Choices
- **UI/UX Design**: Manual design decisions for user experience and visual hierarchy
- **Business Logic**: Core application logic and state management implemented semi-manually, human checking here is very rigorous
- **Code Review**: All AI-generated code was manually reviewed and refined
- **Architecture Decisions**: High-level architectural choices made through human judgment

### Productivity Impact
- **Development Speed**: ~10x faster development with AI assistance
- **Code Quality**: AI suggestions improved code consistency and best practices
- **Testing Coverage**: AI helped achieve 70%+ test coverage quickly
- **Documentation**: AI accelerated comprehensive documentation creation

### Workflow Integration
1. **Planning**: AI helped break down requirements into manageable tasks
2. **Implementation**: AI provided code suggestions and boilerplate
3. **Review**: Manual review of all AI-generated code
4. **Testing**: AI-assisted test generation with manual validation
5. **Deployment**: AI-generated infrastructure code with manual configuration, not fully implemented

## Future Improvements

- [x] Dark/light theme toggle
- [x] Asset details page
- [x] Comprehensive testing suite
- [x] Docker containerization
- [ ] CI/CD pipeline
- [ ] User authentication system
- [ ] Price alerts and notifications
- [ ] Portfolio tracking
- [ ] Advanced filtering and search
- [ ] PWA capabilities
- [ ] Real-time WebSocket updates
- [ ] Advanced charting integration
- [ ] Historical price charts
- [ ] Search functionality
- [x] Infinite scroll pagination

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository or contact the development team.