import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp, Users, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-gradient-hero">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-coral/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-coral/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8"
          >
            <Zap className="w-4 h-4 text-coral" />
            <span className="text-sm font-medium text-foreground">AI-Powered Marketing for Creatives</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6"
          >
            Turn Your Craft Into{" "}
            <span className="text-gradient">Paying Customers</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            The AI marketing copilot that actually understands your business. 
            Get data-driven strategies, automated content, and real sales—not just likes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/onboarding">Start Free <ArrowRight className="w-5 h-5 ml-1" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Play className="w-5 h-5 mr-1" /> Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto"
          >
            {[
              { icon: TrendingUp, value: "3.2x", label: "Avg. Sales Lift" },
              { icon: Users, value: "2,400+", label: "Creators" },
              { icon: Zap, value: "50hrs", label: "Saved Monthly" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-2">
                  <stat.icon className="w-5 h-5 text-coral" />
                </div>
                <div className="font-display text-2xl md:text-3xl font-semibold">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
            {/* Window header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-coral/60" />
                <div className="w-3 h-3 rounded-full bg-teal/60" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground">Kindra Dashboard</span>
              </div>
            </div>
            
            {/* Dashboard content placeholder */}
            <div className="p-6 md:p-8 bg-gradient-card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "This Week's Revenue", value: "$1,247", change: "+23%" },
                  { label: "New Leads", value: "34", change: "+12%" },
                  { label: "Email Opens", value: "68%", change: "+8%" },
                ].map((metric, i) => (
                  <div key={i} className="p-4 rounded-xl bg-background border border-border">
                    <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold">{metric.value}</span>
                      <span className="text-sm text-teal font-medium">{metric.change}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-coral" />
                    </div>
                    <span className="font-medium">AI Strategy Insight</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    &quot;Your email list converts 4x better than Instagram. Focus on growing subscribers this week. I&apos;ve drafted 3 campaigns ready for review.&quot;
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-teal" />
                    </div>
                    <span className="font-medium">Local Opportunity</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    &quot;Maker&apos;s Market is happening in 12 days. Based on your products, you could generate $800-1,200. Want me to draft outreach?&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
