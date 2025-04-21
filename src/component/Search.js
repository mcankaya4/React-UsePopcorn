import { useEffect, useRef } from "react";

function Search({ query, setQuery }) {
  // Todo: Manuel dom manipülasyonu fakat bunu ref'le yapacağız.
  // useEffect(() => {
  //   const el = document.querySelector(".search");
  //   el.focus();
  // }, []);

  // Todo: Ref ile element kolayca seçilir ve current ile tüm özellikleri değişir.
  const inputEl = useRef(null);

  useEffect(() => {
    function callback(e) {
      // Todo: Zaten active element inputEl ise iptal et.
      if (document.activeElement === inputEl.current) return;

      // Todo: Enter'a basınca search'a odaklan
      if (e.code === "Enter") {
        inputEl.current.focus();
        setQuery("");
      }
    }
    window.addEventListener("keydown", callback);

    return function () {
      window.removeEventListener("keydown", callback);
    };
  }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

export default Search;
