# INFMSINK Booking MVP

This is a deployable Next.js + Supabase MVP for INFMSINK.

It includes:
- Public booking link: `/book`
- Admin login: `/admin/login`
- Admin dashboard: `/admin`
- Artist selection
- Tattoo / Piercing service selection
- Slot selection per artist/date
- Proof of payment upload
- Pending Review → Confirmed / Rejected workflow
- Admin email notification on new booking
- Client email notification on approval/rejection

Next.js route handlers live inside the `app` directory, which is the recommended App Router pattern. citeturn782157search0turn782157search18
Supabase's JavaScript client is initialized with your project URL and key. citeturn782157search1turn782157search7
Resend supports sending email from a Next.js app once you add an API key and verified sender/domain. citeturn782157search2turn782157search11

## Install
```bash
npm install
```

## Configure
Copy `.env.example` to `.env.local` and fill values.

## Supabase
Run:
- `supabase/schema.sql`
- `supabase/seed.sql`

Create a public storage bucket named `payment-proofs`.

## Run
```bash
npm run dev
```

Open:
- `http://localhost:3000/book`
- `http://localhost:3000/admin/login`

## Deploy
Push to GitHub, import to Vercel, and add the same env vars.
