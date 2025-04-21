import WatchedListItem from "./WatchedListItem";

function WatchedList({ watched, onRemoveWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedListItem
          key={movie.imdbID}
          movie={movie}
          onRemoveWatched={onRemoveWatched}
        />
      ))}
    </ul>
  );
}

export default WatchedList;
