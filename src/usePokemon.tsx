import { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Pokemon {
  name: string;
  image: string;
}

const usePokemon = (pageNumber: number) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    axios
      .get("https://pokeapi.co/api/v2/pokemon", {
        params: {
          limit: 20,
          offset: (pageNumber - 1) * 20,
        },
      })
      .then(async (res) => {
        const pokemonsNameAndImage: Pokemon[] = [];

        for (const result of res.data.results) {
          let pokemon: Pokemon = { name: "", image: "" };

          await axios.get(result.url).then((res) => {
            pokemon.name = result.name;
            pokemon.image = res.data.sprites.front_default;

            pokemonsNameAndImage.push(pokemon);
          });
        }
        setPokemons((prevState) => [...prevState, ...pokemonsNameAndImage]);

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  }, [pageNumber]);

  return { pokemons, isLoading, error };
};

export default usePokemon;
