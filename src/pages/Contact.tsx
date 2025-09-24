import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen py-16 bg-soft-blue">
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative">
          <Card className="border-0 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-large hover:ring-1 hover:ring-[hsl(215_25%_85%)] hover:ring-offset-2 hover:ring-offset-[hsl(210_20%_98%)] dark:hover:ring-offset-[hsl(220_15%_8%)]">
            <CardContent className="p-8 md:p-10">
            <h1
              className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
              style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui' }}
            >
              Contact Us
            </h1>
            <div
              className="space-y-4 text-base leading-7"
              style={{ fontFamily: 'Open Sans, ui-sans-serif, system-ui' }}
            >
              <p>For queries and support contact:</p>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:care@aitians.in" className="underline underline-offset-4">
                  care@aitians.in
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:9831412752" className="underline underline-offset-4">
                  9831412752
                </a>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


