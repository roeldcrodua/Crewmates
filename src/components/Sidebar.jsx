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
          {crewmates.map((crew) => (
            <Link 
              key={crew.pokemon_id} 
              to={`/crew/${crew.pokemon_id}`}
              className="sidebar-item"
            >
              <img 
                src={crew.avatar_small_url || crew.avatar_big_url} 
                alt={crew.display_name}
              />
              <div className="sidebar-item-info">
                <span className="sidebar-item-name">{crew.display_name}</span>
                <span className="sidebar-item-original">({crew.pokemon_name})</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
