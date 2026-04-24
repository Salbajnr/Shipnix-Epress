import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { 
  Package, 
  FileText, 
  DollarSign, 
  HelpCircle, 
  Search,
  LogOut,
  User
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        
        {/* Logo */}
        <Link href="/">
          <Logo size="sm" />
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            
            {/* Public Navigation */}
            <NavigationMenuItem>
              <Link href="/track">
                <Button 
                  variant={isActive("/track") ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Track Package
                </Button>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/quote">
                <Button 
                  variant={isActive("/quote") ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Get Quote
                </Button>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/faq">
                <Button 
                  variant={isActive("/faq") ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Support
                </Button>
              </Link>
            </NavigationMenuItem>

            {/* Admin Navigation - Only visible when authenticated */}
            {isAuthenticated && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm">
                    Admin Panel
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <li>
                        <Link href="/packages">
                          <Button 
                            variant="ghost" 
                            className="h-auto w-full justify-start p-3"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            <div className="text-left">
                              <div className="text-sm font-medium">Packages</div>
                              <div className="text-xs text-muted-foreground">
                                Manage shipments
                              </div>
                            </div>
                          </Button>
                        </Link>
                      </li>
                      <li>
                        <Link href="/quotes">
                          <Button 
                            variant="ghost" 
                            className="h-auto w-full justify-start p-3"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            <div className="text-left">
                              <div className="text-sm font-medium">Quotes</div>
                              <div className="text-xs text-muted-foreground">
                                Review requests
                              </div>
                            </div>
                          </Button>
                        </Link>
                      </li>
                      <li>
                        <Link href="/invoices">
                          <Button 
                            variant="ghost" 
                            className="h-auto w-full justify-start p-3"
                          >
                            <DollarSign className="mr-2 h-4 w-4" />
                            <div className="text-left">
                              <div className="text-sm font-medium">Invoices</div>
                              <div className="text-xs text-muted-foreground">
                                Payment tracking
                              </div>
                            </div>
                          </Button>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}