import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen py-16 bg-soft-blue">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          <Card className="border-0 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-large hover:ring-1 hover:ring-[hsl(215_25%_85%)] hover:ring-offset-2 hover:ring-offset-[hsl(210_20%_98%)] dark:hover:ring-offset-[hsl(220_15%_8%)]">
            <CardContent className="p-8 md:p-10">
            <h1
              className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
              style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui' }}
            >
              About US
            </h1>
            <div
              className="prose prose-neutral max-w-none text-base leading-7"
              style={{ fontFamily: 'Open Sans, ui-sans-serif, system-ui' }}
            >
              <p>
                Well, it is often said God’s greatest creation is Humanity, and Humanity’s greatest creation is Technology. It is undeniable that with the passage of time some epoch-making technological inventions have changed human life for ever. Industrial Revolution, Computer invention, Internet revolution, Social media revolution etc have truly contributed to the Power of humanity to control the nature.
              </p>
              <p>
                In line with this, the advent of Artificial Intelligence has also created a revolution in life of Humanity in almost every sphere, from personal to professional, from cooking  to coding, from seven to seventy. AI-empowerment, thus, has become more important than any other empowerment.
              </p>
              <p>
                To equip you with this empowerment, ‘Aitians’ has come up to open the griffyndor of AI to experience the magic through professional courses, news,  services, consultancy in a single platform. As the World has been on a reset mode, it is your turn to be rest with ‘Aitians’.
              </p>
              <p>
                Finally, Aitians is here to make Artificial Intelligence your best assistant, not your master. Your master is your Original Intelligence blessed by GOD. Anything Original is always brighter than Artificial. Period.
              </p>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


