import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../../components/Layout/Button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-800">Child Growth Tracking</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
          <a href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
          <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
          <a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md py-2 px-6">
          <a href="/" className="block py-2 text-gray-600 hover:text-gray-900">Home</a>
          <a href="/faq" className="block py-2 text-gray-600 hover:text-gray-900">FAQ</a>
          <a href="/login" className="block py-2 text-gray-600 hover:text-gray-900">Login</a>
          <a href="/contact" className="block py-2 text-gray-600 hover:text-gray-900">Contact</a>
        </div>
      )}
    </header>
  );
};

export default Header;
