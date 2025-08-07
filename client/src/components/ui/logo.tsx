import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl", 
    xl: "text-4xl"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo Image - Using shipnix-logo.png */}
      <div className={cn("relative overflow-hidden rounded-xl", sizeClasses[size])}>
        <img 
          src="/src/assets/shipnix-logo.png"
          alt="Shipnix Express Logo"
          className="h-full w-full object-contain bg-white/10 backdrop-blur-sm"
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            "font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
            textSizeClasses[size]
          )}>
            Shipnix Express
          </h1>
          {size !== "sm" && (
            <p className="text-sm text-muted-foreground -mt-1">
              Global Logistics Solutions
            </p>
          )}
        </div>
      )}
    </div>
  );
}