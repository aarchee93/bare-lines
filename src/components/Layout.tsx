import { NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Layout = () => {
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Tasks", path: "/tasks" },
    { name: "Habits", path: "/habits" },
    { name: "Notes", path: "/notes" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-foreground bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-lg font-bold">Tracker</h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? "border-foreground text-foreground"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? "bg-secondary border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-secondary hover:border-border hover:text-foreground"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;