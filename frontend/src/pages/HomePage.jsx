import { useEffect, useRef, useState, memo } from "react";
import { 
  Sparkles, 
  Heart, 
  TrendingUp, 
  Coins,
  Eye,
  Target,
  Zap,
  ArrowRight,
  ExternalLink
} from "lucide-react";

// Memoized Artwork Card Component
const ArtworkCard = memo(({ artwork }) => (
  <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/8 backdrop-blur-xl shadow-2xl shadow-indigo-950/25 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-purple-500/25 hover:border-purple-400/40">
    {/* Gradient overlay effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-indigo-500/0 to-purple-500/0 opacity-0 transition-opacity duration-700 group-hover:opacity-15" />
    
    {/* Image container */}
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      <img
        src={artwork.image_url}
        alt={artwork.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      
      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* View Details Button */}
      <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-6 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
        <button className="w-full flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-3 rounded-2xl font-semibold hover:bg-white transition-all duration-300 shadow-lg">
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
    
    {/* Card content */}
    <div className="p-6">
      <h3 className="text-xl font-bold text-white truncate mb-2">{artwork.title}</h3>
      <p className="text-white/75 mb-3">{artwork.artist}</p>
      
      {artwork.classification && (
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-gradient-to-r from-purple-500/25 to-indigo-500/25 text-purple-200 text-sm rounded-full font-medium border border-purple-400/30">
            {artwork.classification}
          </span>
          {typeof artwork.classification_percentage === "number" && (
            <span className="text-sm text-white/50 font-medium">
              {Math.round(artwork.classification_percentage)}% confidence
            </span>
          )}
        </div>
      )}
    </div>
  </div>
));

// Feature Card Component
const FeatureCard = memo(({ feature }) => {
  const IconComponent = feature.icon;
  
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-8 shadow-2xl shadow-indigo-950/20 transition-all duration-700 hover:-translate-y-3 hover:bg-white/15 hover:shadow-purple-500/30 hover:border-purple-400/40">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-indigo-500/0 to-purple-500/0 opacity-0 transition-opacity duration-700 group-hover:opacity-15" />
      
      <div className="relative z-10">
        {/* Icon container */}
        <div className="w-18 h-18 rounded-3xl bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-600 flex items-center justify-center mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl">
          <IconComponent className="w-9 h-9 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-100 transition-colors duration-300">
          {feature.title}
        </h3>
        
        <p className="text-white/85 leading-relaxed text-lg">
          {feature.description}
        </p>
        
        {/* Animated bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 scale-x-0 origin-left transition-transform duration-700 group-hover:scale-x-100" />
      </div>
    </div>
  );
});

function HomePage() {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const rootRef = useRef(null);
  
  // Navigation handlers
  const navigateToGallery = () => {
    window.location.href = "/gallery";
  };
  
  const handleLearnMore = () => {
    window.location.href = "/about";
  };

  // Load featured artworks
  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const response = await fetch("/art-data.json");
        const data = await response.json();
        const artworksList = Array.isArray(data) 
          ? data 
          : Array.isArray(data?.artworks) 
          ? data.artworks 
          : [];
        
        setArtworks(artworksList.slice(0, 4));
      } catch (error) {
        console.error("Failed to load artworks:", error);
        setArtworks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworks();
  }, []);

  const platformFeatures = [
    {
      title: "AI Art Generation",
      description: "Create stunning artworks with state-of-the-art AI models and neural networks for unlimited creative possibilities.",
      icon: Sparkles,
    },
    {
      title: "Sentiment Analysis", 
      description: "Deep understanding of emotional resonance across all creative content using advanced machine learning.",
      icon: Heart,
    },
    {
      title: "Aesthetic Scoring",
      description: "Quantify visual appeal using sophisticated algorithms trained on millions of artistic masterpieces.",
      icon: TrendingUp,
    },
    {
      title: "Web3 Collectibles",
      description: "Mint, trade, and showcase blockchain-verified digital assets with full ownership transparency.",
      icon: Coins,
    },
  ];

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen w-full md:mt-[50px] overflow-x-hidden bg-gradient-to-br from-purple-500 via-indigo-600 to-indigo-700"
    >
      {/* Enhanced ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-white/6 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-fuchsia-400/12 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-cyan-400/8 blur-2xl" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 space-y-24">
        
        {/* Hero Section */}
        <section className="grid items-center gap-16 lg:grid-cols-2">
          <div className="text-center lg:text-left space-y-10">
            {/* Hero headline */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                Welcome
              </span>
            </h1>
            
            {/* Hero description */}
            <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 max-w-3xl mx-auto lg:mx-0 leading-relaxed font-light">
              <span className="font-bold text-white">MerakiNexus</span> is where AI-driven
              creativity meets Web3 innovation. Artists showcase their masterpieces while AI
              evaluates style and value, and blockchain ensures secure, transparent ownership.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <button
                onClick={navigateToGallery}
                className="group relative overflow-hidden rounded-3xl bg-white/12 backdrop-blur-xl px-10 py-5 text-white shadow-2xl shadow-indigo-900/25 border border-white/25 transition-all duration-500 hover:bg-white/18 hover:scale-105 hover:shadow-purple-500/35 focus:outline-none focus:ring-4 focus:ring-white/30"
              >
                {/* Button shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] transition-transform duration-1000 group-hover:translate-x-[200%]" />
                
                <div className="relative flex items-center gap-3 font-bold text-lg">
                  <Sparkles className="w-6 h-6" />
                  Explore Gallery
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </button>
              
              <button
                onClick={handleLearnMore}
                className="group rounded-3xl border-2 border-white/30 backdrop-blur-sm px-10 py-5 text-white transition-all duration-500 hover:bg-white/15 hover:scale-105 hover:border-white/50 focus:outline-none focus:ring-4 focus:ring-white/30"
              >
                <div className="flex items-center gap-3 font-bold text-lg">
                  <ExternalLink className="w-5 h-5" />
                  Learn More
                </div>
              </button>
            </div>
          </div>

          {/* Hero visual card */}
          <div className="relative mx-auto w-full max-w-2xl">
            <div className="group relative overflow-hidden rounded-[2rem] border-2 border-white/25 bg-white/10 backdrop-blur-xl shadow-2xl shadow-indigo-950/40 transition-all duration-700 hover:scale-105 hover:rotate-1 hover:shadow-purple-500/30">
              {/* Animated border glow */}
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-fuchsia-400/25 via-cyan-300/25 to-indigo-400/25 blur-xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1752649935031-7c35f43b24b0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fGNyZWF0aXZlJTIwYXJ0d29ya3xlbnwwfHwwfHx8MA%3D%3D"
                  alt="AI creativity showcase"
                  className="w-full h-96 object-cover rounded-[2rem] transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent rounded-[2rem]" />
                
                {/* Floating info card */}
                <div className="absolute bottom-8 left-8 right-8 transform transition-all duration-500 group-hover:translate-y-[-4px]">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-gray-900 font-bold text-xl">AI-Powered Creativity</h3>
                    <p className="text-gray-700 mt-2">Where artistic vision meets cutting-edge technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              About MerakiNexus
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Pioneering the future of digital art through AI innovation and blockchain technology
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Vision Card */}
            <div className="group relative overflow-hidden rounded-[2rem] bg-white/12 backdrop-blur-xl p-10 shadow-2xl shadow-indigo-950/20 border border-white/15 transition-all duration-700 hover:scale-105 hover:bg-white/18 hover:shadow-purple-500/25">
              <div className="absolute top-8 left-8 w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              
              <div className="pt-20">
                <h3 className="text-3xl font-bold mb-6 text-white">Our Vision</h3>
                <p className="text-white/90 text-xl leading-relaxed">
                  Democratize creative expression where AI insight and decentralized ownership 
                  help every creator find value, recognition, and community in the digital renaissance.
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 scale-x-0 transition-transform duration-700 group-hover:scale-x-100" />
            </div>

            {/* Mission Card */}
            <div className="group relative overflow-hidden rounded-[2rem] bg-white/12 backdrop-blur-xl p-10 shadow-2xl shadow-indigo-950/20 border border-white/15 transition-all duration-700 hover:scale-105 hover:bg-white/18 hover:shadow-purple-500/25">
              <div className="absolute top-8 left-8 w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <div className="pt-20">
                <h3 className="text-3xl font-bold mb-6 text-white">Our Mission</h3>
                <p className="text-white/90 text-xl leading-relaxed">
                  Build revolutionary tools that analyze, enhance, and tokenize creative work 
                  using machine learning and Web3 primitives to reward artistic excellence.
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-500 scale-x-0 transition-transform duration-700 group-hover:scale-x-100" />
            </div>
          </div>
        </section>

        {/* Featured Artworks Section */}
        <section className="space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Featured Artworks
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Discover exceptional pieces from our curated collection of AI-enhanced digital masterpieces
            </p>
          </div>
          
          {/* Artworks grid */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-white/10 rounded-3xl mb-4" />
                  <div className="h-4 bg-white/10 rounded mb-2" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
              ))
            ) : (
              artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))
            )}
          </div>
          
          {/* Gallery CTA button */}
          <div className="text-center pt-8">
            <button
              onClick={navigateToGallery}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 px-12 py-6 text-white font-bold text-xl shadow-2xl shadow-purple-500/30 transition-all duration-500 hover:scale-105 hover:shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-400/50"
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] transition-transform duration-1000 group-hover:translate-x-[200%]" />
              
              <div className="relative flex items-center gap-4">
                Browse Full Gallery
                <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
              </div>
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Platform Features
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Experience the future of digital art with our cutting-edge AI and blockchain technology suite
            </p>
          </div>
          
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {platformFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;