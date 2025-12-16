import { motion } from "framer-motion";
import { 
  Target, 
  Sparkles, 
  Calendar, 
  BarChart3, 
  MapPin, 
  Mail, 
  MessageSquare, 
  Zap 
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Full Business Context",
    description: "Unlike generic AI tools, Kindra learns your brand, goals, pricing, and capacity to give relevant advice—not cookie-cutter content.",
    color: "coral",
  },
  {
    icon: Sparkles,
    title: "AI Strategy Engine",
    description: "Get personalized marketing plans that prioritize revenue. Know exactly where to focus your limited time for maximum impact.",
    color: "teal",
  },
  {
    icon: Calendar,
    title: "Smart Content Generation",
    description: "Platform-specific posts, emails, and outreach crafted in your voice. Review once, or let it run on autopilot.",
    color: "coral",
  },
  {
    icon: BarChart3,
    title: "Revenue-First Analytics",
    description: "Track what actually matters: sales, leads, and conversions—not vanity metrics that don't pay the bills.",
    color: "teal",
  },
  {
    icon: MapPin,
    title: "Local Opportunity Finder",
    description: "Discover markets, fairs, pop-ups, and partnership opportunities in your area matched to your products.",
    color: "coral",
  },
  {
    icon: Mail,
    title: "Automated Outreach",
    description: "From retailer pitches to event applications, Kindra handles the tedious outreach so you can focus on creating.",
    color: "teal",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <Zap className="w-4 h-4 text-coral" />
            <span className="text-sm font-medium">Powerful Features</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Grow Sales</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Marketing that actually understands the creative business. Built for makers, 
            artists, and small businesses who want customers—not just followers.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div 
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                  feature.color === "coral" 
                    ? "bg-coral/10 text-coral" 
                    : "bg-teal/10 text-teal"
                }`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span>Trusted by 2,400+ creative businesses worldwide</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
