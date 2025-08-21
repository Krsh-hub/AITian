import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supportedUPIApps, upiAppCategories } from "@/data/payment";
import { Smartphone, Star, TrendingUp, Shield, Zap, ExternalLink } from "lucide-react";

const UPIDemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-800">UPI Payment Apps Showcase</h1>
          <p className="text-xl text-gray-600">Discover all supported UPI applications for CourseCraft</p>
          <div className="flex justify-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {supportedUPIApps.length}+ Apps
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Instant Payments
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Zero Fees
            </Badge>
          </div>
        </div>

        {/* UPI Benefits */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <CardTitle className="text-2xl">Why Choose UPI?</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Instant</h3>
                <p className="text-sm text-gray-600">Real-time payments with no waiting time</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Secure</h3>
                <p className="text-sm text-gray-600">Bank-grade security with UPI encryption</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Free</h3>
                <p className="text-sm text-gray-600">Zero transaction fees on all UPI payments</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Easy</h3>
                <p className="text-sm text-gray-600">Simple one-click payments from any device</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UPI Apps by Category */}
        {upiAppCategories.map((category) => (
          <Card key={category.category} className="mb-8 border-0 shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center space-x-2">
                <span className="text-xl">{category.category}</span>
                <Badge variant="outline">
                  {category.apps.length} apps
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.apps.map((appName) => {
                  const app = supportedUPIApps.find(a => a.name === appName);
                  if (!app) return null;
                  
                  return (
                    <Card
                      key={app.name}
                      className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50 overflow-hidden"
                    >
                      <CardContent className="p-4 text-center space-y-3">
                        {/* App Logo */}
                        <div className="relative">
                          <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-200">
                            {app.logo ? (
                              <img
                                src={app.logo}
                                alt={app.name}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget.nextElementSibling;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="w-12 h-12 hidden items-center justify-center text-3xl">
                              {app.icon}
                            </div>
                          </div>
                          
                          {/* Popular Badge */}
                          {["Google Pay", "PhonePe", "Paytm", "BHIM"].includes(app.name) && (
                            <div className="absolute -top-2 -right-2">
                              <Star className="h-5 w-5 text-yellow-500 fill-current" />
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

                        {/* Brand Color and Actions */}
                        <div className="flex items-center justify-between">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: app.brandColor }}
                          ></div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Call to Action */}
        <Card className="text-center border-0 shadow-lg bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-green-100 mb-6">
              Choose any UPI app and enroll in our courses instantly!
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Smartphone className="mr-2 h-5 w-5" />
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UPIDemoPage;


