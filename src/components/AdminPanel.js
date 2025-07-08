import React from 'react';
import usersData from '../data/users.json';
import badgesData from '../data/badges.json';

const AdminPanel = () => {
  const totalUsers = usersData.users.length;
  const totalBadges = badgesData.badges.length;
  
  // 統計情報の計算
  const getCompletionStats = () => {
    return badgesData.badges.map(badge => {
      const completedCount = usersData.users.filter(user => 
        user.completedTrainings.includes(badge.id)
      ).length;
      
      return {
        badgeName: badge.name,
        completed: completedCount,
        percentage: Math.round((completedCount / totalUsers) * 100)
      };
    });
  };

  const completionStats = getCompletionStats();

  return (
    <div className="admin-panel">
      <h2>⚙️ 管理者ダッシュボード</h2>
      
      {/* 概要統計 */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        <div style={{background: '#e3f2fd', padding: '20px', borderRadius: '10px', textAlign: 'center'}}>
          <h3 style={{margin: '0 0 10px 0', color: '#1976d2'}}>👥 総ユーザー数</h3>
          <p style={{fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#1976d2'}}>{totalUsers}</p>
        </div>
        <div style={{background: '#f3e5f5', padding: '20px', borderRadius: '10px', textAlign: 'center'}}>
          <h3 style={{margin: '0 0 10px 0', color: '#7b1fa2'}}>🏆 総バッジ数</h3>
          <p style={{fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#7b1fa2'}}>{totalBadges}</p>
        </div>
      </div>

      {/* バッジ取得状況 */}
      <section>
        <h3>📊 バッジ取得状況</h3>
        <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '10px'}}>
          {completionStats.map(stat => (
            <div key={stat.badgeName} style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <span style={{fontWeight: 'bold'}}>{stat.badgeName}</span>
                <span>{stat.completed}/{totalUsers} ({stat.percentage}%)</span>
              </div>
              <div style={{background: '#e9ecef', height: '8px', borderRadius: '4px', overflow: 'hidden'}}>
                <div 
                  style={{
                    background: '#28a745', 
                    height: '100%', 
                    width: `${stat.percentage}%`,
                    transition: 'width 0.3s ease'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ユーザー一覧 */}
      <section>
        <h3>👥 ユーザー一覧</h3>
        <div className="user-list">
          {usersData.users.map(user => (
            <div key={user.email} className="user-item">
              <h4>👤 {user.name}</h4>
              <p><strong>📧 Email:</strong> {user.email}</p>
              <p><strong>🏆 取得バッジ:</strong> {user.completedTrainings.length}/{totalBadges}</p>
              <p><strong>📋 取得済み研修:</strong> 
                {user.completedTrainings.length > 0 ? (
                  user.completedTrainings.map(trainingId => {
                    const badge = badgesData.badges.find(b => b.id === trainingId);
                    return badge ? badge.name : trainingId;
                  }).join(', ')
                ) : (
                  <span style={{color: '#6c757d', fontStyle: 'italic'}}>なし</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* パスワード一覧 */}
      <section>
        <h3>🔑 研修パスワード一覧</h3>
        <div style={{background: '#fff3cd', padding: '20px', borderRadius: '10px', border: '1px solid #ffeaa7'}}>
          <p style={{color: '#856404', marginBottom: '15px'}}>
            ⚠️ 以下のパスワードは社員への研修案内時に使用してください
          </p>
          {badgesData.badges.map(badge => (
            <div key={badge.id} style={{marginBottom: '10px', padding: '10px', background: 'white', borderRadius: '5px'}}>
              <strong>{badge.name}:</strong> 
              <code style={{background: '#f8f9fa', padding: '2px 6px', marginLeft: '10px', borderRadius: '3px'}}>
                {badge.password}
              </code>
            </div>
          ))}
          <div style={{marginTop: '10px', padding: '10px', background: 'white', borderRadius: '5px'}}>
            <strong>管理者パスワード:</strong> 
            <code style={{background: '#f8f9fa', padding: '2px 6px', marginLeft: '10px', borderRadius: '3px'}}>
              admin2024
            </code>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;