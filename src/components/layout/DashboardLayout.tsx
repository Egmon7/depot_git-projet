import React, { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLegislative } from "@/contexts/LegislativeContext";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  LogOut,
  Scale,
  Settings,
  User,
  Home,
  FileText,
  Users,
  Vote,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRoleDisplayName } from "@/utils/permissions";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { getUnreadNotifications } = useLegislative();

  const navigate = useNavigate();
  const location = useLocation();

  const unreadNotifications = getUnreadNotifications();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavigationItems = () => {
    const baseItems = [
      { icon: Home, label: "Tableau de bord", path: "/dashboard" },
    ];

    switch (user?.role) {
      case "depute":
        return [
          ...baseItems,
          {
            icon: FileText,
            label: "Mes propositions",
            path: "/dashboard/my-bills",
          },
          {
            icon: FileText,
            label: "Proposer une loi",
            path: "/dashboard/propose-bill",
          },
          { icon: Vote, label: "Votes", path: "/dashboard/voting" },
          { icon: FileText, label: "Documents", path: "/dashboard/documents" },
        ];

      case "president":
        return [
          ...baseItems,
          {
            icon: FileText,
            label: "Lois",
            path: "/dashboard/bills-management",
          },
          {
            icon: Vote,
            label: "Conférence des Présidents",
            path: "/dashboard/conference",
          },
          { icon: Calendar, label: "Sessions", path: "/dashboard/sessions" },
          { icon: Users, label: "Députés", path: "/dashboard/deputies" },
          { icon: BarChart3, label: "Statistiques", path: "/dashboard/stats" },
          { icon: FileText, label: "Documents", path: "/dashboard/documents" },
        ];

      case "rapporteur":
        return [
          ...baseItems,
          {
            icon: Bell,
            label: "Convocations",
            path: "/dashboard/convocations",
          },
          { icon: Users, label: "Députés", path: "/dashboard/deputies" },
          { icon: FileText, label: "Documents", path: "/dashboard/documents" },
        ];

      case "bureau_etudes":
        return [
          ...baseItems,
          {
            icon: FileText,
            label: "Lois à analyser",
            path: "/dashboard/bills-analysis",
          },
          {
            icon: FileText,
            label: "Mes analyses",
            path: "/dashboard/my-analyses",
          },
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <Scale className="h-8 w-8 text-blue-600" />
                <span className="ml-3 text-xl font-semibold text-gray-900">
                  Assemblée Législative
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/dashboard/notifications")}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    variant="destructive"
                  >
                    {unreadNotifications.length}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl} />
                      <AvatarFallback>
                        {user?.firstName[0]}
                        {user?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getRoleDisplayName(user?.role!)}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
