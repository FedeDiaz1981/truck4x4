"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="searchbar-shell">
      <div className="searchbar-core">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Busca por nombre, categoria, color, marca..."
          className="searchbar-input"
        />
      </div>
    </div>
  );
}
