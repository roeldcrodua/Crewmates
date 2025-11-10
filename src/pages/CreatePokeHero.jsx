import React, { useState, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard';
import PokemonPopup from '../components/PokemonPopup';
import Sidebar from '../components/Sidebar';
import { supabase } from '../client';
import './CreatePokeHero.css';

const TOTAL_POKEMON = 600; // Total number of Pokemon to fetch from
const GRID_ROWS = 20;
const GRID_COLS = 30;
const TOTAL_CELLS = GRID_ROWS * GRID_COLS;

const CreatePokeHero = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPokemon, setHoveredPokemon] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [selectedFields, setSelectedFields] = useState({
    id: true,
    name: true,
    types: true,
    abilities: true,
    artwork: true,
    frontGif: true,
    backGif: true
  });
  const [sortMode, setSortMode] = useState('random');

  useEffect(() => {
    loadPokemon();
  }, [sortMode]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClosePopup();
      }
    };

    if (hoveredPokemon) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [hoveredPokemon]);

  const loadPokemon = async () => {
    setLoading(true);
    try {
      let ids;
      
      if (sortMode === 'random') {
        ids = generateRandomIds(TOTAL_CELLS, TOTAL_POKEMON);
      } else if (sortMode === 'id-asc') {
        ids = Array.from({ length: TOTAL_CELLS }, (_, i) => i + 1);
      } else if (sortMode === 'id-desc') {
        ids = Array.from({ length: TOTAL_CELLS }, (_, i) => TOTAL_CELLS - i);
      } else if (sortMode === 'name-asc' || sortMode === 'name-desc') {
        // For name sorting, generate random IDs first, then sort by name
        ids = generateRandomIds(TOTAL_CELLS, TOTAL_POKEMON);
      }

      const promises = ids.map(id => fetchPokemonData(id));
      const results = await Promise.all(promises);
      
      let pokemonData = results.filter(p => p !== null);
      
      if (sortMode === 'name-asc') {
        pokemonData.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortMode === 'name-desc') {
        pokemonData.sort((a, b) => b.name.localeCompare(a.name));
      }
      
      setPokemonList(pokemonData);
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomIds = (count, max) => {
    const ids = new Set();
    while (ids.size < count) {
      ids.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(ids);
  };

  const fetchPokemonData = async (id) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      
      return {
        id: data.id,
        name: data.name,
        imageUrl: data.sprites.other.home.front_default,
        artwork: data.sprites.other["official-artwork"]?.front_shiny || 
                 data.sprites.other["official-artwork"]?.front_default,
        frontGif: data.sprites.other.showdown?.front_shiny || 
                  data.sprites.other.showdown?.front_default,
        backGif: data.sprites.other.showdown?.back_shiny || 
                 data.sprites.other.showdown?.back_default,
        types: data.types.map(t => t.type.name),
        abilities: data.abilities.map(a => a.ability.name),
        smallUrl: data.sprites.front_default
      };
    } catch (error) {
      console.error(`Error fetching Pokemon ${id}:`, error);
      return null;
    }
  };

  const handleMouseEnter = (pokemon, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const popupWidth = 500; // max-width from CSS
    const popupHeight = 600; // estimated max height
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let x = rect.right + 10;
    let y = rect.top;
    
    // Check if popup would go off the right edge
    if (x + popupWidth > viewportWidth - 20) {
      // Position to the left of the card instead
      x = rect.left - popupWidth - 10;
      
      // If still off screen on the left, position within viewport
      if (x < 20) {
        x = viewportWidth - popupWidth - 20;
      }
    }
    
    // Check if popup would go off the bottom edge
    if (y + popupHeight > viewportHeight - 20) {
      // Position so bottom aligns with viewport
      y = viewportHeight - popupHeight - 20;
      
      // Make sure it's not off the top
      if (y < 20) {
        y = 20;
      }
    }
    
    // Make sure popup doesn't go off the top
    if (y < 20) {
      y = 20;
    }
    
    setHoveredPokemon(pokemon);
    setPopupPosition({ x, y });
  };

  const handleMouseLeave = () => {
    // Don't immediately close - let user interact with popup
  };

  const handleClosePopup = () => {
    setHoveredPokemon(null);
  };

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleAddToCrew = async () => {
    if (!hoveredPokemon) return;

    try {
      const heroData = {
        pokemon_id: hoveredPokemon.id,
        pokemon_name: selectedFields.name ? hoveredPokemon.name : '',
        display_name: hoveredPokemon.name,
        avatar_big_url: selectedFields.imageUrl ? hoveredPokemon.imageUrl : '',
        gif_front_url: selectedFields.frontGif ? hoveredPokemon.frontGif : '',
        gif_back_url: selectedFields.backGif ? hoveredPokemon.backGif : '',
        avatar_small_url: hoveredPokemon.smallUrl,
        types: selectedFields.types ? hoveredPokemon.types : [],
        abilities: selectedFields.abilities ? hoveredPokemon.abilities : []
      };

      const { error } = await supabase
        .from('pokemon')
        .insert([heroData]);

      if (error) throw error;

      alert(`${hoveredPokemon.name} added to your crew!`);
      setHoveredPokemon(null);
      
      // Refresh sidebar by triggering a re-render
      window.dispatchEvent(new Event('crewUpdated'));
    } catch (error) {
      console.error('Error adding to crew:', error);
      alert('Failed to add Pokemon to crew. Please try again.');
    }
  };

  return (
    <div className="create-page">
      <div className="main-content">
        <div className="controls">
          <h2>Discover Pokemon</h2>
          <div className="control-buttons">
            <button 
              onClick={loadPokemon} 
              className={`control-btn ${sortMode === 'random' ? 'active' : ''}`}
              disabled={loading}
            >
              🔄 Refresh Random
            </button>
            <button 
              onClick={() => setSortMode('id-asc')}
              className={`control-btn ${sortMode === 'id-asc' ? 'active' : ''}`}
            >
              #️⃣ ID Ascending
            </button>
            <button 
              onClick={() => setSortMode('id-desc')}
              className={`control-btn ${sortMode === 'id-desc' ? 'active' : ''}`}
            >
              #️⃣ ID Descending
            </button>
            <button 
              onClick={() => setSortMode('name-asc')}
              className={`control-btn ${sortMode === 'name-asc' ? 'active' : ''}`}
            >
              🔤 Name A-Z
            </button>
            <button 
              onClick={() => setSortMode('name-desc')}
              className={`control-btn ${sortMode === 'name-desc' ? 'active' : ''}`}
            >
              🔤 Name Z-A
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading Pokemon...</p>
          </div>
        ) : (
          <div className="pokemon-grid">
            {pokemonList.map((pokemon) => (
              <div key={`${pokemon.id}-${Math.random()}`} onMouseEnter={(e) => handleMouseEnter(pokemon, e)}>
                <PokemonCard 
                  pokemon={pokemon}
                  onHover={() => {}}
                  onLeave={handleMouseLeave}
                />
              </div>
            ))}
          </div>
        )}

        {hoveredPokemon && (
          <PokemonPopup 
            pokemon={hoveredPokemon}
            position={popupPosition}
            selectedFields={selectedFields}
            onFieldToggle={handleFieldToggle}
            onAddToCrew={handleAddToCrew}
            onClose={handleClosePopup}
          />
        )}
      </div>

      <Sidebar />
    </div>
  );
};

export default CreatePokeHero;
