import { useEffect, useState } from "react";
import Box from "./component/Box";
import MovieList from "./component/MovieList";
import WatchedSummary from "./component/WatchedSummary";
import WatchedList from "./component/WatchedList";
import Logo from "./component/Logo";
import Search from "./component/Search";
import Result from "./component/Result";
import Navbar from "./component/Navbar";
import Main from "./component/Main";
import Loader from "./component/Loader";
import ErrorMessage from "./component/ErrorMessage";
import SelectedMovie from "./component/SelectedMovie";

const KEY = "625efcf7";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // const [watched, setWatched] = useState([]);
  // Todo: İlk render'da verileri localStorage içerisinden çekmek.
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue) || [];
  });

  // Todo: Tıklanan film zaten seçili olan film değil ise tanımla.
  // Todo: Yoksa tıklanan filmi kapat.
  function handleSelected(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  // Todo: Tıklanan filmi kapat.
  function handleCloseMovie() {
    setSelectedId(null);
  }

  // Todo: İzlenenler listesine film ekle.
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    handleCloseMovie();
  }

  // Todo: Filmi izlenenler listesinden kaldır.
  function handleRemoveWatched(id) {
    setWatched((watched) => watched.filter((item) => item.imdbID !== id));
  }

  // Todo: Localstorage'a verileri depolamak.
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  // Todo: fetch film effect
  useEffect(() => {
    // Todo: Gereksiz tarayıcı isteklerini tamamlamadan bitirmek için
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        // Todo: Loading bar'ı göster ve yüklemeyi başlat.
        setIsLoading(true);
        // Todo: Error'u sıfırlamamız gerekiyor.
        setError("");
        // Todo: controller'ı burada tanımlıyoruz.
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal },
        );

        if (!res.ok)
          throw new Error("Filmler yüklenirken birşeyler ters gitti!");

        const data = await res.json();
        // Todo: data.Response cevabı False ise hata mesajı göster.
        if (data.Response === "False") throw new Error("Film bulunamadı!");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        // Todo: Hata mesajını error state içerisine aktar.
        // Todo: Eğer abort error değilse aktarım yap.
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        // Todo: Loading bar'ı yok et.
        setIsLoading(false);
      }
    }

    // Todo: Arama 3 harften küçükse api'yi çalıştırma.
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // Todo: Yeni bir arama yaptığımızda açık olan selected filmi kapatıyoruz.
    handleCloseMovie();
    fetchMovies();

    // Todo: Clouse içerisinde abort ediyoruz.
    return function () {
      controller.abort();
    };

    // Todo: query değiştikçe useEffect asenkron şekilde tekrar çalışır.
  }, [query]);

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Result movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {/* Todo: isLoading varsa Loading barı göster. */}
          {isLoading && <Loader />}
          {/* Todo: error varsa ErrorMessajını göster. */}
          {error && <ErrorMessage message={error} />}
          {/* Todo: error ve isloading yoksa sonuçları göster. */}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelected={handleSelected} />
          )}
        </Box>

        <Box>
          {selectedId && (
            <SelectedMovie
              onCloseMovie={handleCloseMovie}
              selectedId={selectedId}
              onWatchedMovie={handleAddWatched}
              key={selectedId}
              watched={watched}
            />
          )}
          {!selectedId && (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onRemoveWatched={handleRemoveWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
