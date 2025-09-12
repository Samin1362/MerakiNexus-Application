import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Image,
  Coins,
  Clock,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

// ✅ Import your DashboardHome component
import DashboardHome from "../pages/DashboardHome";
import DashboardUsers from "../pages/DashboardUsers";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/dashboard");

  const navigationItems = [
    { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/dashboard/users", label: "Users", icon: Users },
    { path: "/dashboard/artworks", label: "Artworks", icon: Image },
    { path: "/dashboard/tokens", label: "Tokens", icon: Coins },
    { path: "/dashboard/approvals", label: "Approvals", icon: Clock },
    { path: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const isActiveRoute = (path) => {
    if (path === "/dashboard") {
      return activeRoute === "/dashboard";
    }
    return activeRoute.startsWith(path);
  };

  const handleNavClick = (path) => {
    setActiveRoute(path);
    setIsSidebarOpen(false);
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = isActiveRoute(item.path);

    return (
      <button
        onClick={() => handleNavClick(item.path)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
            : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900"
        }`}
      >
        <Icon
          size={20}
          className={`${
            isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
          } transition-colors duration-300`}
        />
        <span className="font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 md:mt-[65px] to-blue-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MerakiNexus
                  </h2>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">AD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@merakinexus.com</p>
              </div>
            </div>
            <button className="w-full mt-3 flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
              <LogOut size={16} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Menu size={20} className="text-gray-600" />
              </button>

              {/* Search Bar */}
              <div className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 min-w-80">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dashboard..."
                  className="bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 flex-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile */}
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* ✅ Overview now renders DashboardHome */}
            {activeRoute === "/dashboard" && <DashboardHome />}

            {activeRoute === "/dashboard/users" && <DashboardUsers />}
            {activeRoute === "/dashboard/artworks" && (
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Artwork Gallery
                </h1>
                <p className="text-gray-600">
                  Browse and manage all artworks on the platform.
                </p>
              </div>
            )}
            {activeRoute === "/dashboard/tokens" && (
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Token Management
                </h1>
                <p className="text-gray-600">
                  Monitor and manage platform tokens and transactions.
                </p>
              </div>
            )}
            {activeRoute === "/dashboard/approvals" && (
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Pending Approvals
                </h1>
                <p className="text-gray-600">
                  Review and approve pending artworks and user requests.
                </p>
              </div>
            )}
            {activeRoute === "/dashboard/settings" && (
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  System Settings
                </h1>
                <p className="text-gray-600">
                  Configure platform settings and preferences.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
