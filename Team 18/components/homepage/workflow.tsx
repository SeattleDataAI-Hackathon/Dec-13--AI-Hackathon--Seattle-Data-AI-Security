import {
  ArrowPathIcon,
  CpuChipIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon,
  ServerIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedBeam } from './animated-beam';

interface WorkflowCodeExampleProps {
  isVisible: boolean;
}

// Component states for interactive feedback
type ComponentState = 'idle' | 'loading' | 'success' | 'error';

interface ComponentStates {
  userInput: ComponentState;
  aiProcessing: ComponentState;
  mcpServer: ComponentState;
  toolExecution: ComponentState;
  response: ComponentState;
}

export function WorkflowAvatarPipeline({ isVisible }: WorkflowCodeExampleProps) {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentProcessing, setCurrentProcessing] = useState<string | null>(null);

  // State management for component states
  const [componentStates, setComponentStates] = useState<ComponentStates>({
    userInput: 'idle',
    aiProcessing: 'idle',
    mcpServer: 'idle',
    toolExecution: 'idle',
    response: 'idle',
  });

  // Color scheme for different stages
  const stageColors = {
    user: {
      border: 'border-blue-300',
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      beam: '#60a5fa',
    },
    ai: {
      border: 'border-purple-300',
      text: 'text-purple-700',
      bg: 'bg-purple-50',
      beam: '#a855f7',
    },
    mcp: {
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      beam: '#10b981',
    },
    tools: {
      border: 'border-orange-300',
      text: 'text-orange-700',
      bg: 'bg-orange-50',
      beam: '#f59e0b',
    },
    response: {
      border: 'border-pink-300',
      text: 'text-pink-700',
      bg: 'bg-pink-50',
      beam: '#ec4899',
    },
  };

  // Helper function to get state icon
  // Helper function to get state icon
  const getStateIcon = (state: ComponentState, size = 'w-4 h-4') => {
    switch (state) {
      case 'loading':
        return <ArrowPathIcon className={`${size} animate-spin text-blue-500`} />;
      case 'success':
        return <CheckCircleIcon className={`${size} text-green-500`} />;
      case 'error':
        return <ExclamationCircleIcon className={`${size} text-red-500`} />;
      default:
        return null;
    }
  };

  // Helper function to update component state
  const updateComponentState = (component: keyof ComponentStates, state: ComponentState) => {
    setComponentStates((prev) => ({
      ...prev,
      [component]: state,
    }));
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Refs for workflow components
  const userInputRef = useRef<HTMLDivElement>(null);
  const aiProcessingRef = useRef<HTMLDivElement>(null);
  const mcpServerRef = useRef<HTMLDivElement>(null);
  const toolExecutionRef = useRef<HTMLDivElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  // Animation steps
  const totalSteps = 5;

  // Animation function wrapped in useCallback to prevent re-creation on every render
  const startAnimation = useCallback(() => {
    setAnimationStep(0);
    setIsAnimating(true);
    setCurrentProcessing(null);

    // Reset all component states
    setComponentStates({
      userInput: 'idle',
      aiProcessing: 'idle',
      mcpServer: 'idle',
      toolExecution: 'idle',
      response: 'idle',
    });

    const stepDurations = [
      2000, // Step 1: User Input to AI Processing
      2000, // Step 2: AI to MCP Server
      2000, // Step 3: MCP Server to Tool Execution
      2000, // Step 4: Tool Execution back to AI
      2000, // Step 5: AI to User Response
    ];

    let currentStep = 0;
    const animateNextStep = () => {
      if (currentStep < totalSteps) {
        setTimeout(() => {
          setAnimationStep(currentStep + 1);

          // State management for each step
          if (currentStep === 0) {
            // User Input to AI Processing
            setCurrentProcessing('aiProcessing');
            updateComponentState('userInput', 'success');
            updateComponentState('aiProcessing', 'loading');
          } else if (currentStep === 1) {
            // AI Processing to MCP Server
            updateComponentState('aiProcessing', 'success');
            setCurrentProcessing('mcpServer');
            updateComponentState('mcpServer', 'loading');
          } else if (currentStep === 2) {
            // MCP Server to Tool Execution
            updateComponentState('mcpServer', 'success');
            setCurrentProcessing('toolExecution');
            updateComponentState('toolExecution', 'loading');
          } else if (currentStep === 3) {
            // Tool Execution complete
            updateComponentState('toolExecution', 'success');
            setCurrentProcessing('response');
          } else if (currentStep === 4) {
            // Final response
            updateComponentState('response', 'success');
            setCurrentProcessing(null);
          }

          currentStep++;
          if (currentStep < totalSteps) {
            animateNextStep();
          } else {
            setTimeout(() => {
              setIsAnimating(false);
            }, 1000);
          }
        }, stepDurations[currentStep]);
      }
    };

    setTimeout(animateNextStep, 500);
  }, []);

  // Intersection Observer to start animation when element is in view
  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isAnimating && animationStep === 0) {
          startAnimation();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref);

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [isAnimating, animationStep, startAnimation]);

  // Auto-replay animation
  useEffect(() => {
    if (animationStep === totalSteps && !isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [animationStep, isAnimating, startAnimation]);

  // Reset animation when isVisible changes
  useEffect(() => {
    if (isVisible) {
      startAnimation();
    }
  }, [isVisible, startAnimation]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="w-full  rounded-lg p-6">
        <div className="relative w-full" ref={diagramRef}>
          {/* Main Workflow - Horizontal Flow */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
            {/* User Input */}
            <div className="flex flex-col items-center">
              <div
                ref={userInputRef}
                className={`p-6 rounded-lg border-2 ${stageColors.user.border} ${
                  stageColors.user.bg
                } transition-all duration-500 ${animationStep >= 1 ? 'shadow-lg scale-105' : ''}`}
              >
                <UserIcon className={`w-12 h-12 ${stageColors.user.text} mb-3 mx-auto`} />
                <h3 className="text-sm font-semibold text-center text-foreground">USER INPUT</h3>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  &quot;Order a latte&quot;
                </p>
              </div>
            </div>

            <ArrowPathIcon className="w-6 h-6 text-muted-foreground/50 rotate-90 lg:rotate-0" />

            {/* AI Processing */}
            <div className="flex flex-col items-center">
              <div
                ref={aiProcessingRef}
                className={`p-6 rounded-lg border-2 transition-all duration-500 ${
                  componentStates.aiProcessing === 'loading'
                    ? `${stageColors.ai.border} ${stageColors.ai.bg} shadow-lg scale-105`
                    : componentStates.aiProcessing === 'success'
                    ? `border-green-300 bg-green-50 shadow-lg scale-105`
                    : `${stageColors.ai.border} ${stageColors.ai.bg}`
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <SparklesIcon className={`w-12 h-12 ${stageColors.ai.text}`} />
                  {getStateIcon(componentStates.aiProcessing, 'w-6 h-6 ml-2')}
                </div>
                <h3 className="text-sm font-semibold text-center text-foreground">AI ASSISTANT</h3>
                <p className="text-xs text-center text-muted-foreground mt-1">Claude/GPT-4</p>
                {componentStates.aiProcessing === 'loading' && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Understanding intent...
                  </p>
                )}
              </div>
            </div>

            <ArrowPathIcon className="w-6 h-6 text-muted-foreground/50 rotate-90 lg:rotate-0" />

            {/* MCP Server */}
            <div className="flex flex-col items-center">
              <div
                ref={mcpServerRef}
                className={`p-6 rounded-lg border-2 transition-all duration-500 ${
                  componentStates.mcpServer === 'loading'
                    ? `${stageColors.mcp.border} ${stageColors.mcp.bg} shadow-lg scale-105`
                    : componentStates.mcpServer === 'success'
                    ? `border-green-300 bg-green-50 shadow-lg scale-105`
                    : `${stageColors.mcp.border} ${stageColors.mcp.bg}`
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <ServerIcon className={`w-12 h-12 ${stageColors.mcp.text}`} />
                  {getStateIcon(componentStates.mcpServer, 'w-6 h-6 ml-2')}
                </div>
                <h3 className="text-sm font-semibold text-center text-foreground">MCP SERVER</h3>
                <p className="text-xs text-center text-muted-foreground mt-1">Tool Registry</p>
                {componentStates.mcpServer === 'loading' && (
                  <p className="text-xs text-center text-muted-foreground mt-2">Finding tools...</p>
                )}
              </div>
            </div>

            <ArrowPathIcon className="w-6 h-6 text-muted-foreground/50 rotate-90 lg:rotate-0" />

            {/* Tool Execution */}
            <div className="flex flex-col items-center">
              <div
                ref={toolExecutionRef}
                className={`p-6 rounded-lg border-2 transition-all duration-500 ${
                  componentStates.toolExecution === 'loading'
                    ? `${stageColors.tools.border} ${stageColors.tools.bg} shadow-lg scale-105`
                    : componentStates.toolExecution === 'success'
                    ? `border-green-300 bg-green-50 shadow-lg scale-105`
                    : `${stageColors.tools.border} ${stageColors.tools.bg}`
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <WrenchScrewdriverIcon className={`w-12 h-12 ${stageColors.tools.text}`} />
                  {getStateIcon(componentStates.toolExecution, 'w-6 h-6 ml-2')}
                </div>
                <h3 className="text-sm font-semibold text-center text-foreground">
                  TOOL EXECUTION
                </h3>
                <p className="text-xs text-center text-muted-foreground mt-1">place_order()</p>
                {componentStates.toolExecution === 'loading' && (
                  <p className="text-xs text-center text-muted-foreground mt-2">Placing order...</p>
                )}
              </div>
            </div>

            <ArrowPathIcon className="w-6 h-6 text-muted-foreground/50 rotate-90 lg:rotate-0" />

            {/* Response */}
            <div className="flex flex-col items-center">
              <div
                ref={responseRef}
                className={`p-6 rounded-lg border-2 transition-all duration-500 ${
                  componentStates.response === 'loading'
                    ? `${stageColors.response.border} ${stageColors.response.bg} shadow-lg scale-105`
                    : componentStates.response === 'success'
                    ? `border-green-300 bg-green-50 shadow-lg scale-105`
                    : `${stageColors.response.border} ${stageColors.response.bg}`
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <ChatBubbleLeftRightIcon className={`w-12 h-12 ${stageColors.response.text}`} />
                  {getStateIcon(componentStates.response, 'w-6 h-6 ml-2')}
                </div>
                <h3 className="text-sm font-semibold text-center text-foreground">AI RESPONSE</h3>
                <p className="text-xs text-center text-muted-foreground mt-1">Order confirmed!</p>
                {componentStates.response === 'success' && (
                  <div className="flex items-center justify-center mt-2">
                    <ShoppingCartIcon className="w-4 h-4 text-green-600 mr-1" />
                    <p className="text-xs text-green-600">Order placed</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Animated Connections */}
          <AnimatedBeam
            containerRef={diagramRef}
            fromRef={userInputRef}
            toRef={aiProcessingRef}
            isActive={animationStep >= 1}
            color={stageColors.user.beam}
          />

          <AnimatedBeam
            containerRef={diagramRef}
            fromRef={aiProcessingRef}
            toRef={mcpServerRef}
            isActive={animationStep >= 2}
            color={stageColors.ai.beam}
          />

          <AnimatedBeam
            containerRef={diagramRef}
            fromRef={mcpServerRef}
            toRef={toolExecutionRef}
            isActive={animationStep >= 3}
            color={stageColors.mcp.beam}
          />

          <AnimatedBeam
            containerRef={diagramRef}
            fromRef={toolExecutionRef}
            toRef={aiProcessingRef}
            isActive={animationStep >= 4}
            color={stageColors.tools.beam}
          />

          <AnimatedBeam
            containerRef={diagramRef}
            fromRef={aiProcessingRef}
            toRef={responseRef}
            isActive={animationStep >= 5}
            color={stageColors.response.beam}
          />
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < animationStep
                    ? 'bg-green-500'
                    : i === animationStep
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Status Display */}
        <div className="mt-4 text-center">
          {currentProcessing && (
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-700">
                {currentProcessing === 'aiProcessing' && 'AI processing your request...'}
                {currentProcessing === 'mcpServer' && 'Connecting to MCP server...'}
                {currentProcessing === 'toolExecution' && 'Executing coffee order tool...'}
                {currentProcessing === 'response' && 'Generating response...'}
              </span>
            </div>
          )}
          {animationStep === totalSteps && !isAnimating && (
            <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-green-700">
                Order successfully placed with AI assistance!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
