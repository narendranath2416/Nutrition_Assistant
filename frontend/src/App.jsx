import { useState } from 'react';
import axios from 'axios';
import { Flame, Utensils, Plus, LogOut, User, Activity, Scale, Dumbbell, Apple, PieChart } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [meals, setMeals] = useState([]);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', age: '', weight: '', height: '', fitnessGoal: 'Muscle Hypertrophy'
  });
  const [mealForm, setMealForm] = useState({ foodName: '', calories: '', protein: '', carbs: '', fats: '', mealType: 'Breakfast' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleMealChange = (e) => setMealForm({ ...mealForm, [e.target.name]: e.target.value });

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    const url = isLogin ? 'http://localhost:5000/api/user/login' : 'http://localhost:5000/api/user/register';
    try {
      const res = await axios.post(url, formData);
      setUser(res.data);
      fetchUserMeals(res.data._id);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Authentication failed. Please verify your details.');
    }
  };

  const fetchUserMeals = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/meals/user/${userId}`);
      setMeals(res.data);
    } catch (err) {
      console.error("Error fetching meals:", err);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/meals/add', { ...mealForm, userId: user._id });
      setMeals([res.data, ...meals]);
      setMealForm({ foodName: '', calories: '', protein: '', carbs: '', fats: '', mealType: 'Breakfast' });
    } catch (error) {
  console.error(error);
  alert("Failed to save meal entry.");
}
  };

  // Calculate Aggregates
  const totalCalories = meals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + Number(m.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + Number(m.carbs || 0), 0);
  const totalFats = meals.reduce((sum, m) => sum + Number(m.fats || 0), 0);

  // Global styles object for a premium look
  const theme = {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    primary: '#10b981', // Emerald Green
    primaryHover: '#059669',
    background: '#f8fafc',
    cardBg: '#ffffff',
    textMain: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
  };

  if (!user) {
    return (
      <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: theme.cardBg, maxWidth: '440px', width: '100%', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', border: `1px solid ${theme.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ background: '#e6f4ea', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Apple size={28} color={theme.primary} />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: theme.textMain }}>
              {isLogin ? 'Welcome Back' : 'Create Premium Account'}
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: theme.textMuted }}>
              {isLogin ? 'Sign in to monitor your nutritional metrics' : 'Set up your physical profile variables'}
            </p>
          </div>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div style={{ position: 'relative' }}>
                <User size={18} color={theme.textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" name="username" placeholder="Full Name" onChange={handleChange} required style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            )}
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
            
            {!isLogin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input type="number" name="age" placeholder="Age" onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '15px', boxSizing: 'border-box' }} />
                <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '15px', boxSizing: 'border-box' }} />
                <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '15px', boxSizing: 'border-box' }} />
                <select name="fitnessGoal" onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '15px', backgroundColor: '#fff', boxSizing: 'border-box' }}>
                  <option value="Muscle Hypertrophy">Muscle Hypertrophy</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            )}

            <button type="submit" style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', marginTop: '8px', transition: 'background-color 0.2s' }}>
              {isLogin ? 'Sign In' : 'Generate Profile'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: theme.textMuted }}>
            {isLogin ? "New to the assistant?" : "Already configured a profile?"}{' '}
            <span onClick={() => setIsLogin(!isLogin)} style={{ color: theme.primary, cursor: 'pointer', fontWeight: '600' }}>
              {isLogin ? 'Create profile here' : 'Sign in here'}
            </span>
          </p>
          {message && <p style={{ textAlign: 'center', color: '#ef4444', fontWeight: '600', fontSize: '14px', marginTop: '16px' }}>{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh', padding: '0 0 40px 0' }}>
      {/* Navbar Header */}
      <header style={{ backgroundColor: theme.cardBg, borderBottom: `1px solid ${theme.border}`, padding: '16px 40px', sticky: 'top', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#e6f4ea', padding: '8px', borderRadius: '8px' }}><Apple size={22} color={theme.primary} /></div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: theme.textMain, margin: 0 }}>Nutrition Assistant</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', color: theme.textMain }}>{user.username || 'Fitness Elite'}</div>
              <div style={{ fontSize: '13px', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}><Dumbbell size={12} color={theme.primary} /> {user.fitnessGoal}</div>
            </div>
            <button onClick={() => setUser(null)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', color: '#ef4444', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              <LogOut size={14} /> Leave
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Content Wrapper */}
      <main style={{ maxWidth: '1200px', margin: '40px auto 0 auto', padding: '0 20px', boxSizing: 'border-box' }}>
        
        {/* Top Analytics Metrics Dashboard row */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '10px' }}><Flame size={24} color="#d97706" /></div>
            <div>
              <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '500' }}>Energy Consumed</span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: '700' }}>{totalCalories} <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textMuted }}>kcal</span></h2>
            </div>
          </div>

          <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px' }}><Scale size={24} color="#2563eb" /></div>
            <div>
              <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '500' }}>Total Protein</span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: '700' }}>{totalProtein} <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textMuted }}>g</span></h2>
            </div>
          </div>

          <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#e0f2fe', padding: '14px', borderRadius: '10px' }}><PieChart size={24} color="#0284c7" /></div>
            <div>
              <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '500' }}>Carbohydrates</span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: '700' }}>{totalCarbs} <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textMuted }}>g</span></h2>
            </div>
          </div>

          <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#faf5ff', padding: '14px', borderRadius: '10px' }}><Activity size={24} color="#7c3aed" /></div>
            <div>
              <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '500' }}>Dietary Fats</span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: '700' }}>{totalFats} <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textMuted }}>g</span></h2>
            </div>
          </div>
        </section>

        {/* Dynamic Structural Grid split view */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', alignItems: 'start' }}>
          
          {/* Form Side */}
          <div style={{ backgroundColor: theme.cardBg, padding: '32px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} color={theme.primary} /> Log Macro Entry
            </h3>
            <form onSubmit={handleAddMeal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: theme.textMain }}>Food Name</label>
                <input type="text" name="foodName" placeholder="e.g. Grilled Chicken Breast" value={mealForm.foodName} onChange={handleMealChange} required style={{ width: '100%', padding: '11px', borderRadius: '6px', border: `1px solid ${theme.border}`, boxSizing: 'border-box', fontSize: '14px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: theme.textMain }}>Calories (kcal)</label>
                  <input type="number" name="calories" placeholder="0" value={mealForm.calories} onChange={handleMealChange} required style={{ width: '100%', padding: '11px', borderRadius: '6px', border: `1px solid ${theme.border}`, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: theme.textMain }}>Protein (g)</label>
                  <input type="number" name="protein" placeholder="0" value={mealForm.protein} onChange={handleMealChange} required style={{ width: '100%', padding: '11px', borderRadius: '6px', border: `1px solid ${theme.border}`, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: theme.textMain }}>Carbs (g)</label>
                  <input type="number" name="carbs" placeholder="0" value={mealForm.carbs} onChange={handleMealChange} required style={{ width: '100%', padding: '11px', borderRadius: '6px', border: `1px solid ${theme.border}`, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: theme.textMain }}>Fats (g)</label>
                  <input type="number" name="fats" placeholder="0" value={mealForm.fats} onChange={handleMealChange} required style={{ width: '100%', padding: '11px', borderRadius: '6px', border: `1px solid ${theme.border}`, boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: theme.textMain }}>Meal Window</label>
                <select name="mealType" value={mealForm.mealType} onChange={handleMealChange} style={{ width: '100%', padding: '11px', borderRadius: '6px', border: `1px solid ${theme.border}`, background: '#fff', fontSize: '14px', boxSizing: 'border-box' }}>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <button type="submit" style={{ backgroundColor: theme.textMain, color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', marginTop: '8px' }}>
                Secure Entry Log
              </button>
            </form>
          </div>

          {/* History Data Table side */}
          <div style={{ backgroundColor: theme.cardBg, padding: '32px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <Utensils size={20} color={theme.primary} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Chronological Feed Entries</h3>
            </div>
            
            {meals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: theme.textMuted }}>
                <p style={{ margin: 0, fontSize: '15px', fontStyle: 'italic' }}>No metric entries recorded today.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {meals.map((meal, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '10px', border: `1px solid ${theme.border}`, transition: 'transform 0.2s' }}>
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', tracking: '0.05em', background: '#f1f5f9', color: theme.textMain, padding: '4px 8px', borderRadius: '4px', fontWeight: '700', marginRight: '12px' }}>
                        {meal.mealType}
                      </span>
                      <strong style={{ color: theme.textMain, fontSize: '15px' }}>{meal.foodName}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: '600' }}>
                      <span style={{ color: '#d97706' }}>🔥 {meal.calories} kcal</span>
                      <span style={{ color: '#2563eb' }}>🥩 {meal.protein}g</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;