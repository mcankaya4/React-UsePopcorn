import MovieListItem from "./MovieListItem";

function MovieList({ movies, onSelected, onCloseMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <MovieListItem
          key={movie.imdbID}
          movie={movie}
          onSelected={onSelected}
        />
      ))}
    </ul>
  );
}

export default MovieList;
