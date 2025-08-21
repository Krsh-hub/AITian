import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supportedUPIApps, upiAppCategories } from "@/data/payment";
import { Smartphone, Star, TrendingUp, Shield, Zap } from "lucide-react";
import UPIIcon from "./UPIIcon";

interface UPIAppShowcaseProps {
  onAppSelect?: (appName: string) => void;
  showCategories?: boolean;
}

const UPIAppShowcase = ({ onAppSelect, showCategories = true }: UPIAppShowcaseProps) => {
  const [selectedCategory, setSelectedCategory] = useState("Popular");

  const handleAppClick = (appName: string) => {
    if (onAppSelect) {
      onAppSelect(appName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 animate-in slide-in-from-top-4 duration-700">
        <h3 className="text-xl font-bold text-gray-800 animate-in fade-in duration-1000 delay-200">Choose Your UPI App</h3>
        <p className="text-sm text-gray-600 animate-in fade-in duration-1000 delay-400">All major UPI apps supported for instant payments</p>
      </div>

      {/* UPI Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200 animate-in slide-in-from-left-4 duration-700 delay-300 hover:scale-105 hover:shadow-md transition-all duration-300">
          <Zap className="h-6 w-6 text-green-600 mx-auto mb-2 animate-pulse" />
          <p className="text-xs font-medium text-green-800">Instant</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 animate-in slide-in-from-top-4 duration-700 delay-400 hover:scale-105 hover:shadow-md transition-all duration-300">
          <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2 animate-pulse" />
          <p className="text-xs font-medium text-blue-800">Secure</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200 animate-in slide-in-from-top-4 duration-700 delay-500 hover:scale-105 hover:shadow-md transition-all duration-300">
          <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2 animate-pulse" />
          <p className="text-xs font-medium text-purple-800">Free</p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200 animate-in slide-in-from-right-4 duration-700 delay-600 hover:scale-105 hover:shadow-md transition-all duration-300">
          <Smartphone className="h-6 w-6 text-orange-600 mx-auto mb-2 animate-pulse" />
          <p className="text-xs font-medium text-orange-800">Easy</p>
        </div>
      </div>

      {/* Categories */}
      {showCategories && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {upiAppCategories.map((category) => (
              <Badge
                key={category.category}
                variant={selectedCategory === category.category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSelectedCategory(category.category)}
              >
                {category.category}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Apps Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {supportedUPIApps
          .filter(app => 
            !showCategories || 
            upiAppCategories.find(cat => cat.category === selectedCategory)?.apps.includes(app.name)
          )
          .map((app) => (
            <Card
              key={app.name}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 hover:scale-105 animate-in slide-in-from-bottom-4 duration-700"
              onClick={() => handleAppClick(app.name)}
              style={{
                animationDelay: `${Math.random() * 500}ms`
              }}
            >
              <CardContent className="p-4 text-center space-y-3">
                {/* App Logo */}
                                 <div className="relative">
                   <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-200">
                     <UPIIcon 
                       appName={app.name} 
                       size={40} 
                       className="object-contain"
                     />
                   </div>
                  
                  {/* Popular Badge */}
                  {["Google Pay", "PhonePe", "Paytm", "BHIM"].includes(app.name) && (
                    <div className="absolute -top-2 -right-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  )}
                </div>

                {/* App Name */}
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-gray-800 group-hover:text-primary transition-colors">
                    {app.name}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {app.description}
                  </p>
                </div>

                {/* Brand Color Indicator */}
                <div className="flex justify-center space-x-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: app.brandColor }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3">
        <Button variant="outline" className="flex-1">
          <Smartphone className="h-4 w-4 mr-2" />
          Open Any UPI App
        </Button>
        <Button variant="outline" className="flex-1">
          📱 Scan QR Code
        </Button>
      </div>
    </div>
  );
};

export default UPIAppShowcase;
