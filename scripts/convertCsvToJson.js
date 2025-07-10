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
    // ファイル名の取得と拡張子の確認
    let filename = csvBadge.filename || `${csvBadge.id}.png`;
    
    // 拡張子がない場合は .png を追加
    if (!filename.toLowerCase().endsWith('.png') && 
        !filename.toLowerCase().endsWith('.jpg') && 
        !filename.toLowerCase().endsWith('.jpeg')) {
      filename = filename + '.png';
    }
    
    console.log(`バッジ ${csvBadge.id}: ${filename}`); // デバッグ用
    
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