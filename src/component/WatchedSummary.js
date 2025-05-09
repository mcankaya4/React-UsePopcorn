const average = (arr = []) => arr.reduce((acc, cur) => acc + cur / arr.length, 0);

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched?.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched?.map((movie) => movie.userRating));
  const avgRuntime = average(watched?.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched?.length || 0} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating?.toFixed(2) || 0}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating?.toFixed(2) || 0}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime?.toFixed(2) || 0} min</span>
        </p>
      </div>
    </div>
  );
}

export default WatchedSummary;
