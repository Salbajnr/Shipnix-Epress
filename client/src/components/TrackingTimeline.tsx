import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, MapPin, Package, Truck, AlertCircle, QrCode } from "lucide-react";
import type { TrackingEvent } from "@shared/schema";
import QRCode from "qrcode";

interface TrackingTimelineProps {
  trackingId: string;
  currentStatus: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  events: TrackingEvent[];
  showQR?: boolean;
}

const statusIcons = {
  created: Package,
  picked_up: Truck,
  in_transit: Truck,
  out_for_delivery: MapPin,
  delivered: CheckCircle,
  failed_delivery: AlertCircle,
  returned: Package,
};

const statusColors = {
  created: "bg-gray-500",
  picked_up: "bg-blue-500",
  in_transit: "bg-yellow-500",
  out_for_delivery: "bg-orange-500",
  delivered: "bg-green-500",
  failed_delivery: "bg-red-500",
  returned: "bg-purple-500",
};

export function TrackingTimeline({ 
  trackingId, 
  currentStatus, 
  currentLocation, 
  estimatedDelivery, 
  actualDelivery, 
  events,
  showQR = true 
}: TrackingTimelineProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showQrCode, setShowQrCode] = useState(false);

  const generateQRCode = async () => {
    try {
      const trackingUrl = `${window.location.origin}/track/${trackingId}`;
      const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrDataUrl);
      setShowQrCode(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const formatStatus = (status: string) => {
    return status.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusStep = (status: string) => {
    const steps = ['created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
    return steps.indexOf(status) + 1;
  };

  const getCurrentStep = () => getStatusStep(currentStatus);
  const totalSteps = 5;

  return (
    <div className="space-y-6">
      {/* Header with QR Code */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Package Tracking</CardTitle>
              <p className="text-lg font-mono text-gray-600 dark:text-gray-400">{trackingId}</p>
            </div>
            {showQR && (
              <div className="flex flex-col items-end space-y-2">
                <Button variant="outline" size="sm" onClick={generateQRCode}>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR
                </Button>
                {showQrCode && qrCodeUrl && (
                  <div className="text-center">
                    <img src={qrCodeUrl} alt="QR Code" className="border rounded" />
                    <p className="text-xs text-gray-500 mt-1">Scan to track</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
              <Badge className={`${statusColors[currentStatus as keyof typeof statusColors]} text-white`}>
                {formatStatus(currentStatus)}
              </Badge>
            </div>
            {currentLocation && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Location</p>
                <p className="font-medium">{currentLocation}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {actualDelivery ? "Delivered On" : "Estimated Delivery"}
              </p>
              <p className="font-medium">
                {actualDelivery 
                  ? formatDate(actualDelivery)
                  : estimatedDelivery 
                    ? formatDate(estimatedDelivery)
                    : "TBD"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${(getCurrentStep() / totalSteps) * 100}%` }}
              />
            </div>
            
            {/* Status points */}
            <div className="relative flex justify-between">
              {['created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'].map((status, index) => {
                const isCompleted = getStatusStep(currentStatus) > index;
                const isCurrent = currentStatus === status;
                const IconComponent = statusIcons[status as keyof typeof statusIcons];
                
                return (
                  <div key={status} className="flex flex-col items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center z-10
                      ${isCompleted || isCurrent 
                        ? statusColors[status as keyof typeof statusColors] + ' text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }
                      ${isCurrent ? 'ring-4 ring-blue-200 dark:ring-blue-800' : ''}
                    `}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <p className="text-xs mt-2 text-center font-medium">
                      {formatStatus(status)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Events */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, index) => {
              const IconComponent = statusIcons[event.status as keyof typeof statusIcons] || Clock;
              
              return (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${statusColors[event.status as keyof typeof statusColors]} text-white
                  `}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {formatStatus(event.status)}
                      </h4>
                      <time className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(event.timestamp || "")}
                      </time>
                    </div>
                    {event.location && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TrackingTimeline;