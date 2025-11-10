import React, { useEffect, useState } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [crewmates, setCrewmates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrewmates();

    // Listen for crew updates from other components
    const handleCrewUpdate = () => {
      fetchCrewmates();
    };

    window.addEventListener('crewUpdated', handleCrewUpdate);
    
    return () => {
      window.removeEventListener('crewUpdated', handleCrewUpdate);
    };
  }, []);

  const fetchCrewmates = async () => {
    try {
      const { data, error } = await supabase
        .from('pokemon')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCrewmates(data || []);
    } catch (error) {
      console.error('Error fetching crewmates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🌟 My Crew</h2>
        <button onClick={fetchCrewmates} className="refresh-sidebar-btn">
          ↻
        </button>
      </div>
      
      {loading ? (
        <p className="sidebar-loading">Loading crew...</p>
      ) : crewmates.length === 0 ? (
        <p className="sidebar-empty">No crewmates yet!</p>
      ) : (
        <div className="sidebar-list">
          {crewmates.map((hero) => (
            <Link 
              key={hero.pokemon_id} 
              to={`/hero/${hero.pokemon_id}`}
              className="sidebar-item"
            >
              <img 
                src={hero.avatar_small_url || hero.avatar_big_url} 
                alt={hero.display_name}
              />
              <div className="sidebar-item-info">
                <span className="sidebar-item-name">{hero.display_name}</span>
                <span className="sidebar-item-original">({hero.pokemon_name})</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
