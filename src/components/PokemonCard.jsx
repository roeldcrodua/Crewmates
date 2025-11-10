import React from 'react';
import './PokemonCard.css';

const PokemonCard = ({ pokemon, onHover, onLeave }) => {
  return (
    <div 
      className="pokemon-card"
      onMouseEnter={() => onHover(pokemon)}
      onMouseLeave={onLeave}
    >
      <img 
        src={pokemon.imageUrl} 
        alt={pokemon.name}
        loading="lazy"
      />
    </div>
  );
};

export default PokemonCard;
