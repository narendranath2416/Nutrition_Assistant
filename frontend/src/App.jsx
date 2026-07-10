import { useState, useEffect } from 'react';
import './App.css'; 

export default function App() {
  // Session & Structural Navigation States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authTab, setAuthTab] = useState('login'); 
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'profile', 'diet_plans', 'recommendations'
  
  // Registration & Live Profile Management States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('hypertrophy');

  // Input Food Consumption Form States
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [mealWindow, setMealWindow] = useState('Breakfast');

  // Interactive Diet Plan Creator States
  const [planTitle, setPlanTitle] = useState('Hypertrophy Conditioning Phase 1');
  const [startDate, setStartDate] = useState('2026-07-10');
  const [endDate, setEndDate] = useState('2026-10-10');
  const [dietPlanHistory, setDietPlanHistory] = useState([
    { title: 'Hypertrophy Conditioning Phase 1', start: '2026-07-10', end: '2026-10-10', status: 'Active Adherence' }
  ]);

  // Food Ledger Log State Array
  const [loggedMeals, setLoggedMeals] = useState([]);

  // Hypertrophy Sourcing Shortcut Matrix
  const shortcuts = [
    { name: '🍳 3 Egg Whites', food: 'Egg Whites (3)', cal: 50, p: 11, c: 1, f: 0 },
    { name: '🥤 Whey Protein', food: '1 Scoop Whey Protein', cal: 120, p: 25, c: 2, f: 1 },
    { name: '🍗 Chicken & Rice', food: 'Grilled Chicken with Basmati Rice', cal: 450, p: 45, c: 40, f: 5 },
    { name: '🍌 Banana & Oats', food: 'Oatmeal with Banana', cal: 310, p: 10, c: 55, f: 4 }
  ];

  // Fetch tracking rows array on user authentication session active
  useEffect(() => {
    if (isLoggedIn && email) {
      fetch(`http://localhost:5000/api/meals/history/${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setLoggedMeals(data);
        })
        .catch((err) => console.error("Error pulling history:", err));
    }
  }, [isLoggedIn, email]);

  // Live Metric Math Aggregate Calculations
  const totalCalories = loggedMeals.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
  const totalProtein = loggedMeals.reduce((sum, item) => sum + (Number(item.protein) || 0), 0);
  const totalCarbs = loggedMeals.reduce((sum, item) => sum + (Number(item.carbs) || 0), 0);
  const totalFats = loggedMeals.reduce((sum, item) => sum + (Number(item.fats) || 0), 0);

  // Smart Dynamic Strategy Target Formulas
  const targetCal = fitnessGoal === 'hypertrophy' ? 3200 : 2100;
  const targetProt = fitnessGoal === 'hypertrophy' ? 170 : 145;

  const calPercent = Math.min((totalCalories / targetCal) * 100, 100);
  const protPercent = Math.min((totalProtein / targetProt) * 100, 100);

  const applyShortcut = (item) => {
    setFoodName(item.food); setCalories(item.cal); setProtein(item.p); setCarbs(item.c); setFats(item.f);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = authTab === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = authTab === 'login' 
      ? { email, password }
      : { email, password, age: Number(age), weight: Number(weight), height: Number(height), fitnessGoal };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        const data = await response.json();
        alert(data.message || "Authentication layer configuration rejected the details.");
      }
    } catch (err) {
      console.error(err);
      alert("Cannot talk to backend on port 5000.");
    }
  };

  const handleLogFood = async (e) => {
    e.preventDefault();
    const payload = { userEmail: email, foodName, mealWindow, calories: Number(calories), protein: Number(protein), carbs: Number(carbs), fats: Number(fats) };

    try {
      const response = await fetch('http://localhost:5000/api/meals/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok && data.newMeal) {
        setLoggedMeals([data.newMeal, ...loggedMeals]);
        setFoodName(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/meals/delete/${mealId}`, { method: 'DELETE' });
      if (response.ok) {
        setLoggedMeals(loggedMeals.filter(meal => meal._id !== mealId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDietPlan = (e) => {
    e.preventDefault();
    const newPlan = { title: planTitle, start: startDate, end: endDate, status: 'Active Adherence' };
    setDietPlanHistory([newPlan, ...dietPlanHistory]);
    alert("Personalized Diet Plan initialized successfully!");
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert("Profile configurations compiled and updated locally in execution state!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false); setLoggedMeals([]); setEmail(''); setPassword(''); setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-screen-container">
        <div className="auth-glass-card">
          <div className="auth-brand">
            <span className="auth-brand-icon">⚡</span>
            <h2>My Nutrition Partner</h2>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>
          <div className="auth-tabs">
            <button type="button" className={`auth-tab-btn ${authTab === 'login' ? 'active-tab' : ''}`} onClick={() => setAuthTab('login')}>Sign In</button>
            <button type="button" className={`auth-tab-btn ${authTab === 'register' ? 'active-tab' : ''}`} onClick={() => setAuthTab('register')}>Register</button>
          </div>
          <form onSubmit={handleAuthSubmit} className="auth-native-form">
            <div className="auth-input-group">
              <label>Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com" />
            </div>
            <div className="auth-input-group">
              <label>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {authTab === 'register' && (
              <div className="fade-in" style={{display:'flex', flexDirection:'column', gap:'1.25rem'}}>
                <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                  <div className="auth-input-group">
                    <label>Age</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 21" />
                  </div>
                  <div className="auth-input-group">
                    <label>Weight (kg)</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 75" />
                  </div>
                </div>
                <div className="auth-input-group">
                  <label>Height (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 180" />
                </div>
                <div className="auth-input-group">
                  <label>Target Objective Setting</label>
                  <select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
                    <option value="hypertrophy">Weight Gain & Muscle Hypertrophy</option>
                    <option value="weight_loss">Weight Loss Strategy Deficit</option>
                  </select>
                </div>
              </div>
            )}
            <button type="submit" className="auth-submit-btn">{authTab === 'login' ? 'Log In' : 'Create Account'}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="logo-section">
          <span className="logo-icon">⚡</span>
          <h2>Nutrition App</h2>
        </div>
        <nav className="nav-menu" style={{display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px'}}>
          <button style={{borderRadius: '4px'}} className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>📋 Entry Log Dashboard</button>
          <button style={{borderRadius: '4px'}} className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>👤 Profile Management</button>
          <button style={{borderRadius: '4px'}} className={activeTab === 'diet_plans' ? 'active' : ''} onClick={() => setActiveTab('diet_plans')}>📅 Manage Diet Plans</button>
          <button style={{borderRadius: '4px'}} className={activeTab === 'recommendations' ? 'active' : ''} onClick={() => setActiveTab('recommendations')}>🥦 Nutri Recommendations</button>
        </nav>
        <div className="sidebar-footer">
          <p>User Node: {email.split('@')[0]}</p>
          <p style={{opacity: 0.4, marginTop:'4px'}}>Strategy: {fitnessGoal === 'hypertrophy' ? 'Bulking' : 'Cutting'}</p>
        </div>
      </aside>

      {/* MAIN CONTAINER PANEL */}
      <main className="main-content" style={{background: '#ffffff', minHeight: '100vh'}}>
        <header className="main-header" style={{borderBottom: '1px solid #f1f5f9', paddingBottom: '15px'}}>
          <div>
            <h1 style={{color: '#22c55e', fontWeight: '800'}}>My Nutrition Partner</h1>
          </div>
          <div className="header-user-controls">
            <div className="avatar" style={{background: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1', fontWeight: '700'}}>PN</div>
            <button onClick={handleLogout} className="btn-header-logout">Sign Out</button>
          </div>
        </header>

        {/* 📋 TAB VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="fade-in" style={{paddingTop: '20px'}}>
            <section style={{display: 'flex', gap: '20px', marginBottom: '25px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px', flex: 1}}>
                <div style={{width: '65px', height: '65px', borderRadius: '50%', background: `conic-gradient(#22c55e ${calPercent}%, #e2e8f0 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px'}}>{Math.round(calPercent)}%</div>
                <div>
                  <h4 style={{margin: 0, color: '#64748b', fontSize: '13px'}}>Energy Balance Consumed</h4>
                  <p style={{margin: '4px 0 0 0', fontWeight: 'bold', fontSize: '18px', color: '#0f172a'}}>{totalCalories} / {targetCal} kcal</p>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px', flex: 1}}>
                <div style={{width: '65px', height: '65px', borderRadius: '50%', background: `conic-gradient(#3b82f6 ${protPercent}%, #e2e8f0 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px'}}>{Math.round(protPercent)}%</div>
                <div>
                  <h4 style={{margin: 0, color: '#64748b', fontSize: '13px'}}>Total Macro Protein Target</h4>
                  <p style={{margin: '4px 0 0 0', fontWeight: 'bold', fontSize: '18px', color: '#0f172a'}}>{totalProtein} / {targetProt} g</p>
                </div>
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card" style={{background: '#f8fafc', border: '1px solid #e2e8f0'}}><h3>Carbohydrates</h3><div className="stat-value" style={{color: '#0f172a'}}>{totalCarbs} <span className="unit">g</span></div></div>
              <div className="stat-card" style={{background: '#f8fafc', border: '1px solid #e2e8f0'}}><h3>Dietary Fats</h3><div className="stat-value" style={{color: '#0f172a'}}>{totalFats} <span className="unit">g</span></div></div>
            </section>

            <div className="dashboard-layout">
              <div className="dashboard-main-panel" style={{background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px'}}>
                <h3 style={{color: '#0f172a', fontWeight: '700'}}>Input Food Consumption</h3>
                <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '12px 0'}}>
                  {shortcuts.map((item, idx) => (
                    <button key={idx} type="button" onClick={() => applyShortcut(item)} style={{background: '#ffffff', border: '1px solid #e2e8f0', color: '#334155', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', cursor: 'pointer'}}>{item.name}</button>
                  ))}
                </div>
                <form onSubmit={handleLogFood} className="meal-form">
                  <div className="form-group"><label>Food Item Title</label><input type="text" required value={foodName} onChange={(e) => setFoodName(e.target.value)} /></div>
                  <div className="form-grid">
                    <div className="form-group"><label>Energy (kcal)</label><input type="number" required value={calories} onChange={(e) => setCalories(e.target.value)} /></div>
                    <div className="form-group"><label>Protein (g)</label><input type="number" required value={protein} onChange={(e) => setProtein(e.target.value)} /></div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group"><label>Carbs (g)</label><input type="number" required value={carbs} onChange={(e) => setCarbs(e.target.value)} /></div>
                    <div className="form-group"><label>Fats (g)</label><input type="number" required value={fats} onChange={(e) => setFats(e.target.value)} /></div>
                  </div>
                  <div className="form-group">
                    <label>Meal Target Window</label>
                    <select value={mealWindow} onChange={(e) => setMealWindow(e.target.value)}>
                      <option value="Breakfast">Breakfast Allocation</option>
                      <option value="Lunch">Lunch Allocation</option>
                      <option value="Dinner">Dinner Allocation</option>
                      <option value="Snack">Snacks / Supplements</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary">Log Entry Node</button>
                </form>
              </div>

              <div className="dashboard-side-panel" style={{background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px'}}>
                <h3 style={{color: '#0f172a', fontWeight: '700'}}>Live Ledger Stream</h3>
                <div className="meal-list">
                  {loggedMeals.map((meal) => (
                    <div key={meal._id || meal.id} className="meal-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff'}}>
                      <div>
                        <span className={`meal-tag ${meal.mealWindow.toLowerCase()}`}>{meal.mealWindow}</span>
                        <h4 style={{color: '#0f172a', margin: '4px 0'}}>{meal.foodName}</h4>
                        <span style={{fontSize: '11px', color: '#64748b'}}>P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{fontWeight: 700, color: '#0f172a'}}>{meal.calories} kcal</div>
                        <button onClick={() => handleDeleteMeal(meal._id)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer'}}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 👤 TAB VIEW 2: PROFILE MANAGEMENT */}
        {activeTab === 'profile' && (
          <div className="fade-in" style={{background: '#f8fafc', border: '1px solid #e2e8f0', padding: '25px', borderRadius: '12px', marginTop: '20px'}}>
            <h2 style={{color: '#0f172a', marginBottom: '6px'}}>Profile Management</h2>
            <p className="panel-subtitle" style={{disabledColor: '#64748b', marginBottom: '20px'}}>Keep biometric values up-to-date to re-scale calculator metrics guidelines boundaries.</p>
            <form onSubmit={handleUpdateProfile} style={{maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div className="auth-input-group"><label>Account Email Context</label><input type="email" disabled value={email} style={{background: '#e2e8f0', cursor: 'not-allowed'}} /></div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                <div className="auth-input-group"><label>Age Parameters</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} /></div>
                <div className="auth-input-group"><label>Current Weight (kg)</label><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
              </div>
              <div className="auth-input-group"><label>Measured Height (cm)</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} /></div>
              <div className="auth-input-group">
                <label>Active Metrics Target Plan</label>
                <select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff'}}>
                  <option value="hypertrophy">Weight Gain & Muscle Hypertrophy Focus</option>
                  <option value="weight_loss">Weight Loss Strategy Deficit</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{marginTop: '10px'}}>Save Structural Changes</button>
            </form>
          </div>
        )}

        {/* 📅 TAB VIEW 3: DIET PLANS */}
        {activeTab === 'diet_plans' && (
          <div className="fade-in" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>
            <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', padding: '25px', borderRadius: '12px'}}>
              <h2 style={{color: '#0f172a', marginBottom: '4px'}}>Formulate Diet Plan</h2>
              <p className="panel-subtitle" style={{marginBottom: '15px'}}>Define execution operational calendar targets.</p>
              <form onSubmit={handleCreateDietPlan} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                <div className="auth-input-group"><label>Plan Designation Title</label><input type="text" required value={planTitle} onChange={(e) => setPlanTitle(e.target.value)} /></div>
                <div className="auth-input-group"><label>Start Boundary Date</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
                <div className="auth-input-group"><label>End Target Date</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
                <button type="submit" className="btn-primary">Provision Roadmap Node</button>
              </form>
            </div>
            <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', padding: '25px', borderRadius: '12px'}}>
              <h3 style={{color: '#0f172a'}}>Active Adherence Logs</h3>
              <div style={{marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {dietPlanHistory.map((plan, i) => (
                  <div key={i} style={{border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', background: '#ffffff'}}>
                    <span style={{background: '#22c55e', color: '#ffffff', fontSize: '10px', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold'}}>{plan.status}</span>
                    <h4 style={{color: '#1e293b', margin: '8px 0 4px 0'}}>{plan.title}</h4>
                    <p style={{margin: 0, fontSize: '12px', color: '#64748b'}}>Operational Horizon: {plan.start} to {plan.end}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 🥦 TAB VIEW 4: NUTRI RECOMMENDATIONS (REDEFINED & EXPANDED) */}
        {activeTab === 'recommendations' && (
          <div className="fade-in" style={{background: '#f8fafc', border: '1px solid #e2e8f0', padding: '25px', borderRadius: '12px', marginTop: '20px'}}>
            <h2 style={{color: '#0f172a', marginBottom: '4px'}}>Nutritional Information & Guidance Directory</h2>
            <p className="panel-subtitle" style={{marginBottom: '20px'}}>Dynamic clinical-tier guidance metrics corresponding directly with your active target goal profile.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              {/* TARGET RECAP BANNER */}
              <div style={{background: '#ffffff', padding: '15px 20px', borderRadius: '8px', borderLeft: '4px solid #22c55e', border: '1px solid #e2e8f0', borderLeftWidth: '5px'}}>
                <p style={{margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.5'}}>
                  🚨 <strong>Adherence Target Analysis:</strong> For your updated metrics (Weight: <strong>{weight || '0'} kg</strong>, Height: <strong>{height || '0'} cm</strong>), the strategy engine dictates a daily consumption of <strong>{targetCal} kcal</strong> and <strong>{targetProt} g of Protein</strong>.
                </p>
              </div>

              {/* GRID SECTIONS */}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                
                {/* COLUMN 1: SUPERFOODS BREAKDOWN */}
                <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                  <h3 style={{color: '#1e293b', fontSize: '15px', fontWeight: '700', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '12px'}}>🥩 Targeted Superfood Selection</h3>
                  <ul style={{paddingLeft: '18px', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0}}>
                    {fitnessGoal === 'hypertrophy' ? (
                      <>
                        <li><strong>Whole Eggs & Greek Yogurt:</strong> Bioavailable complete proteins packed with leucine to initiate maximum muscle protein synthesis (MPS).</li>
                        <li><strong>Basmati Rice & Sweet Potatoes:</strong> Clean glycogen sources that optimize intra-muscular fuel storage, dramatically increasing output during progressive overload training.</li>
                        <li><strong>Peanuts & Cold-Pressed Olive Oil:</strong> Calorically dense lipids that supply safe, raw clean energy bounds, making a clean caloric surplus effortless to achieve.</li>
                      </>
                    ) : (
                      <>
                        <li><strong>Lean Chicken Breast & White Fish:</strong> Extremely high protein-to-calorie density ratios that fully protect lean muscle mass from catabolism during a deficit.</li>
                        <li><strong>Fibrous Vegetables (Broccoli & Spinach):</strong> High volume nutrition providing structural gastric satiety blocks, suppressing mechanical hunger signals cleanly.</li>
                        <li><strong>Wild Berries & Avocados:</strong> Low glycemic carbohydrates rich in cell-protecting antioxidants alongside anti-inflammatory monounsaturated structural fats.</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* COLUMN 2: TIMING & MEAL SCHEDULE RULES */}
                <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                  <h3 style={{color: '#1e293b', fontSize: '15px', fontWeight: '700', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '12px'}}>⏰ Meal Timing & Allocation Logic</h3>
                  <ul style={{paddingLeft: '18px', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0}}>
                    {fitnessGoal === 'hypertrophy' ? (
                      <>
                        <li><strong>Pre-Workout Window:</strong> Consume a composite meal of complex carbohydrates and 30g+ protein 90 minutes before your session to maximize raw power outputs.</li>
                        <li><strong>Post-Workout Anabolic Phase:</strong> Prioritize an instant fast-digesting protein stream (like Whey protein) within 45 minutes to accelerate tissue remodeling.</li>
                        <li><strong>Protein Pacing Rule:</strong> Space your protein intake evenly across 4 distinct meals to sustain a consistent positive nitrogen balance throughout the day.</li>
                      </>
                    ) : (
                      <>
                        <li><strong>Satiety Scheduling:</strong> Frontload 40% of your total daily carbohydrate allowances around your heavy training windows to maintain energy levels while managing baseline rules.</li>
                        <li><strong>Intermittent Allocation:</strong> Consider delaying your breakfast window to narrow your eating window, creating an automated mental buffer against evening cravings.</li>
                        <li><strong>Night Casein Intake:</strong> Consume a slow-release clean protein item (like low-fat paneer or curd) before sleeping to control overnight muscle recovery.</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* COLUMN 3: MICRONUTRIENTS & INTEGRATION */}
                <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                  <h3 style={{color: '#1e293b', fontSize: '15px', fontWeight: '700', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '12px'}}>💧 Micronutrient & Hydration Guardrails</h3>
                  <ul style={{paddingLeft: '18px', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0}}>
                    <li><strong>Hydration Standard:</strong> Maintain a minimum intake of 3.5 to 4.5 liters of clean water daily to facilitate safe cell hydration, metabolic pathways, and digestion.</li>
                    <li><strong>Electrolyte Management:</strong> Ensure sufficient dietary potassium and sodium inputs to guard against cramping and keep intramuscular pump metrics high.</li>
                    <li><strong>Fiber Tracking Minimums:</strong> Target at least 30g of dietary fiber daily from whole foods to stabilize blood glucose spikes and support optimal gut health.</li>
                  </ul>
                </div>

                {/* COLUMN 4: SYSTEM TRACKING RESPONSIBILITY RULES */}
                <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                  <h3 style={{color: '#1e293b', fontSize: '15px', fontWeight: '700', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '12px'}}>🛡️ End-User Operational Responsibilities</h3>
                  <ul style={{paddingLeft: '18px', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0}}>
                    <li><strong>Consistent Logging:</strong> Commit input values immediately post-consumption. Tracking errors compound fast when relying on memory at the end of the day.</li>
                    <li><strong>Biometric Synchronization:</strong> Access the <em>Profile Management</em> view weekly to adjust body weight changes. The target math engines adapt seamlessly.</li>
                    <li><strong>Adherence Reporting:</strong> Cross-check your dynamic ledger history stream items against your set calendar diet plans to evaluate and optimize your compliance.</li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}