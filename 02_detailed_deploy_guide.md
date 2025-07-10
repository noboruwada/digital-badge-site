# Azure Static Web Apps デプロイ完全ガイド（初心者向け）

## 📋 事前準備チェックリスト

### ✅ 必要なアカウント
- [ ] **Azureアカウント** - [azure.microsoft.com](https://azure.microsoft.com) で無料作成
- [ ] **GitHubアカウント** - [github.com](https://github.com) で無料作成

### ✅ 必要なソフトウェア
- [ ] **Visual Studio Code** - [code.visualstudio.com](https://code.visualstudio.com)
- [ ] **Node.js** - [nodejs.org](https://nodejs.org) (LTS版をダウンロード)
- [ ] **Git** - [git-scm.com](https://git-scm.com)

---

## 🚀 Step 1: プロジェクト作成とGitHub準備

### 1-1. React プロジェクト作成
```bash
# ターミナル（コマンドプロンプト）を開いて実行
npx create-react-app digital-badge-site
cd digital-badge-site
```

### 1-2. プロジェクト構造を作成
```
digital-badge-site/
├── src/
│   ├── components/        # ← 新規作成
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   └── BadgeCard.js
│   ├── data/             # ← 新規作成
│   │   ├── users.json
│   │   └── badges.json
│   └── assets/           # ← 新規作成
│       └── badges/       # バッジファイル置き場
├── public/
└── package.json
```

### 1-3. GitHubリポジトリ作成
1. **GitHub.com にアクセス**
2. 右上の **「+」→「New repository」** をクリック
3. **Repository name**: `digital-badge-site`
4. **Public** を選択（無料版のため）
5. **「Create repository」** をクリック

### 1-4. ローカルとGitHubを連携
```bash
# プロジェクトフォルダで実行
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/digital-badge-site.git
git push -u origin main
```

> **💡 注意**: `あなたのユーザー名` の部分は実際のGitHubユーザー名に置き換えてください

---

## 🏗️ Step 2: Azure Static Web Apps 作成

### 2-1. Azure ポータルにアクセス
1. **[portal.azure.com](https://portal.azure.com)** にアクセス
2. Azureアカウントでログイン

### 2-2. リソースグループ作成
1. **検索バーに「リソースグループ」** と入力
2. **「リソースグループ」** をクリック
3. **「+ 作成」** をクリック
4. 以下を入力:
   - **サブスクリプション**: そのまま
   - **リソースグループ名**: `rg-digital-badge`
   - **地域**: `Japan East`
5. **「確認および作成」** → **「作成」** をクリック

### 2-3. Static Web Apps 作成
1. **検索バーに「Static Web Apps」** と入力
2. **「静的 Web アプリ」** をクリック
3. **「+ 作成」** をクリック

### 2-4. 基本情報の入力
以下の項目を入力してください:

| 項目 | 値 |
|------|-----|
| **サブスクリプション** | そのまま |
| **リソースグループ** | `rg-digital-badge` |
| **名前** | `digital-badge-app` |
| **プランの種類** | `Free` |
| **Azure Functions と ステージング環境の地域** | `East Asia` |
| **デプロイの詳細** | `GitHub` |

### 2-5. GitHub連携設定
1. **「GitHubでサインイン」** をクリック
2. GitHubの認証を完了
3. 以下を選択:
   - **組織**: あなたのGitHubユーザー名
   - **リポジトリ**: `digital-badge-site`
   - **ブランチ**: `main`

### 2-6. ビルド設定
| 項目 | 値 |
|------|-----|
| **ビルドのプリセット** | `React` |
| **アプリの場所** | `/` |
| **APIの場所** | （空欄のまま） |
| **出力場所** | `build` |

### 2-7. 作成実行
1. **「確認および作成」** をクリック
2. 設定内容を確認
3. **「作成」** をクリック
4. **デプロイ完了まで2-3分待機**

---

## ⚙️ Step 3: 自動デプロイの確認

### 3-1. GitHub Actions 確認
1. **GitHubのリポジトリページ** にアクセス
2. **「Actions」タブ** をクリック
3. **ワークフローが実行中** であることを確認
4. **緑のチェックマーク** が表示されるまで待機（5-10分）

### 3-2. デプロイ完了の確認
1. **Azureポータル** に戻る
2. **「リソースに移動」** をクリック
3. **「URL」** をクリックしてサイトにアクセス
4. **React のデフォルトページ** が表示されればOK

---

## 🎯 Step 4: サンプルデータの追加

### 4-1. ファイル構造の準備
Visual Studio Code でプロジェクトを開き、以下のファイルを作成:

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
      "description": "情報セキュリティ基礎研修修了証"
    },
    {
      "id": "compliance-training", 
      "name": "コンプライアンス研修",
      "file": "/assets/badges/compliance-badge.png",
      "description": "企業コンプライアンス研修修了証"
    },
    {
      "id": "leadership-training",
      "name": "リーダーシップ研修", 
      "file": "/assets/badges/leadership-badge.png",
      "description": "管理職向けリーダーシップ研修修了証"
    }
  ]
}
```

### 4-2. バッジファイルの準備
1. **`public/assets/badges/`** フォルダを作成
2. 以下のバッジファイルを配置:
   - `security-badge.png`
   - `compliance-badge.png` 
   - `leadership-badge.png`

> **💡 Tip**: バッジファイルがない場合は、一時的に適当な画像ファイルをリネームして使用してください

---

## 🔄 Step 5: コードの更新とデプロイ

### 5-1. 変更をコミット
```bash
# ターミナルでプロジェクトフォルダに移動
git add .
git commit -m "Add sample data and badge files"
git push origin main
```

### 5-2. 自動デプロイの確認
1. **GitHub Actions** で新しいワークフローが開始
2. **完了まで5-10分待機**
3. **Azure Static Web Apps のURL** で更新を確認

---

## 🌐 Step 6: カスタムドメイン設定（オプション）

### 6-1. カスタムドメインがある場合
1. **Azure Static Web Apps** のリソースページで **「カスタムドメイン」** をクリック
2. **「+ 追加」** をクリック
3. **ドメイン名** を入力（例: `badges.company.com`）
4. **DNS設定** の指示に従ってCNAMEレコードを追加
5. **検証完了** まで待機

### 6-2. 標準ドメインを使用する場合
- **何もしません**
- `https://***-***-***.azurestaticapps.net` の形式のURLが割り当てられます

---

## 🔐 Step 7: 基本的なセキュリティ設定

### 7-1. 環境変数の設定（将来用）
1. **Azure Static Web Apps** のリソースページで **「構成」** をクリック
2. **「アプリケーション設定」** タブを選択
3. 将来的に必要になる設定項目を追加:
   - `NODE_ENV`: `production`
   - `REACT_APP_VERSION`: `1.0.0`

---

## ✅ Step 8: 動作確認チェックリスト

### 8-1. 基本動作確認
- [ ] **サイトにアクセス** できる
- [ ] **React アプリ** が表示される
- [ ] **コンソールエラー** がない
- [ ] **モバイル表示** も正常

### 8-2. デプロイフロー確認
- [ ] **コード変更** → **git push**
- [ ] **GitHub Actions** 実行
- [ ] **自動デプロイ** 完了
- [ ] **サイト更新** 確認

---

## 🆘 よくあるトラブルと解決方法

### ❌ GitHub Actions が失敗する
**原因**: package.json の設定やNode.js バージョン
**解決**: 
```json
// package.json に追加
"engines": {
  "node": ">=18.0.0"
}
```

### ❌ サイトが表示されない
**原因**: ビルド設定の間違い
**解決**: Azure Static Web Apps の設定で「出力場所」を `build` に設定

### ❌ 画像ファイルが表示されない  
**原因**: ファイルパスの間違い
**解決**: `public/assets/` フォルダに配置し、`/assets/` から始まるパスを使用

### ❌ JSONファイルが読み込めない
**原因**: importパスの間違い
**解決**: 
```javascript
import usersData from '../data/users.json';
```

---

## 🎉 完成！

これで **Azure Static Web Apps** へのデプロイが完了しました！

### 📱 確認ポイント
1. **URL アクセス**: `https://***-***-***.azurestaticapps.net`
2. **自動デプロイ**: コード変更時の自動更新
3. **無料運用**: 月額0円での継続運用

### 🔄 今後の更新方法
1. **コード修正**
2. **`git add . && git commit -m "更新内容" && git push`**
3. **5-10分で自動デプロイ完了**

お疲れさまでした！これで基盤は完成です！🚀