import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Copy, CreditCard, Smartphone, Building2, Wallet, QrCode } from "lucide-react";
import { paymentMethods, upiDetails, supportedUPIApps } from "@/data/payment";
import { PaymentRequest, PaymentResponse } from "@/types/payment";
import { useToast } from "@/hooks/use-toast";
import { paymentService } from "@/services/paymentService";
import UPIAppShowcase from "./UPIAppShowcase";
import UPIIcon from "./UPIIcon";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  amount: number;
  originalPrice?: number;
}

const PaymentModal = ({ isOpen, onClose, courseId, courseTitle, amount, originalPrice }: PaymentModalProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    // Validate payment request
    const paymentRequest: PaymentRequest = {
      courseId,
      courseTitle,
      amount,
      currency: "INR",
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod: selectedPaymentMethod,
    };

    const validation = paymentService.validatePaymentRequest(paymentRequest);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Process payment using the payment service
      const response = await paymentService.processPayment(paymentRequest);

      if (response.success) {
        toast({
          title: "Payment Successful!",
          description: `Transaction ID: ${response.transactionId}`,
        });
        
        // Close modal and redirect
        setTimeout(() => {
          onClose();
          window.location.href = response.redirectUrl || `/course/${courseId}`;
        }, 2000);
      } else {
        toast({
          title: "Payment Failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText(upiDetails.upiId);
    toast({
      title: "UPI ID Copied!",
      description: "UPI ID has been copied to clipboard",
    });
  };

  const generateUPILink = () => {
    return paymentService.generateUPIPaymentLink(
      upiDetails.upiId,
      amount,
      upiDetails.merchantName,
      `CourseCraft: ${courseTitle}`
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Complete Your Enrollment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
                      {/* UPI Apps Showcase Banner */}
            <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-xl p-6 text-white animate-in slide-in-from-top-4 duration-700">
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold animate-in fade-in duration-1000 delay-300">💳 Multiple UPI Payment Options</h3>
                <p className="text-green-100 animate-in fade-in duration-1000 delay-500">Choose from 9+ popular UPI apps for instant payments</p>
                <div className="flex justify-center space-x-2 pt-2">
                  {supportedUPIApps.slice(0, 6).map((app, index) => (
                    <div
                      key={app.name}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-110 hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:rotate-3"
                      title={app.name}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'slideInFromBottom 0.6s ease-out forwards'
                      }}
                    >
                      <UPIIcon 
                        appName={app.name} 
                        size={20} 
                        className="object-contain"
                      />
                    </div>
                  ))}
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-110 hover:bg-white/30 transition-all duration-300 animate-in slide-in-from-bottom-4 duration-700 delay-700">
                    <span className="text-xs">+3</span>
                  </div>
                </div>
              </div>
            </div>

          {/* Course Summary */}
          <Card className="border-2 border-primary/20 animate-in slide-in-from-left-4 duration-700 delay-200 hover:shadow-lg hover:border-primary/40 transition-all duration-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg animate-in fade-in duration-1000 delay-400">{courseTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between animate-in slide-in-from-right-4 duration-700 delay-500">
                <span className="text-muted-foreground">Course Price:</span>
                <div className="flex items-center space-x-2">
                  {originalPrice && (
                    <span className="text-muted-foreground line-through animate-in fade-in duration-1000 delay-600">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-primary animate-pulse">
                    ₹{amount.toLocaleString()}
                  </span>
                </div>
              </div>
              {originalPrice && (
                <div className="text-right animate-in slide-in-from-bottom-4 duration-700 delay-700">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 animate-bounce">
                    Save ₹{(originalPrice - amount).toLocaleString()}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <h3 className="text-lg font-semibold animate-in fade-in duration-1000 delay-400">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 animate-in slide-in-from-left-4 duration-700 delay-500 hover:scale-105 transition-transform duration-300">
                <Label htmlFor="name" className="animate-in fade-in duration-1000 delay-600">Full Name *</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="focus:scale-105 focus:shadow-lg transition-all duration-300"
                />
              </div>
              <div className="space-y-2 animate-in slide-in-from-right-4 duration-700 delay-600 hover:scale-105 transition-transform duration-300">
                <Label htmlFor="email" className="animate-in fade-in duration-1000 delay-700">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="focus:scale-105 focus:shadow-lg transition-all duration-300"
                />
              </div>
              <div className="space-y-2 animate-in slide-in-from-left-4 duration-700 delay-700 hover:scale-105 transition-transform duration-300">
                <Label htmlFor="phone" className="animate-in fade-in duration-1000 delay-800">Phone Number *</Label>
                <Input
                  id="phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="focus:scale-105 focus:shadow-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-400">
            <h3 className="text-lg font-semibold animate-in fade-in duration-1000 delay-500">Choose Payment Method</h3>
            <Tabs value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <TabsList className="grid w-full grid-cols-4 animate-in slide-in-from-top-4 duration-700 delay-600">
                <TabsTrigger value="upi" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
                  <Smartphone className="h-4 w-4 animate-pulse" />
                  <span className="hidden sm:inline">UPI</span>
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
                  <CreditCard className="h-4 w-4 animate-pulse" />
                  <span className="hidden sm:inline">Card</span>
                </TabsTrigger>
                <TabsTrigger value="netbanking" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
                  <Building2 className="h-4 w-4 animate-pulse" />
                  <span className="hidden sm:inline">NetBank</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
                  <Wallet className="h-4 w-4 animate-pulse" />
                  <span className="hidden sm:inline">Wallet</span>
                </TabsTrigger>
              </TabsList>

              {/* UPI Payment Tab */}
              <TabsContent value="upi" className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                <Card className="hover:shadow-lg transition-all duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 animate-in fade-in duration-1000 delay-300">
                      <Smartphone className="h-5 w-5 text-green-600 animate-pulse" />
                      <span>UPI Payment</span>
                    </CardTitle>
                  </CardHeader>
                                     <CardContent className="space-y-6">
                     {/* UPI App Showcase */}
                     <div className="text-center space-y-3">
                       <h4 className="text-lg font-semibold text-gray-800">Choose Your Preferred UPI App</h4>
                       <p className="text-sm text-gray-600">All major UPI apps are supported for instant payments</p>
                     </div>

                     {/* UPI ID Section */}
                     <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200 animate-in slide-in-from-left-4 duration-700 delay-400 hover:shadow-md transition-all duration-500">
                       <div className="flex items-center justify-between">
                         <div className="space-y-1">
                           <p className="font-semibold text-green-800 text-lg animate-in fade-in duration-1000 delay-500">UPI ID: {upiDetails.upiId}</p>
                           <p className="text-sm text-green-600 animate-in fade-in duration-1000 delay-600">Merchant: {upiDetails.merchantName}</p>
                           <p className="text-xs text-green-500 animate-in fade-in duration-1000 delay-700">Copy this UPI ID and paste in any UPI app</p>
                         </div>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={copyUPIId}
                           className="border-green-300 text-green-700 hover:bg-green-100 hover:scale-110 transition-all duration-300 animate-bounce"
                         >
                           <Copy className="h-4 w-4 mr-2" />
                           Copy UPI ID
                         </Button>
                       </div>
                     </div>

                                         {/* UPI Apps Showcase */}
                     <UPIAppShowcase 
                       onAppSelect={(appName) => {
                         // Handle app selection - could open specific app or show instructions
                         toast({
                           title: `${appName} Selected`,
                           description: `Opening ${appName} for payment...`,
                         });
                         setTimeout(() => {
                           window.open(generateUPILink(), '_blank');
                         }, 1000);
                       }}
                       showCategories={false}
                     />

                                         {/* Payment Methods */}
                     <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-700 delay-600">
                       <div className="grid grid-cols-2 gap-3">
                         <Button
                           variant="outline"
                           className="w-full h-12 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 hover:scale-105 transition-all duration-300 animate-in slide-in-from-left-4 duration-700 delay-700"
                           onClick={() => setShowQRCode(true)}
                         >
                           <QrCode className="h-5 w-5 mr-2 text-blue-600 animate-pulse" />
                           <span className="font-medium">Scan QR Code</span>
                         </Button>
                         
                         <Button
                           variant="outline"
                           className="w-full h-12 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 hover:scale-105 transition-all duration-300 animate-in slide-in-from-right-4 duration-700 delay-800"
                           onClick={() => window.open(generateUPILink(), '_blank')}
                         >
                           <Smartphone className="h-5 w-5 mr-2 text-green-600 animate-pulse" />
                           <span className="font-medium">Open UPI App</span>
                         </Button>
                       </div>
                     </div>

                     {/* UPI Benefits */}
                     <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                       <div className="flex items-start space-x-3">
                         <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                           <span className="text-green-600 text-sm">✨</span>
                         </div>
                         <div className="space-y-2">
                           <p className="text-sm font-medium text-green-800">
                             Why choose UPI?
                           </p>
                           <ul className="text-xs text-green-700 space-y-1">
                             <li>• Instant payments - No waiting time</li>
                             <li>• Zero transaction fees</li>
                             <li>• Works with any bank account</li>
                             <li>• Most secure payment method</li>
                           </ul>
                         </div>
                       </div>
                     </div>

                     {/* How to Pay Instructions */}
                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                       <div className="flex items-start space-x-3">
                         <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                           <span className="text-blue-600 text-sm">💡</span>
                         </div>
                         <div className="space-y-2">
                           <p className="text-sm font-medium text-blue-800">
                             How to pay with UPI:
                           </p>
                           <ul className="text-xs text-blue-700 space-y-1">
                             <li>• Copy the UPI ID above and paste in any UPI app</li>
                             <li>• Scan the QR code with your preferred UPI app</li>
                             <li>• Click on any UPI app icon to open directly</li>
                             <li>• Enter amount: ₹{amount.toLocaleString()} and pay</li>
                           </ul>
                         </div>
                       </div>
                     </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Card Payment Tab */}
              <TabsContent value="card" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span>Card Payment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input id="cardName" placeholder="Enter cardholder name" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Net Banking Tab */}
              <TabsContent value="netbanking" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-purple-600" />
                      <span>Net Banking</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Select your bank to proceed with net banking payment
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Yes Bank"].map((bank) => (
                        <Button key={bank} variant="outline" className="justify-start">
                          {bank}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wallet Tab */}
              <TabsContent value="wallet" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Wallet className="h-5 w-5 text-orange-600" />
                      <span>Digital Wallet</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {["Paytm", "PhonePe", "Amazon Pay", "MobiKwik"].map((wallet) => (
                        <Button key={wallet} variant="outline" className="justify-start">
                          {wallet}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Payment Button */}
          <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-in slide-in-from-bottom-4 duration-700 delay-600"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5 animate-pulse" />
                  Pay ₹{amount.toLocaleString()} & Enroll
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground animate-in fade-in duration-1000 delay-700">
              By clicking "Pay & Enroll", you agree to our terms and conditions.
            </p>
          </div>
        </div>

        {/* Enhanced QR Code Modal */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in slide-in-from-bottom-4 duration-500 scale-in-95">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center animate-in zoom-in duration-700 delay-200">
                  <QrCode className="h-8 w-8 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold animate-in fade-in duration-1000 delay-300">UPI QR Code</h3>
                <p className="text-green-100 text-sm animate-in fade-in duration-1000 delay-400">Scan to pay instantly</p>
              </div>
              
              {/* QR Code Content */}
              <div className="p-6 space-y-6">
                {/* QR Code Display */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200 flex items-center justify-center">
                      <div className="w-48 h-48 bg-white rounded-xl shadow-lg flex items-center justify-center">
                        <QrCode className="h-32 w-32 text-gray-400" />
                      </div>
                    </div>
                    {/* UPI Logo Overlay */}
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg font-bold">UPI</span>
                    </div>
                  </div>
                </div>
                
                {/* Payment Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="font-bold text-lg text-green-600">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">UPI ID:</span>
                    <span className="font-mono text-sm text-gray-800">{upiDetails.upiId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Merchant:</span>
                    <span className="text-sm text-gray-800">{upiDetails.merchantName}</span>
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    📱 Open any UPI app and scan this QR code
                  </p>
                                     <div className="flex justify-center space-x-2">
                     {supportedUPIApps.slice(0, 4).map((app) => (
                       <div
                         key={app.name}
                         className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                         title={app.name}
                       >
                         <UPIIcon 
                           appName={app.name} 
                           size={20} 
                           className="object-contain"
                         />
                       </div>
                     ))}
                   </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowQRCode(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setShowQRCode(false);
                      window.open(generateUPILink(), '_blank');
                    }}
                  >
                    Open UPI App
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
