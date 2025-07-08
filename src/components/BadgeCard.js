import React from 'react';

const BadgeCard = ({ badge, available }) => {
  const handleDownload = () => {
    if (!available) return;
    
    // バッジファイルをダウンロード
    const link = document.createElement('a');
    link.href = badge.file;
    link.download = `${badge.name.replace(/\s+/g, '_')}_badge.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeIcon = (badgeId) => {
    switch(badgeId) {
      case 'security-training': return '🔒';
      case 'compliance-training': return '⚖️';
      case 'leadership-training': return '👑';
      default: return '🏆';
    }
  };

  return (
    <div className={`badge-card ${available ? 'available' : 'unavailable'}`}>
      <div className="badge-icon">
        {getBadgeIcon(badge.id)}
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