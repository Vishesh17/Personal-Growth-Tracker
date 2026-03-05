import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isHairOilDay, isMonday } from '../utils/dateHelpers';
import { saveDayData, loadDayData } from '../services/dynamodb';

function DailyGoals({ currentDate, setStats }) {
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [protein, setProtein] = useState(0);
  const [proteinInput, setProteinInput] = useState('');
  const [weight, setWeight] = useState('');
  const [supplements, setSupplements] = useState({
    fishOil: false,
    multivitamins: false,
    ashwagandha: false
  });
  const [fitness, setFitness] = useState({
    badminton: false,
    gym: false,
    walk: false,
    physio1: false,
    physio2: false
  });
  const [officeWork, setOfficeWork] = useState('');
  const [freelance, setFreelance] = useState({
    korziHours: '',
    amanUpdates: '',
    cheggQuestions: '',
    extraMoney: ''
  });
  const [music, setMusic] = useState({
    piano: false,
    guitar: false,
    ukulele: false
  });
  const [meals, setMeals] = useState({
    meal1: '',
    meal2: '',
    meal3: ''
  });
  const [wellness, setWellness] = useState({
    nightSkincare: false,
    morningSkincare: false,
    hairOil: false,
    coldShower: false,
    noSmoke: false
  });
  const [diet, setDiet] = useState({
    noSugar: false,
    noProcessed: false
  });

  const waterTarget = 12;
  const proteinTarget = 150;
  const showHairOil = isHairOilDay(currentDate);
  const showWeight = isMonday(currentDate);

  // Load data when date changes
  useEffect(() => {
    const loadData = async () => {
      const data = await loadDayData(currentDate);
      if (data) {
        setWaterGlasses(data.waterGlasses || 0);
        setProtein(data.protein || 0);
        setWeight(data.weight || '');
        setSupplements(data.supplements || { fishOil: false, multivitamins: false, ashwagandha: false });
        setFitness(data.fitness || { badminton: false, gym: false, walk: false, physio1: false, physio2: false });
        setOfficeWork(data.officeWork || '');
        setFreelance(data.freelance || { korziHours: '', amanUpdates: '', cheggQuestions: '', extraMoney: '' });
        setMusic(data.music || { piano: false, guitar: false, ukulele: false });
        setMeals(data.meals || { meal1: '', meal2: '', meal3: '' });
        setDiet(data.diet || { noSugar: false, noProcessed: false });
        setWellness(data.wellness || { nightSkincare: false, morningSkincare: false, hairOil: false, coldShower: false, noSmoke: false });
      } else {
        // Reset to empty state for new day
        setWaterGlasses(0);
        setProtein(0);
        setWeight('');
        setSupplements({ fishOil: false, multivitamins: false, ashwagandha: false });
        setFitness({ badminton: false, gym: false, walk: false, physio1: false, physio2: false });
        setOfficeWork('');
        setFreelance({ korziHours: '', amanUpdates: '', cheggQuestions: '', extraMoney: '' });
        setMusic({ piano: false, guitar: false, ukulele: false });
        setMeals({ meal1: '', meal2: '', meal3: '' });
        setDiet({ noSugar: false, noProcessed: false });
        setWellness({ nightSkincare: false, morningSkincare: false, hairOil: false, coldShower: false, noSmoke: false });
      }
    };
    loadData();
  }, [currentDate]);

  // Calculate stats
  useEffect(() => {
    let completed = 0;
    let total = 0;

    // Water (1 task)
    total++;
    if (waterGlasses >= waterTarget) completed++;

    // Protein (1 task)
    total++;
    if (protein >= proteinTarget) completed++;

    // Supplements (3 tasks)
    total += 3;
    completed += Object.values(supplements).filter(Boolean).length;

    // Fitness (5 tasks)
    total += 5;
    completed += Object.values(fitness).filter(Boolean).length;

    // Office/Freelance (5 tasks)
    total += 5;
    if (officeWork) completed++;
    if (freelance.korziHours) completed++;
    if (freelance.amanUpdates) completed++;
    if (freelance.cheggQuestions) completed++;
    if (freelance.extraMoney) completed++;

    // Music (1 task)
    total++;
    if (Object.values(music).some(Boolean)) completed++;

    // Meals (3 tasks)
    total += 3;
    if (meals.meal1) completed++;
    if (meals.meal2) completed++;
    if (meals.meal3) completed++;

    // Diet (2 tasks)
    total += 2;
    completed += Object.values(diet).filter(Boolean).length;

    // Wellness (5 tasks, but hair oil is conditional)
    const wellnessCount = showHairOil ? 5 : 4;
    total += wellnessCount;
    let wellnessCompleted = 0;
    if (wellness.nightSkincare) wellnessCompleted++;
    if (wellness.morningSkincare) wellnessCompleted++;
    if (showHairOil && wellness.hairOil) wellnessCompleted++;
    if (wellness.coldShower) wellnessCompleted++;
    if (wellness.noSmoke) wellnessCompleted++;
    completed += wellnessCompleted;

    // Weight (conditional on Monday)
    if (showWeight) {
      total++;
      if (weight) completed++;
    }

    // Calculate earnings
    const korziEarnings = (Number(freelance.korziHours) || 0) * 750;
    const cheggEarnings = (Number(freelance.cheggQuestions) || 0) * 100;
    const extraEarnings = Number(freelance.extraMoney) || 0;
    const totalEarnings = korziEarnings + cheggEarnings + extraEarnings;

    // Check if perfect day
    const isPerfectDay = completed === total;

    setStats({ completed, total, perfectDays: 0, totalEarnings, isPerfectDay });

    // Auto-save data
    const saveData = async () => {
      await saveDayData(currentDate, {
        waterGlasses,
        protein,
        weight,
        supplements,
        fitness,
        officeWork,
        freelance,
        music,
        meals,
        diet,
        wellness,
        stats: { completed, total, isPerfectDay, totalEarnings }
      });
    };
    
    // Debounce save (wait 1 second after last change)
    const timer = setTimeout(saveData, 1000);
    return () => clearTimeout(timer);
  }, [waterGlasses, protein, supplements, fitness, officeWork, freelance, music, meals, diet, wellness, weight, showHairOil, showWeight, setStats, currentDate]);

  const addProtein = () => {
    if (proteinInput) {
      setProtein(protein + Number(proteinInput));
      setProteinInput('');
    }
  };

  const resetDay = () => {
    if (window.confirm('⚠️ WARNING: This will delete ALL data for this day. This action cannot be undone. Are you sure?')) {
      setWaterGlasses(0);
      setProtein(0);
      setWeight('');
      setSupplements({ fishOil: false, multivitamins: false, ashwagandha: false });
      setFitness({ badminton: false, gym: false, walk: false, physio1: false, physio2: false });
      setOfficeWork('');
      setFreelance({ korziHours: '', amanUpdates: '', cheggQuestions: '', extraMoney: '' });
      setMusic({ piano: false, guitar: false, ukulele: false });
      setMeals({ meal1: '', meal2: '', meal3: '' });
      setDiet({ noSugar: false, noProcessed: false });
      setWellness({ nightSkincare: false, morningSkincare: false, hairOil: false, coldShower: false, noSmoke: false });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        
        {/* Water */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">🥤 Water</span>
            <span className="text-white/60">{waterGlasses}/{waterTarget}</span>
          </div>
          
          <div className="grid grid-cols-6 gap-2 mb-4">
            {[...Array(waterTarget)].map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setWaterGlasses(i + 1)}
                className="cursor-pointer relative w-8 h-10 mx-auto"
              >
                <div className="absolute inset-0 border-2 border-white/40 rounded-b-lg" />
                {i < waterGlasses && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-400 to-cyan-300 rounded-b-lg"
                  />
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
              className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg font-semibold transition-all"
            >
              -
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWaterGlasses(waterGlasses + 1)}
              className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg font-semibold transition-all"
            >
              +
            </motion.button>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((waterGlasses / waterTarget) * 100, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-white/50">{waterGlasses * 250}ml / 3000ml</div>
        </motion.div>

        {/* Protein */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">🥩 Protein</span>
            <span className="text-white/60">{protein}g/{proteinTarget}g</span>
          </div>
          
          <div className="text-center mb-6">
            <motion.div 
              key={protein}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold"
            >
              {protein}g
            </motion.div>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={proteinInput}
              onChange={(e) => setProteinInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addProtein()}
              placeholder="Enter grams"
              className="flex-1 bg-white/10 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addProtein}
              className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg font-semibold transition-all"
            >
              Add
            </motion.button>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden mb-2">
            <motion.div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-400"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((protein / proteinTarget) * 100, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setProtein(0)}
            className="w-full bg-red-500/20 hover:bg-red-500/30 py-2 rounded-lg text-sm transition-all"
          >
            Reset
          </motion.button>
        </motion.div>

        {/* Supplements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="mb-4 text-lg font-semibold">💊 Supplements</div>
          
          <div className="space-y-3">
            {[
              { key: 'fishOil', label: 'Fish Oil', icon: '🐟' },
              { key: 'multivitamins', label: 'Multivitamins', icon: '💊' },
              { key: 'ashwagandha', label: 'Ashwagandha', icon: '🌿' }
            ].map(({ key, label, icon }) => (
              <motion.label 
                key={key}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
              >
                <motion.input
                  type="checkbox"
                  checked={supplements[key]}
                  onChange={(e) => setSupplements({ ...supplements, [key]: e.target.checked })}
                  className="w-5 h-5 rounded accent-green-500 cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                />
                <span className="text-xl">{icon}</span>
                <span className="flex-1">{label}</span>
                <AnimatePresence>
                  {supplements[key] && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="text-green-400 text-xl"
                    >
                      ✓
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.label>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Weight Input (Mondays only) */}
      {showWeight && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all mt-6"
        >
          <div className="mb-4 text-lg font-semibold">⚖️ Weekly Weight (Monday)</div>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in kg"
            className="w-full bg-white/10 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </motion.div>
      )}

      {/* Sports & Fitness + Office Work & Freelance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Sports & Fitness */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="mb-4 text-lg font-semibold">🏃 Sports & Fitness</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'badminton', label: 'Badminton', icon: '🏸' },
              { key: 'gym', label: 'Gym', icon: '💪' },
              { key: 'walk', label: '20min Walk', icon: '🚶' },
              { key: 'physio1', label: 'Physio 1', icon: '🧘' },
              { key: 'physio2', label: 'Physio 2', icon: '🧘' }
            ].map(({ key, label, icon }) => (
              <motion.label 
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
              >
                <input
                  type="checkbox"
                  checked={fitness[key]}
                  onChange={(e) => setFitness({ ...fitness, [key]: e.target.checked })}
                  className="w-4 h-4 rounded accent-green-500"
                />
                <span className="text-lg">{icon}</span>
                <span className="text-sm">{label}</span>
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Office Work & Freelance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="mb-4 text-lg font-semibold">💼 Office & 💻 Freelance</div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60 w-24">Office Work:</span>
              <input
                type="checkbox"
                checked={!!officeWork}
                readOnly
                className="w-4 h-4 rounded accent-blue-500"
              />
              <input
                type="text"
                value={officeWork}
                onChange={(e) => setOfficeWork(e.target.value)}
                placeholder="Summary"
                className="flex-1 bg-white/10 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60 w-24">Korzi Hours:</span>
              <input
                type="checkbox"
                checked={!!freelance.korziHours}
                readOnly
                className="w-4 h-4 rounded accent-blue-500"
              />
              <input
                type="number"
                value={freelance.korziHours}
                onChange={(e) => setFreelance({ ...freelance, korziHours: e.target.value })}
                placeholder="Hours"
                className="flex-1 bg-white/10 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
              {freelance.korziHours && (
                <span className="text-xs text-green-400">₹{Number(freelance.korziHours) * 750}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60 w-24">Aman Updates:</span>
              <input
                type="checkbox"
                checked={!!freelance.amanUpdates}
                readOnly
                className="w-4 h-4 rounded accent-blue-500"
              />
              <input
                type="text"
                value={freelance.amanUpdates}
                onChange={(e) => setFreelance({ ...freelance, amanUpdates: e.target.value })}
                placeholder="Updates"
                className="flex-1 bg-white/10 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60 w-24">Chegg:</span>
              <input
                type="checkbox"
                checked={!!freelance.cheggQuestions}
                readOnly
                className="w-4 h-4 rounded accent-blue-500"
              />
              <input
                type="number"
                value={freelance.cheggQuestions}
                onChange={(e) => setFreelance({ ...freelance, cheggQuestions: e.target.value })}
                placeholder="Questions"
                className="flex-1 bg-white/10 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
              {freelance.cheggQuestions && (
                <span className="text-xs text-green-400">₹{Number(freelance.cheggQuestions) * 100}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60 w-24">Extra Money:</span>
              <input
                type="checkbox"
                checked={!!freelance.extraMoney}
                readOnly
                className="w-4 h-4 rounded accent-blue-500"
              />
              <input
                type="number"
                value={freelance.extraMoney}
                onChange={(e) => setFreelance({ ...freelance, extraMoney: e.target.value })}
                placeholder="Amount"
                className="flex-1 bg-white/10 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Music Practice */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all mt-6"
      >
        <div className="mb-4 text-lg font-semibold">🎵 Music Practice (20 min - Pick one)</div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'piano', label: 'Piano', icon: '🎹' },
            { key: 'guitar', label: 'Guitar', icon: '🎸' },
            { key: 'ukulele', label: 'Ukulele', icon: '🎸' }
          ].map(({ key, label, icon }) => (
            <motion.label 
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
            >
              <input
                type="radio"
                name="music"
                checked={music[key]}
                onChange={() => setMusic({ piano: false, guitar: false, ukulele: false, [key]: true })}
                className="w-5 h-5 accent-purple-500"
              />
              <span className="text-2xl">{icon}</span>
              <span>{label}</span>
            </motion.label>
          ))}
        </div>
      </motion.div>

      {/* Meals */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all mt-6"
      >
        <div className="mb-4 text-lg font-semibold">🍽️ Meals</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            value={meals.meal1}
            onChange={(e) => setMeals({ ...meals, meal1: e.target.value })}
            placeholder="Meal 1"
            className="bg-white/10 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <input
            type="text"
            value={meals.meal2}
            onChange={(e) => setMeals({ ...meals, meal2: e.target.value })}
            placeholder="Meal 2"
            className="bg-white/10 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <input
            type="text"
            value={meals.meal3}
            onChange={(e) => setMeals({ ...meals, meal3: e.target.value })}
            placeholder="Meal 3"
            className="bg-white/10 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="flex gap-4">
          <motion.label 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
          >
            <input
              type="checkbox"
              checked={diet.noSugar}
              onChange={(e) => setDiet({ ...diet, noSugar: e.target.checked })}
              className="w-4 h-4 rounded accent-green-500"
            />
            <span className="text-sm">No Sugar</span>
          </motion.label>
          <motion.label 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
          >
            <input
              type="checkbox"
              checked={diet.noProcessed}
              onChange={(e) => setDiet({ ...diet, noProcessed: e.target.checked })}
              className="w-4 h-4 rounded accent-green-500"
            />
            <span className="text-sm">No Processed Food</span>
          </motion.label>
        </div>
      </motion.div>

      {/* Wellness */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all mt-6"
      >
        <div className="mb-4 text-lg font-semibold">✨ Wellness</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { key: 'nightSkincare', label: 'Night Skincare', icon: '🌙', show: true },
            { key: 'morningSkincare', label: 'Morning Skincare', icon: '☀️', show: true },
            { key: 'hairOil', label: 'Hair Oil', icon: '💆', show: showHairOil },
            { key: 'coldShower', label: '60s Cold Shower', icon: '🚿', show: true },
            { key: 'noSmoke', label: 'No Smoke', icon: '🚫', show: true }
          ].filter(item => item.show).map(({ key, label, icon }) => (
            <motion.label 
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
            >
              <input
                type="checkbox"
                checked={wellness[key]}
                onChange={(e) => setWellness({ ...wellness, [key]: e.target.checked })}
                className="w-4 h-4 rounded accent-pink-500"
              />
              <span className="text-lg">{icon}</span>
              <span className="text-sm">{label}</span>
            </motion.label>
          ))}
        </div>
      </motion.div>

      {/* Reset Day Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-6 flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={resetDay}
          className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-8 py-3 rounded-lg font-semibold transition-all"
        >
          🗑️ Reset Day
        </motion.button>
      </motion.div>
    </div>
  );
}

export default DailyGoals;
