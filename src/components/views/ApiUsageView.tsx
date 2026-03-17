import { useState, useEffect } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { useWorkspaces } from "@/hooks/useWorkspaces";

type CodeTab = "curl" | "javascript" | "python";

const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null;

export function ApiUsageView() {
  const [activeTab, setActiveTab] = useState<CodeTab>("curl");
  const [copied, setCopied] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");

  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();

  // Set default to first workspace
  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0].workspaceId);
    }
  }, [workspaces, selectedWorkspaceId]);

  const apiKey = selectedWorkspaceId || "YOUR_WORKSPACE_ID";

  const codeExamples: Record<CodeTab, string> = {
    curl: `curl -X POST https://f966-2409-40c0-1067-90cb-815f-4bf5-67f5-a99.ngrok-free.app/api/query \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "question": "What is the return policy?",
    "workspaceId": "${apiKey}"
  }'`,

    javascript: `const response = await fetch(
  'https://f966-2409-40c0-1067-90cb-815f-4bf5-67f5-a99.ngrok-free.app/api/query',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN',
    },
    body: JSON.stringify({
      question: 'What is the return policy?',
      workspaceId: '${apiKey}'
    }),
  }
);

const data = await response.json();
console.log(data);`,

    python: `import requests

response = requests.post(
    'https://f966-2409-40c0-1067-90cb-815f-4bf5-67f5-a99.ngrok-free.app/api/query',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
    },
    json={
        'question': 'What is the return policy?',
        'workspaceId': '${apiKey}'
    }
)

data = response.json()
print(data)`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            API Usage
          </h1>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Workspace:</label>
            <div className="relative">
              <select
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                disabled={workspacesLoading}
                className="appearance-none pl-3 pr-8 py-1.5 text-sm bg-secondary/50 rounded-lg border border-border transition-all disabled:opacity-50 cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
              >
                {workspaces?.map((ws) => (
                  <option key={ws.workspaceId} value={ws.workspaceId}>
                    {ws.workspaceName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
        <p className="text-muted-foreground">
          Learn how to integrate the DataMind Ai API into your applications.
        </p>
      </div>

      {/* Endpoint Info */}
      <div className="bg-card rounded-2xl p-6 dark:bg-neutral-950 card-shadow">
        <h3 className="font-medium text-foreground mb-4">Query Endpoint</h3>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 dark:bg-neutral-900 border border-border mb-4">
          <span className="px-2 py-1 rounded-md bg-success/10 text-success text-xs font-medium">
            POST
          </span>
          <code className="font-mono text-sm text-foreground">
            /api/query
          </code>
        </div>

        <p className="text-sm text-muted-foreground">
          Send a query to retrieve relevant information and get an AI-generated answer.
        </p>
      </div>

      {/* Code Examples */}
      <div className="bg-card dark:bg-neutral-900 rounded-2xl card-shadow overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center dark:bg-neutral-950 gap-1 p-0 border-b border-border bg-secondary/30">
          {(["curl", "javascript", "python"] as CodeTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm  font-medium transition-all duration-200 ${activeTab === tab
                ? "bg-card text-foreground nav-shadow"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab === "curl"
                ? "cURL"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

          <button
            onClick={handleCopy}
            className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Code Block */}
        <div className="p-6 overflow-x-auto">
          <CodeBlock code={codeExamples[activeTab]} language={activeTab} />
        </div>
      </div>

      {/* Response Example */}
      <div className="bg-neutral-900 border border-[#30363d] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-[#30363d] bg-neutral-950">
          <h3 className="font-medium text-white">Response Example</h3>
        </div>

        <div className="p-6 overflow-x-auto font-mono text-sm leading-relaxed">
          <pre>
            {`{`}
            {"\n  "}
            <span className="text-orange-400">"success"</span>
            {`: `}
            <span className="text-blue-400">true</span>
            {`,`}
            {"\n  "}
            <span className="text-orange-400">"response"</span>
            {`: {`}
            {"\n    "}
            <span className="text-orange-400">"message"</span>
            {`: `}
            <span className="text-green-400">"Based on the documents, our return policy allows returns within 30 days of purchase."</span>
            {"\n  "}{`},`}
            {"\n  "}
            <span className="text-orange-400">"intent"</span>
            {`: `}
            <span className="text-green-400">"rag"</span>
            {`,`}
            {"\n  "}
            <span className="text-orange-400">"is_multi_step"</span>
            {`: `}
            <span className="text-blue-400">false</span>
            {"\n}"}
          </pre>
        </div>
      </div>


      {/* Parameters Table */}
      <div className="bg-card rounded-2xl p-6 card-shadow">
        <h3 className="font-medium text-foreground mb-4">Request Parameters</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-muted-foreground font-medium">
                  Parameter
                </th>
                <th className="text-left py-3 text-muted-foreground font-medium">
                  Type
                </th>
                <th className="text-left py-3 text-muted-foreground font-medium">
                  Required
                </th>
                <th className="text-left py-3 text-muted-foreground font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 font-mono text-foreground">question</td>
                <td className="py-3 text-muted-foreground">string</td>
                <td className="py-3">
                  <span className="text-success">Yes</span>
                </td>
                <td className="py-3 text-muted-foreground">
                  The search question or query
                </td>
              </tr>
              <tr>
                <td className="py-3 font-mono text-foreground">workspaceId</td>
                <td className="py-3 text-muted-foreground">string</td>
                <td className="py-3">
                  <span className="text-success">Yes</span>
                </td>
                <td className="py-3 text-muted-foreground">
                  The workspace ID to query
                </td>
              </tr>
              <tr>
                <td className="py-3 font-mono text-foreground">documentId</td>
                <td className="py-3 text-muted-foreground">string</td>
                <td className="py-3 text-muted-foreground">No</td>
                <td className="py-3 text-muted-foreground">
                  Optional document ID to limit search scope
                </td>
              </tr>
              <tr>
                <td className="py-3 font-mono text-foreground">stream</td>
                <td className="py-3 text-muted-foreground">boolean</td>
                <td className="py-3 text-muted-foreground">No</td>
                <td className="py-3 text-muted-foreground">
                  Enable streaming response (default: false)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
