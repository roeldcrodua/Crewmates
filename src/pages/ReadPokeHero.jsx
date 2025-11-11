import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../client';
import './ReadPokeHero.css';

const ReadPokeHero = () => {
  const [crews, setCrews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchCrews();
  }, []);

  const fetchCrews = async () => {
    try {
      const { data, error } = await supabase
        .from('pokemon')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCrews(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching crews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (crewList) => {
    if (crewList.length === 0) {
      setStats({});
      return;
    }

    // Count types
    const typeCounts = {};
    const abilityCounts = {};
    
    crewList.forEach(crew => {
      if (crew.types && Array.isArray(crew.types)) {
        crew.types.forEach(type => {
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
      }
      
      if (crew.abilities && Array.isArray(crew.abilities)) {
        crew.abilities.forEach(ability => {
          abilityCounts[ability] = (abilityCounts[ability] || 0) + 1;
        });
      }
    });

    setStats({
      total: crewList.length,
      typeCounts,
      abilityCounts,
      mostCommonType: Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])[0],
      mostCommonAbility: Object.keys(abilityCounts).sort((a, b) => abilityCounts[b] - abilityCounts[a])[0]
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your crew...</p>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1>🌟 My Pokemon Crew Gallery 🌟</h1>
        <p className="gallery-count">Total crews: {crews.length}</p>
      </div>

      {stats.total > 0 && (
        <div className="stats-section">
          <h2>📊 Crew Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Most Common Type</h3>
              <p className="stat-value">{stats.mostCommonType || 'N/A'}</p>
              <p className="stat-detail">
                {stats.typeCounts && stats.mostCommonType 
                  ? `${stats.typeCounts[stats.mostCommonType]} Pokemon` 
                  : ''}
              </p>
            </div>
            
            <div className="stat-card">
              <h3>Type Distribution</h3>
              <div className="type-chart">
                {Object.entries(stats.typeCounts || {})
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([type, count]) => (
                    <div key={type} className="chart-bar">
                      <span className="chart-label">{type}</span>
                      <div className="chart-bar-fill" style={{ width: `${(count / stats.total) * 100}%` }}>
                        {count}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="stat-card">
              <h3>Top Abilities</h3>
              <div className="ability-list">
                {Object.entries(stats.abilityCounts || {})
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([ability, count]) => (
                    <div key={ability} className="ability-stat-item">
                      <span className="ability-stat-name">{ability}</span>
                      <span className="ability-stat-count">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {crews.length === 0 ? (
        <div className="empty-state">
          <h2>No Pokemon crews Yet!</h2>
          <p>Start building your crew by discovering Pokemon on the main page.</p>
          <Link to="/" className="cta-button">Discover Pokemon</Link>
        </div>
      ) : (
        <div className="crews-grid">
          {crews.map((crew) => (
            <Link 
              key={crew.pokemon_id} 
              to={`/crew/${crew.pokemon_id}`}
              className="crew-card"
            >
              <div className="crew-card-image">
                <img 
                  src={crew.avatar_big_url || crew.avatar_small_url} 
                  alt={crew.display_name}
                />
              </div>
              
              <div className="crew-card-content">
                <h3 className="crew-display-name">{crew.display_name}</h3>
                <p className="crew-original-name">({crew.pokemon_name})</p>
                
                {crew.types && crew.types.length > 0 && (
                  <div className="crew-types">
                    {crew.types.map((type, idx) => (
                      <span key={idx} className={`type-badge type-${type}`}>
                        {type}
                      </span>
                    ))}
                  </div>
                )}
                
                {crew.abilities && crew.abilities.length > 0 && (
                  <div className="crew-abilities">
                    {crew.abilities.slice(0, 2).map((ability, idx) => (
                      <span key={idx} className="ability-badge">
                        {ability}
                      </span>
                    ))}
                    {crew.abilities.length > 2 && (
                      <span className="ability-more">+{crew.abilities.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="crew-card-footer">
                <span className="view-details">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadPokeHero;
