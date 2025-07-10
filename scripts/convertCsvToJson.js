const fs = require('fs');
const path = require('path');

console.log('🚀 CSV to JSON 変換スクリプト開始 (数字1対応版)');

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

// ユーザーデータを変換する関数（改良版）
function convertUsers(csvUsers, badges) {
  console.log('👥 ユーザーデータを変換中...');
  
  return csvUsers.map(csvUser => {
    const completedTrainings = [];
    
    // badges.csvから動的に研修IDを取得
    badges.forEach(badge => {
      const trainingValue = csvUser[badge.id];
      
      // 受講済みと判定する条件
      if (isCompleted(trainingValue)) {
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

// 受講完了判定関数（柔軟性を追加）
function isCompleted(value) {
  if (!value) return false;
  
  const trimmedValue = value.toString().trim();
  
  // 受講済みと判定するパターン
  const completedPatterns = [
    '1',        // 半角数字の1
    '１',       // 全角数字の１
    '○',        // 全角マル
    '◯',        // 白丸
    '済',       // 済
    '完了',     // 完了
    'OK',       // OK
    'ok',       // ok
    'YES',      // YES
    'yes',      // yes
    'Y',        // Y
    'y'         // y
  ];
  
  return completedPatterns.includes(trimmedValue);
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
function validateData(usersCSV, badgesCSV) {
  console.log('🔍 データ検証中...');
  
  // バッジIDの重複チェック
  const badgeIds = badgesCSV.map(badge => badge.id);
  const duplicateBadgeIds = badgeIds.filter((id, index) => badgeIds.indexOf(id) !== index);
  if (duplicateBadgeIds.length > 0) {
    console.warn(`⚠️  重複するバッジID: ${duplicateBadgeIds.join(', ')}`);
  }
  
  // ユーザーメールアドレスの重複チェック
  const userEmails = usersCSV.map(user => user.email);
  const duplicateEmails = userEmails.filter((email, index) => userEmails.indexOf(email) !== index);
  if (duplicateEmails.length > 0) {
    console.warn(`⚠️  重複するメールアドレス: ${duplicateEmails.join(', ')}`);
  }
  
  // users.csvの列名とbadges.csvのIDの整合性チェック
  if (usersCSV.length > 0) {
    const userHeaders = Object.keys(usersCSV[0]);
    const missingColumns = badgeIds.filter(id => !userHeaders.includes(id));
    const extraColumns = userHeaders.filter(header => 
      !['email', 'name'].includes(header) && !badgeIds.includes(header)
    );
    
    if (missingColumns.length > 0) {
      console.warn(`⚠️  users.csvに不足している研修列: ${missingColumns.join(', ')}`);
    }
    if (extraColumns.length > 0) {
      console.warn(`⚠️  users.csvの不要な列: ${extraColumns.join(', ')}`);
    }
  }
  
  console.log('✅ データ検証完了');
}

// 統計情報表示関数
function showStatistics(users, badges) {
  console.log('');
  console.log('📊 変換統計情報:');
  console.log(`   👥 総ユーザー数: ${users.length}名`);
  console.log(`   🏆 総バッジ数: ${badges.length}個`);
  
  // 各研修の受講率計算
  badges.forEach(badge => {
    const completedCount = users.filter(user => 
      user.completedTrainings.includes(badge.id)
    ).length;
    const completionRate = users.length > 0 ? Math.round((completedCount / users.length) * 100) : 0;
    console.log(`   📈 ${badge.name}: ${completedCount}/${users.length}名 (${completionRate}%)`);
  });
  
  // 全研修完了者数
  const allCompletedCount = users.filter(user => 
    user.completedTrainings.length === badges.length
  ).length;
  console.log(`   🎉 全研修完了者: ${allCompletedCount}名`);
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
    
    // 2. データ検証
    validateData(usersCSV, badgesCSV);
    
    // 3. データを変換
    const badges = convertBadges(badgesCSV);
    const users = convertUsers(usersCSV, badges);
    
    // 4. JSONファイルに保存
    console.log('💾 JSONファイルに保存中...');
    saveJSON(users, './src/data/users.json', 'users');
    saveJSON(badges, './src/data/badges.json', 'badges');
    
    // 5. 統計情報表示
    showStatistics(users, badges);
    
    console.log('');
    console.log('🎉 変換完了！');
    console.log('');
    console.log('🚀 次のコマンドでサイトを確認できます:');
    console.log('   npm start');
    console.log('');
    console.log('💡 受講済み判定される文字: 1, １, ○, 済, 完了, OK, YES, Y');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

// スクリプト実行
main();