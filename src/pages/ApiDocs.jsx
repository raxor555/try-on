import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, Button, Input } from '../components/ui';
import { Copy, Check, Play, Globe, Shield, Zap } from 'lucide-react';

export const ApiDocs = () => {
    const [copied, setCopied] = useState(null);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const codeExamples = {
        curl: `curl -X POST https://tryout-ai.vercel.app/api/v1/try-on \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "person_image": "https://example.com/person.jpg",
    "garment_image": "https://example.com/shirt.jpg"
  }'`,
        javascript: `const response = await fetch('https://tryout-ai.vercel.app/api/v1/try-on', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    person_image: 'https://example.com/person.jpg',
    garment_image: 'https://example.com/shirt.jpg'
  })
});

const data = await response.json();
console.log(data.image_url);`,
        python: `import requests

url = "https://tryout-ai.vercel.app/api/v1/try-on"
headers = {
    "X-API-Key": "YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "person_image": "https://example.com/person.jpg",
    "garment_image": "https://example.com/shirt.jpg"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`
    };

    return (
        <div className="space-y-12 pb-20">
            <div>
                <h2 className="text-3xl font-bold mb-4">API Documentation</h2>
                <p className="text-slate-400 max-w-2xl text-lg">
                    Integrate Tryout AI into your e-commerce platform in minutes. Our developer-friendly API allows you to programmatically generate virtual try-on results.
                </p>
            </div>

            {/* Base URL & Auth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <div className="flex items-center gap-3 mb-4 text-primary">
                        <Globe size={24} />
                        <h3 className="text-xl font-bold">Base URL</h3>
                    </div>
                    <code className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-md block font-mono text-sm">
                        https://tryout-ai.vercel.app/api/v1
                    </code>
                </Card>
                <Card>
                    <div className="flex items-center gap-3 mb-4 text-secondary">
                        <Shield size={24} />
                        <h3 className="text-xl font-bold">Authentication</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">
                        Authenticate your requests by including your API key in the <code className="text-slate-200">X-API-Key</code> header.
                    </p>
                    <code className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-md block font-mono text-sm">
                        X-API-Key: YOUR_API_KEY
                    </code>
                </Card>
            </div>

            {/* Endpoint: Try-On */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="bg-success/20 text-success px-3 py-1 rounded text-xs font-bold font-mono">POST</span>
                    <h3 className="text-2xl font-bold">/try-on</h3>
                </div>

                <p className="text-slate-400">
                    Main endpoint to generate a virtual try-on image by providing a person photo and a garment photo.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Parameters */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">Body Parameters</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'person_image', type: 'string', required: true, desc: 'URL of the person photo (publicly accessible).' },
                                { name: 'garment_image', type: 'string', required: true, desc: 'URL of the garment photo (publicly accessible).' },
                                { name: 'webhook_url', type: 'string', required: false, desc: 'URL for asynchronous results (optional).' },
                            ].map((param) => (
                                <div key={param.name} className="border-b border-slate-800 pb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-primary">{param.name}</span>
                                        <span className="text-xs text-slate-500 font-mono">{param.type}</span>
                                        {param.required && <span className="text-[10px] bg-error/10 text-error px-1.5 py-0.5 rounded">Required</span>}
                                    </div>
                                    <p className="text-sm text-slate-400">{param.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Code Tabs */}
                    <div className="space-y-4">
                        <div className="flex border-b border-slate-800">
                            {['curl', 'javascript', 'python'].map((lang) => (
                                <button
                                    key={lang}
                                    className="px-4 py-2 text-sm font-medium text-slate-400 border-b-2 border-transparent hover:text-white transition-colors capitalize"
                                    onClick={() => {/* tab logic */ }}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <div className="relative group">
                            <button
                                onClick={() => copyToClipboard(codeExamples.curl, 'curl')}
                                className="absolute right-4 top-4 p-2 bg-slate-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-700"
                            >
                                {copied === 'curl' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                            </button>
                            <SyntaxHighlighter language="bash" style={atomDark} customStyle={{ borderRadius: '0.5rem', padding: '1.5rem', fontSize: '14px' }}>
                                {codeExamples.curl}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </div>
            </div>

            {/* Playground Preview */}
            <Card className="bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Play className="text-primary" />
                        <h3 className="text-xl font-bold">Try it out</h3>
                    </div>
                    <Button variant="outline" size="sm">Coming Soon</Button>
                </div>
                <div className="flex items-center justify-center p-12 border-2 border-dashed border-primary/20 rounded-lg">
                    <p className="text-slate-500 italic">The interactive playground is being prepared.</p>
                </div>
            </Card>
        </div>
    );
};
