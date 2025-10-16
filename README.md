# Servy 🤖✨

AI-powered home service booking platform. Book trusted service providers through natural ChatGPT conversations.

## Features

- 🤖 **ChatGPT Integration** - Book services through natural conversation via MCP
- ✨ **Beautiful UI** - Apple-inspired design with LED blue/purple aesthetics
- 🔒 **Verified Vendors** - All providers are licensed and insured
- 📱 **Responsive** - Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL)
- **AI Integration**: Model Context Protocol (MCP)
- **Deployment**: Vercel
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- GitHub account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/trstng/servy.git
cd servy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Supabase credentials.

4. Run the Supabase migration:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/001_create_vendors.sql`
   - Run the query

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial Servy setup"
git push origin main
```

### Step 2: Deploy to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repository: `trstng/servy`
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click "Deploy"

Your app will be live at: `https://servy.vercel.app` (or your custom domain)

### Step 3: Test with ChatGPT

1. Go to ChatGPT Settings → Connectors → Developer Mode
2. Enable Developer Mode
3. Create new connector:
   - **Name**: Servy
   - **Description**: Book home service providers
   - **URL**: `https://your-app.vercel.app/api/mcp`
4. In a new chat, enable the Servy connector
5. Try: "Show me power washers in Austin"

## Project Structure

```
servy/
├── app/
│   ├── api/mcp/route.ts       # MCP server endpoint
│   ├── signup/page.tsx         # Vendor signup page
│   ├── page.tsx                # Homepage
│   └── globals.css             # LED theme styles
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── mcp/tools.ts            # MCP tools & carousel
├── supabase/
│   └── migrations/             # Database schema
└── .env.local                  # Environment variables (not in git)
```

## API Endpoints

### MCP Server
- **URL**: `/api/mcp`
- **Protocol**: Model Context Protocol (Streamable HTTP)
- **Tools**:
  - `search_providers` - Search for home service vendors

### Test Endpoint
- **URL**: `/api/mcp` (GET)
- Returns server info and available tools

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (private) |

## Database Schema

### Vendors Table
- `id` - UUID primary key
- `name` - Business name
- `service_type` - Type of service offered
- `city` / `state` - Location
- `rating` - Average rating (0-5)
- `review_count` - Number of reviews
- `image_url` - Business image
- `description` - Business description
- `price_range` - $, $$, or $$$
- `is_licensed` - Boolean
- `is_insured` - Boolean

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## ChatGPT Example Prompts

Try these prompts in ChatGPT after connecting Servy:

- "Show me power washers in Austin"
- "Find window cleaners in Austin, TX"
- "Search for lawn care services in Austin"

## Roadmap

- [ ] User authentication
- [ ] Booking system with calendar integration
- [ ] Review system
- [ ] Provider dashboard
- [ ] Search filters (licensed, insured, price range)
- [ ] Multi-city support
- [ ] Payment integration

## License

MIT

## Author

Built by [@trstng](https://github.com/trstng)
