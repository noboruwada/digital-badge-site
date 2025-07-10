# users.csv 詳細管理ガイド

## 📊 users.csv の構造

### カラム説明
| カラム名 | 説明 | 例 | 必須 | 注意事項 |
|----------|------|-----|------|----------|
| **email** | ユーザーのメールアドレス（ログインID） | `tanaka@company.com` | ✅ | 一意である必要がある |
| **name** | ユーザーの表示名 | `田中太郎` | ✅ | 日本語OK、重複可能 |
| **研修ID列** | 各研修の受講状況 | `1` または空白 | ❌ | badges.csvのIDと一致が必要 |

### ⚠️ 重要なルール

#### 研修ID列の命名規則
- **badges.csvのid列** と **users.csvの列名** が完全に一致している必要があります
- **例**: badges.csvに `security-training` があれば、users.csvにも `security-training` 列が必要

#### 受講状況の表記
- **受講済み**: `1` （半角数字の1）
- **未受講**: 空白（何も入力しない）
- **その他の文字**: `0`, `済`, `完了` なども可能（1以外はすべて未受講扱い）

#### メールアドレスの規則
- **一意性**: 同じメールアドレスは使用不可
- **形式**: 一般的なメール形式 (`user@domain.com`)
- **大文字小文字**: 区別される（`User@company.com` と `user@company.com` は別）

---

## 📝 実際の編集例

### 🆕 新入社員を追加する場合

#### 現在のusers.csv
```csv
email,name,security-training,compliance-training,leadership-training
tanaka@company.com,田中太郎,○,,
sato@company.com,佐藤花子,○,○,
admin@company.com,管理者,○,○,○
```

#### 新入社員追加後
```csv
email,name,security-training,compliance-training,leadership-training
tanaka@company.com,田中太郎,1,,
sato@company.com,佐藤花子,1,1,
admin@company.com,管理者,1,1,1
yamada@company.com,山田次郎,,,
suzuki@company.com,鈴木花子,,,
```

### 📚 研修受講状況を更新する場合

#### 田中太郎がコンプライアンス研修を受講完了
```csv
email,name,security-training,compliance-training,leadership-training
tanaka@company.com,田中太郎,1,1,
sato@company.com,佐藤花子,1,1,
admin@company.com,管理者,1,1,1
```

#### 複数人が同時に研修完了
```csv
email,name,security-training,compliance-training,leadership-training
tanaka@company.com,田中太郎,1,1,
sato@company.com,佐藤花子,1,1,1
yamada@company.com,山田次郎,1,,
admin@company.com,管理者,1,1,1
```

### 🆕 新しい研修列を追加する場合

#### badges.csvに新研修追加後
```csv
id,name,description,password,filename
security-training,セキュリティ研修,情報セキュリティ基礎研修修了証,sec2024,security-badge.png
compliance-training,コンプライアンス研修,企業コンプライアンス研修修了証,comp2024,compliance-badge.png
leadership-training,リーダーシップ研修,管理職向けリーダーシップ研修修了証,lead2024,leadership-badge.png
digital-transformation,DX研修,デジタルトランスフォーメーション基礎研修修了証,dx2024,dx-badge.png
```

#### users.csvに対応する列を追加
```csv
email,name,security-training,compliance-training,leadership-training,digital-transformation
tanaka@company.com,田中太郎,1,,,
sato@company.com,佐藤花子,1,1,,
admin@company.com,管理者,1,1,1,1
yamada@company.com,山田次郎,,,1,
```

### 👋 退職者の処理

#### 方法1: 行削除（推奨）
```csv
# 佐藤花子が退職 → 該当行を削除
email,name,security-training,compliance-training,leadership-training
tanaka@company.com,田中太郎,1,,
admin@company.com,管理者,1,1,1
yamada@company.com,山田次郎,,,
```

#### 方法2: 無効化（履歴保持）
```csv
# 退職者は名前に[退職]を付けて無効化
email,name,security-training,compliance-training,leadership-training
tanaka@company.com,田中太郎,1,,
sato-retired@company.com,[退職]佐藤花子,1,1,
admin@company.com,管理者,1,1,1
yamada@company.com,山田次郎,,,
```

---

## 🔧 Excel での効率的な編集方法

### データ入力規則の設定

#### 1. メールアドレス列の入力規則
1. **email列（A列）** を選択
2. **データ** → **データの入力規則**
3. **設定**:
   - 入力値の種類: `ユーザー設定`
   - 数式: `=AND(ISERROR(FIND(" ",A2)),FIND("@",A2)>0,FIND(".",A2)>FIND("@",A2))`
   - エラーメッセージ: `正しいメールアドレス形式で入力してください`

#### 2. 研修受講状況列の入力規則
1. **研修列（C列以降）** を選択
2. **データ** → **データの入力規則**
3. **設定**:
   - 入力値の種類: `リスト`
   - 元の値: `1,済,完了` （カンマ区切り）
   - 空白を無視する: ✅チェック

#### 3. 名前列の入力規則
1. **name列（B列）** を選択
2. **データ** → **データの入力規則**
3. **設定**:
   - 入力値の種類: `文字列（長さ指定）`
   - 最小文字数: `1`
   - 最大文字数: `50`

### 条件付き書式の設定

#### 1. 重複メールアドレスの警告
1. **email列** を選択
2. **ホーム** → **条件付き書式** → **セルの強調表示ルール** → **重複する値**
3. **書式**: 赤色背景で設定

#### 2. 受講完了状況の視覚化
1. **研修列** を選択
2. **ホーム** → **条件付き書式** → **新しいルール**
3. **ルールの種類**: `指定の値を含むセルだけを書式設定`
4. **書式設定の対象**: `特定の文字列` `1`
5. **書式**: 緑色背景で設定

#### 3. 未受講者の強調表示
1. **研修列** を選択
2. **ホーム** → **条件付き書式** → **新しいルール**
3. **ルールの種類**: `空白セルの書式設定`
4. **書式**: 薄い黄色背景で設定

### 便利な数式

#### 1. 受講完了数の自動計算
```excel
# D列に各ユーザーの受講完了数を表示（C列から最後の研修列まで）
=COUNTIF(C2:Z2,"1")
```

#### 2. 全研修完了チェック
```excel
# E列に全研修完了かどうかを表示
=IF(COUNTIF(C2:Z2,"1")=COUNTA(C1:Z1)-2,"完了","未完了")
```

#### 3. メールアドレスの重複チェック
```excel
# F列に重複チェック結果を表示
=IF(COUNTIF(A:A,A2)>1,"重複","OK")
```

---

## 📋 よくある編集パターン

### パターン1: 月次研修受講更新

#### 一括更新の手順
1. **研修実施報告書** から受講者リストを取得
2. **Excel のフィルタ機能** で該当ユーザーを抽出
3. **一括で○印** を入力
4. **保存** → **変換実行**

#### 例: セキュリティ研修の一括更新
```csv
# 2024年1月実施分
email,name,security-training,compliance-training,leadership-training
tanaka@company.com,田中太郎,1,,
yamada@company.com,山田次郎,1,,
suzuki@company.com,鈴木花子,1,,
```

### パターン2: 部署異動に伴う更新

#### 管理職昇進時
```csv
# 山田次郎が管理職に昇進 → リーダーシップ研修が必要
email,name,security-training,compliance-training,leadership-training
yamada@company.com,山田次郎,1,,1
```

#### メールアドレス変更
```csv
# 結婚により姓が変更
# 旧: suzuki@company.com → 新: tanaka-yuki@company.com
email,name,security-training,compliance-training,leadership-training
tanaka-yuki@company.com,田中由紀,1,1,
```

### パターン3: 大量データの処理

#### 新入社員100名の一括追加
1. **別のExcelファイル** で新入社員リストを準備
2. **コピー&ペースト** でusers.csvに追加
3. **研修列は空白** で追加
4. **後から研修受講に応じて更新**

#### CSVインポート機能の活用
```csv
# 人事システムからエクスポートしたデータを活用
employee_id,email,full_name,department
E001,tanaka@company.com,田中太郎,営業部
E002,sato@company.com,佐藤花子,総務部
```

---

## 🎯 運用フローのベストプラクティス

### 日常運用

#### 1. 研修受講報告の処理（週次）
```
1. 研修担当者から受講者リストを受領
2. Excel で users.csv を開く
3. フィルタ機能で該当者を抽出
4. 該当研修列に1を一括入力
5. 保存 → 変換実行 → 動作確認
```

#### 2. 新入社員の追加（月次）
```
1. 人事システムから新入社員リストを取得
2. users.csv の最下行に追加
3. 必須研修の設定（セキュリティ研修など）
4. 保存 → 変換実行 → 新入社員に通知
```

#### 3. 退職者の処理（随時）
```
1. 人事部から退職者リストを受領
2. 該当者の行を削除または無効化
3. 保存 → 変換実行
4. アクセス状況の確認
```

### 定期メンテナンス

#### 1. 月次レポート作成
```excel
# 各研修の受講率計算
=COUNTIF(C:C,"1")/COUNTA(A:A)-1
```

#### 2. 未受講者リストの作成
```
1. フィルタ機能で未受講者を抽出
2. 別シートにコピー
3. 管理者に報告用資料として提供
```

#### 3. データ整合性チェック
```
1. 重複メールアドレスの確認
2. 無効なメールアドレスの確認
3. 研修列の整合性確認（badges.csvとの比較）
```

---

## 🚨 トラブルシューティング

### ❌ 「ユーザーが見つからない」エラー

#### 症状
ログイン時に「メールアドレスが見つかりません」表示

#### 原因と解決
- **原因**: メールアドレスの不一致
- **確認方法**: 
  ```bash
  cat data/users.csv | cut -d',' -f1
  ```
- **解決**: 正確なメールアドレスで再入力

### ❌ 「研修が表示されない」エラー

#### 症状
バッジが取得済みなのに表示されない

#### 原因と解決
- **原因**: 研修ID列名とbadges.csvの不一致
- **確認方法**: 
  ```bash
  # users.csvの列名確認
  head -1 data/users.csv
  
  # badges.csvのID確認
  cat data/badges.csv | cut -d',' -f1
  ```
- **解決**: 列名を badges.csv の id と一致させる

### ❌ 「○印が認識されない」エラー

#### 症状
1を入力しても未受講として表示される

#### 原因と解決
- **原因**: 全角・半角の違いまたは余計な文字
- **解決**: 
  ```csv
  # 正しい: 半角の1
  tanaka@company.com,田中太郎,1,,
  
  # 間違い: 全角の１、空白、その他文字
  tanaka@company.com,田中太郎,１ ,,  # NG（全角）
  tanaka@company.com,田中太郎, 1,,   # NG（前に空白）
  tanaka@company.com,田中太郎,○,,    # NG（○文字）
  ```

### ❌ 「文字化け」エラー

#### 症状
名前が文字化けして表示される

#### 原因と解決
- **原因**: 文字コードの問題
- **解決**: Excel で **CSV UTF-8** 形式で再保存

---

## 📊 高度な管理テクニック

### 1. 条件付き書式による進捗可視化

#### 受講進捗バーの作成
```excel
# 各行の進捗率を視覚化
=COUNTIF(C2:Z2,"○")/COUNTA(C1:Z1)-2
```

#### 色分けルール
- **緑色**: 80%以上受講完了
- **黄色**: 50-79%受講完了  
- **赤色**: 50%未満

### 2. ピボットテーブルによる分析

#### 部署別受講状況の分析
1. **部署列** を追加
2. **ピボットテーブル** 作成
3. **行**: 部署名
4. **値**: 各研修の受講者数

#### 研修別受講率の分析
1. **ピボットテーブル** 作成
2. **行**: 研修名
3. **値**: 受講者数、受講率

### 3. 自動化スクリプトとの連携

#### 受講期限の管理
```csv
# 受講期限列を追加
email,name,security-training,security-deadline,compliance-training,compliance-deadline
tanaka@company.com,田中太郎,1,2024-03-31,,2024-06-30
```

#### アラート機能
```javascript
// 期限切れユーザーの自動抽出
const checkDeadlines = () => {
  const today = new Date();
  // 期限チェック処理
};
```

---

## ✅ users.csv 管理チェックリスト

### 基本確認
- [ ] **メールアドレスに重複がない**
- [ ] **研修列名がbadges.csvのIDと一致**
- [ ] **受講状況は1または空白のみ**
- [ ] **文字コードがUTF-8**

### データ整合性確認
- [ ] **全ユーザーに有効なメールアドレス**
- [ ] **名前フィールドが空でない**
- [ ] **不要な空白や特殊文字がない**
- [ ] **退職者データの適切な処理**

### 運用確認
- [ ] **月次更新プロセスが確立**
- [ ] **研修受講報告の反映手順が明確**
- [ ] **エラー対応手順が準備済み**
- [ ] **バックアップ取得が定期実行**

**この管理ガイドに従えば、効率的で正確なユーザーデータ管理が可能になります！** 🎯