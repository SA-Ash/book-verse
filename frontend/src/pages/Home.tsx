import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Vast Library',
      description: 'Discover thousands of books across all genres'
    },
    {
      icon: Star,
      title: 'Rate & Review',
      description: 'Share your thoughts and help others find great reads'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with fellow book lovers worldwide'
    },
    {
      icon: TrendingUp,
      title: 'Personalized',
      description: 'Get recommendations based on your reading taste'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 bg-gradient-subtle overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-warm bg-clip-text text-transparent">
              Your Literary Journey Starts Here
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore, review, and share your favorite books with a community of passionate readers
            </p>
            <div className="flex gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/books">
                  <Button size="lg" className="gap-2">
                    <BookOpen className="w-5 h-5" />
                    Browse Books
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">Login</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why BookVerse?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of readers who trust BookVerse to discover their next favorite book
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-card transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-warm rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
