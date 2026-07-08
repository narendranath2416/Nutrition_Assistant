import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', age: '', weight: '', height: '', fitnessGoal: 'Maintenance'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const url = isLogin ? 'http://localhost:5000/api/user/login' : 'http://localhost:5000/api/user/register';
    
    try {
      const res = await axios.post(url, formData);
      setMessage(`${isLogin ? 'Login' : 'Registration'} Successful! Welcome, ${res.data.username || formData.email}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong. Please check your details.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>{isLogin ? 'Sign In to Nutrition Assistant' : 'Create Your Health Profile'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'col', gap: '12px' }}>
        {!isLogin && (
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        )}
        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        
        {!isLogin && (
          <>
            <input type="number" name="age" placeholder="Age" onChange={handleChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <select name="fitnessGoal" onChange={handleChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="Maintenance">Maintenance</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Hypertrophy">Muscle Hypertrophy</option>
            </select>
          </>
        )}
        
        <button type="submit" style={{ backgroundColor: '#007BFF', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLogin ? 'Login' : 'Register Profile'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
        {isLogin ? "New to the platform?" : "Already have a profile?"}{' '}
        <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}>
          {isLogin ? 'Create an account' : 'Sign in here'}
        </span>
      </p>
      {message && <p style={{ textAlign: 'center', color: message.includes('Successful') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default App;