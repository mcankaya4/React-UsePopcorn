function Result({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length || "0"}</strong> results
    </p>
  );
}

export default Result;
