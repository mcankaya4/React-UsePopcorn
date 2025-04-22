import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";
const KEY = "625efcf7";

function SelectedMovie({ selectedId, onCloseMovie, onWatchedMovie, watched }) {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [movieLoading, setMovieLoading] = useState(false);
  const [rating, setRating] = useState(0);

  // Todo: Render'da yenilenmeyen ve kaldığı yerden devam eden değişken
  // Todo: useRef'ler sadece useEffect ile değiştirilebilir.
  const countRef = useRef(0);

  // Todo: Kararsızlık tıklamasını ölçen effect
  useEffect(() => {
    // Todo: Bu koşulu yapmazsak başlar başlamaz 2 defa zaten çalışır.
    if (rating) countRef.current++;
  }, [rating]);

  const isWatched = watched?.find((movie) => movie.imdbID === selectedId);

  // Todo: Selected movie içerisinde kullanacağımız değişkenleri aktarıyoruz.
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = selectedMovie;

  // Todo: Detaylı film aramasını yapan fetch
  useEffect(() => {
    async function fetchMovie() {
      setMovieLoading(true);

      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
      );
      if (!res.ok) return;

      const data = await res.json();
      setSelectedMovie(data);
      setMovieLoading(false);
    }
    fetchMovie();
  }, [selectedId]);

  // Todo: Dinamik title seçimi ->>>> EFSANE!!!!
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    // Todo: Burası "cleanup" fonksiyondur.
    // Todo: Eğer bir title yoksa varsayılana dönsün.
    return function () {
      document.title = `usePopcorn`;
    };
  }, [title]);

  // Todo: ESC ile semiçi iptal etmek
  // Todo: Klavye olaylarını bu şekilde ele alacağız.
  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    }
    document.addEventListener("keydown", callback);

    // Todo: Olayın sadece 1 defa çalışması için temizlenmesi gerekir.
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [onCloseMovie]);

  function handleAddMovie() {
    const movie = {
      imdbID: selectedId,
      Title: title,
      Year: year,
      Poster: poster,
      imdbRating: +imdbRating,
      runtime: +runtime.split(" ").at(0),
      userRating: rating,
      countRaring: countRef.current,
    };
    onWatchedMovie(movie);
  }

  return movieLoading ? (
    <Loader />
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          &larr;
        </button>
        <img src={poster} alt={`Poster of ${title} movie.`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span> {imdbRating} IMDb rating
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              <StarRating
                maxRating={10}
                rating={rating}
                setRating={setRating}
              />
              {rating > 0 && (
                <button className="btn-add" onClick={handleAddMovie}>
                  + Add to list
                </button>
              )}
            </>
          ) : (
            <p>
              The score you gave this movie &rarr; <span>⭐</span>
              {isWatched.userRating}
            </p>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

export default SelectedMovie;
