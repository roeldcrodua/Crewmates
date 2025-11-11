import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import './EditPokeHero.css';

const EditPokeHero = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crew, setCrew] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [types, setTypes] = useState([]);
  const [abilities, setAbilities] = useState([]);
  
  // Form states
  const [newType, setNewType] = useState('');
  const [newAbility, setNewAbility] = useState('');
  const [deleteTypeInput, setDeleteTypeInput] = useState('');
  const [deleteAbilityInput, setDeleteAbilityInput] = useState('');
  const [editingType, setEditingType] = useState(null);
  const [editTypeValue, setEditTypeValue] = useState('');
  const [editingAbility, setEditingAbility] = useState(null);
  const [editAbilityValue, setEditAbilityValue] = useState('');

  useEffect(() => {
    fetchCrew();
  }, [id]);

  const fetchCrew = async () => {
    try {
      const { data, error } = await supabase
        .from('pokemon')
        .select('*')
        .eq('pokemon_id', id)
        .single();
      
      if (error) throw error;
      
      setCrew(data);
      setDisplayName(data.display_name || '');
      setTypes(data.types || []);
      setAbilities(data.abilities || []);
    } catch (error) {
      console.error('Error fetching crew:', error);
      alert('Failed to load Pokemon crew');
      navigate('/gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDisplayName = async () => {
    if (!displayName.trim()) {
      alert('Display name cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('pokemon')
        .update({ 
          display_name: displayName,
          updated_at: new Date().toISOString()
        })
        .eq('pokemon_id', id);
      
      if (error) throw error;
      
      alert('Display name updated successfully!');
      fetchCrew();
    } catch (error) {
      console.error('Error updating display name:', error);
      alert('Failed to update display name');
    }
  };

  const handleAddType = async () => {
    const trimmedType = newType.trim().toLowerCase();
    
    if (!trimmedType) {
      alert('Please enter a type');
      return;
    }

    if (types.includes(trimmedType)) {
      alert('This type already exists');
      return;
    }

    const updatedTypes = [...types, trimmedType];

    try {
      const { error } = await supabase
        .from('pokemon')
        .update({ 
          types: updatedTypes,
          updated_at: new Date().toISOString()
        })
        .eq('pokemon_id', id);
      
      if (error) throw error;
      
      setTypes(updatedTypes);
      setNewType('');
      alert('Type added successfully!');
    } catch (error) {
      console.error('Error adding type:', error);
      alert('Failed to add type');
    }
  };

  const handleDeleteType = async () => {
    const trimmedInput = deleteTypeInput.trim().toLowerCase();
    
    if (!trimmedInput) {
      alert('Please enter the exact type name to delete');
      return;
    }

    const typeIndex = types.findIndex(t => t.toLowerCase() === trimmedInput);
    
    if (typeIndex === -1) {
      alert('Type not found. Please check the spelling and case.');
      return;
    }

    const updatedTypes = types.filter((_, idx) => idx !== typeIndex);

    try {
      const { error } = await supabase
        .from('pokemon')
        .update({ 
          types: updatedTypes,
          updated_at: new Date().toISOString()
        })
        .eq('pokemon_id', id);
      
      if (error) throw error;
      
      setTypes(updatedTypes);
      setDeleteTypeInput('');
      alert('Type deleted successfully!');
    } catch (error) {
      console.error('Error deleting type:', error);
      alert('Failed to delete type');
    }
  };

  const handleEditType = (index) => {
    setEditingType(index);
    setEditTypeValue(types[index]);
  };

  const handleSaveEditType = async (index) => {
    const trimmedValue = editTypeValue.trim().toLowerCase();
    
    if (!trimmedValue) {
      alert('Type cannot be empty');
      return;
    }

    if (types.includes(trimmedValue) && types[index] !== trimmedValue) {
      alert('This type already exists');
      return;
    }

    const updatedTypes = [...types];
    updatedTypes[index] = trimmedValue;

    try {
      const { error } = await supabase
        .from('pokemon')
        .update({ 
          types: updatedTypes,
          updated_at: new Date().toISOString()
        })
        .eq('pokemon_id', id);
      
      if (error) throw error;
      
      setTypes(updatedTypes);
      setEditingType(null);
      setEditTypeValue('');
      alert('Type updated successfully!');
    } catch (error) {
      console.error('Error updating type:', error);
      alert('Failed to update type');
    }
  };

  const handleAddAbility = async () => {
    const trimmedAbility = newAbility.trim().toLowerCase();
    
    if (!trimmedAbility) {
      alert('Please enter an ability');
      return;
    }

    if (abilities.includes(trimmedAbility)) {
      alert('This ability already exists');
      return;
    }

    const updatedAbilities = [...abilities, trimmedAbility];

    try {
      const { error } = await supabase
        .from('pokemon')
        .update({ 
          abilities: updatedAbilities,
          updated_at: new Date().toISOString()
        })
        .eq('pokemon_id', id);
      
      if (error) throw error;
      
      setAbilities(updatedAbilities);
      setNewAbility('');
      alert('Ability added successfully!');
    } catch (error) {
      console.error('Error adding ability:', error);
      alert('Failed to add ability');
    }
  };

  const handleDeleteAbility = async () => {
    const trimmedInput = deleteAbilityInput.trim().toLowerCase();
    
    if (!trimmedInput) {
      alert('Please enter the exact ability name to delete');
      return;
    }

    const abilityIndex = abilities.findIndex(a => a.toLowerCase() === trimmedInput);
    
    if (abilityIndex === -1) {
      alert('Ability not found. Please check the spelling and case.');
      return;
    }

    const updatedAbilities = abilities.filter((_, idx) => idx !== abilityIndex);

    try {
      const { error } = await supabase
        .from('pokemon')
        .update({ 
          abilities: updatedAbilities,
          updated_at: new Date().toISOString()
        })
        .eq('pokemon_id', id);
      
      if (error) throw error;
      
      setAbilities(updatedAbilities);
      setDeleteAbilityInput('');
      alert('Ability deleted successfully!');
    } catch (error) {
      console.error('Error deleting ability:', error);
      alert('Failed to delete ability');
    }
  };

  const handleEditAbility = (index) => {
    setEditingAbility(index);
    setEditAbilityValue(abilities[index]);
  };

  const handleSaveEditAbility = async (index) => {
    const trimmedValue = editAbilityValue.trim().toLowerCase();
    
    if (!trimmedValue) {
      alert('Ability cannot be empty');
      return;
    }

    if (abilities.includes(trimmedValue) && abilities[index] !== trimmedValue) {
      alert('This ability already exists');
      return;
    }

    const updatedAbilities = [...abilities];
    updatedAbilities[index] = trimmedValue;

    try {
      const { error } = await supabase
        .from('pokemon')
        .update({ 
          abilities: updatedAbilities,
          updated_at: new Date().toISOString()
        })
        .eq('pokemon_id', id);
      
      if (error) throw error;
      
      setAbilities(updatedAbilities);
      setEditingAbility(null);
      setEditAbilityValue('');
      alert('Ability updated successfully!');
    } catch (error) {
      console.error('Error updating ability:', error);
      alert('Failed to update ability');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${crew.display_name} from your crew?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('pokemon')
        .delete()
        .eq('pokemon_id', id);
      
      if (error) throw error;
      
      alert('Pokemon crew deleted successfully!');
      navigate('/gallery');
    } catch (error) {
      console.error('Error deleting crew:', error);
      alert('Failed to delete Pokemon crew');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading crew details...</p>
      </div>
    );
  }

  if (!crew) {
    return <div className="error-message">crew not found</div>;
  }

  return (
    <div className="edit-page">
      <div className="edit-container">
        <div className="edit-header">
          <button onClick={() => navigate('/gallery')} className="back-btn">
            ← Back to Gallery
          </button>
          <h1>Pokemon Crew Details</h1>
        </div>

        <div className="crew-details">
          <div className="crew-image-section">
            <div className="image-gif-row">
              <div className="big-image">
                <img src={crew.avatar_big_url || crew.avatar_small_url} alt={crew.display_name} />
              </div>
              <div className="gif-container">
                {crew.avatar_big_url && (
                  <div className="gif-preview">
                    <label>Artwork</label>
                    <img src={crew.avatar_big_url} alt={`${crew.display_name} artwork`} />
                  </div>
                )}
                {crew.gif_front_url && (
                  <div className="gif-preview">
                    <label>Front</label>
                    <img src={crew.gif_front_url} alt={`${crew.display_name} front gif`} />
                  </div>
                )}
                {crew.gif_back_url && (
                  <div className="gif-preview">
                    <label>Back </label>
                    <img src={crew.gif_back_url} alt={`${crew.display_name} back gif`} />
                  </div>
                )}
              </div>
            </div>
            <div className="disabled-fields">
              <div className="info-group">
                <label>Pokemon ID (Cannot be modified)</label>
                <input type="text" value={crew.pokemon_id} disabled className="disabled-input" />
              </div>

              <div className="info-group">
                <label>Original Pokemon Name (Cannot be modified)</label>
                <input 
                  type="text" 
                  value={crew.pokemon_name} 
                  disabled 
                  className="disabled-input capitalized" 
                />
              </div>
            </div>
          </div>

          <div className="crew-info-section">
            <div className="info-group">
              <label>Display Name (Editable)</label>
              <div className="edit-field">
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="editable-input"
                />
                <button onClick={handleUpdateDisplayName} className="save-btn">
                  Save
                </button>
              </div>
            </div>

            <div className="info-group">
              <label>Types</label>
              <div className="list-container">
                {types.map((type, idx) => (
                  <div key={idx} className="list-item">
                    {editingType === idx ? (
                      <>
                        <input 
                          type="text"
                          value={editTypeValue}
                          onChange={(e) => setEditTypeValue(e.target.value)}
                          className="inline-edit-input"
                        />
                        <button onClick={() => handleSaveEditType(idx)} className="inline-save-btn">
                          ✓
                        </button>
                        <button onClick={() => setEditingType(null)} className="inline-cancel-btn">
                          ✗
                        </button>
                      </>
                    ) : (
                      <>
                        <span className={`type-badge type-${type}`}>{type}</span>
                        <button onClick={() => handleEditType(idx)} className="edit-item-btn">
                          ✎
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="actions-row">
                <div className="action-group">
                  <h4>Add Type</h4>
                  <div className="edit-field">
                    <input 
                      type="text"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      placeholder="Enter new type"
                      className="editable-input"
                    />
                    <button onClick={handleAddType} className="add-btn">
                      Add
                    </button>
                  </div>
                </div>

                <div className="action-group">
                  <h4>Delete Type</h4>
                  <div className="edit-field">
                    <input 
                      type="text"
                      value={deleteTypeInput}
                      onChange={(e) => setDeleteTypeInput(e.target.value)}
                      placeholder="Type exact name to delete"
                      className="editable-input"
                    />
                    <button onClick={handleDeleteType} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-group">
              <label>Abilities</label>
              <div className="list-container">
                {abilities.map((ability, idx) => (
                  <div key={idx} className="list-item">
                    {editingAbility === idx ? (
                      <>
                        <input 
                          type="text"
                          value={editAbilityValue}
                          onChange={(e) => setEditAbilityValue(e.target.value)}
                          className="inline-edit-input"
                        />
                        <button onClick={() => handleSaveEditAbility(idx)} className="inline-save-btn">
                          ✓
                        </button>
                        <button onClick={() => setEditingAbility(null)} className="inline-cancel-btn">
                          ✗
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="ability-badge">{ability}</span>
                        <button onClick={() => handleEditAbility(idx)} className="edit-item-btn">
                          ✎
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="actions-row">
                <div className="action-group">
                  <h4>Add Ability</h4>
                  <div className="edit-field">
                    <input 
                      type="text"
                      value={newAbility}
                      onChange={(e) => setNewAbility(e.target.value)}
                      placeholder="Enter new ability"
                      className="editable-input"
                    />
                    <button onClick={handleAddAbility} className="add-btn">
                      Add
                    </button>
                  </div>
                </div>

                <div className="action-group">
                  <h4>Delete Ability</h4>
                  <div className="edit-field">
                    <input 
                      type="text"
                      value={deleteAbilityInput}
                      onChange={(e) => setDeleteAbilityInput(e.target.value)}
                      placeholder="Type exact name to delete"
                      className="editable-input"
                    />
                    <button onClick={handleDeleteAbility} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <p>Once you delete this Pokemon crew, there is no going back.</p>
              <button onClick={handleDelete} className="delete-crew-btn">
                Delete This Pokemon crew
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPokeHero;
