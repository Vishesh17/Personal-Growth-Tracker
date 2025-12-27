# 🏗️ Architecture & Data Flow

## 📱 Complete System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR DEVICES                              │
│  📱 iPhone/Android    💻 Desktop    📱 Tablet               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  VERCEL HOSTING                              │
│  • React App (Static Files)                                  │
│  • Global CDN (Fast Worldwide)                               │
│  • Auto HTTPS                                                │
│  • Free Forever                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Calls
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE (Optional)                             │
│  • PostgreSQL Database                                       │
│  • Real-time Sync                                            │
│  • Automatic Backups                                         │
│  • Free Forever                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Without Cloud Storage (Default)
```
User Action → React State → localStorage (Browser)
                                    ↓
                            Persists on device only
```

### With Cloud Storage (Recommended)
```
User Action → React State → Supabase API → PostgreSQL
                    ↓                           ↓
              localStorage                 Cloud Storage
              (Backup)                    (Syncs everywhere)
```

## 📊 Database Schema

### Table: quest_data
```
┌──────────┬──────────┬────────┬────────────┬────────────┐
│ user_id  │  month   │ state  │ updated_at │     id     │
├──────────┼──────────┼────────┼────────────┼────────────┤
│ default  │ 2025-01  │ {...}  │ timestamp  │ uuid       │
└──────────┴──────────┴────────┴────────────┴────────────┘
```

### Table: month_history
```
┌──────────┬──────────┬──────────┬──────────┬─────────────┐
│ user_id  │  month   │ total_xp │   days   │ weight_lost │
├──────────┼──────────┼──────────┼──────────┼─────────────┤
│ default  │ 2024-12  │   8500   │    28    │     4.2     │
└──────────┴──────────┴──────────┴──────────┴─────────────┘
```

## 🎯 Monthly Workflow

```
Start of Month
      ↓
Edit monthlyGoals.js
      ↓
Set new goals & tasks
      ↓
Deploy: vercel --prod
      ↓
Track daily for 30 days
      ↓
Complete month
      ↓
Data saved to history
      ↓
Repeat next month!
```

## 📱 Mobile App Experience

### iOS Installation
```
Safari → Open URL → Share Button → Add to Home Screen
                                          ↓
                                    App Icon Created
                                          ↓
                                  Opens Full Screen
                                          ↓
                                  Feels Like Native App
```

### Android Installation
```
Chrome → Open URL → Menu (⋮) → Add to Home screen
                                      ↓
                                App Icon Created
                                      ↓
                              Opens Full Screen
                                      ↓
                              Feels Like Native App
```

## 🔐 Security

### Current Setup (Simple)
- No authentication required
- Single user per deployment
- Data stored with default user ID

### Future Enhancement (Optional)
```
Add Supabase Auth
      ↓
Multiple users supported
      ↓
Each user has own data
      ↓
Login with email/Google
```

## 💾 Storage Strategy

### localStorage (Always Active)
- ✅ Works offline
- ✅ Instant access
- ✅ No setup needed
- ❌ Device-specific
- ❌ Can be cleared

### Supabase (Optional)
- ✅ Syncs across devices
- ✅ Never loses data
- ✅ Automatic backups
- ✅ Can add auth later
- ⚠️ Requires internet

### Best Practice
```
App uses BOTH:
1. Supabase for cloud sync
2. localStorage as backup
3. If Supabase fails → localStorage works
4. When online → Syncs to cloud
```

## 🚀 Deployment Flow

```
Local Development
      ↓
npm run dev (localhost:5173)
      ↓
Make changes & test
      ↓
npm run build
      ↓
Creates /dist folder
      ↓
vercel --prod
      ↓
Uploads to Vercel CDN
      ↓
Live at your-app.vercel.app
      ↓
Access from anywhere!
```

## 📈 Scalability

### Current Capacity
- Users: 1 (you)
- Storage: Unlimited days
- Bandwidth: 100GB/month (Vercel free)
- Database: 500MB (Supabase free)

### If You Want to Share
```
Add Supabase Auth
      ↓
Each user gets own account
      ↓
Can support 1000s of users
      ↓
Still free tier!
```

## 🎨 Customization Points

### Monthly Goals
```
src/config/monthlyGoals.js
      ↓
Change tasks, weights, targets
      ↓
Redeploy
```

### Styling
```
src/App.css
      ↓
Modify colors, animations
      ↓
Redeploy
```

### Features
```
src/App.jsx
      ↓
Add/remove components
      ↓
Redeploy
```

## 💰 Cost Breakdown

```
Vercel Hosting:     $0/month (Free tier: 100GB bandwidth)
Supabase Database:  $0/month (Free tier: 500MB + 2GB bandwidth)
Domain (optional):  $12/year (if you want custom domain)
                    ─────────
Total:              $0/month (or $1/month with domain)
```

## 🔄 Update Cycle

```
Week 1-4: Track daily
      ↓
End of Month: Review progress
      ↓
New Month: Update config
      ↓
Deploy: vercel --prod
      ↓
Repeat!
```

## 🎯 Success Metrics

Track these automatically:
- ✅ Daily XP earned
- ✅ Streak maintained
- ✅ Weight progress
- ✅ Money spent
- ✅ Income earned
- ✅ Task completion rate
- ✅ Monthly totals

All visualized in beautiful charts! 📊
