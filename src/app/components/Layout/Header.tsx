import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white w-full shadow-md fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold">MomMilk</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 text-lg font-medium">
          <Link to="/" className="hover:text-pink-400 transition">Home</Link>
          <Link to="/product" className="hover:text-pink-400 transition">Product</Link>
          <Link to="/faq" className="hover:text-pink-400 transition">FAQ</Link>
          <Link to="/blogs" className="hover:text-pink-400 transition">Blogs</Link>
          <Link to="/contact" className="hover:text-pink-400 transition">Contact</Link>
        </nav>

        {/* Login & Cart */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/login" className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600 transition">
            Log in
          </Link>
          <button className="text-white hover:text-pink-400 transition">
            <ShoppingCart size={24} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 text-white py-4 px-6 space-y-4 absolute top-16 left-0 w-full shadow-lg">
          <Link to="/" className="block py-2 hover:text-pink-400">Home</Link>
          <Link to="/product" className="block py-2 hover:text-pink-400">Product</Link>
          <Link to="/faq" className="block py-2 hover:text-pink-400">FAQ</Link>
          <Link to="/blogs" className="block py-2 hover:text-pink-400">Blogs</Link>
          <Link to="/contact" className="block py-2 hover:text-pink-400">Contact</Link>
          <Link to="/login" className="block py-2 bg-pink-500 text-center rounded-lg hover:bg-pink-600 transition">
            Log in
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
