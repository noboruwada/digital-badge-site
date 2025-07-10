import React from 'react';

const BadgeCard = ({ badge, available }) => {
  const handleDownload = async () => {
    if (!available) return;
    
    try {
      console.log('ダウンロード開始 - ファイルパス:', badge.file);
      
      // ファイルパスの確認と修正
      let filePath = badge.file;
      
      // パスが正しく始まっているか確認
      if (!filePath.startsWith('/')) {
        filePath = '/' + filePath;
      }
      
      // 拡張子がない場合は .png を追加
      if (!filePath.toLowerCase().includes('.png') && 
          !filePath.toLowerCase().includes('.jpg') && 
          !filePath.toLowerCase().includes('.jpeg')) {
        filePath = filePath + '.png';
      }
      
      console.log('修正されたファイルパス:', filePath);
      
      // ファイルの取得
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`ファイルが見つかりません: ${response.status} - ${filePath}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('HTMLページが返されました。ファイルパスを確認してください。');
      }
      
      const blob = await response.blob();
      console.log('ファイルサイズ:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        throw new Error('ファイルが空です');
      }
      
      // ダウンロード処理
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // ファイル名の取得（拡張子を含む）
      const actualFileName = filePath.split('/').pop();
      link.download = `修了証_${actualFileName}`;
      
      console.log('ダウンロードファイル名:', link.download);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      console.log('ダウンロード完了');
      
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
      
      {/* デバッグ用：ファイルパス表示 */}
      <div style={{fontSize: '10px', color: '#666', marginBottom: '5px'}}>
        パス: {badge.file}
      </div>
      
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