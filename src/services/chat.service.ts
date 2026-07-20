import { ChatMessage, Conversation } from "@/types";
import { generateId, sleep } from "@/lib/utils";

const SIMULATED_RESPONSES = [
  "Based on the data analysis, I can see several key trends in your metrics. The user engagement has increased by 23% over the past quarter, with mobile usage leading the growth.",
  "Here's a comprehensive breakdown of the document you uploaded:\n\n**Key Findings:**\n- Revenue increased 15% QoQ\n- Customer retention improved by 8%\n- New user acquisition doubled\n\n**Recommendations:**\n1. Focus on mobile-first experiences\n2. Invest in customer success programs\n3. Expand into the enterprise segment",
  "I've analyzed the code snippet you shared. There are a few potential improvements:\n\n```javascript\n// Optimized version\nconst fetchData = async (endpoint) => {\n  try {\n    const response = await fetch(endpoint);\n    if (!response.ok) throw new Error('Network response was not ok');\n    return await response.json();\n  } catch (error) {\n    console.error('Fetch error:', error);\n    throw error;\n  }\n};\n```\n\nKey improvements:\n- Added error handling\n- Added response validation\n- Used async/await pattern",
  "Great question! Let me walk you through the process step by step.\n\n1. **Data Collection**: Gather all relevant data from your sources\n2. **Preprocessing**: Clean and normalize the data\n3. **Analysis**: Apply statistical methods and ML models\n4. **Visualization**: Create interactive charts and dashboards\n5. **Insights**: Generate actionable recommendations\n\nWould you like me to elaborate on any of these steps?",
  "The sentiment analysis of your customer feedback shows:\n\n| Sentiment | Percentage | Count |\n|-----------|-----------|-------|\n| Positive | 62% | 1,240 |\n| Neutral | 24% | 480 |\n| Negative | 14% | 280 |\n\nThe overall trend is positive, with satisfaction scores improving month over month. Key areas of improvement include response time and feature completeness.",
];

const chatService = {
  async sendMessage(
    conversationId: string,
    content: string,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const responseIndex = Math.floor(Math.random() * SIMULATED_RESPONSES.length);
    const fullResponse = SIMULATED_RESPONSES[responseIndex];
    let accumulated = "";

    for (let i = 0; i < fullResponse.length; i++) {
      await sleep(15 + Math.random() * 25);
      accumulated += fullResponse[i];
      onChunk(accumulated);
    }

    return fullResponse;
  },

  async getConversations(): Promise<Conversation[]> {
    const stored = localStorage.getItem("neuralflow_conversations");
    if (stored) {
      return JSON.parse(stored).map((c: Conversation) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }));
    }

    const defaultConversations: Conversation[] = [
      {
        id: generateId(),
        title: "Getting Started with NeuralFlow",
        messages: [
          {
            id: generateId(),
            role: "user",
            content: "How do I get started with the platform?",
            timestamp: new Date(Date.now() - 86400000),
          },
          {
            id: generateId(),
            role: "assistant",
            content: "Welcome to NeuralFlow! Here's how to get started:\n\n1. **Set up your workspace** - Go to Settings and create your first workspace\n2. **Upload documents** - Navigate to Documents and upload your files\n3. **Start a chat** - Use the Chat feature to interact with AI models\n4. **Explore analytics** - Check the Analytics dashboard for insights",
            timestamp: new Date(Date.now() - 86390000),
          },
        ],
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        model: "gpt-4o",
      },
      {
        id: generateId(),
        title: "Data Analysis Request",
        messages: [
          {
            id: generateId(),
            role: "user",
            content: "Can you analyze the quarterly report data?",
            timestamp: new Date(Date.now() - 43200000),
          },
          {
            id: generateId(),
            role: "assistant",
            content: "I'd be happy to analyze the quarterly report. Please upload the document, and I'll provide:\n\n- Key metrics summary\n- Trend analysis\n- Comparative charts\n- Recommendations",
            timestamp: new Date(Date.now() - 43190000),
          },
        ],
        createdAt: new Date(Date.now() - 43200000),
        updatedAt: new Date(Date.now() - 43200000),
        model: "claude-3-5-sonnet",
      },
      {
        id: generateId(),
        title: "Code Review Assistance",
        messages: [],
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000),
        model: "gpt-4o",
      },
    ];

    localStorage.setItem("neuralflow_conversations", JSON.stringify(defaultConversations));
    return defaultConversations;
  },

  async saveConversations(conversations: Conversation[]): Promise<void> {
    localStorage.setItem("neuralflow_conversations", JSON.stringify(conversations));
  },

  async deleteConversation(id: string): Promise<void> {
    const conversations = await this.getConversations();
    const filtered = conversations.filter((c) => c.id !== id);
    localStorage.setItem("neuralflow_conversations", JSON.stringify(filtered));
  },

  async searchConversations(query: string): Promise<Conversation[]> {
    const conversations = await this.getConversations();
    const lower = query.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        c.messages.some((m) => m.content.toLowerCase().includes(lower))
    );
  },
};

export default chatService;
