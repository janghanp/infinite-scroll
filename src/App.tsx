import { useState, useRef, useCallback, useEffect } from "react";
import { PropagateLoader } from "react-spinners";

import usePokemon from "./usePokemon";

function App() {
  const [pageNumber, setPageNumber] = useState<number>(1);

  const observerRef = useRef<IntersectionObserver>();

  const { pokemons, isLoading, error } = usePokemon(pageNumber);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (!node) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("Fetch data");
          setPageNumber((prevState) => prevState + 1);
        }
      },
      { threshold: 1 }
    );

    if (node) {
      observerRef.current.observe(node);
      console.log('set new last element')
    }
  }, []);

  return (
    <div className="container mx-auto text-center min-h-screen">
      <button
        className="border rounded-md p-2 bg-gray-200"
        onClick={() => setPageNumber((prevState) => prevState + 1)}
      >
        Fetch data
      </button>
      {pokemons.map((pokemon, index) => {
        if (index + 1 === pokemons.length) {
          //lastElement
          return (
            <div
              key={index}
              ref={lastElementRef}
              className="flex flex-col items-center justify-center"
            >
              <img src={pokemon.image} alt={pokemon.name} />
              <span>{pokemon.name}</span>
            </div>
          );
        } else {
          return (
            <div
              key={pokemon.name}
              className="flex flex-col items-center justify-center"
            >
              <img src={pokemon.image} alt={pokemon.name} />
              <span>{pokemon.name}</span>
            </div>
          );
        }
      })}
      {isLoading && (
        <div className="mt-5">
          <PropagateLoader />
        </div>
      )}
      {error && <div className="text-red-500 text-sm">Error...</div>}
    </div>
  );
}

export default App;
