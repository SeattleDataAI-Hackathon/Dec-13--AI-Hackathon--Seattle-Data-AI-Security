'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Target, 
  Package, 
  MapPin, 
  Share2,
  Sparkles,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface OnboardingData {
  businessName: string;
  industry: string;
  primaryGoal: string;
  productType: string;
  priceRange: string;
  location: string;
  capacity: string;
  platforms: string[];
}

const initialData: OnboardingData = {
  businessName: "",
  industry: "",
  primaryGoal: "",
  productType: "",
  priceRange: "",
  location: "",
  capacity: "",
  platforms: [],
};

const steps = [
  { id: 1, title: "Business Info", icon: Building2 },
  { id: 2, title: "Goals", icon: Target },
  { id: 3, title: "Products", icon: Package },
  { id: 4, title: "Location", icon: MapPin },
  { id: 5, title: "Platforms", icon: Share2 },
];

const industries = [
  "Handmade Crafts",
  "Art & Illustration",
  "Photography",
  "Jewelry",
  "Clothing & Fashion",
  "Food & Beverage",
  "Home Decor",
  "Beauty & Skincare",
  "Digital Products",
  "Services",
  "Other",
];

const goals = [
  { id: "sales", label: "Increase Sales", description: "Drive more revenue from existing products" },
  { id: "awareness", label: "Build Awareness", description: "Get discovered by new potential customers" },
  { id: "events", label: "Event Turnout", description: "Fill your workshops, markets, and pop-ups" },
  { id: "commissions", label: "Get Commissions", description: "Attract custom order requests" },
  { id: "wholesale", label: "Retail/Wholesale", description: "Partner with stores and retailers" },
];

const priceRanges = [
  "Under $25",
  "$25 - $50",
  "$50 - $100",
  "$100 - $250",
  "$250 - $500",
  "$500+",
];

const capacityOptions = [
  "Just me, limited capacity",
  "Small batch (5-20 items/week)",
  "Growing production (20-50 items/week)",
  "Established production (50+ items/week)",
  "Digital/unlimited capacity",
];

const platformOptions = [
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "tiktok", label: "TikTok", icon: "🎵" },
  { id: "etsy", label: "Etsy", icon: "🛍️" },
  { id: "shopify", label: "Shopify", icon: "🏪" },
  { id: "email", label: "Email Marketing", icon: "📧" },
  { id: "pinterest", label: "Pinterest", icon: "📌" },
  { id: "facebook", label: "Facebook", icon: "👥" },
  { id: "markets", label: "Local Markets", icon: "🎪" },
];

export const StartWizard = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateData = (key: keyof OnboardingData, value: string | string[]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const togglePlatform = (platformId: string) => {
    setData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerateStrategy = async () => {
    setIsGenerating(true);
    
    // Store the business data in localStorage for the dashboard
    localStorage.setItem('cocreator_business', JSON.stringify(data));
    
    // Simulate AI strategy generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Strategy generated successfully!");
    router.push('/dashboard');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.businessName && data.industry;
      case 2:
        return data.primaryGoal;
      case 3:
        return data.productType && data.priceRange;
      case 4:
        return data.location && data.capacity;
      case 5:
        return data.platforms.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Co-Creator</span>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            Let&apos;s Get to Know Your Business
          </h1>
          <p className="text-muted-foreground text-sm">
            We&apos;ll create a personalized marketing strategy based on your unique context.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : currentStep > step.id
                    ? "bg-primary/60 text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-1 mx-1 rounded-full transition-colors duration-300 ${
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Business Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">
                      Tell us about your business
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      This helps us understand your brand and create relevant strategies.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Business Name
                      </label>
                      <Input
                        placeholder="e.g., Luna Ceramics"
                        value={data.businessName}
                        onChange={(e) => updateData("businessName", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        What best describes your business?
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {industries.map((industry) => (
                          <button
                            key={industry}
                            onClick={() => updateData("industry", industry)}
                            className={`p-3 rounded-xl text-sm text-left border transition-all duration-200 ${
                              data.industry === industry
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {industry}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Goals */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">
                      What&apos;s your primary goal?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll prioritize strategies that help you achieve this.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {goals.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => updateData("primaryGoal", goal.id)}
                        className={`w-full p-4 rounded-xl text-left border transition-all duration-200 ${
                          data.primaryGoal === goal.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium">{goal.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {goal.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Products */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">
                      About your products
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Understanding your offerings helps us recommend the right channels.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Describe your main product/service
                      </label>
                      <Input
                        placeholder="e.g., Handmade ceramic mugs and bowls"
                        value={data.productType}
                        onChange={(e) => updateData("productType", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Typical price range
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {priceRanges.map((range) => (
                          <button
                            key={range}
                            onClick={() => updateData("priceRange", range)}
                            className={`p-3 rounded-xl text-sm border transition-all duration-200 ${
                              data.priceRange === range
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Location & Capacity */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">
                      Location & Capacity
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll find local opportunities and scale recommendations to your capacity.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Where are you based?
                      </label>
                      <Input
                        placeholder="e.g., Austin, TX"
                        value={data.location}
                        onChange={(e) => updateData("location", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        What&apos;s your production capacity?
                      </label>
                      <div className="space-y-2">
                        {capacityOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => updateData("capacity", option)}
                            className={`w-full p-3 rounded-xl text-sm text-left border transition-all duration-200 ${
                              data.capacity === option
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Platforms */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">
                      Where do you want to market?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Select all the platforms you&apos;re interested in. We&apos;ll recommend which to prioritize.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {platformOptions.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                          data.platforms.includes(platform.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{platform.icon}</span>
                        <span className="font-medium text-sm">{platform.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep === steps.length ? (
              <Button
                disabled={!canProceed() || isGenerating}
                onClick={handleGenerateStrategy}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate My Strategy
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={nextStep}
                disabled={!canProceed()}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>

        {/* Trust */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Your data is secure and never shared. We use it only to personalize your experience.
        </p>
      </div>
    </div>
  );
};
