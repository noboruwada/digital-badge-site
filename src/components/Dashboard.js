import React from 'react';
import BadgeCard from './BadgeCard';
import badgesData from '../data/badges.json';

const Dashboard = ({ user }) => {
  // 取得済みバッジ
  const availableBadges = badgesData.badges.filter(badge => 
    user.completedTrainings.includes(badge.id)
  );

  // 未取得バッジ
  const pendingBadges = badgesData.badges.filter(badge => 
    !user.completedTrainings.includes(badge.id)
  );

  return (
    <div className="dashboard">
      <h2>📋 {user.name}さんのデジタルバッジ</h2>
      
      <section>
        <h3>🏆 取得済みバッジ ({availableBadges.length}個)</h3>
        {availableBadges.length > 0 ? (
          <div className="badge-grid">
            {availableBadges.map(badge => (
              <BadgeCard 
                key={badge.id} 
                badge={badge} 
                available={true}
              />
            ))}
          </div>
        ) : (
          <p style={{color: '#666', fontStyle: 'italic'}}>
            まだ取得したバッジがありません。研修を受講してバッジを獲得しましょう！
          </p>
        )}
      </section>

      <section>
        <h3>⏳ 未取得バッジ ({pendingBadges.length}個)</h3>
        {pendingBadges.length > 0 ? (
          <div className="badge-grid">
            {pendingBadges.map(badge => (
              <BadgeCard 
                key={badge.id} 
                badge={badge} 
                available={false}
              />
            ))}
          </div>
        ) : (
          <p style={{color: '#28a745', fontWeight: 'bold'}}>
            🎉 おめでとうございます！全てのバッジを取得済みです！
          </p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;