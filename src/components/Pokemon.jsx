import React, { useEffect, useState } from 'react';

const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const API = 'https://pokeapi.co/api/v2/pokemon?limit=124';

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      const detailedPokemonData = data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const data = await res.json();
        return data;
      });
      const detailedResponses = await Promise.all(detailedPokemonData);
      setPokemon(detailedResponses);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const searchData = pokemon.filter((pokemon) => pokemon.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }

  return (
    <section className="container">
      <header>
        <h2 className="title">Let's Catch Pokémon</h2>
      </header>
      <div className='pokemon-search'>
       <input type="text" placeholder='Search Any Pokemon' value={search} onChange={(e) => setSearch(e.target.value)}/>
      </div>
      <div className="cards-grid">
        {searchData.map((curpokemon) => (
          <div key={curpokemon.id} className="card">
            <h3>{curpokemon.name}</h3>
            <img src={curpokemon.sprites.front_default} alt={curpokemon.name} />

            {/* Stats in a row format */}
            <div className="stats">
              <div className="stat-row">
                <p>Weight: {curpokemon.weight}</p>
                <p>Height: {curpokemon.height}</p>
                <p>Speed: {curpokemon.stats[0].base_stat}</p>
              </div>
              <div className="stat-row">
                <p>Attack: {curpokemon.stats[1]?.base_stat}</p>
                <p>Experience: {curpokemon.base_experience}</p>
                <p>Ability: {curpokemon.abilities[0]?.ability.name}</p>
              </div>
            </div>

            {/* Type in circle */}
            <div className="type">
              <p>{curpokemon.types.map((type) => type.type.name).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pokemon;
