import { ShoppingCart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import CheckoutModal from './CheckoutModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { cart, getCartTotal, getCartCount, removeFromCart } = useCart();
  const { currentUser, userData, logout } = useAuth();

  const handleCheckout = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      setIsCartOpen(false);
    } else {
      setIsCheckoutModalOpen(true);
      setIsCartOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold text-amber-500 tracking-wide">
            ShopElite
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-slate-700 font-medium">
            <Link to="/" className="hover:text-amber-500 transition">Home</Link>
            <Link to="/" className="hover:text-amber-500 transition">Shop</Link>
            <Link to="/" className="hover:text-amber-500 transition">Categories</Link>
            <Link to="/" className="hover:text-amber-500 transition">About</Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-slate-600 hover:text-amber-500">
              <Search size={20} />
            </button>

            <button 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative text-slate-600 hover:text-amber-500"
            >
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Auth / User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-slate-600 hover:text-amber-500"
                >
                  <User size={20} />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-10 w-48 bg-white shadow-lg rounded-lg z-50">
                    <div className="p-4 border-b">
                      <p className="font-semibold text-sm">{userData?.displayName}</p>
                      <p className="text-xs text-slate-500">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-1 text-slate-600 hover:text-amber-500"
              >
                <User size={20} />
                <span className="text-sm">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Icon */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden text-slate-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3">
            <Link to="/" className="block text-slate-600 hover:text-amber-500">Home</Link>
            <Link to="/" className="block text-slate-600 hover:text-amber-500">Shop</Link>
            <Link to="/" className="block text-slate-600 hover:text-amber-500">Categories</Link>
            <Link to="/" className="block text-slate-600 hover:text-amber-500">About</Link>
          </div>
        )}

        {/* Cart Dropdown */}
        {isCartOpen && (
          <div className="absolute right-4 top-16 w-80 bg-white shadow-lg rounded-lg z-50">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Your Cart ({getCartCount()} items)</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="p-4 text-slate-500 text-center">Your cart is empty.</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex p-4 border-b">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <div className="flex justify-between mt-1 text-sm text-slate-500">
                        <span>{item.quantity} × ${item.price.toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t">
              <div className="flex justify-between font-medium mb-4">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-2 rounded-lg ${
                  cart.length === 0 
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsCheckoutModalOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  );
}
