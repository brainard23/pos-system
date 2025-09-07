import { ChangeEvent } from "react";
import { Input } from "../ui/input";

interface SearchProps {
  searchQuery: string;
  setQuery: (query: string) => void;
}

const Search = ({ searchQuery, setQuery }: SearchProps) => {
  return (
    <>
      <Input
        type="search"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
        className="w-64 shadow-lg border-gray-300"
      />
    </>
  );
};

export default Search;
