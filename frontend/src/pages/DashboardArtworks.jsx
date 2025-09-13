import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  Check, 
  X, 
  Star, 
  Trash2, 
  Upload, 
  ChevronLeft, 
  ChevronRight, 
  Image,
  CheckCircle,
  Clock,
  User,
  Calendar,
  FileImage,
  HardDrive,
  Filter
} from 'lucide-react';

const DashboardArtworks = () => {
  // Mock data with more variety
  const mockArtworks = [
    {
      id: 1,
      title: "Sunset Serenity",
      artist: "Emma Rodriguez",
      category: "Landscape",
      status: "Pending",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
      uploadDate: "2024-09-10",
      description: "A breathtaking sunset over mountain ranges with vibrant colors that capture the essence of nature's beauty.",
      resolution: "3840x2160",
      fileSize: "2.4 MB",
      artistBio: "Landscape photographer specializing in natural light photography with over 10 years of experience.",
      artistAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      title: "Urban Abstract",
      artist: "Marcus Chen",
      category: "Abstract",
      status: "Approved",
      thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=150&fit=crop",
      uploadDate: "2024-09-08",
      description: "Modern abstract composition inspired by city architecture and urban life dynamics.",
      resolution: "2560x1920",
      fileSize: "1.8 MB",
      artistBio: "Contemporary artist exploring urban themes through abstract forms and geometric patterns.",
      artistAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      title: "Portrait of Grace",
      artist: "Sofia Williams",
      category: "Portrait",
      status: "Featured",
      thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=150&fit=crop",
      uploadDate: "2024-09-05",
      description: "Elegant portrait capturing natural beauty and emotion with masterful lighting techniques.",
      resolution: "2880x3600",
      fileSize: "3.1 MB",
      artistBio: "Portrait artist known for capturing authentic human expressions and emotional depth.",
      artistAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      title: "Digital Dreams",
      artist: "Alex Thompson",
      category: "Digital Art",
      status: "Rejected",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=150&fit=crop",
      uploadDate: "2024-09-12",
      description: "Futuristic digital artwork blending reality with imagination in a cyberpunk aesthetic.",
      resolution: "4096x2304",
      fileSize: "4.2 MB",
      artistBio: "Digital artist pushing the boundaries of virtual reality art and immersive experiences.",
      artistAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 5,
      title: "Nature's Canvas",
      artist: "Luna Martinez",
      category: "Nature",
      status: "Pending",
      thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop",
      uploadDate: "2024-09-11",
      description: "Stunning nature photography showcasing the untamed beauty of forest wilderness.",
      resolution: "3200x2400",
      fileSize: "2.9 MB",
      artistBio: "Nature photographer documenting wildlife and landscapes across different continents.",
      artistAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 6,
      title: "Geometric Harmony",
      artist: "David Park",
      category: "Abstract",
      status: "Approved",
      thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=150&fit=crop",
      uploadDate: "2024-09-07",
      description: "Mathematical precision meets artistic expression in this harmonious composition.",
      resolution: "2400x2400",
      fileSize: "1.6 MB",
      artistBio: "Geometric abstract artist exploring mathematical beauty and symmetrical patterns.",
      artistAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 7,
      title: "Ocean Waves",
      artist: "Maria Santos",
      category: "Landscape",
      status: "Featured",
      thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&h=150&fit=crop",
      uploadDate: "2024-09-06",
      description: "Powerful ocean waves captured at the perfect moment of impact against rocky shores.",
      resolution: "3000x2000",
      fileSize: "2.7 MB",
      artistBio: "Seascape photographer specializing in dramatic ocean and coastal imagery.",
      artistAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 8,
      title: "Street Life",
      artist: "Carlos Rivera",
      category: "Street Art",
      status: "Pending",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop",
      uploadDate: "2024-09-09",
      description: "Vibrant street art capturing the essence of urban culture and community expression.",
      resolution: "2800x2100",
      fileSize: "3.3 MB",
      artistBio: "Street artist and photographer documenting urban culture and social movements.",
      artistAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 6;

  // Filter options
  const categories = ['All', 'Landscape', 'Abstract', 'Portrait', 'Digital Art', 'Nature', 'Street Art'];
  const statuses = ['All', 'Pending', 'Approved', 'Featured', 'Rejected'];

  // Calculate summary statistics
  const stats = useMemo(() => {
    const total = mockArtworks.length;
    const pending = mockArtworks.filter(art => art.status === 'Pending').length;
    const approved = mockArtworks.filter(art => art.status === 'Approved').length;
    const featured = mockArtworks.filter(art => art.status === 'Featured').length;
    
    return { total, pending, approved, featured };
  }, [mockArtworks]);

  // Filter and search logic
  const filteredArtworks = useMemo(() => {
    return mockArtworks.filter(artwork => {
      const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artwork.artist.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || artwork.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || artwork.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, categoryFilter, statusFilter, mockArtworks]);

  // Pagination logic
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtworks = filteredArtworks.slice(startIndex, startIndex + itemsPerPage);

  // Selection handlers
  const handleSelectArtwork = (id) => {
    setSelectedArtworks(prev => 
      prev.includes(id) 
        ? prev.filter(artId => artId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedArtworks.length === paginatedArtworks.length) {
      setSelectedArtworks([]);
    } else {
      setSelectedArtworks(paginatedArtworks.map(art => art.id));
    }
  };

  // Style helpers
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-50 border-orange-200';
      case 'Approved': return 'bg-green-50 border-green-200';
      case 'Featured': return 'bg-purple-50 border-purple-200';
      case 'Rejected': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'Pending': return `${baseClass} bg-orange-100 text-orange-800`;
      case 'Approved': return `${baseClass} bg-green-100 text-green-800`;
      case 'Featured': return `${baseClass} bg-purple-100 text-purple-800`;
      case 'Rejected': return `${baseClass} bg-red-100 text-red-800`;
      default: return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  // Modal handlers
  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArtwork(null);
  };

  // Action handlers (placeholder implementations)
  const handleAction = (action, artworkId) => {
    console.log(`${action} action for artwork ${artworkId}`);
    alert(`${action} action triggered for artwork ${artworkId}`);
    if (showModal) closeModal();
  };

  const handleBulkAction = (action) => {
    console.log(`${action} action for artworks:`, selectedArtworks);
    alert(`${action} action triggered for ${selectedArtworks.length} artworks`);
    setSelectedArtworks([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Artwork Management
          </h1>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Artworks</p>
                  <p className="text-3xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Image className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pending Approvals</p>
                  <p className="text-3xl font-bold mt-1">{stats.pending}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-400 to-blue-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Approved Artworks</p>
                  <p className="text-3xl font-bold mt-1">{stats.approved}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Featured Artworks</p>
                  <p className="text-3xl font-bold mt-1">{stats.featured}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full xl:w-auto">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by title or artist..."
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filters */}
              <div className="flex gap-3">
                <select
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-0"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-0"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 w-full xl:w-auto">
              {selectedArtworks.length > 0 && (
                <button 
                  className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                  onClick={() => handleBulkAction('bulk-approve')}
                >
                  <Check className="h-4 w-4" />
                  Approve Selected ({selectedArtworks.length})
                </button>
              )}
              <button className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl">
                <Upload className="h-4 w-4" />
                Upload Artwork
              </button>
            </div>
          </div>
        </div>

        {/* Artworks Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      checked={selectedArtworks.length === paginatedArtworks.length && paginatedArtworks.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Artwork</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Artist</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedArtworks.map((artwork) => (
                  <tr 
                    key={artwork.id} 
                    className={`hover:bg-gray-50 transition-all duration-200 border-l-4 ${getStatusColor(artwork.status)} ${
                      selectedArtworks.includes(artwork.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        checked={selectedArtworks.includes(artwork.id)}
                        onChange={() => handleSelectArtwork(artwork.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={artwork.thumbnail} 
                          alt={artwork.title}
                          className="w-16 h-12 object-cover rounded-lg shadow-sm mr-4"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{artwork.title}</p>
                          <p className="text-xs text-gray-500">{artwork.uploadDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{artwork.artist}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{artwork.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(artwork.status)}>
                        {artwork.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openModal(artwork)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('approve', artwork.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('reject', artwork.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('feature', artwork.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
                          title="Feature"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('delete', artwork.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredArtworks.length)} of {filteredArtworks.length} results
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                    currentPage === page 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {showModal && selectedArtwork && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Artwork Details</h2>
                  <button 
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Artwork Image */}
                  <div>
                    <img 
                      src={selectedArtwork.thumbnail} 
                      alt={selectedArtwork.title}
                      className="w-full h-80 sm:h-96 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                  
                  {/* Artwork Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{selectedArtwork.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{selectedArtwork.description}</p>
                      <span className={getStatusBadge(selectedArtwork.status)}>
                        {selectedArtwork.status}
                      </span>
                    </div>
                    
                    {/* Artist Info */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Artist Information
                      </h4>
                      <div className="flex items-start gap-4 mb-4">
                        <img 
                          src={selectedArtwork.artistAvatar} 
                          alt={selectedArtwork.artist}
                          className="w-16 h-16 rounded-full object-cover shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-lg text-gray-900">{selectedArtwork.artist}</p>
                          <p className="text-sm text-gray-600 mb-2">{selectedArtwork.category}</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{selectedArtwork.artistBio}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Metadata */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Artwork Metadata</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-gray-600 block">Upload Date</span>
                            <span className="font-semibold text-gray-900">{selectedArtwork.uploadDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FileImage className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-gray-600 block">Resolution</span>
                            <span className="font-semibold text-gray-900">{selectedArtwork.resolution}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
                          <HardDrive className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-gray-600 block">File Size</span>
                            <span className="font-semibold text-gray-900">{selectedArtwork.fileSize}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Admin Actions */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Admin Actions</h4>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => handleAction('approve', selectedArtwork.id)}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAction('reject', selectedArtwork.id)}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </button>
                        <button 
                          onClick={() => handleAction('feature', selectedArtwork.id)}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
                        >
                          <Star className="h-4 w-4" />
                          Feature
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardArtworks;