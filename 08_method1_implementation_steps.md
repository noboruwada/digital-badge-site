# 方法1実装手順（設定ファイル方式）

## 📋 実装の流れ

1. **`data/admin.json` 作成**
2. **変換スクリプト修正**
3. **Login.js 修正**
4. **App.js 修正**
5. **テスト実行**

---

## 🗂️ Step 1: 管理者設定ファイルの作成

### 1-1. admin.json ファイルの作成

#### ファイル作成
1. **Visual Studio Code** で `data` フォルダを右クリック
2. **新しいファイル** → `admin.json`

#### 内容を貼り付け
```json
{
  "admins": [
    {
      "email": "admin@company.com",
      "name": "システム管理者",
      "password": "admin2024"
    }
  ],
  "settings": {
    "multipleAdmins": true,
    "defaultAdminPassword": "admin2024",
    "description": "管理者設定ファイル - メールアドレスとパスワードを変更する場合はここを編集してください"
  }
}
```

### 1-2. ファイル構造の確認
作成後、以下の構造になっていることを確認：
```
data/
├── admin.json     ← 新規作成
├── users.csv
└── badges.csv
```

---

## ⚙️ Step 2: 変換スクリプトの修正

### 2-1. convertCsvToJson.js の修正

**`scripts/convertCsvToJson.js`** を以下の内容に置き換え：

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
    
    // デフォルト設定を作成
    const defaultAdminConfig = {
      "admins": [
        {
          "email": "admin@company.com",
          "name": "システム管理者", 
          "password": "admin2024"
        }
      ],
      "settings": {
        "multipleAdmins": true,
        "defaultAdminPassword": "admin2024",
        "description": "管理者設定ファイル - メールアドレスとパスワードを変更する場合はここを編集してください"
      }
    };
    
    fs.writeFileSync(adminConfigPath, JSON.stringify(defaultAdminConfig, null, 2));
    console.log('✅ デフォルトのadmin.jsonを作成しました');
  }
  
  const adminConfig = JSON.parse(fs.readFileSync(adminConfigPath, 'utf8'));
  console.log(`👑 管理者設定読み込み: ${adminConfig.admins.length}名`);
  
  // 管理者の詳細表示
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
    
    // badges.csvから動的に研修IDを取得
    badges.forEach(badge => {
      const trainingValue = csvUser[badge.id];
      
      // 受講済みと判定する条件（数字1対応）
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
    // ファイルパスの設定（filenameが指定されていない場合はIDベース）
    const filename = csvBadge.filename || `${csvBadge.id}.png`;
    
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
  
  // ディレクトリが存在しない場合は作成
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, jsonString, 'utf8');
  console.log(`✅ 保存完了: ${filePath}`);
}

// データ検証関数
function validateData(usersCSV, badgesCSV, adminConfig) {
  console.log('🔍 データ検証中...');
  
  // 管理者メールアドレスの重複チェック
  const adminEmails = adminConfig.admins.map(admin => admin.email);
  const duplicateAdminEmails = adminEmails.filter((email, index) => adminEmails.indexOf(email) !== index);
  if (duplicateAdminEmails.length > 0) {
    console.warn(`⚠️  重複する管理者メールアドレス: ${duplicateAdminEmails.join(', ')}`);
  }
  
  // ユーザーと管理者の重複チェック
  const userEmails = usersCSV.map(user => user.email);
  const overlappingEmails = adminEmails.filter(email => userEmails.includes(email));
  if (overlappingEmails.length > 0) {
    console.log(`📋 ユーザーと管理者の重複: ${overlappingEmails.join(', ')} (正常)`);
  }
  
  console.log('✅ データ検証完了');
}

// 統計情報表示関数
function showStatistics(users, badges, adminConfig) {
  console.log('');
  console.log('📊 変換統計情報:');
  console.log(`   👥 総ユーザー数: ${users.length}名`);
  console.log(`   🏆 総バッジ数: ${badges.length}個`);
  console.log(`   👑 管理者数: ${adminConfig.admins.length}名`);
  
  // 各研修の受講率計算
  badges.forEach(badge => {
    const completedCount = users.filter(user => 
      user.completedTrainings.includes(badge.id)
    ).length;
    const completionRate = users.length > 0 ? Math.round((completedCount / users.length) * 100) : 0;
    console.log(`   📈 ${badge.name}: ${completedCount}/${users.length}名 (${completionRate}%)`);
  });
}

// メイン処理
function main() {
  try {
    // 1. 設定ファイルとCSVファイルを読み込み
    console.log('📖 設定ファイルとCSVファイルを読み込み中...');
    const adminConfig = readAdminConfig();
    const usersCSV = readCSV('./data/users.csv');
    const badgesCSV = readCSV('./data/badges.csv');
    
    console.log(`👥 ユーザー数: ${usersCSV.length}`);
    console.log(`🏆 バッジ数: ${badgesCSV.length}`);
    
    // 2. データ検証
    validateData(usersCSV, badgesCSV, adminConfig);
    
    // 3. データを変換
    const badges = convertBadges(badgesCSV);
    const users = convertUsers(usersCSV, badges);
    
    // 4. JSONファイルに保存
    console.log('💾 JSONファイルに保存中...');
    saveJSON(users, './src/data/users.json', 'users');
    saveJSON(badges, './src/data/badges.json', 'badges');
    saveJSON(adminConfig, './src/data/admin.json', 'config'); // 管理者設定も保存
    
    // 5. 統計情報表示
    showStatistics(users, badges, adminConfig);
    
    console.log('');
    console.log('🎉 変換完了！');
    console.log('');
    console.log('🚀 次のコマンドでサイトを確認できます:');
    console.log('   npm start');
    console.log('');
    console.log('⚙️ 管理者設定の変更は data/admin.json を編集してください');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

// スクリプト実行
main();
```

---

## ⚛️ Step 3: Login.js の修正

### 3-1. Login.js ファイルの修正

**`src/components/Login.js`** を以下の内容に置き換え：

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

  // 管理者情報を取得（表示用）
  const firstAdmin = adminData.config.admins[0];

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
          {firstAdmin && (
            <p>📧 {firstAdmin.email} / 🔑 {firstAdmin.password}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
```

---

## 📱 Step 4: App.js の修正

### 4-1. App.js ファイルの修正

**`src/App.js`** を以下の内容に置き換え：

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
```

---

## 🧪 Step 5: テスト実行

### 5-1. 変換スクリプトの実行
```bash
# 変換スクリプト実行
npm run convert-data
```

#### 成功時の表示例
```
🚀 CSV to JSON 変換スクリプト開始 (管理者設定外だし対応)
📖 設定ファイルとCSVファイルを読み込み中...
👑 管理者設定読み込み: 1名
   1. システム管理者 (admin@company.com)
👥 ユーザー数: 4
🏆 バッジ数: 3
🔍 データ検証中...
✅ データ検証完了
👥 ユーザーデータを変換中...
🏆 バッジデータを変換中...
💾 JSONファイルに保存中...
✅ 保存完了: ./src/data/users.json
✅ 保存完了: ./src/data/badges.json
✅ 保存完了: ./src/data/admin.json

📊 変換統計情報:
   👥 総ユーザー数: 4名
   🏆 総バッジ数: 3個
   👑 管理者数: 1名

🎉 変換完了！

🚀 次のコマンドでサイトを確認できます:
   npm start

⚙️ 管理者設定の変更は data/admin.json を編集してください
```

### 5-2. サイトの起動とテスト
```bash
# サイト起動
npm start
```

### 5-3. 動作確認

#### 管理者ログインテスト
1. **メールアドレス**: `admin@company.com`
2. **パスワード**: `admin2024`
3. **ヘッダーに「👑 管理者」** が表示されるか確認
4. **管理者ダッシュボード** が表示されるか確認

---

## 🎛️ 管理者設定の変更方法

### 📝 管理者メールアドレスの変更

#### `data/admin.json` を編集
```json
{
  "admins": [
    {
      "email": "new-admin@company.com",
      "name": "新しい管理者",
      "password": "admin2024"
    }
  ],
  "settings": {
    "multipleAdmins": true,
    "defaultAdminPassword": "admin2024"
  }
}
```

### 🔑 管理者パスワードの変更

#### `data/admin.json` を編集
```json
{
  "admins": [
    {
      "email": "admin@company.com",
      "name": "システム管理者",
      "password": "secure-password-2024"
    }
  ]
}
```

### 👥 複数管理者の追加

#### `data/admin.json` を編集
```json
{
  "admins": [
    {
      "email": "admin@company.com",
      "name": "システム管理者",
      "password": "admin2024"
    },
    {
      "email": "hr-admin@company.com",
      "name": "人事管理者",
      "password": "hr2024"
    },
    {
      "email": "manager@company.com",
      "name": "部門管理者", 
      "password": "manager2024"
    }
  ]
}
```

### 🔄 変更後の手順
1. **`data/admin.json`** を保存
2. **`npm run convert-data`** を実行
3. **`npm start`** で確認

---

## ✅ 実装完了チェックリスト

### ファイル作成
- [ ] **`data/admin.json`** 作成済み
- [ ] **`scripts/convertCsvToJson.js`** 修正済み
- [ ] **`src/components/Login.js`** 修正済み
- [ ] **`src/App.js`** 修正済み

### 動作確認
- [ ] **`npm run convert-data`** が成功する
- [ ] **`src/data/admin.json`** が生成される
- [ ] **管理者ログイン** が成功する
- [ ] **ヘッダーに「👑 管理者」** が表示される
- [ ] **管理者ダッシュボード** が表示される

### 設定変更テスト
- [ ] **`data/admin.json`** でメールアドレス変更可能
- [ ] **`data/admin.json`** でパスワード変更可能
- [ ] **複数管理者** の追加が可能

**すべて確認できれば、管理者設定の外だし完了です！** 🎉

どのステップから始めますか？一緒に進めていきましょう！