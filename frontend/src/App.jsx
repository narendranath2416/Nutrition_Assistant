import { useState, useEffect } from 'react';
import './App.css'; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('20');
  const [weight, setWeight] = useState('76');
  const [height, setHeight] = useState('194');
  const [fitnessGoal, setFitnessGoal] = useState('hypertrophy');

  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [mealWindow, setMealWindow] = useState('Breakfast');

  const [loggedMeals, setLoggedMeals] = useState([]);

  // 🎯 HYPERTROPHY SHORTCUT CHIPS CONFIGURATION
  const shortcuts = [
    { name: '🍳 3 Egg Whites', food: 'Egg Whites (3)', cal: 50, p: 11, c: 1, f: 0 },
    { name: '🥤 Whey Protein', food: '1 Scoop Whey Protein', cal: 120, p: 25, c: 2, f: 1 },
    { name: '🍗 Chicken & Rice', food: 'Grilled Chicken with Basmati Rice', cal: 450, p: 45, c: 40, f: 5 },
    { name: '🍌 Banana & Oats', food: 'Oatmeal with Banana', cal: 310, p: 10, c: 55, f: 4 }
  ];

  useEffect(() => {
    if (isLoggedIn && email) {
      fetch(`http://localhost:5000/api/meals/history/${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setLoggedMeals(data);
        })
        .catch((err) => console.error("Error synchronizing history:", err));
    }
  }, [isLoggedIn, email]);

  // Live Aggregate Math Calculations
  const totalCalories = loggedMeals.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
  const totalProtein = loggedMeals.reduce((sum, item) => sum + (Number(item.protein) || 0), 0);
  const totalCarbs = loggedMeals.reduce((sum, item) => sum + (Number(item.carbs) || 0), 0);
  const totalFats = loggedMeals.reduce((sum, item) => sum + (Number(item.fats) || 0), 0);

  // Targets based on 76kg / Hypertrophy goals
  const targetCal = 3000;
  const targetProt = 160;

  // Calculate percentage caps for the progress rings (Max out at 100%)
  const calPercent = Math.min((totalCalories / targetCal) * 100, 100);
  const protPercent = Math.min((totalProtein / targetProt) * 100, 100);

  const applyShortcut = (item) => {
    setFoodName(item.food);
    setCalories(item.cal);
    setProtein(item.p);
    setCarbs(item.c);
    setFats(item.f);
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
      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        alert(data.message || "Authentication layer rejected parameters.");
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
      alert("Network error during meal write operation.");
    }
  };

  // 🗑️ CONTROL CODE: DELETE TRANSACTION METHOD
  const handleDeleteMeal = async (mealId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/meals/delete/${mealId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Filter out the deleted meal from local state instantly
        setLoggedMeals(loggedMeals.filter(meal => meal._id !== mealId));
      } else {
        alert("Could not remove record from cloud collection.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedMeals([]);
    setEmail(''); setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-screen-container">
        <div className="auth-glass-card">
          <div className="auth-brand">
            <span className="auth-brand-icon">⚡</span>
            <h2>My Nutrition Partner</h2>
            <p className="auth-subtitle">Sign in to your dashboard</p>
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
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                  <div className="auth-input-group">
                    <label>Age</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                  </div>
                  <div className="auth-input-group">
                    <label>Weight (kg)</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                </div>
                <div className="auth-input-group">
                  <label>Height (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                </div>
                <div className="auth-input-group">
                  <label>Target Objective</label>
                  <select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
                    <option value="hypertrophy">Muscle Hypertrophy Focus</option>
                    <option value="weight_loss">Weight Loss Strategy</option>
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
      <aside className="sidebar">
        <div className="logo-section">
          <span className="logo-icon">⚡</span>
          <h2>Nutrition App</h2>
        </div>
        <nav className="nav-menu">
          <button className="active">Dashboard Hub</button>
        </nav>
        <div className="sidebar-footer">
          <p>MERN Pipeline Node</p>
          <p style={{opacity: 0.4, marginTop:'4px'}}>Cloud Status: Syncing</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div>
            <h1 style={{color: '#0f172a'}}>My Nutrition Partner</h1>
            <p className="subtitle">Real-time daily dietary tracking ledger</p>
          </div>
          <div className="header-user-controls">
            <div className="avatar">PN</div>
            <button onClick={handleLogout} className="btn-header-logout">Sign Out</button>
          </div>
        </header>

        {/* 🌀 PROGRESS RINGS AREA */}
        <section style={{display: 'flex', gap: '20px', marginBottom: '25px', background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px', flex: 1}}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%', 
              background: `conic-gradient(#22c55e ${calPercent}%, #e2e8f0 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: '#0f172a'
            }}>{Math.round(calPercent)}%</div>
            <div>
              <h4 style={{margin: 0, color: '#64748b', fontSize: '14px'}}>Calories Progress</h4>
              <p style={{margin: '4px 0 0 0', fontWeight: 'bold', fontSize: '18px', color: '#0f172a'}}>{totalCalories} / {targetCal} kcal</p>
            </div>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '15px', flex: 1}}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%', 
              background: `conic-gradient(#3b82f6 ${protPercent}%, #e2e8f0 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: '#0f172a'
            }}>{Math.round(protPercent)}%</div>
            <div>
              <h4 style={{margin: 0, color: '#64748b', fontSize: '14px'}}>Protein Progress</h4>
              <p style={{margin: '4px 0 0 0', fontWeight: 'bold', fontSize: '18px', color: '#0f172a'}}>{totalProtein} / {targetProt} g</p>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <h3 style={{color: '#64748b'}}>Total Carbs</h3>
            <div className="stat-value" style={{color: '#0f172a'}}>{totalCarbs} <span className="unit">g</span></div>
          </div>
          <div className="stat-card">
            <h3 style={{color: '#64748b'}}>Dietary Fats</h3>
            <div className="stat-value" style={{color: '#0f172a'}}>{totalFats} <span className="unit">g</span></div>
          </div>
        </section>

        <div className="dashboard-layout">
          <div className="dashboard-main-panel">
            <h3 style={{marginBottom:'6px', color: '#0f172a', fontWeight: '700'}}>Log Daily Intake</h3>
            
            {/* ⚡ SHORTCUT BUTTON CHIPS ROW */}
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '15px 0 20px 0'}}>
              {shortcuts.map((item, idx) => (
                <button 
                  key={idx} 
                  type="button" 
                  onClick={() => applyShortcut(item)}
                  style={{background: '#f1f5f9', border: 'none', color: '#334155', padding: '8px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'}}
                  onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
                  onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogFood} className="meal-form">
              <div className="form-group">
                <label>Food Item Title</label>
                <input type="text" required value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="e.g., Grilled Chicken Rice" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Energy (kcal)</label>
                  <input type="number" required value={calories} onChange={(e) => setCalories(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input type="number" required value={protein} onChange={(e) => setProtein(e.target.value)} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Carbs (g)</label>
                  <input type="number" required value={carbs} onChange={(e) => setCarbs(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Fats (g)</label>
                  <input type="number" required value={fats} onChange={(e) => setFats(e.target.value)} />
                </div>
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

          <div className="dashboard-side-panel">
            <h3 style={{marginBottom:'6px', color: '#0f172a', fontWeight: '700'}}>Live Ledger Stream</h3>
            <p className="panel-subtitle">Staged document updates.</p>

            <div className="meal-list">
              {loggedMeals.map((meal) => (
                <div key={meal._id || meal.id} className="meal-item fade-in" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div className="meal-info">
                    <span className={`meal-tag ${meal.mealWindow.toLowerCase()}`}>{meal.mealWindow}</span>
                    <h4 style={{color: '#0f172a', margin: '4px 0'}}>{meal.foodName}</h4>
                    <div className="meal-macros" style={{fontSize:'11px', color: '#64748b'}}>
                      <span>P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g</span>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{fontWeight:700, color: '#0f172a'}}>{meal.calories} kcal</div>
                    {/* 🗑️ TRASH ICON ICON TRIGGER */}
                    <button 
                      onClick={() => handleDeleteMeal(meal._id)}
                      style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', padding: '4px'}}
                      title="Delete Entry"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}