import { useState, useEffect } from 'react';
import { LayoutDashboard, Key, BarChart, History, Eye, EyeOff, Copy, RotateCcw, Trash2, Plus } from 'lucide-react';
import { Card, Button, Input } from '../components/ui';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard = () => {
    const { user } = useAuth();
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showKey, setShowKey] = useState({});
    const [newKeyName, setNewKeyName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        const [keysRes, profileRes] = await Promise.all([
            supabase.from('api_keys').select('*').order('created_at', { ascending: false }),
            supabase.from('profiles').select('*').eq('id', user.id).single()
        ]);

        if (keysRes.data) setApiKeys(keysRes.data);
        if (profileRes.data) setProfile(profileRes.data);
        setLoading(false);
    };

    const generateKey = () => {
        const bytes = new Uint8Array(32);
        window.crypto.getRandomValues(bytes);
        return 'sk_live_' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const createApiKey = async () => {
        if (!newKeyName) return;
        const fullKey = generateKey();
        const maskedKey = fullKey.substring(0, 12) + '••••' + fullKey.substring(fullKey.length - 4);

        const { data, error } = await supabase.from('api_keys').insert([
            {
                user_id: user.id,
                name: newKeyName,
                key_hash: fullKey, // In production, this should be hashed. Using plain for MVP as per request.
                display_key: maskedKey
            }
        ]).select();

        if (data) {
            setApiKeys([data[0], ...apiKeys]);
            setNewKeyName('');
            setIsCreating(false);
        }
    };

    const revokeKey = async (id) => {
        const { error } = await supabase.from('api_keys').delete().eq('id', id);
        if (!error) {
            setApiKeys(apiKeys.filter(k => k.id !== id));
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('API Key copied to clipboard!');
    };

    const stats = [
        { label: 'Credits Remaining', value: profile?.credits_remaining ?? 0, icon: BarChart, color: 'text-primary' },
        { label: 'Active API Keys', value: apiKeys.length, icon: Key, color: 'text-secondary' },
        { label: 'Current Plan', value: profile?.plan_id?.toUpperCase() ?? 'FREE', icon: History, color: 'text-success' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold mb-2 font-display">Dashboard</h2>
                    <p className="text-slate-400">Welcome, {user?.email}</p>
                </div>
                <Button onClick={() => setIsCreating(true)} className="gap-2">
                    <Plus size={18} /> Create New Key
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <stat.icon size={64} />
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold">{stat.value}</h3>
                    </Card>
                ))}
            </div>

            {isCreating && (
                <Card className="border-primary/50 bg-primary/5">
                    <h3 className="text-lg font-bold mb-4">Create New API Key</h3>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Key Name (e.g. Production, Testing)"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            className="max-w-md"
                        />
                        <Button onClick={createApiKey}>Generate</Button>
                        <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                    </div>
                </Card>
            )}

            <Card className="bg-slate-900/50">
                <h3 className="text-xl font-bold mb-6">Your API Keys</h3>

                {loading ? (
                    <div className="text-center py-12 text-slate-500 animate-pulse">Loading keys...</div>
                ) : apiKeys.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-lg">
                        <p className="text-slate-500 italic">No API keys generated yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {apiKeys.map((key) => (
                            <div key={key.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all">
                                <div className="space-y-2 mb-4 md:mb-0">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg">{key.name}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${key.is_active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                                            {key.is_active ? 'Active' : 'Revoked'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 font-mono text-sm text-slate-400 bg-slate-900/80 px-3 py-2 rounded-md">
                                        <span>{showKey[key.id] ? key.key_hash : key.display_key}</span>
                                        <button onClick={() => setShowKey({ ...showKey, [key.id]: !showKey[key.id] })} className="hover:text-white">
                                            {showKey[key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                        <button onClick={() => copyToClipboard(key.key_hash)} className="hover:text-white">
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <RotateCcw size={14} /> Rotate
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-error hover:bg-error/10 hover:text-error gap-2" onClick={() => revokeKey(key.id)}>
                                        <Trash2 size={14} /> Revoke
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};
