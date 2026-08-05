import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
        ? "py-3 bg-black/60 backdrop-blur-xl border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
        : "py-6 bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <motion.a
          href="#"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.25 }}
          className="flex items-center space-x-2 text-white font-extrabold text-2xl tracking-wider"
        >
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-black">
            D
          </div>

          <span>
            DRONE<span className="text-gray-400">DEPLOY</span>
          </span>
        </motion.a>
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a
            href="#"
            className="relative text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Products
          </a>
          <a
            href="#"
            className="relative text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Solutions
          </a>
          <a
            href="#"
            className="relative text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Resources
          </a>
          <a
            href="#"
            className="relative text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Pricing
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={onSignOut}
              className="text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
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
            className="px-5 py-2.5 bg-white text-black font-semibold rounded-xl text-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]"          >
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 p-6 flex flex-col space-y-6 backdrop-blur-lg"
          >            <div className="flex flex-col space-y-4">
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

