'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

export function SequenceDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    // Use simpler theme detection with fallback colors
    const isDark = document.documentElement.classList.contains('dark');
    const isCoffee = document.documentElement.classList.contains('coffee');

    // Define color schemes for different themes
    let themeColors;
    if (isDark) {
      themeColors = {
        primaryColor: '#8B6F47',
        primaryTextColor: '#E8E3DC',
        primaryBorderColor: '#8B6F47',
        lineColor: '#4A4A4A',
        secondaryColor: '#5A5A5A',
        tertiaryColor: '#2A2A2A',
        background: '#2A2A2A',
        mainBkg: '#2A2A2A',
        secondBkg: '#3A3A3A',
        tertiaryBkg: '#8B6F47',
        noteBkgColor: '#3A3A3A',
        noteTextColor: '#E8E3DC',
      };
    } else if (isCoffee) {
      themeColors = {
        primaryColor: '#8B6F47',
        primaryTextColor: '#4A3F35',
        primaryBorderColor: '#8B6F47',
        lineColor: '#A0826D',
        secondaryColor: '#D4C5B9',
        tertiaryColor: '#F5F2EF',
        background: '#F5F2EF',
        mainBkg: '#F5F2EF',
        secondBkg: '#E8DED2',
        tertiaryBkg: '#8B6F47',
        noteBkgColor: '#E8DED2',
        noteTextColor: '#4A3F35',
      };
    } else {
      // Light theme (default)
      themeColors = {
        primaryColor: '#D4A574',
        primaryTextColor: '#3F2A1E',
        primaryBorderColor: '#D4A574',
        lineColor: '#9E9E9E',
        secondaryColor: '#F3EDE7',
        tertiaryColor: '#FEFDFB',
        background: '#FEFDFB',
        mainBkg: '#FEFDFB',
        secondBkg: '#F3EDE7',
        tertiaryBkg: '#D4A574',
        noteBkgColor: '#F3EDE7',
        noteTextColor: '#3F2A1E',
      };
    }

    // Initialize mermaid with theme-aware colors
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: themeColors,
    });

    // Mermaid diagram definition
    const diagramDefinition = `
sequenceDiagram
    participant U as 👤 User
    participant UI as 💬 Chat UI
    participant API as 🔌 API Route
    participant MCP as 🔧 MCP Client
    participant AI as 🧠 AI SDK
    participant LLM as 🤖 Claude/GPT-4
    participant MCPS as ⚙️ MCP Server
    participant DB as 🗄️ SQLite DB

    U->>UI: Send message "Order a latte"
    UI->>API: POST /api/chat
    API->>DB: Save user message
    API->>MCP: Initialize MCP clients
    MCP->>MCPS: Connect to servers
    MCPS-->>MCP: Return available tools
    MCP-->>API: Return tool registry
    API->>AI: streamText() with tools
    AI->>LLM: Send message + tools

    alt Tool Call Required
        LLM-->>AI: Request tool execution
        AI->>MCP: Execute place_order tool
        MCP->>MCPS: Call place_order()
        MCPS-->>MCP: Return order result
        MCP-->>AI: Return tool result
        AI->>LLM: Send tool result
    end

    LLM-->>AI: Stream response
    AI-->>API: Stream chunks
    API-->>UI: SSE stream
    UI-->>U: Display "Order confirmed!"
    API->>DB: Save assistant message
    API->>MCP: Cleanup clients
    `;

    // Render the diagram
    const renderDiagram = async () => {
      if (diagramRef.current) {
        try {
          diagramRef.current.innerHTML = '';
          const id = `mermaid-${Date.now()}`;
          const { svg } = await mermaid.render(id, diagramDefinition);
          if (diagramRef.current) {
            diagramRef.current.innerHTML = svg;
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('Error rendering mermaid diagram:', error);
          if (diagramRef.current) {
            diagramRef.current.innerHTML =
              '<p class="text-destructive p-4">Failed to render diagram</p>';
          }
        }
      }
    };

    renderDiagram();
  }, [isInitialized]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-background to-secondary/20 border border-border rounded-xl p-6 shadow-coffee-shadow">
        <div
          ref={diagramRef}
          className="w-full overflow-x-auto bg-background rounded-lg p-4 border"
          style={{ minHeight: '400px' }}
        />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>User Interaction</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span>API Calls</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span>Real-time Stream</span>
          </div>
        </div>
      </div>
    </div>
  );
}
