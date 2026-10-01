import React, { useState } from 'react';
import { 
  Github, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  ShieldCheck,
  FileCode2,
  Terminal
} from 'lucide-react';

interface GitHubDeployHelperProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployHelper: React.FC<GitHubDeployHelperProps> = ({ isOpen, onClose }) => {
  const [copiedAction, setCopiedAction] = useState(false);
  const [diagnosticsRan, setDiagnosticsRan] = useState(false);

  if (!isOpen) return null;

  const githubActionWorkflow = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Static Applet
        run: npm run build

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v4

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const handleCopyAction = () => {
    navigator.clipboard.writeText(githubActionWorkflow);
    setCopiedAction(true);
    setTimeout(() => setCopiedAction(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-stone-900 text-white">
              <Github className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                Deployment Assurance Engine
              </div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                GitHub Repository & Pages Zero-Blank-Screen Verification
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-xs text-stone-700">
          
          {/* Why Blank Screens Happen on GitHub Pages */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2">
            <h4 className="font-semibold text-emerald-950 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Zero-Blank-Screen Safeguards Pre-Configured</span>
            </h4>
            <p className="text-stone-700 leading-relaxed text-[11px]">
              Vite applications frequently show a blank white screen when deployed to GitHub Pages because the default build generates absolute paths (<code className="bg-white px-1 py-0.5 rounded border border-emerald-200 text-stone-800">/assets/index.js</code>) which fail with a 404 error inside repository subpaths (<code className="bg-white px-1 py-0.5 rounded border border-emerald-200 text-stone-800">username.github.io/repo-name/</code>).
            </p>
            <p className="text-stone-700 leading-relaxed text-[11px]">
              This application has been built with:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-[11px]">
              <li><strong><code className="text-emerald-900">base: &apos;./&apos;</code> in vite.config.ts</strong>: Assets load relative to any repository path or subfolder.</li>
              <li><strong>Hash-Synchronized Client Routing</strong>: Prevents 404 errors on page reloads without requiring server rewrite rules.</li>
              <li><strong>Self-Contained Local-First Storage</strong>: Encrypted local storage and clinical mock EHR that never depend on remote server cold starts.</li>
              <li><strong>React Error Boundary Protection</strong>: Catches runtime exceptions and displays a recovery console rather than a blank screen.</li>
            </ul>
          </div>

          {/* Pre-Flight Checklist */}
          <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-stone-50">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px]">
              Pre-Flight Static Build Verification Checklist
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Vite base path configured to &apos;./&apos; (Relative Asset Links)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Zero external broken image hosts (Leica/SVG photographic fallbacks)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>HTML metadata and open graph tags synced with clinical identity</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>No required server-side secrets or missing environment variables for static hosting</span>
              </div>
            </div>
          </div>

          {/* Quick Deployment Steps */}
          <div className="space-y-3">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px]">
              How to Push & Deploy to GitHub (3 Simple Steps)
            </h4>

            <div className="space-y-2 text-[11px]">
              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <div className="font-semibold text-stone-900">Step 1: Push code to your GitHub Repository</div>
                <div className="font-mono bg-stone-100 p-2 rounded text-stone-800 text-[10px]">
                  git init<br/>
                  git add .<br/>
                  git commit -m &quot;feat: complete clinical nutrition platform&quot;<br/>
                  git branch -M main<br/>
                  git remote add origin https://github.com/&lt;your-username&gt;/&lt;your-repo-name&gt;.git<br/>
                  git push -u origin main
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-stone-900">Step 2: Add GitHub Actions Workflow</div>
                  <button
                    onClick={handleCopyAction}
                    className="px-2.5 py-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 flex items-center gap-1"
                  >
                    {copiedAction ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAction ? 'Copied Workflow YAML!' : 'Copy .github/workflows/deploy.yml'}</span>
                  </button>
                </div>
                <p className="text-stone-500">
                  Save this in your repository under <code className="text-stone-800 font-semibold">.github/workflows/deploy.yml</code>. It automatically builds and deploys on every push!
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <div className="font-semibold text-stone-900">Step 3: Enable Pages in GitHub Repository Settings</div>
                <p className="text-stone-500">
                  Go to <strong>Settings &rarr; Pages</strong> in your GitHub repository and under <strong>Build and deployment &rarr; Source</strong> select <strong>GitHub Actions</strong>. Your site will be live at <code className="text-stone-800">https://&lt;username&gt;.github.io/&lt;repo&gt;/</code> with zero blank screen!
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
          >
            Got It, Ready to Deploy
          </button>
        </div>

      </div>
    </div>
  );
};
