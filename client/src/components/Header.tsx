import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Package, 
  Menu, 
  X, 
  Search, 
  Bell, 
  User,
  Calculator,
  FileText,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/Logo";

interface HeaderProps {
  showUserMenu?: boolean;
  userName?: string;
}

export default function Header({ showUserMenu = true, userName = "John Doe" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Track Package", href: "/track", icon: Search },
    { name: "Calculate Cost", href: "/calculate", icon: Calculator },
    { name: "Get Quote", href: "/quote", icon: FileText },
    { name: "Support", href: "/support", icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold gradient-text">Shipnix-Express</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {showUserMenu && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  2
                </span>
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu or Auth Buttons */}
            {showUserMenu ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        john.doe@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Live Chat
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/api/login">Admin Login</a>
                </Button>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="btn-gradient text-sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground block px-3 py-2 text-base font-medium flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {!showUserMenu && (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:text-blue-700 justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Live Chat
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="/api/login">Admin Login</a>
                  </Button>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Customer Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full btn-gradient">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}