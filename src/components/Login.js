import React, { useState } from 'react';
import usersData from '../data/users.json';
import badgesData from '../data/badges.json';
import adminData from '../data/admin.json';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // ユーザー検索
    const user = usersData.users.find(u => u.email === email);
    
    if (!user) {
      setError('メールアドレスが見つかりません');
      return;
    }

    // パスワード認証（研修パスワード + 管理者パスワード）
    const validPasswords = [
      ...badgesData.badges.map(badge => badge.password),
      ...adminData.config.admins.map(admin => admin.password) // 管理者パスワードを動的取得
    ];
    
    if (!validPasswords.includes(password)) {
      setError('パスワードが正しくありません');
      return;
    }

    // ログイン成功
    onLogin(user);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>🏆 モダトレデジタルバッジ</h2>
        <h3>🔐 ログイン</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>メールアドレス:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@company.com"
              required
            />
          </div>
          <div className="form-group">
            <label>研修パスワード:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="研修で案内されたパスワード"
              required
            />
          </div>
          {error && <div className="error">❌ {error}</div>}
          <button type="submit" className="login-button">
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;