import { useState, useEffect } from 'react';
import './App.css'; // Connects directly to external stylesheet variables

export default function App() {
  // Session Access States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  
  // Registration Profile States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('20');
  const [weight, setWeight] = useState('76');
  const [height, setHeight] = useState('194');
  const [fitnessGoal, setFitnessGoal] = useState('hypertrophy');

  // Input Data Form States
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [mealWindow, setMealWindow] = useState('Breakfast');

  // Active Sync Ledger Stream Array 
  const [loggedMeals, setLoggedMeals] = useState([]);

  // Fetch the live database logs array whenever a user successfully authenticates
  useEffect(() => {
    if (isLoggedIn && email) {
      fetch(`http://localhost:5000/api/meals/history/${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setLoggedMeals(data);
        })
        .catch((err) => console.error("Error synchronizing tracking history:", err));
    }
  }, [isLoggedIn, email]);

  // Dynamic Live Aggregate Value Math Calculations
  const totalCalories = loggedMeals.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
  const totalProtein = loggedMeals.reduce((sum, item) => sum + (Number(item.protein) || 0), 0);
  const totalCarbs = loggedMeals.reduce((sum, item) => sum + (Number(item.carbs) || 0), 0);
  const totalFats = loggedMeals.reduce((sum, item) => sum + (Number(item.fats) || 0), 0);

  // User Profile Cloud Insertion Submission
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
        alert(data.message || "Authentication layer rejected the request parameters.");
      }
    } catch (err) {
      console.error(err);
      alert("Cannot talk to backend on port 5000. Is server.js active?");
    }
  };

  // Dietary Food Document Cloud Integration Pipeline
  const handleLogFood = async (e) => {
    e.preventDefault();
    const payload = {
      userEmail: email, // Associate this tracking row with this active user profile
      foodName,
      mealWindow,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0
    };

    try {
      const response = await fetch('http://localhost:5000/api/meals/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.newMeal) {
        // Unshift the successfully returned document payload directly into state
        setLoggedMeals([data.newMeal, ...loggedMeals]);
        setFoodName(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
      } else {
        alert("Failed to commit food record document map to database cluster collections.");
      }
    } catch (err) {
      console.error(err);
      alert("Network dropped during data sync collection write transaction sequence.");
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

        <section className="stats-grid">
          <div className="stat-card">
            <h3 style={{color: '#64748b'}}>Energy Balance</h3>
            <div className="stat-value" style={{color: '#0f172a'}}>{totalCalories} <span className="unit">kcal</span></div>
          </div>
          <div className="stat-card">
            <h3 style={{color: '#64748b'}}>Total Protein</h3>
            <div className="stat-value" style={{color: '#0f172a'}}>{totalProtein} <span className="unit">g</span></div>
          </div>
          <div className="stat-card">
            <h3 style={{color: '#64748b'}}>Carbohydrates</h3>
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
            <p className="panel-subtitle">Record and compile values into your running cloud cluster document node.</p>

            <form onSubmit={handleLogFood} className="meal-form">
              <div className="form-group">
                <label>Food Item Title</label>
                <input type="text" required value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="e.g., Grilled Chicken with Basmati Rice" />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Energy (kcal)</label>
                  <input type="number" required value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="400" />
                </div>
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input type="number" required value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="40" />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Carbs (g)</label>
                  <input type="number" required value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="35" />
                </div>
                <div className="form-group">
                  <label>Fats (g)</label>
                  <input type="number" required value={fats} onChange={(e) => setFats(e.target.value)} placeholder="5" />
                </div>
              </div>

              <div className="form-group">
                <label>Meal Target Window</label>
                <select value={mealWindow} onChange={(e) => setMealWindow(e.target.value)}>
                  <option value="Breakfast">Breakfast Allocation</option>
                  <option value="Lunch">Lunch Allocation</option>
                  <option value="Dinner">Dinner Allocation</option>
                  <option value="Snack">Snacks / Other Supplementation</option>
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
                <div key={meal._id || meal.id} className="meal-item fade-in">
                  <div className="meal-info">
                    <span className={`meal-tag ${meal.mealWindow.toLowerCase()}`}>{meal.mealWindow}</span>
                    <h4 style={{color: '#0f172a'}}>{meal.foodName}</h4>
                    <div className="meal-macros" style={{marginTop:'6px', fontSize:'11px'}}>
                      <span>P: {meal.protein}g</span>
                      <span>C: {meal.carbs}g</span>
                      <span>F: {meal.fats}g</span>
                    </div>
                  </div>
                  <div style={{fontWeight:700, color: '#0f172a'}}>{meal.calories} kcal</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}