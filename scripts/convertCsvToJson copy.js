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
    if (csvUser['security-training'] === '○') {
      completedTrainings.push('security-training');
    }
    if (csvUser['compliance-training'] === '○') {
      completedTrainings.push('compliance-training');
    }
    if (csvUser['leadership-training'] === '○') {
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
  
  return csvBadges.map(csvBadge => ({
    id: csvBadge.id,
    name: csvBadge.name,
    file: `/assets/badges/${csvBadge.id}.png`,
    description: csvBadge.description,
    password: csvBadge.password
  }));
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