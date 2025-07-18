import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Package, Truck, CheckCircle, AlertCircle, Settings, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  type: "delivery" | "pickup" | "delay" | "success";
  title: string;
  message: string;
  timestamp: Date;
  trackingId?: string;
  read: boolean;
}

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  deliveryUpdates: boolean;
  promotionalOffers: boolean;
  securityAlerts: boolean;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "delivery",
      title: "Package Out for Delivery",
      message: "Your package ST-DEMO12345 is out for delivery and will arrive today between 2-4 PM.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      trackingId: "ST-DEMO12345",
      read: false
    },
    {
      id: "2",
      type: "success",
      title: "Package Delivered Successfully",
      message: "Your package ST-DEMO67890 has been delivered to your address.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      trackingId: "ST-DEMO67890",
      read: false
    },
    {
      id: "3",
      type: "pickup",
      title: "Package Ready for Pickup",
      message: "Your package is ready for pickup at the nearest collection point.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      trackingId: "ST-DEMO24680",
      read: true
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    deliveryUpdates: true,
    promotionalOffers: false,
    securityAlerts: true
  });

  const [showSettings, setShowSettings] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "delivery": return <Truck className="h-4 w-4 text-blue-500" />;
      case "pickup": return <Package className="h-4 w-4 text-orange-500" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "delay": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Request notification permission
  useEffect(() => {
    if (settings.pushEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [settings.pushEnabled]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </div>

        {showSettings ? (
          <div className="p-4 space-y-4">
            <h4 className="font-medium">Notification Settings</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Push Notifications</span>
                <Switch
                  checked={settings.pushEnabled}
                  onCheckedChange={(checked) => updateSetting('pushEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Notifications</span>
                <Switch
                  checked={settings.emailEnabled}
                  onCheckedChange={(checked) => updateSetting('emailEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">SMS Notifications</span>
                <Switch
                  checked={settings.smsEnabled}
                  onCheckedChange={(checked) => updateSetting('smsEnabled', checked)}
                />
              </div>
              
              <div className="border-t pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delivery Updates</span>
                  <Switch
                    checked={settings.deliveryUpdates}
                    onCheckedChange={(checked) => updateSetting('deliveryUpdates', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Promotional Offers</span>
                  <Switch
                    checked={settings.promotionalOffers}
                    onCheckedChange={(checked) => updateSetting('promotionalOffers', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Alerts</span>
                  <Switch
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => updateSetting('securityAlerts', checked)}
                  />
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(false)}
              className="w-full"
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-muted/50 cursor-pointer border-l-2 transition-colors ${
                      notification.read 
                        ? "border-l-transparent bg-muted/20" 
                        : "border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                          {notification.trackingId && (
                            <Badge variant="outline" className="text-xs">
                              {notification.trackingId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}