import type React from "react"
import { useState } from "react"
import { useNavigate, useLocation, Outlet } from "react-router"
import { Menu, X, Home, Package, ShoppingCart, User, LogOut } from "lucide-react"

function ProfileLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const NavPages = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Products", path: "/products", icon: Package },
    { name: "Cart", path: "/cart", icon: ShoppingCart },
    { name: "Profile", path: "/profile", icon: User },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    setSidebarOpen(false)
  }

  const handleLogout = () => {
    if (true) {
      navigate("/login?logout_success=true")
      return
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {/* Logo */}
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">L</span>
            </div>

            {/* Website Name */}
            <h1 className="text-xl font-semibold text-foreground">Your Website</h1>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Main Navigation */}
          <nav className="p-2 space-y-2 flex-1">
            {NavPages.map((page) => {
              const IconComponent = page.icon
              const isActive = location.pathname === page.path
              return (
                <button
                  key={page.name}
                  onClick={() => handleNavigation(page.path)}
                  className={`w-full flex items-center rounded-lg transition-all duration-200 ease-in-out text-left px-3 py-2 ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                  }`}
                  title={!sidebarOpen ? page.name : undefined}
                >
                  <div className="flex items-center justify-center w-6 h-6 flex-none">
                    <IconComponent className={`h-5 w-5 ${isActive ? "text-white" : ""}`} />
                  </div>
                  {sidebarOpen && (
                    <span className={`ml-3 whitespace-nowrap font-medium ${isActive ? "text-white" : ""}`}>
                      {page.name}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Logout Button at Bottom */}
          <div className="p-2 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center rounded-lg hover:bg-destructive/10 transition-all duration-200 ease-in-out text-left px-3 py-2"
              title={!sidebarOpen ? "Logout" : undefined}
            >
              <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                <LogOut className="h-5 w-5 text-destructive" />
              </div>
              {sidebarOpen && <span className="ml-3 whitespace-nowrap text-destructive font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="p-6">
            <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

export default ProfileLayout
