// component/SearchInput.tsx
'use client';

import React, { useState, useEffect } from "react";

interface SearchInputProps {
  initialSearchName: string;
  onSearchSubmit: (name: string) => void; 
}

const SearchInput: React.FC<SearchInputProps> = ({ initialSearchName, onSearchSubmit }) => {
    const [searchName, setSearchName] = useState(initialSearchName);

    useEffect(() => {
        setSearchName(initialSearchName);
    }, [initialSearchName]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(event.target.value);
    };

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearchSubmit(searchName.trim());
    };

     return (
    <form onSubmit={handleSearch} className="mb-8 flex justify-center w-full max-w-md">
      <input
        type="text"
        value={searchName}
        onChange={handleInputChange}
        placeholder="Search Pokemon by name (e.g., Pikachu)"
        className="p-2 border border-gray-300 rounded-l-md w-80 text-black" 
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
