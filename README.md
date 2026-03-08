# Web PLK Jamus

Beginner-friendly village profile website with a simple Express backend and Supabase REST API.

## Requirements
- Node.js 18+
- Supabase project (PostgreSQL)

## Install Dependencies
```bash
npm install
```

## Environment Variables
1. Copy .env.example to .env
2. Fill in your Supabase credentials:
```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-service-role-or-anon-key
```
3. Keep .env private and do not commit it.

## Supabase Tables (Suggested)
Create these tables in Supabase:
- `berita`: `judul`, `tanggal`, `isi`
- `perangkat_desa`: `nama`, `jabatan`, `deskripsi`
- `galeri`: `judul`, `deskripsi`, `gambar_url`
- `profil`: `judul`, `isi`

You can add more fields if needed. The frontend will use fallback fields if names are different.

## Run Locally
```bash
npm install
npm start
```
Then open `http://localhost:3000` in your browser.

## Connect Supabase
The backend uses `SUPABASE_URL` and `SUPABASE_KEY` to call the REST API routes:
- `GET /api/berita`
- `GET /api/perangkat`
- `GET /api/galeri`
- `GET /api/profil`

If you get 500 errors, re-check the key and table names in Supabase.

## Deploy to Vercel
1. Push this project to a Git repository.
2. Import the repo in Vercel.
3. Add environment variables in Vercel settings:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
4. Deploy. Vercel will use `vercel.json` to route API and static files.

## Git Version Control
```bash
git init
git add .
git commit -m "Initial village profile website"
```

## Project Scripts
- `npm start` - run the Express server
