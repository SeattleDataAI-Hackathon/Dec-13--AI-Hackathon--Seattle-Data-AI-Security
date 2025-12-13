import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Tell Us About Your Business",
    description: "Share your brand, products, goals, and capacity. Upload your brand guide, connect socials, or just fill in the basics.",
    features: [
      "Brand & product info",
      "Sales goals & price points",
      "Preferred platforms",
      "Location & capacity",
    ],
  },
  {
    number: "02",
    title: "Get Your AI Strategy",
    description: "Our Strategy Agent analyzes your context and market to create a personalized marketing plan focused on revenue, not engagement.",
    features: [
      "Platform recommendations",
      "Optimal posting cadence",
      "Content themes that sell",
      "Local opportunity alerts",
    ],
  },
  {
    number: "03",
    title: "Review & Automate",
    description: "Approve AI-generated content or let it run automatically. Posts, emails, and outreach—all in your unique voice.",
    features: [
      "Platform-specific content",
      "Email campaigns",
      "Event & retail outreach",
      "Choose your automation level",
    ],
  },
  {
    number: "04",
    title: "Track & Optimize",
    description: "Watch your sales grow with analytics that explain what's working and automatically adjust your strategy.",
    features: [
      "Revenue-focused metrics",
      "Conversion tracking",
      "AI-powered insights",
      "Continuous optimization",
    ],
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            How <span className="text-gradient">Kindra</span> Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From setup to sales in four simple steps. Your AI marketing team 
            handles the heavy lifting while you focus on what you love.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 bottom-0 w-px bg-border hidden md:block" />
              )}
              
              <div className="flex gap-6 md:gap-8 pb-12 last:pb-0">
                {/* Step number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-lg shadow-coral/20">
                    <span className="font-display text-xl font-semibold text-primary-foreground">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="font-display text-xl md:text-2xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-lg">
                    {step.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {step.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <Button size="lg" asChild>
            <Link href="/onboarding">Get Started Free <ArrowRight className="w-5 h-5 ml-1" /></Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • Free 14-day trial
          </p>
        </motion.div>
      </div>
    </section>
  );
};
