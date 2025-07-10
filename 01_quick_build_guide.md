# 2-3日構築 デジタルバッジサイト 簡易版

## 🚀 超シンプル構成

### アーキテクチャ
```
👨‍💼 社員 → 🌐 Azure Static Web Apps (React) → 📁 静的ファイル
                    ↓
                🔐 シンプル認証 (パスワード1つ)
```

### 💰 コスト: **完全無料**
- Azure Static Web Apps 無料プラン
- ファイルは全て静的配置

---

## 📅 3日間スケジュール

### **Day 1: 基盤構築**
#### 午前 (2-3時間)
1. **Azure Static Web Apps 作成**
2. **React プロジェクト セットアップ**
3. **GitHub連携 & 自動デプロイ**

#### 午後 (3-4時間)
4. **基本UI作成**
5. **認証機能実装**
6. **バッジ一覧表示**

### **Day 2: 機能実装**
#### 午前 (2-3時間)
1. **ユーザーデータ管理**
2. **バッジダウンロード機能**
3. **レスポンシブ対応**

#### 午後 (3-4時間)
4. **管理機能（簡易版）**
5. **テスト & デバッグ**
6. **デザイン調整**

### **Day 3: 仕上げ**
#### 午前 (2-3時間)
1. **最終テスト**
2. **データ投入**
3. **本番デプロイ**

#### 午後 (1-2時間)
4. **動作確認**
5. **ドキュメント作成**

---

## 🛠️ 実装詳細

### 1. プロジェクト構造
```
digital-badge-site/
├── src/
│   ├── components/
│   │   ├── Login.js          # ログイン画面
│   │   ├── Dashboard.js      # ダッシュボード
│   │   ├── BadgeCard.js      # バッジカード
│   │   └── AdminPanel.js     # 管理画面
│   ├── data/
│   │   ├── users.json        # ユーザーデータ
│   │   └── badges.json       # バッジデータ
│   ├── assets/
│   │   └── badges/           # バッジファイル
│   └── App.js
├── public/
└── package.json
```

### 2. 超シンプル認証
```javascript
// 研修パスワード方式
const PASSWORDS = {
  "security-training": "sec2024",
  "compliance-training": "comp2024",
  "leadership-training": "lead2024"
};

// ユーザー判定
const checkUserAccess = (email, password) => {
  // 社員メールアドレス + 研修パスワードでログイン
  return VALID_EMAILS.includes(email) && 
         Object.values(PASSWORDS).includes(password);
};
```

### 3. データ管理（JSON形式）
```javascript
// users.json
{
  "users": [
    {
      "email": "tanaka@company.com",
      "name": "田中太郎",
      "completedTrainings": ["security-training", "compliance-training"]
    }
  ]
}

// badges.json
{
  "badges": [
    {
      "id": "security-training",
      "name": "セキュリティ研修",
      "file": "/assets/badges/security-badge.png",
      "description": "情報セキュリティ基礎研修修了"
    }
  ]
}
```

---

## 💻 実装コード例

### メインアプリ (App.js)
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
    // ログイン状態確認
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header>
        <h1>🏆 デジタルバッジ管理システム</h1>
        <div>
          <span>ようこそ、{user.name}さん</span>
          {isAdmin && <span> | 管理者</span>}
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      </header>
      
      {isAdmin ? <AdminPanel /> : <Dashboard user={user} />}
    </div>
  );
}

export default App;
```

### ログイン画面 (Login.js)
```javascript
import React, { useState } from 'react';
import usersData from '../data/users.json';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ユーザー検索
    const user = usersData.users.find(u => u.email === email);
    
    if (!user) {
      setError('メールアドレスが見つかりません');
      return;
    }

    // 簡易パスワード認証
    const validPasswords = ['sec2024', 'comp2024', 'lead2024', 'admin2024'];
    if (!validPasswords.includes(password)) {
      setError('パスワードが正しくありません');
      return;
    }

    onLogin(user);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>🔐 ログイン</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>メールアドレス:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>研修パスワード:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">ログイン</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

### ダッシュボード (Dashboard.js)
```javascript
import React from 'react';
import BadgeCard from './BadgeCard';
import badgesData from '../data/badges.json';

const Dashboard = ({ user }) => {
  const availableBadges = badgesData.badges.filter(badge => 
    user.completedTrainings.includes(badge.id)
  );

  const pendingBadges = badgesData.badges.filter(badge => 
    !user.completedTrainings.includes(badge.id)
  );

  return (
    <div className="dashboard">
      <h2>📋 あなたのデジタルバッジ</h2>
      
      <section>
        <h3>🏆 取得済みバッジ ({availableBadges.length})</h3>
        <div className="badge-grid">
          {availableBadges.map(badge => (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              available={true}
            />
          ))}
        </div>
      </section>

      <section>
        <h3>⏳ 未取得バッジ ({pendingBadges.length})</h3>
        <div className="badge-grid">
          {pendingBadges.map(badge => (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              available={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
```

---

## 🎨 簡単CSS
```css
/* App.css */
.App {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #007acc;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 400px;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.badge-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.badge-card.available {
  background: #f0f8f0;
  border-color: #28a745;
}

.badge-card.unavailable {
  background: #f8f8f8;
  opacity: 0.6;
}
```

---

## 🚀 デプロイ手順

### 1. Azure Static Web Apps 作成
```bash
# Azure CLI でリソース作成
az staticwebapp create \
  --name digital-badge-app \
  --resource-group rg-digital-badge \
  --source https://github.com/your-username/digital-badge-site \
  --location "East Asia" \
  --branch main \
  --app-location "/" \
  --output-location "build"
```

### 2. GitHub Actions 自動設定
- プッシュするだけで自動デプロイ
- 5分程度でサイト公開

### 3. データ投入
```javascript
// users.json にユーザー情報追加
// assets/badges/ にバッジファイル配置
```

---

## ✅ 完成イメージ

### 🔐 ログイン画面
- メールアドレス入力
- 研修パスワード入力
- シンプルな認証

### 📱 ダッシュボード
- 取得済みバッジ一覧
- ダウンロードボタン
- 未取得バッジ表示

### ⚙️ 管理画面
- ユーザー一覧
- バッジ管理
- CSV出力

---

## 🎯 この構成のメリット

✅ **2-3日で完成**  
✅ **完全無料**  
✅ **メンテナンス不要**  
✅ **高速・軽量**  
✅ **後からAzure移行可能**

この超軽量版で進めますか？明日から実装を開始できます！