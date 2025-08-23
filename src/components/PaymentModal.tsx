import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone } from "lucide-react";
import { PaymentRequest } from "@/types/payment";
import { useToast } from "@/hooks/use-toast";
import { paymentService } from "@/services/paymentService";
import { upiDetails } from "@/data/payment";

interface PaymentModalProps {
	isOpen: boolean;
	onClose: () => void;
	courseId: string;
	courseTitle: string;
	amount: number;
	originalPrice?: number;
}

const PaymentModal = ({ isOpen, onClose, courseId, courseTitle, amount }: PaymentModalProps) => {
	const [method, setMethod] = useState<"upi" | "card">("upi");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	// Card only
	const [cardNumber, setCardNumber] = useState("");
	const [cardExpiry, setCardExpiry] = useState("");
	const [cardCvv, setCardCvv] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const { toast } = useToast();

	const upiLink = paymentService.generateUPIPaymentLink(
		upiDetails.upiId,
		amount,
		upiDetails.merchantName,
		`Course: ${courseTitle}`
	);

	const handlePay = async () => {
		const req: PaymentRequest = {
			courseId,
			courseTitle,
			amount,
			currency: "INR",
			customerName: name,
			customerEmail: email,
			customerPhone: phone,
			paymentMethod: method,
		};

		const validation = paymentService.validatePaymentRequest(req);
		if (!validation.isValid) {
			toast({ title: "Validation error", description: validation.errors.join(", "), variant: "destructive" });
			return;
		}

		// For demo: basic card field checks if method is card
		if (method === "card") {
			if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
				toast({ title: "Card details required", description: "Enter card number, expiry and CVV", variant: "destructive" });
				return;
			}
		}

		setIsProcessing(true);
		try {
			const res = await paymentService.processPayment(req);
			if (res.success) {
				toast({ title: "Payment successful", description: `Transaction: ${res.transactionId}` });
				onClose();
				window.location.href = res.redirectUrl || `/course/${courseId}`;
			} else {
				toast({ title: "Payment failed", description: res.message, variant: "destructive" });
			}
		} catch (e) {
			toast({ title: "Payment error", description: "Please try again.", variant: "destructive" });
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-xl">Pay and Enroll</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div>
						<p className="text-sm text-muted-foreground">Course</p>
						<p className="font-medium">{courseTitle}</p>
						<p className="mt-1 text-2xl font-bold">₹{amount.toLocaleString()}</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="name">Full name</Label>
							<Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
						</div>
						<div>
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
						</div>
						<div>
							<Label htmlFor="phone">Phone</Label>
							<Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
						</div>
					</div>

					<Tabs value={method} onValueChange={(v) => setMethod(v as any)}>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="upi" className="flex items-center gap-2">
								<Smartphone className="h-4 w-4" /> UPI
							</TabsTrigger>
							<TabsTrigger value="card" className="flex items-center gap-2">
								<CreditCard className="h-4 w-4" /> Card
							</TabsTrigger>
						</TabsList>

						<TabsContent value="upi" className="space-y-3 pt-4">
							<p className="text-sm text-muted-foreground">You will be redirected to your UPI app. Merchant UPI ID: <span className="font-mono">{upiDetails.upiId}</span></p>
							<div className="flex gap-2">
								<Button variant="outline" onClick={() => window.open(upiLink, "_blank")}>Open UPI app</Button>
								<Button onClick={handlePay} disabled={isProcessing}>{isProcessing ? "Processing..." : `Pay ₹${amount.toLocaleString()}`}</Button>
							</div>
						</TabsContent>

						<TabsContent value="card" className="space-y-3 pt-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<div className="md:col-span-2">
									<Label htmlFor="cardNumber">Card number</Label>
									<Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" />
								</div>
								<div>
									<Label htmlFor="cardExpiry">Expiry</Label>
									<Input id="cardExpiry" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" />
								</div>
								<div>
									<Label htmlFor="cardCvv">CVV</Label>
									<Input id="cardCvv" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="123" />
								</div>
							</div>
							<Button onClick={handlePay} disabled={isProcessing} className="w-full">{isProcessing ? "Processing..." : `Pay ₹${amount.toLocaleString()}`}</Button>
						</TabsContent>
					</Tabs>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PaymentModal;
