# 各ファイルの実装内容（コピペ用）

## 📁 ファイル別実装ガイド

### 🗂️ データファイル（まず最初に作成）

#### `src/data/users.json`
```json
{
  "users": [
    {
      "email": "tanaka@company.com",
      "name": "田中太郎",
      "completedTrainings": ["security-training"]
    },
    {
      "email": "sato@company.com", 
      "name": "佐藤花子",
      "completedTrainings": ["security-training", "compliance-training"]
    },
    {
      "email": "yamada@company.com",
      "name": "山田次郎", 
      "completedTrainings": []
    },
    {
      "email": "admin@company.com",
      "name": "管理者",
      "completedTrainings": ["security-training", "compliance-training", "leadership-training"]
    }
  ]
}
```

#### `src/data/badges.json`
```json
{
  "badges": [
    {
      "id": "security-training",
      "name": "セキュリティ研修",
      "file": "/assets/badges/security-badge.png",
      "description": "情報セキュリティ基礎研修修了証",
      "password": "sec2024"
    },
    {
      "id": "compliance-training", 
      "name": "コンプライアンス研修",
      "file": "/assets/badges/compliance-badge.png",
      "description": "企業コンプライアンス研修修了証",
      "password": "comp2024"
    },
    {
      "id": "leadership-training",
      "name": "リーダーシップ研修", 
      "file": "/assets/badges/leadership-badge.png",
      "description": "管理職向けリーダーシップ研修修了証",
      "password": "lead2024"
    }
  ]
}
```

---

## 🎨 CSS ファイル

#### `src/App.css` （既存ファイルを上書き）
```css
.App {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* ヘッダー */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

header h1 {
  margin: 0;
  font-size: 1.8rem;
}

header .user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

header button {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

header button:hover {
  background: rgba(255,255,255,0.3);
}

/* ログイン画面 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  width: 400px;
  text-align: center;
}

.login-form h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.login-button {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.login-button:hover {
  transform: translateY(-2px);
}

.error {
  color: #dc3545;
  background: #f8d7da;
  padding: 10px;
  border-radius: 5px;
  margin: 15px 0;
  border: 1px solid #f5c6cb;
}

/* ダッシュボード */
.dashboard {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.dashboard h2 {
  color: #333;
  margin-bottom: 10px;
}

.dashboard section {
  margin-bottom: 40px;
}

.dashboard h3 {
  color: #555;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

/* バッジグリッド */
.badge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

/* バッジカード */
.badge-card {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
  background: white;
}

.badge-card.available {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-color: #28a745;
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.2);
}

.badge-card.available:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(40, 167, 69, 0.3);
}

.badge-card.unavailable {
  background: #f8f9fa;
  opacity: 0.7;
  border-color: #dee2e6;
}

.badge-card h4 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.3rem;
}

.badge-card p {
  color: #666;
  margin: 10px 0;
  line-height: 1.5;
}

.badge-card .badge-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.download-button {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  margin-top: 15px;
}

.download-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.unavailable-text {
  color: #6c757d;
  font-style: italic;
  margin-top: 15px;
}

/* 管理画面 */
.admin-panel {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.admin-panel h2 {
  color: #333;
  margin-bottom: 20px;
}

.user-list {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
}

.user-item {
  background: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  border-left: 4px solid #007bff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-item h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.user-item p {
  margin: 5px 0;
  color: #666;
}

/* レスポンシブ */
@media (max-width: 768px) {
  .App {
    padding: 10px;
  }
  
  header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .login-form {
    width: 90%;
    padding: 30px 20px;
  }
  
  .badge-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## ⚛️ React コンポーネント

#### `src/App.js` （既存ファイルを上書き）
```javascript
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
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
      
      // 管理者判定
      if (userData.email === 'admin@company.com') {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // 管理者判定
    if (userData.email === 'admin@company.com') {
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
```

#### `src/components/Login.js`
```javascript
import React, { useState } from 'react';
import usersData from '../data/users.json';
import badgesData from '../data/badges.json';

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
      'admin2024' // 管理者用パスワード
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
        <h2>🔐 ログイン</h2>
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
        
        <div style={{marginTop: '20px', fontSize: '14px', color: '#666'}}>
          <p><strong>テスト用アカウント:</strong></p>
          <p>📧 tanaka@company.com / 🔑 sec2024</p>
          <p>📧 admin@company.com / 🔑 admin2024</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

#### `src/components/Dashboard.js`
```javascript
import React from 'react';
import BadgeCard from './BadgeCard';
import badgesData from '../data/badges.json';

const Dashboard = ({ user }) => {
  // 取得済みバッジ
  const availableBadges = badgesData.badges.filter(badge => 
    user.completedTrainings.includes(badge.id)
  );

  // 未取得バッジ
  const pendingBadges = badgesData.badges.filter(badge => 
    !user.completedTrainings.includes(badge.id)
  );

  return (
    <div className="dashboard">
      <h2>📋 {user.name}さんのデジタルバッジ</h2>
      
      <section>
        <h3>🏆 取得済みバッジ ({availableBadges.length}個)</h3>
        {availableBadges.length > 0 ? (
          <div className="badge-grid">
            {availableBadges.map(badge => (
              <BadgeCard 
                key={badge.id} 
                badge={badge} 
                available={true}
              />
            ))}
          </div>
        ) : (
          <p style={{color: '#666', fontStyle: 'italic'}}>
            まだ取得したバッジがありません。研修を受講してバッジを獲得しましょう！
          </p>
        )}
      </section>

      <section>
        <h3>⏳ 未取得バッジ ({pendingBadges.length}個)</h3>
        {pendingBadges.length > 0 ? (
          <div className="badge-grid">
            {pendingBadges.map(badge => (
              <BadgeCard 
                key={badge.id} 
                badge={badge} 
                available={false}
              />
            ))}
          </div>
        ) : (
          <p style={{color: '#28a745', fontWeight: 'bold'}}>
            🎉 おめでとうございます！全てのバッジを取得済みです！
          </p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
```

#### `src/components/BadgeCard.js`
```javascript
import React from 'react';

const BadgeCard = ({ badge, available }) => {
  const handleDownload = () => {
    if (!available) return;
    
    // バッジファイルをダウンロード
    const link = document.createElement('a');
    link.href = badge.file;
    link.download = `${badge.name.replace(/\s+/g, '_')}_badge.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeIcon = (badgeId) => {
    switch(badgeId) {
      case 'security-training': return '🔒';
      case 'compliance-training': return '⚖️';
      case 'leadership-training': return '👑';
      default: return '🏆';
    }
  };

  return (
    <div className={`badge-card ${available ? 'available' : 'unavailable'}`}>
      <div className="badge-icon">
        {getBadgeIcon(badge.id)}
      </div>
      <h4>{badge.name}</h4>
      <p>{badge.description}</p>
      
      {available ? (
        <button 
          onClick={handleDownload}
          className="download-button"
        >
          📥 バッジをダウンロード
        </button>
      ) : (
        <div className="unavailable-text">
          研修受講後にダウンロード可能になります
        </div>
      )}
    </div>
  );
};

export default BadgeCard;
```

#### `src/components/AdminPanel.js`
```javascript
import React from 'react';
import usersData from '../data/users.json';
import badgesData from '../data/badges.json';

const AdminPanel = () => {
  const totalUsers = usersData.users.length;
  const totalBadges = badgesData.badges.length;
  
  // 統計情報の計算
  const getCompletionStats = () => {
    return badgesData.badges.map(badge => {
      const completedCount = usersData.users.filter(user => 
        user.completedTrainings.includes(badge.id)
      ).length;
      
      return {
        badgeName: badge.name,
        completed: completedCount,
        percentage: Math.round((completedCount / totalUsers) * 100)
      };
    });
  };

  const completionStats = getCompletionStats();

  return (
    <div className="admin-panel">
      <h2>⚙️ 管理者ダッシュボード</h2>
      
      {/* 概要統計 */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        <div style={{background: '#e3f2fd', padding: '20px', borderRadius: '10px', textAlign: 'center'}}>
          <h3 style={{margin: '0 0 10px 0', color: '#1976d2'}}>👥 総ユーザー数</h3>
          <p style={{fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#1976d2'}}>{totalUsers}</p>
        </div>
        <div style={{background: '#f3e5f5', padding: '20px', borderRadius: '10px', textAlign: 'center'}}>
          <h3 style={{margin: '0 0 10px 0', color: '#7b1fa2'}}>🏆 総バッジ数</h3>
          <p style={{fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#7b1fa2'}}>{totalBadges}</p>
        </div>
      </div>

      {/* バッジ取得状況 */}
      <section>
        <h3>📊 バッジ取得状況</h3>
        <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '10px'}}>
          {completionStats.map(stat => (
            <div key={stat.badgeName} style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <span style={{fontWeight: 'bold'}}>{stat.badgeName}</span>
                <span>{stat.completed}/{totalUsers} ({stat.percentage}%)</span>
              </div>
              <div style={{background: '#e9ecef', height: '8px', borderRadius: '4px', overflow: 'hidden'}}>
                <div 
                  style={{
                    background: '#28a745', 
                    height: '100%', 
                    width: `${stat.percentage}%`,
                    transition: 'width 0.3s ease'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ユーザー一覧 */}
      <section>
        <h3>👥 ユーザー一覧</h3>
        <div className="user-list">
          {usersData.users.map(user => (
            <div key={user.email} className="user-item">
              <h4>👤 {user.name}</h4>
              <p><strong>📧 Email:</strong> {user.email}</p>
              <p><strong>🏆 取得バッジ:</strong> {user.completedTrainings.length}/{totalBadges}</p>
              <p><strong>📋 取得済み研修:</strong> 
                {user.completedTrainings.length > 0 ? (
                  user.completedTrainings.map(trainingId => {
                    const badge = badgesData.badges.find(b => b.id === trainingId);
                    return badge ? badge.name : trainingId;
                  }).join(', ')
                ) : (
                  <span style={{color: '#6c757d', fontStyle: 'italic'}}>なし</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* パスワード一覧 */}
      <section>
        <h3>🔑 研修パスワード一覧</h3>
        <div style={{background: '#fff3cd', padding: '20px', borderRadius: '10px', border: '1px solid #ffeaa7'}}>
          <p style={{color: '#856404', marginBottom: '15px'}}>
            ⚠️ 以下のパスワードは社員への研修案内時に使用してください
          </p>
          {badgesData.badges.map(badge => (
            <div key={badge.id} style={{marginBottom: '10px', padding: '10px', background: 'white', borderRadius: '5px'}}>
              <strong>{badge.name}:</strong> 
              <code style={{background: '#f8f9fa', padding: '2px 6px', marginLeft: '10px', borderRadius: '3px'}}>
                {badge.password}
              </code>
            </div>
          ))}
          <div style={{marginTop: '10px', padding: '10px', background: 'white', borderRadius: '5px'}}>
            <strong>管理者パスワード:</strong> 
            <code style={{background: '#f8f9fa', padding: '2px 6px', marginLeft: '10px', borderRadius: '3px'}}>
              admin2024
            </code>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
```

---

## 🖼️ バッジファイルの準備

### `public/assets/badges/` フォルダに配置する画像ファイル

以下のファイル名で画像を配置してください：
- `security-badge.png`
- `compliance-badge.png`
- `leadership-badge.png`

**画像がない場合の対処法:**
1. **一時的に適当な画像をリネーム**
2. **オンラインでフリー素材をダウンロード**
3. **PowerPointなどで簡単なバッジを作成**

---

## 🚀 実装の順番

### 1. データファイルから開始
```bash
# まずはJSONファイルを作成
src/data/users.json
src/data/badges.json
```

### 2. CSSファイル
```bash
# 見た目を整える
src/App.css
```

### 3. Reactコンポーネント
```bash
# 機能を実装
src/components/Login.js
src/components/BadgeCard.js
src/components/Dashboard.js
src/components/AdminPanel.js
src/App.js
```

### 4. 画像ファイル
```bash
# 最後にバッジ画像を配置
public/assets/badges/
```

## ✅ 実装完了後のテスト

### ローカルでテスト実行
```bash
npm start
```

### テスト用アカウント
- **一般ユーザー**: tanaka@company.com / sec2024
- **管理者**: admin@company.com / admin2024

この順番で実装していけば、確実に動作するサイトが完成します！🎉