# 🎯 My Quest - 30 Day Transformation Challenge

A beautiful, gamified habit tracker for your monthly transformation goals. Track fitness, diet, grooming, tech learning, and finances all in one place.

## ✨ Features

- 📊 **Daily Mission Tracking** - Complete tasks and earn XP
- 💪 **Weight Progress** - Visual weight loss tracking
- 🔥 **Streak System** - Maintain perfect days for bonus XP
- 📈 **Progress Charts** - Visualize your spending and habits
- 🗓️ **Heatmap View** - See your consistency at a glance
- 💾 **Cloud Sync** - Optional cloud storage with Supabase
- 📱 **Mobile Optimized** - Works perfectly on phone and desktop
- 🎨 **Beautiful UI** - Animated gradients and smooth transitions

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Deploy to Production

**Option 1: One-Click Deploy**
```bash
./deploy.sh
```

**Option 2: Manual Deploy**
```bash
npm run build
vercel --prod
```

## 📱 Use on Phone

1. Deploy your app (see above)
2. Open the URL on your phone
3. **iOS**: Tap Share → "Add to Home Screen"
4. **Android**: Tap Menu → "Add to Home screen"
5. App now opens like a native app!

## 🎨 Monthly Customization

At the start of each month, edit `src/config/monthlyGoals.js`:

```javascript
export const MONTHLY_CONFIG = {
  currentMonth: '2025-02',  // Update this
  totalDays: 30,
  startingWeight: 74.0,     // Your current weight
  goalWeight: 69.0,         // Your target
  
  // Enable/disable tasks
  enabledTasks: {
    sleep: true,
    workout: true,
    // ... customize as needed
  }
};
```

Then redeploy: `vercel --prod`

## 💾 Add Cloud Storage (Optional)

### Why?
- ✅ Sync data across devices
- ✅ Never lose progress
- ✅ Access from phone AND desktop

### Setup (5 minutes)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create new project

2. **Run Database Setup**
   - Open Supabase SQL Editor
   - Copy & paste from `database/schema.sql`
   - Click "Run"

3. **Get API Keys**
   - Project Settings → API
   - Copy URL and anon key

4. **Add to Project**
   ```bash
   cp .env.example .env
   # Edit .env with your keys
   ```

5. **Install & Deploy**
   ```bash
   npm install @supabase/supabase-js
   vercel --prod
   ```

6. **Add Environment Variables in Vercel**
   - Vercel Dashboard → Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## 📁 Project Structure

```
my-quest/
├── src/
│   ├── App.jsx              # Main app component
│   ├── App.css              # Styles and animations
│   ├── config/
│   │   └── monthlyGoals.js  # Monthly configuration
│   └── services/
│       └── storage.js       # Cloud storage service
├── database/
│   └── schema.sql           # Supabase database schema
├── public/
│   └── manifest.json        # PWA manifest
├── DEPLOYMENT.md            # Detailed deployment guide
└── deploy.sh                # Quick deploy script
```

## 🎯 Task Categories

- **Core Habits**: Sleep, hydration, sunlight, supplements
- **Diet & Nutrition**: Fasting, clean eating, meal logging
- **Fitness**: Steps, gym, physio exercises
- **Grooming**: Skincare routines, cold showers
- **Tech & Learning**: DSA problems, system design
- **Finance**: Spending tracking, income logging

## 📊 Scoring System

- Complete tasks: Earn XP
- Perfect day (all tasks): +50 XP bonus
- Maintain streak: Keep going!
- Monthly goal: 10,050 XP total

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js
- **Icons**: Lucide React
- **Hosting**: Vercel (free)
- **Database**: Supabase (optional, free)

## 💰 Cost

**$0/month** - Everything runs on free tiers!

## 📖 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Detailed deployment steps
- Troubleshooting guide
- Architecture overview
- Future enhancements

## 🔧 Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Deployment
./deploy.sh          # Quick deploy
vercel               # Deploy to Vercel
vercel --prod        # Deploy to production
```

## 🎨 Customization

### Add Custom Tasks

Edit `src/config/monthlyGoals.js`:

```javascript
customTasks: [
  {
    id: 'meditation',
    text: 'Meditate 10 mins',
    desc: 'Morning meditation',
    points: 15,
    category: 'core',
    icon: 'Sparkles'
  }
]
```

### Change Colors

Edit `src/App.css` - modify gradient colors and animations

### Adjust Targets

Edit `src/config/monthlyGoals.js`:

```javascript
dailyTargets: {
  waterGlasses: 7,    // Change water goal
  proteinGrams: 150,  // Change protein goal
  steps: 10000        // Change step goal
}
```

## 🐛 Troubleshooting

**App not loading?**
- Clear browser cache
- Check console for errors
- Try incognito mode

**Data not syncing?**
- Verify Supabase credentials
- Check environment variables
- App works offline with localStorage

**Build fails?**
- Run `npm install`
- Delete `node_modules` and reinstall
- Check Node.js version (18.20+)

## 📱 Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS & macOS)
- ✅ Firefox
- ✅ Samsung Internet

## 🎉 Start Your Journey

1. Deploy the app
2. Open on your phone
3. Add to home screen
4. Set your monthly goals
5. Start tracking!

**Transform yourself, one day at a time! 💪**
