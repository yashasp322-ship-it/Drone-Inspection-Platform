import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onSignInClick: () => void;
  isLoggedIn: boolean;
  onSignOut: () => void;
}

export default function Header({ onSignInClick, isLoggedIn, onSignOut }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent hover:bg-black/95 hover:backdrop-blur-md border-b ${
        isScrolled
          ? "border-white/10 py-4 shadow-lg backdrop-blur-sm bg-black/30"
          : "border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center space-x-2 text-white font-extrabold text-2xl tracking-wider">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-black">
            D
          </div>
          <span>
            DRONE<span className="text-gray-400">DEPLOY</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            Products
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            Solutions
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            Resources
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            Pricing
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={onSignOut}
              className="text-white hover:text-gray-300 transition-colors text-sm font-medium px-4 py-2"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={onSignInClick}
              className="text-white hover:text-gray-300 transition-colors text-sm font-medium px-4 py-2"
            >
              Sign In
            </button>
          )}
          <a
            href="#"
            className="px-5 py-2.5 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]"
          >
            Request a Demo
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 p-6 flex flex-col space-y-6 backdrop-blur-lg animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col space-y-4">
            <a href="#" className="text-sm font-semibold text-white py-2 border-b border-white/5">
              Products
            </a>
            <a href="#" className="text-sm font-semibold text-white py-2 border-b border-white/5">
              Solutions
            </a>
            <a href="#" className="text-sm font-semibold text-white py-2 border-b border-white/5">
              Resources
            </a>
            <a href="#" className="text-sm font-semibold text-white py-2">
              Pricing
            </a>
          </div>
          <hr className="border-white/10" />
          <div className="flex flex-col space-y-3">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  onSignOut();
                  setIsOpen(false);
                }}
                className="w-full text-center py-2.5 text-white hover:text-gray-300 border border-white/20 rounded-lg text-sm font-semibold"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  onSignInClick();
                  setIsOpen(false);
                }}
                className="w-full text-center py-2.5 text-white hover:text-gray-300 border border-white/20 rounded-lg text-sm font-semibold"
              >
                Sign In
              </button>
            )}
            <a
              href="#"
              className="w-full text-center py-2.5 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg text-sm"
            >
              Request a Demo
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
