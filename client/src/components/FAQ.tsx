import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MessageCircle, Mail, Phone } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "shipping" | "tracking" | "payment" | "general";
}

const faqData: FAQItem[] = [
  {
    question: "How do I track my package?",
    answer: "You can track your package using the tracking ID provided when you shipped your item. Simply enter the tracking ID (format: ST-XXXXXXXXX) on our tracking page, or click the tracking link in your confirmation email.",
    category: "tracking"
  },
  {
    question: "How long does international shipping take?",
    answer: "International shipping times vary by destination. Express delivery typically takes 1-3 business days, standard delivery takes 3-7 business days, and economy delivery takes 7-14 business days. You'll receive an estimated delivery date when you create your shipment.",
    category: "shipping"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and cryptocurrencies including Bitcoin, Ethereum, and USDC. You can select your preferred payment method during checkout.",
    category: "payment"
  },
  {
    question: "Can I change the delivery address after shipping?",
    answer: "Yes, in most cases you can change the delivery address before the package reaches the destination country. Contact our support team immediately with your tracking ID, and we'll help redirect your package for a small fee.",
    category: "shipping"
  },
  {
    question: "What if my package is damaged or lost?",
    answer: "All packages are fully insured. If your package is damaged or lost, please contact our support team within 48 hours with your tracking ID and photos (if damaged). We'll investigate and provide a full refund or replacement.",
    category: "general"
  },
  {
    question: "Do you ship to all countries?",
    answer: "We ship to 220+ countries and territories worldwide. Some restrictions may apply to certain items or destinations due to customs regulations. Check our shipping calculator for availability to your destination.",
    category: "shipping"
  },
  {
    question: "How do I calculate shipping costs?",
    answer: "Use our online shipping calculator by entering the package dimensions, weight, origin, and destination. Costs depend on size, weight, delivery speed, and destination. You'll get an instant quote before booking.",
    category: "shipping"
  },
  {
    question: "Can I schedule a pickup from my location?",
    answer: "Yes! We offer free pickup services in major cities. You can schedule a pickup when creating your shipment, or contact our support team to arrange a pickup time that works for you.",
    category: "shipping"
  },
  {
    question: "What happens if I miss a delivery attempt?",
    answer: "We'll make 3 delivery attempts. After each failed attempt, you'll receive a notification with options to reschedule delivery, redirect to a nearby pickup point, or authorize a safe drop-off location.",
    category: "tracking"
  },
  {
    question: "How do I get a refund?",
    answer: "Refunds are processed according to our refund policy. Contact our support team with your tracking ID and reason for refund. Most refunds are processed within 5-7 business days to your original payment method.",
    category: "payment"
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const categories = [
    { key: "all", label: "All Questions" },
    { key: "shipping", label: "Shipping" },
    { key: "tracking", label: "Tracking" },
    { key: "payment", label: "Payment" },
    { key: "general", label: "General" }
  ];

  const filteredFAQ = activeCategory === "all" 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Find quick answers to common questions about our shipping services
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={activeCategory === category.key ? "default" : "outline"}
            onClick={() => setActiveCategory(category.key)}
            className={activeCategory === category.key ? "btn-gradient" : ""}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4 mb-8">
        {filteredFAQ.map((item, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleItem(index)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium pr-4">
                  {item.question}
                </CardTitle>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            </CardHeader>
            {openItems.includes(index) && (
              <CardContent className="pt-0">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.answer}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Contact Support */}
      <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
            Still Have Questions?
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Our support team is here to help 24/7
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/50">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Live Chat</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/50">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Email Support</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/50">
              <Phone className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Call Us</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}