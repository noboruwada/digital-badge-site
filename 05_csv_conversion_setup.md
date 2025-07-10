# CSV変換システム構築手順

## 📋 全体の流れ

1. **フォルダ・ファイル作成**
2. **変換スクリプト実装**
3. **サンプルCSVファイル作成**
4. **package.json設定**
5. **テスト実行**
6. **運用開始**

---

## 🗂️ Step 1: フォルダ・ファイル構造の作成

### 1-1. 必要なフォルダを作成

**Visual Studio Code** でプロジェクトを開き、以下の構造を作成:

```
digital-badge-site/
├── data/              ← 新規作成（CSVファイル置き場）
├── scripts/           ← 新規作成（変換スクリプト置き場）
├── src/
│   └── data/          ← 既存（JSONファイル出力先）
└── public/
```

#### フォルダ作成方法
1. **プロジェクトルート**（package.jsonがある場所）を右クリック
2. **新しいフォルダー** → `data`
3. **プロジェクトルート** を右クリック
4. **新しいフォルダー** → `scripts`

### 1-2. 最終的なフォルダ構造
```
digital-badge-site/
├── data/                    ← CSVファイル（Excel編集用）
│   ├── users.csv
│   └── badges.csv
├── scripts/                 ← 変換スクリプト
│   └── convertCsvToJson.js
├── src/
│   └── data/               ← JSONファイル（サイト用）
│       ├── users.json
│       └── badges.json
└── package.json
```

---

## 📄 Step 2: CSVファイルの作成

### 2-1. users.csv の作成

#### ファイル作成
1. **data** フォルダを右クリック
2. **新しいファイル** → `users.csv`

#### 内容を貼り付け
```csv
email,name,security-training,compliance-training,leadership-training
tanaka@company.com,田中太郎,1,,
sato@company.com,佐藤花子,1,1,
yamada@company.com,山田次郎,,,
admin@company.com,管理者,1,1,1
```

### 2-2. badges.csv の作成

#### ファイル作成
1. **data** フォルダを右クリック
2. **新しいファイル** → `badges.csv`

#### 内容を貼り付け
```csv
id,name,description,password,filename
security-training,セキュリティ研修,情報セキュリティ基礎研修修了証,sec2024,security-badge.png
compliance-training,コンプライアンス研修,企業コンプライアンス研修修了証,comp2024,compliance-badge.png
leadership-training,リーダーシップ研修,管理職向けリーダーシップ研修修了証,lead2024,leadership-badge.png
```

---

## ⚙️ Step 3: 変換スクリプトの作成

### 3-1. 変換スクリプトファイルの作成

#### ファイル作成
1. **scripts** フォルダを右クリック
2. **新しいファイル** → `convertCsvToJson.js`

#### スクリプト内容を貼り付け
```javascript
const fs = require('fs');
const path = require('path');

console.log('🚀 CSV to JSON 変換スクリプト開始');

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

// ユーザーデータを変換する関数
function convertUsers(csvUsers) {
  console.log('👥 ユーザーデータを変換中...');
  
  return csvUsers.map(csvUser => {
    const completedTrainings = [];
    
    // 各研修の受講状況をチェック
    if (csvUser['security-training'] === '1') {
      completedTrainings.push('security-training');
    }
    if (csvUser['compliance-training'] === '1') {
      completedTrainings.push('compliance-training');
    }
    if (csvUser['leadership-training'] === '1') {
      completedTrainings.push('leadership-training');
    }
    
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

// メイン処理
function main() {
  try {
    // 1. CSVファイルを読み込み
    console.log('📖 CSVファイルを読み込み中...');
    const usersCSV = readCSV('./data/users.csv');
    const badgesCSV = readCSV('./data/badges.csv');
    
    console.log(`👥 ユーザー数: ${usersCSV.length}`);
    console.log(`🏆 バッジ数: ${badgesCSV.length}`);
    
    // 2. データを変換
    const users = convertUsers(usersCSV);
    const badges = convertBadges(badgesCSV);
    
    // 3. JSONファイルに保存
    console.log('💾 JSONファイルに保存中...');
    saveJSON(users, './src/data/users.json', 'users');
    saveJSON(badges, './src/data/badges.json', 'badges');
    
    console.log('🎉 変換完了！');
    console.log('');
    console.log('📋 変換されたデータ:');
    console.log(`   - ユーザー: ${users.length}名`);
    console.log(`   - バッジ: ${badges.length}個`);
    console.log('');
    console.log('🚀 次のコマンドでサイトを確認できます:');
    console.log('   npm start');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

// スクリプト実行
main();
```

---

## 📦 Step 4: package.json の設定

### 4-1. package.json にスクリプトを追加

**package.json** ファイルを開き、`"scripts"` セクションを以下のように修正:

#### 変更前
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

#### 変更後
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

## 🧪 Step 5: テスト実行

### 5-1. 変換スクリプトのテスト

#### ターミナルで実行
```bash
# プロジェクトフォルダに移動
cd digital-badge-site

# 変換スクリプト実行
npm run convert-data
```

#### 成功時の表示例
```
🚀 CSV to JSON 変換スクリプト開始
📖 CSVファイルを読み込み中...
👥 ユーザー数: 4
🏆 バッジ数: 3
👥 ユーザーデータを変換中...
🏆 バッジデータを変換中...
💾 JSONファイルに保存中...
✅ 保存完了: ./src/data/users.json
✅ 保存完了: ./src/data/badges.json
🎉 変換完了！

📋 変換されたデータ:
   - ユーザー: 4名
   - バッジ: 3個

🚀 次のコマンドでサイトを確認できます:
   npm start
```

### 5-2. サイトでの確認
```bash
# サイト起動
npm start
```

**ブラウザで確認**:
- ログイン画面が表示される
- テストアカウントでログイン可能
- バッジが正しく表示される

---

## 📊 Step 6: Excel/Googleスプレッドシートでの編集方法

### 6-1. Excelで編集

#### CSVファイルを開く
1. **Excel** を起動
2. **ファイル** → **開く**
3. `digital-badge-site/data/users.csv` を選択
4. **ファイルの種類** で **CSV** を選択

#### データ編集
| A列: email | B列: name | C列: security-training | D列: compliance-training | E列: leadership-training |
|------------|-----------|------------------------|--------------------------|--------------------------|
| tanaka@company.com | 田中太郎 | ○ | | |
| sato@company.com | 佐藤花子 | ○ | ○ | |
| **追加→** | **新入社員@company.com** | **新入 太郎** | **○** | | |

#### 保存
1. **Ctrl + S** で保存
2. **CSV形式で保存** を選択

### 6-2. Googleスプレッドシートで編集

#### インポート
1. **Google Drive** → **新規** → **Googleスプレッドシート**
2. **ファイル** → **インポート** → **アップロード**
3. `users.csv` をアップロード

#### 編集・エクスポート
1. データを編集
2. **ファイル** → **ダウンロード** → **CSV**
3. ダウンロードしたファイルを `data/users.csv` に上書き

---

## 🔄 Step 7: 日常の運用フロー

### 7-1. データ更新手順

#### ① 新入社員の追加
```bash
1. Excel で data/users.csv を開く
2. 最下行に新入社員情報を追加
3. 保存
4. npm run convert-data
5. npm start で確認
```

#### ② 研修受講状況の更新
```bash
1. Excel で data/users.csv を開く
2. 該当ユーザーの研修列に 1 を入力
3. 保存
4. npm run convert-data
5. npm start で確認
```

#### ③ 新しい研修の追加
```bash
1. Excel で data/badges.csv を開く
2. 新しい研修を1行追加（id, name, description, password, filename）
3. 新しいバッジ画像を public/assets/badges/ に配置
4. Excel で data/users.csv を開く
5. 新しい研修の列を追加（列名は badges.csv の id と同じにする）
6. 保存
7. npm run convert-data
8. npm start で確認
```

#### ④ 既存研修の情報変更
```bash
1. Excel で data/badges.csv を開く
2. 該当行の情報を修正（研修名、説明文、パスワードなど）
3. 保存
4. npm run convert-data
5. npm start で確認
```

#### ⑤ 研修の削除
```bash
1. Excel で data/badges.csv を開く
2. 該当行を削除
3. Excel で data/users.csv を開く
4. 該当する研修の列を削除
5. public/assets/badges/ から不要な画像ファイルを削除
6. 保存
7. npm run convert-data
8. npm start で確認
```

### 7-2. ワンコマンド実行
```bash
# データ変換 + サイト起動
npm run dev-with-data
```

### 7-3. 本番デプロイ
```bash
# Git コミット・プッシュ
git add .
git commit -m "Update user and badge data"
git push origin main
```

---

## 🆘 トラブルシューティング

### ❌ 「ファイルが見つかりません」エラー
**原因**: CSVファイルのパスが間違っている
**解決**: 
```bash
# 現在の場所を確認
pwd

# ファイルの存在確認
ls data/
```

### ❌ CSV読み込みエラー
**原因**: CSV形式の問題
**解決**:
- **カンマ** がデータに含まれていないか確認
- **改行コード** の問題（LF vs CRLF）
- **文字コード** をUTF-8で保存

### ❌ JSON変換エラー
**原因**: データの不整合
**解決**:
- **空のセル** がないか確認
- **特殊文字** がないか確認
- **列数** が揃っているか確認

### ❌ サイトに反映されない
**原因**: ブラウザキャッシュ
**解決**:
```bash
# 開発サーバー再起動
Ctrl + C でサーバー停止
npm start で再起動
```

---

## ✅ 構築完了チェックリスト

### ファイル・フォルダ
- [ ] `data/users.csv` 作成済み
- [ ] `data/badges.csv` 作成済み
- [ ] `scripts/convertCsvToJson.js` 作成済み
- [ ] `package.json` にスクリプト追加済み

### 動作確認
- [ ] `npm run convert-data` が成功する
- [ ] `src/data/users.json` が更新される
- [ ] `src/data/badges.json` が更新される
- [ ] `npm start` でサイトが正常動作する

### 運用確認
- [ ] Excel/Googleスプレッドシートで編集可能
- [ ] CSV保存 → 変換 → サイト確認の流れが動作する
- [ ] 新入社員追加のテストが成功する

**全て確認できれば、CSV変換システムの構築完了です！** 🎉

これで、技術者でない方でも簡単にデータメンテナンスができるようになります！