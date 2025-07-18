import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare, Smartphone, Clock, Package, Truck, MapPin } from "lucide-react";

interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  packageShipped: boolean;
  inTransit: boolean;
  outForDelivery: boolean;
  delivered: boolean;
  deliveryAttempt: boolean;
  customsDelay: boolean;
  frequency: "instant" | "hourly" | "daily";
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    packageShipped: true,
    inTransit: true,
    outForDelivery: true,
    delivered: true,
    deliveryAttempt: true,
    customsDelay: true,
    frequency: "instant",
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00"
    }
  });

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Shipnix-Express", {
          body: "Notifications enabled! You'll receive updates about your packages.",
          icon: "/favicon.ico"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Channels
          </CardTitle>
          <CardDescription>
            Choose how you want to receive delivery updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-blue-500" />
              <Label>Push Notifications</Label>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) => {
                updatePreference("pushNotifications", checked);
                if (checked) requestNotificationPermission();
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-green-500" />
              <Label>Email Notifications</Label>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => updatePreference("emailNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              <Label>SMS Notifications</Label>
            </div>
            <Switch
              checked={preferences.smsNotifications}
              onCheckedChange={(checked) => updatePreference("smsNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Events</CardTitle>
          <CardDescription>
            Select which delivery events you want to be notified about
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "packageShipped", label: "Package Shipped", icon: Package },
            { key: "inTransit", label: "In Transit Updates", icon: Truck },
            { key: "outForDelivery", label: "Out for Delivery", icon: MapPin },
            { key: "delivered", label: "Package Delivered", icon: Package },
            { key: "deliveryAttempt", label: "Failed Delivery Attempt", icon: Clock },
            { key: "customsDelay", label: "Customs Delays", icon: Clock }
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-blue-500" />
                <Label>{label}</Label>
              </div>
              <Switch
                checked={preferences[key as keyof NotificationPreferences] as boolean}
                onCheckedChange={(checked) => updatePreference(key as keyof NotificationPreferences, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Frequency</CardTitle>
          <CardDescription>
            Control how often you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Update Frequency</Label>
            <Select value={preferences.frequency} onValueChange={(value) => updatePreference("frequency", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="hourly">Hourly Summary</SelectItem>
                <SelectItem value="daily">Daily Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Quiet Hours</Label>
              <Switch
                checked={preferences.quietHours.enabled}
                onCheckedChange={(checked) => 
                  updatePreference("quietHours", { ...preferences.quietHours, enabled: checked })
                }
              />
            </div>
            
            {preferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="space-y-2">
                  <Label className="text-sm">From</Label>
                  <Select 
                    value={preferences.quietHours.start} 
                    onValueChange={(value) => 
                      updatePreference("quietHours", { ...preferences.quietHours, start: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">To</Label>
                  <Select 
                    value={preferences.quietHours.end} 
                    onValueChange={(value) => 
                      updatePreference("quietHours", { ...preferences.quietHours, end: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="btn-gradient">
          Save Notification Preferences
        </Button>
      </div>
    </div>
  );
}