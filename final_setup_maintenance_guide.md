# デジタルバッジサイト 構築・メンテナンス完全ガイド

## 🚀 構築手順

### **事前準備**

#### 必要なアカウント・ソフトウェア
- ✅ **Azureアカウント** - [azure.microsoft.com](https://azure.microsoft.com)
- ✅ **GitHubアカウント** - [github.com](https://github.com)
- ✅ **Visual Studio Code** - [code.visualstudio.com](https://code.visualstudio.com)
- ✅ **Node.js** - [nodejs.org](https://nodejs.org) (LTS版)
- ✅ **Git** - [git-scm.com](https://git-scm.com)

---

## 📋 Step 1: プロジェクト作成

### **1-1. React プロジェクト作成**
```bash
npx create-react-app digital-badge-site
cd digital-badge-site
```

### **1-2. プロジェクト構造作成**
Visual Studio Code でフォルダ・ファイルを作成：

```
digital-badge-site/
├── data/                    ← 新規作成
│   ├── admin.json          ← 新規作成
│   ├── users.csv           ← 新規作成
│   └── badges.csv          ← 新規作成
├── scripts/                ← 新規作成
│   └── convertCsvToJson.js ← 新規作成
├── src/
│   ├── components/         ← 新規作成
│   │   ├── Login.js        ← 新規作成
│   │   ├── Dashboard.js    ← 新規作成
│   │   ├── BadgeCard.js    ← 新規作成
│   │   └── AdminPanel.js   ← 新規作成
│   ├── data/              ← 新規作成（空フォルダ）
│   └── App.js             ← 修正
├── public/
│   └── assets/            ← 新規作成
│       └── badges/        ← 新規作成
└── package.json           ← 修正
```

---

## 📄 Step 2: データファイル作成

### **2-1. data/admin.json**
```json
{
  "admins": [
    {
      "email": "admin@moda",
      "name": "システム管理者",
      "password": "modamora5391"
    }
  ],
  "settings": {
    "multipleAdmins": true,
    "defaultAdminPassword": "modamora5391",
    "description": "管理者設定ファイル - 複数管理者追加可能"
  }
}
```

### **2-2. data/users.csv**
```csv
email,name,security-training,compliance-training,leadership-training
tanaka@company.com,田中太郎,1,,
sato@company.com,佐藤花子,1,1,
yamada@company.com,山田次郎,,,
admin@moda,システム管理者,1,1,1
```

### **2-3. data/badges.csv**
```csv
id,name,description,password,filename
security-training,セキュリティ研修,情報セキュリティ基礎研修修了証,sec2024,security-badge.png
compliance-training,コンプライアンス研修,企業コンプライアンス研修修了証,comp2024,compliance-badge.png
leadership-training,リーダーシップ研修,管理職向けリーダーシップ研修修了証,lead2024,leadership-badge.png
```

---

## ⚙️ Step 3: 変換スクリプト作成

### **3-1. scripts/convertCsvToJson.js**
```javascript
const fs = require('fs');
const path = require('path');

console.log('🚀 CSV to JSON 変換スクリプト開始 (管理者設定外だし対応)');

// CSVファイルを読み込む関数
function readCSV(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ファイルが見つかりません: ${filePath}`);
    process.exit(1);
  }
  
  const csvData = fs.readFileSync(filePath, 'utf8');
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

// 管理者設定を読み込む関数
function readAdminConfig() {
  const adminConfigPath = './data/admin.json';
  
  if (!fs.existsSync(adminConfigPath)) {
    console.log('📋 admin.json が見つかりません。デフォルト設定を作成します...');
    
    const defaultAdminConfig = {
      "admins": [
        {
          "email": "admin@moda",
          "name": "システム管理者", 
          "password": "modamora5391"
        }
      ],
      "settings": {
        "multipleAdmins": true,
        "defaultAdminPassword": "modamora5391",
        "description": "管理者設定ファイル"
      }
    };
    
    fs.writeFileSync(adminConfigPath, JSON.stringify(defaultAdminConfig, null, 2));
    console.log('✅ デフォルトのadmin.jsonを作成しました');
  }
  
  const adminConfig = JSON.parse(fs.readFileSync(adminConfigPath, 'utf8'));
  console.log(`👑 管理者設定読み込み: ${adminConfig.admins.length}名`);
  
  adminConfig.admins.forEach((admin, index) => {
    console.log(`   ${index + 1}. ${admin.name} (${admin.email})`);
  });
  
  return adminConfig;
}

// ユーザーデータを変換する関数
function convertUsers(csvUsers, badges) {
  console.log('👥 ユーザーデータを変換中...');
  
  return csvUsers.map(csvUser => {
    const completedTrainings = [];
    
    badges.forEach(badge => {
      const trainingValue = csvUser[badge.id];
      if (trainingValue === '1') {
        completedTrainings.push(badge.id);
      }
    });
    
    return {
      email: csvUser.email,
      name: csvUser.name,
      completedTrainings
    };
  });
}

// バッジデータを変換する関数
function convertBadges(csvBadges) {
  console.log('🏆 バッジデータを変換中...');
  
  return csvBadges.map(csvBadge => {
    let filename = csvBadge.filename || `${csvBadge.id}.png`;
    
    if (!filename.toLowerCase().endsWith('.png') && 
        !filename.toLowerCase().endsWith('.jpg') && 
        !filename.toLowerCase().endsWith('.jpeg')) {
      filename = filename + '.png';
    }
    
    return {
      id: csvBadge.id,
      name: csvBadge.name,
      file: `/assets/badges/${filename}`,
      description: csvBadge.description,
      password: csvBadge.password
    };
  });
}

// JSONファイルに保存する関数
function saveJSON(data, filePath, dataKey) {
  const jsonData = { [dataKey]: data };
  const jsonString = JSON.stringify(jsonData, null, 2);
  
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, jsonString, 'utf8');
  console.log(`✅ 保存完了: ${filePath}`);
}

// メイン処理
function main() {
  try {
    console.log('📖 設定ファイルとCSVファイルを読み込み中...');
    const adminConfig = readAdminConfig();
    const usersCSV = readCSV('./data/users.csv');
    const badgesCSV = readCSV('./data/badges.csv');
    
    console.log(`👥 ユーザー数: ${usersCSV.length}`);
    console.log(`🏆 バッジ数: ${badgesCSV.length}`);
    
    const badges = convertBadges(badgesCSV);
    const users = convertUsers(usersCSV, badges);
    
    console.log('💾 JSONファイルに保存中...');
    saveJSON(users, './src/data/users.json', 'users');
    saveJSON(badges, './src/data/badges.json', 'badges');
    saveJSON(adminConfig, './src/data/admin.json', 'config');
    
    console.log('🎉 変換完了！');
    console.log('🚀 次のコマンドでサイトを確認できます: npm start');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();
```

### **3-2. package.json にスクリプト追加**
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "convert-data": "node scripts/convertCsvToJson.js",
    "dev-with-data": "npm run convert-data && npm start"
  }
}
```

---

## ⚛️ Step 4: React コンポーネント作成

### **4-1. src/App.css**
```css
.App {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

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

.badge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

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

### **4-2. src/App.js**
```javascript
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
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      const adminEmails = adminData.config.admins.map(admin => admin.email);
      if (adminEmails.includes(userData.email)) {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
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

### **4-3. src/components/Login.js**
```javascript
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
    
    const user = usersData.users.find(u => u.email === email);
    
    if (!user) {
      setError('メールアドレスが見つかりません');
      return;
    }

    const validPasswords = [
      ...badgesData.badges.map(badge => badge.password),
      ...adminData.config.admins.map(admin => admin.password)
    ];
    
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
```

### **4-4. src/components/Dashboard.js**
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

### **4-5. src/components/BadgeCard.js**
```javascript
import React from 'react';

const BadgeCard = ({ badge, available }) => {
  const handleDownload = async () => {
    if (!available) return;
    
    try {
      let filePath = badge.file;
      
      if (!filePath.startsWith('/')) {
        filePath = '/' + filePath;
      }
      
      if (!filePath.toLowerCase().includes('.png') && 
          !filePath.toLowerCase().includes('.jpg') && 
          !filePath.toLowerCase().includes('.jpeg')) {
        filePath = filePath + '.png';
      }
      
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`ファイルが見つかりません: ${response.status} - ${filePath}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('HTMLページが返されました。ファイルパスを確認してください。');
      }
      
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('ファイルが空です');
      }
      
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const actualFileName = filePath.split('/').pop();
      link.download = `修了証_${actualFileName}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
    } catch (error) {
      console.error('ダウンロードエラー:', error);
      alert(`ダウンロードエラー:\n${error.message}`);
    }
  };

  const getBadgeIcon = () => {
    return '👑';
  };

  return (
    <div className={`badge-card ${available ? 'available' : 'unavailable'}`}>
      <div className="badge-icon">
        {getBadgeIcon()}
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

### **4-6. src/components/AdminPanel.js**
```javascript
import React from 'react';
import usersData from '../data/users.json';
import badgesData from '../data/badges.json';

const AdminPanel = () => {
  const totalUsers = usersData.users.length;
  const totalBadges = badgesData.badges.length;
  
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
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
```

---

## 🖼️ Step 5: バッジファイル配置

### **5-1. バッジ画像ファイルの準備**
以下のファイルを `public/assets/badges/` に配置：
- `security-badge.png`
- `compliance-badge.png`
- `leadership-badge.png`

### **5-2. ファイル配置の確認**
```
public/assets/badges/
├── security-badge.png
├── compliance-badge.png
└── leadership-badge.png
```

---

## 🌐 Step 6: Azure デプロイ

### **6-1. GitHubリポジトリ作成**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/digital-badge-site.git
git push -u origin main
```

### **6-2. Azure Static Web Apps作成**
1. **Azure Portal** → **Static Web Apps** → **作成**
2. **設定**:
   - リソースグループ: `rg-digital-badge`
   - 名前: `digital-badge-app`
   - プラン: `Free`
   - デプロイソース: `GitHub`
   - リポジトリ: 作成したリポジトリを選択
   - ブランチ: `main`
   - ビルドプリセット: `React`
   - アプリの場所: `/`
   - 出力場所: `build`

### **6-3. 自動デプロイ確認**
- GitHub Actions で自動デプロイが実行される
- 5-10分でサイトが公開される

---

## 🧪 Step 7: 動作確認

### **7-1. ローカルテスト**
```bash
npm run convert-data  # データ変換
npm start            # サイト起動
```

### **7-2. ログインテスト**
- **一般ユーザー**: `tanaka@company.com` / `sec2024`
- **管理者**: `admin@moda` / `modamora5391`

### **7-3. 本番デプロイテスト**
- Azure Static Web Apps のURLでアクセス
- 全機能の動作確認

---

# 🛠️ メンテナンス手順

## 📋 日常メンテナンス

### **新入社員の追加**

#### Step 1: users.csv 編集
```csv
# data/users.csv に追加
email,name,security-training,compliance-training,leadership-training
new-employee@moda,新入社員,,,
```

#### Step 2: 変換・デプロイ
```bash
npm run convert-data
git add .
git commit -m "Add new employee"
git push origin main
```

### **研修受講状況の更新**

#### Step 1: users.csv 編集
```csv
# 受講済みの場合は 1 を入力
tanaka@company.com,田中太郎,1,1,  # セキュリティ・コンプライアンス完了
```

#### Step 2: 変換・デプロイ
```bash
npm run convert-data
git add .
git commit -m "Update training completion status"
git push origin main
```

### **退職者の処理**

#### Step 1: users.csv から削除
該当行を削除または名前に[退職]を追加

#### Step 2: 変換・デプロイ
```bash
npm run convert-data
git add .
git commit -m "Remove retired employee"
git push origin main
```

---

## 🏆 新しい研修・バッジの追加

### **Step 1: バッジ画像ファイルの準備**
- 新しいバッジ画像を `public/assets/badges/` に配置
- ファイル名例: `new-training-badge.png`

### **Step 2: badges.csv に追加**
```csv
# data/badges.csv に追加
id,name,description,password,filename
new-training,新しい研修,新しい研修の説明,newpass2024,new-training-badge.png
```

### **Step 3: users.csv に列を追加**
```csv
# data/users.csv に列を追加
email,name,security-training,compliance-training,leadership-training,new-training
tanaka@company.com,田中太郎,1,,,
sato@company.com,佐藤花子,1,1,,1  # 新研修受講済み
```

### **Step 4: 変換・デプロイ**
```bash
npm run convert-data
git add .
git commit -m "Add new training: 新しい研修"
git push origin main
```

---

## 👑 管理者の変更・追加

### **管理者メールアドレスの変更**

#### Step 1: admin.json 編集
```json
{
  "admins": [
    {
      "email": "new-admin@moda",
      "name": "新しい管理者",
      "password": "newpass2024"
    }
  ]
}
```

#### Step 2: users.csv 更新
```csv
# 管理者ユーザーも users.csv に必要
new-admin@moda,新しい管理者,1,1,1
```

### **複数管理者の追加**

#### Step 1: admin.json 編集
```json
{
  "admins": [
    {
      "email": "admin@moda",
      "name": "システム管理者",
      "password": "modamora5391"
    },
    {
      "email": "sub-admin@moda",
      "name": "副管理者",
      "password": "subadmin2024"
    }
  ]
}
```

#### Step 2: 変換・デプロイ
```bash
npm run convert-data
git add .
git commit -m "Add new administrator"
git push origin main
```

---

## 🔑 パスワードの変更

### **研修パスワードの変更**

#### Step 1: badges.csv 編集
```csv
# パスワード列を更新
id,name,description,password,filename
security-training,セキュリティ研修,説明,sec2025,security-badge.png
```

#### Step 2: 変換・デプロイ
```bash
npm run convert-data
git add .
git commit -m "Update training passwords for 2025"
git push origin main
```

### **管理者パスワードの変更**

#### Step 1: admin.json 編集
```json
{
  "admins": [
    {
      "email": "admin@moda",
      "name": "システム管理者",
      "password": "new-secure-password-2025"
    }
  ]
}
```

#### Step 2: 変換・デプロイ
```bash
npm run convert-data
git add .
git commit -m "Update admin password"
git push origin main
```

---

## 📊 データのバックアップ

### **定期バックアップ（推奨：月1回）**

#### Step 1: CSVファイルのバックアップ
```bash
# バックアップフォルダ作成
mkdir backup/$(date +%Y-%m-%d)

# CSVファイルをコピー
cp data/*.csv backup/$(date +%Y-%m-%d)/
cp data/*.json backup/$(date +%Y-%m-%d)/
```

#### Step 2: Gitでのバージョン管理
```bash
git add .
git commit -m "Monthly backup: $(date +%Y-%m-%d)"
git push origin main
```

---

## 🆘 トラブルシューティング

### **よくある問題と解決方法**

#### 問題1: ログインできない
- **原因**: メールアドレスまたはパスワードの間違い
- **解決**: users.csv と badges.csv のパスワードを確認

#### 問題2: バッジがダウンロードできない
- **原因**: ファイルパスまたはファイル名の問題
- **解決**: 
  1. `public/assets/badges/` にファイルが存在するか確認
  2. badges.csv の filename列が正確か確認
  3. 拡張子(.png)が含まれているか確認

#### 問題3: 管理者権限が表示されない
- **原因**: admin.json の設定または変換処理の問題
- **解決**:
  1. admin.json の設定を確認
  2. `npm run convert-data` を再実行
  3. ブラウザのキャッシュをクリア

### **緊急時の対応**

#### データの復旧
```bash
# 前回のコミットに戻す
git reset --hard HEAD~1

# 特定のファイルのみ復旧
git checkout HEAD~1 -- data/users.csv
```

#### サイトの緊急停止
```bash
# Azure Static Web Apps でのデプロイ停止
# Azure Portal → Static Web Apps → 設定 → デプロイ無効化
```

---

## ✅ メンテナンス チェックリスト

### **月次メンテナンス**
- [ ] 新入社員・退職者の反映
- [ ] 研修受講状況の更新
- [ ] CSVファイルのバックアップ
- [ ] システムの動作確認

### **年次メンテナンス**
- [ ] パスワードの更新
- [ ] 管理者情報の見直し
- [ ] 不要なユーザーデータの整理
- [ ] システムの全体的な見直し

### **緊急時対応準備**
- [ ] バックアップデータの定期確認
- [ ] 緊急連絡先の整備
- [ ] 復旧手順の文書化

---

**この手順書に従えば、デジタルバッジサイトの構築から日常運用まで確実に行えます！** 🎯