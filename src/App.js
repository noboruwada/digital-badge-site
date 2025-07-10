import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import adminData from './data/admin.json';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // ローカルストレージからログイン状態を復元
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // 管理者判定（設定ファイルから動的取得）
      const adminEmails = adminData.config.admins.map(admin => admin.email);
      if (adminEmails.includes(userData.email)) {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // 管理者判定（設定ファイルから動的取得）
    const adminEmails = adminData.config.admins.map(admin => admin.email);
    if (adminEmails.includes(userData.email)) {
      setIsAdmin(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('currentUser');
  };

  // ログインしていない場合はログイン画面を表示
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header>
        <h1>🏆 デジタルバッジ管理システム</h1>
        <div className="user-info">
          <span>ようこそ、{user.name}さん</span>
          {isAdmin && <span style={{color: '#ffd700'}}>👑 管理者</span>}
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      </header>
      
      {isAdmin ? <AdminPanel /> : <Dashboard user={user} />}
    </div>
  );
}

export default App;