// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Palette, 
  DollarSign, 
  Eye,
  Clock,
  CheckCircle,
  TrendingUp,
  Activity,
  Calendar,
  Star,
  ArrowUp,
  Coins,
  Image,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ArtistHome = () => {
  // eslint-disable-next-line no-unused-vars
  const [artistData, setArtistData] = useState({
    name: "Alex Rivera",
    totalArtworks: 47,
    pendingApprovals: 3,
    earningsBalance: 2847.50,
    profileViews: 12340
  });

  const [recentActivity] = useState([
    { id: 1, type: 'upload', message: 'Uploaded "Digital Dreams"', time: '2 hours ago', icon: Upload },
    { id: 2, type: 'approval', message: 'Artwork "Neon City" approved', time: '5 hours ago', icon: CheckCircle },
    { id: 3, type: 'earning', message: 'Earned $150 from token sales', time: '1 day ago', icon: Coins },
    { id: 4, type: 'view', message: 'Profile viewed 50 times today', time: '1 day ago', icon: Eye },
    { id: 5, type: 'upload', message: 'Uploaded "Abstract Waves"', time: '3 days ago', icon: Upload }
  ]);

  const [earningsData] = useState([
    { month: 'Jan', earnings: 1200, uploads: 8 },
    { month: 'Feb', earnings: 1800, uploads: 12 },
    { month: 'Mar', earnings: 2100, uploads: 15 },
    { month: 'Apr', earnings: 1650, uploads: 10 },
    { month: 'May', earnings: 2400, uploads: 18 },
    { month: 'Jun', earnings: 2847, uploads: 22 }
  ]);

  const [uploadsData] = useState([
    { month: 'Jan', count: 8 },
    { month: 'Feb', count: 12 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 10 },
    { month: 'May', count: 18 },
    { month: 'Jun', count: 22 }
  ]);

  // Navigation handlers
  const handleUploadArtwork = () => {
    console.log('Navigate to upload artwork');
  };

  const handleManageArtworks = () => {
    console.log('Navigate to manage artworks');
  };

  const handleViewEarnings = () => {
    console.log('Navigate to earnings page');
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Artworks',
      value: artistData.totalArtworks,
      icon: Image,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Pending Approvals',
      value: artistData.pendingApprovals,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/20',
      change: '-2',
      changeType: 'neutral'
    },
    {
      title: 'Earnings Balance',
      value: `$${artistData.earningsBalance.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Profile Views',
      value: artistData.profileViews.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      change: '+24%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-black text-white overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-pink-400/5 blur-2xl" />
      </div>

      <div className="relative z-10 p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-4xl lg:text-6xl font-black">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Welcome back,
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              {artistData.name}!
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-white/80 font-light max-w-2xl mx-auto lg:mx-0">
            Unleash your creativity on MerakiNexus and inspire the world with your unique vision
          </p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.title}
                className="group relative overflow-hidden bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/15 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${card.bgColor}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className={`text-sm font-medium ${card.changeType === 'positive' ? 'text-green-400' : card.changeType === 'negative' ? 'text-red-400' : 'text-yellow-400'} flex items-center gap-1`}>
                      {card.changeType === 'positive' && <ArrowUp className="w-3 h-3" />}
                      {card.change}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-white">{card.value}</h3>
                    <p className="text-white/70 text-sm font-medium">{card.title}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/30 rounded-xl">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Recent Activity</h2>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="p-2 bg-indigo-500/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm leading-relaxed">
                          {activity.message}
                        </p>
                        <p className="text-white/60 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-[1.02]">
                View All Activity
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-pink-500/30 rounded-xl">
                  <Star className="w-5 h-5 text-white" />
                </div>
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <button
                  onClick={handleUploadArtwork}
                  className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <Upload className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Upload New Artwork
                </button>
                
                <button
                  onClick={handleManageArtworks}
                  className="w-full flex items-center gap-3 p-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] border border-white/20 group"
                >
                  <Palette className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Manage My Artworks
                </button>
                
                <button
                  onClick={handleViewEarnings}
                  className="w-full flex items-center gap-3 p-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] border border-white/20 group"
                >
                  <DollarSign className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  View Earnings
                </button>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Earnings Chart */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/30 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Monthly Earnings</h2>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-400">${earningsData[earningsData.length - 1].earnings}</p>
                  <p className="text-white/60 text-sm">This month</p>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        color: 'white'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Uploads Chart */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/30 rounded-xl">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Monthly Uploads</h2>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-400">{uploadsData[uploadsData.length - 1].count}</p>
                  <p className="text-white/60 text-sm">This month</p>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={uploadsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        color: 'white'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#blueGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistHome;