# ✅ Deployment Checklist

## 🎯 Phase 1: Basic Deployment (5 minutes)

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run deployment: `vercel` or `./deploy.sh`
- [ ] Get your URL (e.g., https://my-quest-xyz.vercel.app)
- [ ] Test URL in browser
- [ ] Open URL on phone
- [ ] Add to phone home screen
- [ ] Test app on phone

**✅ Phase 1 Complete! Your app is live!**

---

## 💾 Phase 2: Cloud Storage (Optional - 10 minutes)

- [ ] Go to https://supabase.com
- [ ] Create account (GitHub/Google)
- [ ] Create new project
  - [ ] Name: my-quest
  - [ ] Password: (save it!)
  - [ ] Region: (closest to you)
- [ ] Wait for project setup (~2 mins)
- [ ] Open SQL Editor
- [ ] Copy content from `database/schema.sql`
- [ ] Paste and click "Run"
- [ ] Verify tables created
- [ ] Go to Settings → API
- [ ] Copy Project URL
- [ ] Copy anon/public key
- [ ] Run: `npm install @supabase/supabase-js`
- [ ] Run: `cp .env.example .env`
- [ ] Edit `.env` with your keys
- [ ] Test locally: `npm run dev`
- [ ] Deploy: `vercel --prod`
- [ ] Go to Vercel Dashboard
- [ ] Settings → Environment Variables
- [ ] Add `VITE_SUPABASE_URL`
- [ ] Add `VITE_SUPABASE_ANON_KEY`
- [ ] Redeploy: `vercel --prod`
- [ ] Test on phone - data should sync!

**✅ Phase 2 Complete! Cloud storage active!**

---

## 🎨 Phase 3: Monthly Customization

- [ ] Open `src/config/monthlyGoals.js`
- [ ] Update `currentMonth` to current month
- [ ] Set your `startingWeight`
- [ ] Set your `goalWeight`
- [ ] Enable/disable tasks as needed
- [ ] Add custom tasks (optional)
- [ ] Save file
- [ ] Deploy: `vercel --prod`
- [ ] Verify changes on phone

**✅ Phase 3 Complete! Goals customized!**

---

## 📱 Phase 4: Mobile Optimization

### iOS
- [ ] Open app URL in Safari
- [ ] Tap Share button (square with arrow)
- [ ] Scroll down
- [ ] Tap "Add to Home Screen"
- [ ] Name it "My Quest"
- [ ] Tap "Add"
- [ ] Find icon on home screen
- [ ] Open app (should open full screen)
- [ ] Test all features

### Android
- [ ] Open app URL in Chrome
- [ ] Tap menu (3 dots)
- [ ] Tap "Add to Home screen"
- [ ] Name it "My Quest"
- [ ] Tap "Add"
- [ ] Find icon on home screen
- [ ] Open app (should open full screen)
- [ ] Test all features

**✅ Phase 4 Complete! Mobile app ready!**

---

## 🧪 Testing Checklist

- [ ] Can check/uncheck tasks
- [ ] Water tracker works
- [ ] Protein tracker works
- [ ] Spends tracker works
- [ ] Meal logging works
- [ ] Notes save properly
- [ ] Complete Day button works
- [ ] Weight modal appears
- [ ] Progress log shows data
- [ ] Heatmap displays correctly
- [ ] Charts render properly
- [ ] Data persists after refresh
- [ ] Works offline (if using localStorage)
- [ ] Syncs across devices (if using Supabase)

**✅ Testing Complete! App fully functional!**

---

## 🔄 Monthly Maintenance

### At Start of Each Month:
- [ ] Edit `src/config/monthlyGoals.js`
- [ ] Update month identifier
- [ ] Update weight goals
- [ ] Adjust tasks if needed
- [ ] Deploy: `vercel --prod`
- [ ] Test on phone

### During Month:
- [ ] Track daily
- [ ] Complete tasks
- [ ] Log weight
- [ ] Review progress

### End of Month:
- [ ] Review total XP
- [ ] Check weight progress
- [ ] Review spending
- [ ] Celebrate achievements! 🎉

---

## 🐛 Troubleshooting

### App not loading?
- [ ] Check URL is correct
- [ ] Try incognito/private mode
- [ ] Clear browser cache
- [ ] Check browser console for errors

### Data not saving?
- [ ] Check localStorage is enabled
- [ ] Check Supabase credentials (if using)
- [ ] Check environment variables in Vercel
- [ ] Check browser console for errors

### Build fails?
- [ ] Run `npm install`
- [ ] Delete `node_modules` and reinstall
- [ ] Check Node.js version: `node --version` (need 18.20+)
- [ ] Check for syntax errors

### Deployment fails?
- [ ] Check Vercel CLI is installed
- [ ] Run `vercel login`
- [ ] Check internet connection
- [ ] Try `vercel --debug` for more info

---

## 📚 Documentation Reference

- **Quick Start**: `QUICKSTART.md`
- **Full Deployment**: `DEPLOYMENT.md`
- **Architecture**: `ARCHITECTURE.md`
- **Features**: `README.md`
- **Database**: `database/schema.sql`

---

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ App loads on desktop
- ✅ App loads on phone
- ✅ Can add to home screen
- ✅ All features work
- ✅ Data persists
- ✅ Can track daily tasks
- ✅ Can complete days
- ✅ Progress shows correctly

---

## 🚀 You're Ready!

Once all checkboxes are complete:
1. Start tracking your goals
2. Build your streak
3. Transform yourself!

**Good luck on your 30-day journey! 💪**

---

## 📞 Quick Commands Reference

```bash
# Development
npm run dev              # Start local server
npm run build            # Build for production

# Deployment
./deploy.sh              # Quick deploy
vercel                   # Deploy to preview
vercel --prod            # Deploy to production
vercel login             # Login to Vercel

# Database
npm install @supabase/supabase-js  # Install Supabase

# Environment
cp .env.example .env     # Create env file
```

---

**Last Updated**: January 2025
**Version**: 1.0.0
