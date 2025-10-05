import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookProvider } from "@/contexts/BookContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import AddEditBook from "./pages/AddEditBook";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <BookProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/books" 
                  element={
                    <ProtectedRoute>
                      <Books />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/books/:id" 
                  element={
                    <ProtectedRoute>
                      <BookDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/add-book" 
                  element={
                    <ProtectedRoute>
                      <AddEditBook />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/edit-book/:id" 
                  element={
                    <ProtectedRoute>
                      <AddEditBook />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BookProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
