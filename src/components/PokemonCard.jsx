import React from 'react';
import './PokemonCard.css';

const PokemonCard = ({ pokemon, onClick }) => {
  return (
    <div 
      className="pokemon-card"
      onClick={() => onClick(pokemon)}
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
