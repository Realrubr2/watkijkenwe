import { MdLocalMovies } from 'react-icons/md';

export function Navbar({ onReset }: { onReset: () => void }) {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onReset}>
          <MdLocalMovies className="text-white text-3xl" />
          <h1 className="text-2xl font-bold text-white">Wat kijken we?</h1>
        </div>
      </div>
    </nav>
  );
}