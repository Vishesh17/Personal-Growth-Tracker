# 🚀 QUICK START - Deploy in 5 Minutes

## Step 1: Deploy Now (Easiest)

```bash
npm install -g vercel
cd /Users/visheshgupta/Desktop/my-quest
vercel
```

Follow prompts, get your URL like: `https://my-quest-xyz.vercel.app`

## Step 2: Open on Phone

1. Open the URL on your phone
2. **iOS**: Share → "Add to Home Screen"
3. **Android**: Menu → "Add to Home screen"

**Done! Your app is live! 🎉**

---

## Want Cloud Storage? (Optional - 10 more minutes)

### 1. Create Supabase Account
- Go to https://supabase.com
- Sign up → Create project

### 2. Setup Database
- Supabase Dashboard → SQL Editor
- Copy/paste from `database/schema.sql`
- Click "Run"

### 3. Get Keys
- Settings → API
- Copy URL and anon key

### 4. Add to Project
```bash
npm install @supabase/supabase-js
cp .env.example .env
# Edit .env with your keys
vercel --prod
```

### 5. Add to Vercel
- Vercel Dashboard → Settings → Environment Variables
- Add both keys

**Now your data syncs across devices! 📱💻**

---

## Monthly Goal Updates

Edit `src/config/monthlyGoals.js` at start of each month:

```javascript
currentMonth: '2025-02',  // Change this
startingWeight: 74.0,     // Your weight
goalWeight: 69.0,         // Your target
```

Then: `vercel --prod`

---

## Architecture

```
WITHOUT CLOUD:
Phone → Vercel (React App) → localStorage (browser)

WITH CLOUD:
Phone → Vercel (React App) → Supabase (PostgreSQL)
                           ↓
Desktop → Same data synced!
```

---

## Cost: $0/month

Both Vercel and Supabase are free forever for your usage!

---

## Files Created

✅ `DEPLOYMENT.md` - Full deployment guide
✅ `README.md` - Complete documentation
✅ `src/config/monthlyGoals.js` - Monthly customization
✅ `src/services/storage.js` - Cloud storage service
✅ `database/schema.sql` - Database setup
✅ `deploy.sh` - One-click deploy script
✅ `vercel.json` - Deployment config
✅ `public/manifest.json` - PWA config
✅ `.env.example` - Environment template

---

## Need Help?

1. Read `DEPLOYMENT.md` for detailed steps
2. Read `README.md` for full documentation
3. Check troubleshooting sections

**Your app is ready to deploy! 🚀**
