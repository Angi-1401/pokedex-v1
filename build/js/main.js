const API_URL = "https://pokeapi.co/api/v2/pokemon/"; // PokeApi
const LIMIT = 50; // Limit per page
let offset = 0; // Initial offset

// DOM Elements
const pokedexContainer = document.getElementById("pokedex");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const firstBtn = document.getElementById("first");
const lastBtn = document.getElementById("last");

// Type icons mapping
const typeIcons = {
  bug: "./assets/pkmn-types/bug.svg",
  dark: "./assets/pkmn-types/dark.svg",
  dragon: "./assets/pkmn-types/dragon.svg",
  electric: "./assets/pkmn-types/electric.svg",
  fairy: "./assets/pkmn-types/fairy.svg",
  fighting: "./assets/pkmn-types/fighting.svg",
  fire: "./assets/pkmn-types/fire.svg",
  flying: "./assets/pkmn-types/flying.svg",
  ghost: "./assets/pkmn-types/ghost.svg",
  grass: "./assets/pkmn-types/grass.svg",
  ground: "./assets/pkmn-types/ground.svg",
  ice: "./assets/pkmn-types/ice.svg",
  normal: "./assets/pkmn-types/normal.svg",
  poison: "./assets/pkmn-types/poison.svg",
  psychic: "./assets/pkmn-types/psychic.svg",
  rock: "./assets/pkmn-types/rock.svg",
  steel: "./assets/pkmn-types/steel.svg",
  water: "./assets/pkmn-types/water.svg",
};

/**
 * Fetches a list of Pokémon using the PokeAPI.
 *
 * @param {number} offset The starting index of the Pokémon to fetch.
 * @param {number} limit The number of Pokémon to fetch.
 * @returns {Promise<Pokemon[]>} A promise that resolves with a list of Pokémon.
 */
const fetchPokemon = async (offset, limit) => {
  try {
    const response = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return [];
  }
};

/**
 * Fetches a Pokémon's details using the PokeAPI.
 *
 * @param {string} url The URL of the Pokémon to fetch.
 * @returns {Promise<PokemonDetails>} A promise that resolves with the Pokémon's details.
 */
const fetchPokemonDetails = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    return null;
  }
};

/**
 * Renders Pokémon cards and inserts them into the pokedex container.
 *
 * @param {Array} pokemonList - List of Pokémon objects with URLs to fetch details.
 * @returns {Promise<void>} - A promise that resolves when all Pokémon details are fetched and rendered.
 */
const renderPokemon = async (pokemonList) => {
  const pokemonDetails = await Promise.all(
    pokemonList.map((pokemon) => fetchPokemonDetails(pokemon.url))
  );

  const cards = pokemonDetails
    .filter((details) => details !== null)
    .map((details) => {
      const typeImages = details.types // Get the types of the current Pokémon
        .map((typeInfo) => {
          const typeName = typeInfo.type.name; // Get the type name
          const iconPath = typeIcons[typeName]; // Get the icon path
          return iconPath
            ? `<img src="${iconPath}" alt="${typeName}" class="w-4 h-4" />` // Render the icon
            : ""; // Return an empty string if the icon path is not found
        })
        .join("");

      // Pokédex card
      return `
        <div
          class="relative flex flex-row md:flex-col items-center p-4 border-none rounded-lg hover:bg-gray-100">
          <p class="absolute top-2 right-2 text-sm text-gray-400 font-light">
            #${details.id}
          </p>
          <div class="w-24 h-24 flex justify-center items-center">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/${
                details.id
              }.png"
              alt="${details.name}"
              class="object-cover max-w-24 max-h-24" />
          </div>
          <div class="flex flex-col items-center leading-normal w-full">
            <h2 class="font-bold text-lg text-red-500 whitespace-nowrap">
              ${details.name.toUpperCase()}
            </h2>
            <div class="flex items-center gap-2">${typeImages}</div>
          </div>
        </div>	
      `;
    });

  pokedexContainer.innerHTML = cards.join(""); // Insert the cards into the pokedex container
};

/**
 * Loads a list of Pokémon and renders them to the page.
 *
 * @returns {Promise<void>} A promise that resolves when the Pokémon have been rendered.
 */
const loadPokemon = async () => {
  const pokemonList = await fetchPokemon(offset, LIMIT);
  await renderPokemon(pokemonList);
};

// Event listeners for pagination

prevBtn.addEventListener("click", () => {
  if (offset >= LIMIT) {
    offset -= LIMIT;
    loadPokemon();
  }
});

nextBtn.addEventListener("click", () => {
  offset += LIMIT;
  loadPokemon();
});

firstBtn.addEventListener("click", () => {
  offset = 0;
  loadPokemon();
});

lastBtn.addEventListener("click", () => {
  offset = 975;
  loadPokemon();
});

// Initial load
loadPokemon();
