import { useState, useRef, useEffect } from "react";
import { PropagateLoader } from "react-spinners";

import usePokemon from "./usePokemon";

function App() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [lastElement, setLastElement] = useState<any>();

  const { pokemons, isLoading, error } = usePokemon(pageNumber);

  const observerRef = useRef(
    new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          //load more data
          console.log("load data");
          setPageNumber((prevState) => prevState + 1);
        }
      },
      { threshold: 1 }
    )
  );

  useEffect(() => {
    if (lastElement) {
      observerRef.current.unobserve(lastElement);
    }
  }, [pageNumber]);

  useEffect(() => {
    if (lastElement) {
      observerRef.current.observe(lastElement);
    }
  }, [lastElement]);

  return (
    <div className="container mx-auto text-center min-h-screen">
      {pokemons.map((pokemon, index) => {
        if (index + 1 === pokemons.length) {
          //lastElement
          return (
            <div
              key={index}
              ref={setLastElement}
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
    </div>
  );
}

export default App;
