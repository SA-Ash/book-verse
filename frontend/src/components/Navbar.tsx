import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, User, LogOut, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-warm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-warm bg-clip-text text-transparent">
            BookVerse
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/books">
                <Button 
                  variant={isActive('/books') ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Books
                </Button>
              </Link>
              <Link to="/add-book">
                <Button 
                  variant={isActive('/add-book') ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Book
                </Button>
              </Link>
              <Link to="/profile">
                <Button 
                  variant={isActive('/profile') ? 'default' : 'ghost'}
                  size="icon"
                >
                  <User className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
