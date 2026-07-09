import React, { useState } from 'react';

export default function App() {
  // State management to control active view and date logging
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today');

  // State for adding new meal data items
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [mealWindow, setMealWindow] = useState('Breakfast');

  // Simple mock array to demonstrate history loading state
  const pastDays = [
    { label: 'Today', dateStr: 'July 9' },
    { label: 'Yesterday', dateStr: 'July 8' },
    { label: 'Day Before Yesterday', dateStr: 'July 7' },
    { label: 'July 6, 2026', dateStr: 'July 6' },
    { label: 'July 5, 2026', dateStr: 'July 5' },
    { label: 'July 4, 2026', dateStr: 'July 4' },
    { label: 'July 3, 2026', dateStr: 'July 3' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    // Your backend API fetch validation would plug in here
    setIsLoggedIn(true);
  };

  const handleLogFood = (e) => {
    e.preventDefault();
    console.log("Sending payload metrics directly to cluster collection...", {
      foodName, calories, protein, carbs, fats, mealWindow, date: selectedDate
    });
    // Clear inputs after successful local staging
    setFoodName(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
  };

  // --- VIEW LAYER 1: AUTHENTICATION LOGIN GUARD SPLASH ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-[#0B0F17] px-4 text-gray-100">
        <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40 mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-1">My Nutrition Partner</h1>
            <p className="text-sm text-gray-400">Access your personalized metabolic dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com" 
                className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition-colors" 
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/30 transition-all transform active:scale-95 mt-2">
              Secure Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW LAYER 2: THE MAIN DASHBOARD & SIDE PANEL METRIC SYSTEM ---
  return (
    <div className="min-h-screen w-screen flex bg-[#0B0F17] text-gray-100 overflow-x-hidden">
      
      {/* 🧭 SIDE PANEL: Dynamic Monthly History Log Picker */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#111827] border-r border-gray-800 p-6 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">M</div>
            <span className="font-bold text-lg text-white">Log History</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white text-sm">✕ Close</button>
        </div>

        <div className="space-y-2 overflow-y-auto h-[calc(100vh-120px)] pr-2">
          <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Select Logs by Date</span>
          {pastDays.map((day) => (
            <button 
              key={day.label}
              onClick={() => { setSelectedDate(day.label); setIsSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${selectedDate === day.label ? 'bg-emerald-600 text-white shadow-md' : 'bg-[#1F2937]/50 hover:bg-[#1F2937] text-gray-300'}`}
            >
              <span>{day.label}</span>
              <span className={`text-xs ${selectedDate === day.label ? 'text-emerald-200' : 'text-gray-500'}`}>{day.dateStr}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* 🚀 MAIN CORE BODY VIEWPORT FRAME */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Top Floating Dashboard Navbar Header */}
        <header className="w-full bg-[#111827]/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-[#1F2937] border border-gray-700 rounded-lg text-emerald-400 font-bold text-sm">
              ☰ Menu
            </button>
            <h2 className="text-xl font-black text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text">
              My Nutrition Partner
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-[#1F2937] px-4 py-1.5 rounded-full border border-gray-700/60 text-xs text-emerald-400 font-bold shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Viewing: {selectedDate}
          </div>
        </header>

        {/* Content Section Area */}
        <main className="p-4 md:p-8 flex-1 max-w-5xl w-full mx-auto space-y-8">
          
          {/* Section A: Running Macro Tracker Metric Summary Cards */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Total Daily Consumption Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#111827] border border-gray-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Energy Consumed</span>
                <span className="text-2xl font-black text-emerald-400">1,840 <span className="text-xs text-gray-500">kcal</span></span>
              </div>
              <div className="bg-[#111827] border border-gray-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all">
                <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Total Protein Intake</span>
                <span className="text-2xl font-black text-blue-400">142 <span className="text-xs text-gray-500">g</span></span>
              </div>
              <div className="bg-[#111827] border border-gray-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all">
                <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Carbohydrates</span>
                <span className="text-2xl font-black text-amber-400">195 <span className="text-xs text-gray-500">g</span></span>
              </div>
              <div className="bg-[#111827] border border-gray-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-rose-500/30 transition-all">
                <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Dietary Fats</span>
                <span className="text-2xl font-black text-rose-400">58 <span className="text-xs text-gray-500">g</span></span>
              </div>
            </div>
          </div>

          {/* Section B: The Core Daily Food Logging Section Module Form */}
          <div className="grid md:grid-cols-5 gap-6">
            
            {/* Input Tracking Module Interface Component */}
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl md:col-span-2">
              <h4 className="text-base font-bold text-white mb-4">Log Active Nutrition Entry</h4>
              <form onSubmit={handleLogFood} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Food / Meal Item Title</label>
                  <input type="text" required value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="e.g., Grilled Chicken Breast" className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Calories (kcal)</label>
                    <input type="number" required value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="320" className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Protein (g)</label>
                    <input type="number" required value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="30" className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Carbs (g)</label>
                    <input type="number" required value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="0" className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Fats (g)</label>
                    <input type="number" required value={fats} onChange={(e) => setFats(e.target.value)} placeholder="4" className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Meal Allocation Window</label>
                  <div className="relative">
                    <select value={mealWindow} onChange={(e) => setMealWindow(e.target.value)} className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl p-2.5 text-sm appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer">
                      <option value="Breakfast" className="bg-[#111827]">Breakfast</option>
                      <option value="Lunch" className="bg-[#111827]">Lunch</option>
                      <option value="Dinner" className="bg-[#111827]">Dinner</option>
                      <option value="Snack" className="bg-[#111827]">Snacks / Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-emerald-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-950/40">
                  Commit Food to Database
                </button>
              </form>
            </div>

            {/* Live Data Intake Stream Ledger Display Component */}
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl md:col-span-3 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-white">Intake History Ledger</h4>
                <span className="text-xs text-gray-400 font-medium">Logged Items for {selectedDate}</span>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] pr-1">
                <div className="p-4 bg-[#1F2937]/40 border border-gray-800 rounded-xl flex items-center justify-between hover:border-gray-700 transition-colors">
                  <div>
                    <span className="text-xs font-bold uppercase text-emerald-400 block tracking-wider mb-0.5">Lunch</span>
                    <h5 className="text-sm font-semibold text-white">Chicken Breast with Rice</h5>
                    <p className="text-xs text-gray-400 mt-1">P: 45g | C: 40g | F: 6g</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white block">420 kcal</span>
                    <span className="text-[10px] text-gray-500">Recorded Live</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}