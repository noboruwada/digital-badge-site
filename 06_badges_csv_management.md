# badges.csv 詳細管理ガイド

## 📊 badges.csv の構造

### カラム説明
| カラム名 | 説明 | 例 | 必須 |
|----------|------|-----|------|
| **id** | 研修の一意識別子（英数字・ハイフンのみ） | `security-training` | ✅ |
| **name** | 研修の表示名 | `セキュリティ研修` | ✅ |
| **description** | バッジの説明文 | `情報セキュリティ基礎研修修了証` | ✅ |
| **password** | ログイン用パスワード | `sec2024` | ✅ |
| **filename** | バッジ画像ファイル名 | `security-badge.png` | ❌ |

### ⚠️ 重要なルール

#### ID命名規則
- **英小文字、数字、ハイフン（-）のみ**
- **スペース、日本語、特殊文字は使用不可**
- **例**: `security-training`, `new-employee-2024`, `leadership-advanced`

#### users.csvとの連携
- **badges.csvのid** = **users.csvの列名** である必要があります
- IDを変更する場合は、users.csvの該当列名も変更が必要

---

## 📝 実際の編集例

### 🆕 新しい研修を追加する場合

#### Step 1: badges.csv に追加
```csv
id,name,description,password,filename
security-training,セキュリティ研修,情報セキュリティ基礎研修修了証,sec2024,security-badge.png
compliance-training,コンプライアンス研修,企業コンプライアンス研修修了証,comp2024,compliance-badge.png
leadership-training,リーダーシップ研修,管理職向けリーダーシップ研修修了証,lead2024,leadership-badge.png
digital-transformation,DX研修,デジタルトランスフォーメーション基礎研修修了証,dx2024,dx-badge.png
```

#### Step 2: users.csv に列を追加
```csv
email,name,security-training,compliance-training,leadership-training,digital-transformation
tanaka@company.com,田中太郎,○,,,
sato@company.com,佐藤花子,○,○,,
yamada@company.com,山田次郎,,,○,
admin@company.com,管理者,○,○,○,○
```

#### Step 3: バッジ画像を配置
- `public/assets/badges/dx-badge.png` を配置

### 🔄 既存研修の情報を変更する場合

#### 研修名の変更
```csv
id,name,description,password,filename
security-training,情報セキュリティ研修,情報セキュリティ基礎研修修了証,sec2024,security-badge.png
```

#### パスワードの変更
```csv
id,name,description,password,filename
security-training,セキュリティ研修,情報セキュリティ基礎研修修了証,security2025,security-badge.png
```

#### バッジ画像の変更
```csv
id,name,description,password,filename
security-training,セキュリティ研修,情報セキュリティ基礎研修修了証,sec2024,new-security-badge.png
```
※ `public/assets/badges/new-security-badge.png` を配置

### 🗑️ 研修を削除する場合

#### Step 1: badges.csv から削除
```csv
# leadership-training を削除
id,name,description,password,filename
security-training,セキュリティ研修,情報セキュリティ基礎研修修了証,sec2024,security-badge.png
compliance-training,コンプライアンス研修,企業コンプライアンス研修修了証,comp2024,compliance-badge.png
```

#### Step 2: users.csv から該当列を削除
```csv
email,name,security-training,compliance-training
tanaka@company.com,田中太郎,○,
sato@company.com,佐藤花子,○,○
yamada@company.com,山田次郎,,
admin@company.com,管理者,○,○
```

#### Step 3: 不要な画像ファイルを削除
- `public/assets/badges/leadership-badge.png` を削除

---

## 🎯 よくある編集パターン

### パターン1: 年度更新
```csv
# パスワードを年度ごとに更新
id,name,description,password,filename
security-training,セキュリティ研修,情報セキュリティ基礎研修修了証,sec2025,security-badge.png
compliance-training,コンプライアンス研修,企業コンプライアンス研修修了証,comp2025,compliance-badge.png
leadership-training,リーダーシップ研修,管理職向けリーダーシップ研修修了証,lead2025,leadership-badge.png
```

### パターン2: 研修の階層化
```csv
# 基礎・応用コースを分ける
id,name,description,password,filename
security-basic,セキュリティ研修（基礎）,情報セキュリティ基礎研修修了証,secbasic2024,security-basic-badge.png
security-advanced,セキュリティ研修（応用）,情報セキュリティ応用研修修了証,secadv2024,security-advanced-badge.png
```

### パターン3: 部門別研修
```csv
# 部門ごとの専門研修
id,name,description,password,filename
sales-training,営業研修,営業スキル向上研修修了証,sales2024,sales-badge.png
engineering-training,エンジニア研修,技術力向上研修修了証,eng2024,engineering-badge.png
hr-training,人事研修,人事制度研修修了証,hr2024,hr-badge.png
```

---

## 🔧 Excel での効率的な編集方法

### データ入力規則の設定

#### ID列の入力規則
1. **ID列を選択**
2. **データ** → **データの入力規則**
3. **設定**:
   - 入力値の種類: `ユーザー設定`
   - 数式: `=AND(LEN(A2)>0,ISERROR(FIND(" ",A2)),ISERROR(FIND("　",A2)))`
   - エラーメッセージ: `IDには英数字とハイフンのみ使用してください`

#### パスワード列の入力規則
1. **パスワード列を選択**
2. **データ** → **データの入力規則**
3. **設定**:
   - 入力値の種類: `文字列（長さ指定）`
   - 最小文字数: `6`
   - 最大文字数: `20`

### 条件付き書式の設定

#### 重複IDの警告
1. **ID列を選択**
2. **ホーム** → **条件付き書式** → **セルの強調表示ルール** → **重複する値**
3. **書式**: 赤色背景

### 数式による自動補完

#### filename列の自動生成
```excel
# D2セルに以下の数式（IDがA2の場合）
=A2&".png"
```

---

## ✅ バッジ管理チェックリスト

### 新しい研修追加時
- [ ] **IDは英数字・ハイフンのみ**
- [ ] **既存IDと重複していない**
- [ ] **users.csvに同名の列を追加**
- [ ] **バッジ画像ファイルを配置**
- [ ] **変換テスト実行**

### 研修情報変更時
- [ ] **IDを変更する場合はusers.csvも更新**
- [ ] **ファイル名を変更する場合は画像ファイルも更新**
- [ ] **パスワード変更は関係者に通知**
- [ ] **変換テスト実行**

### 研修削除時
- [ ] **badges.csvから行削除**
- [ ] **users.csvから列削除**
- [ ] **不要な画像ファイル削除**
- [ ] **既存ユーザーへの影響確認**
- [ ] **変換テスト実行**

---

## 🆘 トラブルシューティング

### ❌ 「研修が表示されない」
**原因**: users.csvとbadges.csvのID不一致
**解決**: 
```bash
# badges.csvのIDを確認
cat data/badges.csv | cut -d, -f1

# users.csvの列名を確認
head -1 data/users.csv
```

### ❌ 「バッジ画像が表示されない」
**原因**: filename指定とファイル名の不一致
**解決**:
```bash
# 実際のファイル名を確認
ls public/assets/badges/

# badges.csvのfilename列を確認
cat data/badges.csv | cut -d, -f5
```

### ❌ 「パスワードでログインできない」
**原因**: badges.csvのpassword列とログイン処理の不一致
**解決**:
- **パスワードにスペースが含まれていないか確認**
- **特殊文字が含まれていないか確認**
- **変換後のJSONファイルでパスワードを確認**

---

## 🚀 高度な活用方法

### バッチ処理での一括更新

#### 年度末の一括パスワード更新
```csv
# 全研修のパスワードを2025年版に更新
id,name,description,password,filename
security-training,セキュリティ研修,情報セキュリティ基礎研修修了証,sec2025,security-badge.png
compliance-training,コンプライアンス研修,企業コンプライアンス研修修了証,comp2025,compliance-badge.png
leadership-training,リーダーシップ研修,管理職向けリーダーシップ研修修了証,lead2025,leadership-badge.png
```

### CSVテンプレートの作成

#### 新研修追加用テンプレート
```csv
id,name,description,password,filename
[研修ID],「研修名」,[説明文],[パスワード],[ファイル名].png
```

**これで badges.csv も完全にExcelで管理できるようになります！** 🎉