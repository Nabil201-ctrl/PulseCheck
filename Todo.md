Phase 1: The Setup (1 hour)
Azure Portal: * Create a Resource Group (e.g., PulseCheck-RG).

Provision an App Service (Linux, Node 20+).

Tip: Use the B1 (Basic) tier. It’s cheap, fits in your $200 credit easily, and supports custom domains/SSL.

NestJS Scaffolding: * nest new pulse-check

Install dependencies: @nestjs/axios, openai, lucide-react (if you want a quick frontend).

Phase 2: Core Logic (4 hours)Monitoring Service: Create a service that uses HttpService to GET a target URL.AI Analysis: If the response time is $> 500ms$ or returns a 4xx/5xx, send the headers and status to DeepSeek.Prompt: "Analyze these HTTP headers and response time. Identify potential bottlenecks like missing compression, slow TTFB, or CDN misses."Endpoint: A simple POST /check that takes a URL and returns a JSON report.

Phase 3: Azure Deployment (3 hours)
Environment Variables: * Go to Settings > Configuration in the Azure Portal.

Add your DEEPSEEK_API_KEY and PORT (Azure usually uses 8080).

GitHub Actions: * In the Azure Portal, go to Deployment Center.

Connect your GitHub repo. Azure will automatically generate a .yml workflow file for you.

Push your code. It will build and deploy instantly.