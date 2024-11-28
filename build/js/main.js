const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const LIMIT = 50;
let offset = 0;

const pokedexContainer = document.getElementById("pokedex");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const firstBtn = document.getElementById("first");
const lastBtn = document.getElementById("last");

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

const fetchPokemonDetails = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    return null;
  }
};

const renderPokemon = async (pokemonList) => {
  const pokemonDetails = await Promise.all(
    pokemonList.map((pokemon) => fetchPokemonDetails(pokemon.url))
  );

  const cards = pokemonDetails
    .filter((details) => details !== null)
    .map((details) => {
      const typeImages = details.types
        .map((typeInfo) => {
          const typeName = typeInfo.type.name;
          const iconPath = typeIcons[typeName];
          return iconPath
            ? `<img src="${iconPath}" alt="${typeName}" class="w-4 h-4" />`
            : "";
        })
        .join("");

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

  pokedexContainer.innerHTML = cards.join("");
};

const loadPokemon = async () => {
  const pokemonList = await fetchPokemon(offset, LIMIT);
  await renderPokemon(pokemonList);
};

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

loadPokemon();

/*
 */
