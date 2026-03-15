# Dedicate a Song - Women's History Month

A public digital pin board where people dedicate songs from the Women's History Month playlist on Audius to women who inspire them.

## Features

- 🎵 **Corkboard UI**: Beautiful pin board interface with floating dedication cards
- 🎨 **5 Card Themes**: Floral, Neon, Vintage, Watercolor, and Cosmic
- 🎶 **Music Player**: Integrated Audius player with dedication info
- 💝 **Reactions**: React to dedications with ❤️ 🔥 👏 ✨
- 📍 **Location Stats**: See where dedications are coming from
- 🔗 **Shareable Links**: Each dedication gets its own shareable URL
- 📱 **Responsive Design**: Works beautifully on mobile and desktop

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Music**: Audius REST API
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/emilyhou/audius-womens-history-month.git
cd audius-womens-history-month
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project at https://supabase.com
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Get your project URL and anon key from Settings > API

4. Create `.env.local`:
```bash
cp .env.local.example .env.local
```

5. Fill in your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
AUDIUS_API_URL=https://api.audius.co
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The app uses two main tables:

- **dedications**: Stores all song dedications with positioning, themes, and messages
- **reactions**: Stores reactions to dedications (anonymous)

See `supabase-schema.sql` for the complete schema with RLS policies.

## Project Structure

```
/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Homepage (corkboard)
│   ├── dedicate/          # Dedication creation flow
│   ├── [id]/              # Individual dedication pages
│   └── api/               # API routes
├── components/            # React components
│   ├── Corkboard.tsx      # Main board component
│   ├── DedicationCard.tsx # Pinned card component
│   ├── MusicPlayer.tsx    # Audio player
│   └── DedicationFlow/    # 4-step creation flow
├── lib/                   # Utilities
│   ├── audius.ts         # Audius API client
│   └── supabase.ts       # Supabase client
└── types/                # TypeScript types
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables
4. Deploy!

The app will automatically deploy on every push to main.

## Hackathon Submission

Built for the Audius Women's History Month Hackathon.

**Playlist**: https://audius.co/Audius/playlist/womens-history-month

## License

MIT
