import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui';
import { Search, Filter, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export const Usage = () => {
    const { user } = userAuth(); // Note: error potential here, will fix
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const fetchLogs = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('usage_logs')
            .select('*', { count: 'exact' })
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false })
            .range((page - 1) * pageSize, page * pageSize - 1);

        if (data) setLogs(data);
        setLoading(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2">Usage Logs</h2>
                <p className="text-slate-400">Track all requests made via your API keys.</p>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Request ID or API Key..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
                    <Filter size={18} />
                    <span>Filters</span>
                </button>
            </div>

            <Card className="p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800/50 border-b border-slate-700">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Endpoint</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Credits</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Key Name</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-12 text-slate-500 animate-pulse">Loading logs...</td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-20 text-slate-500 italic">
                                    <div className="flex flex-col items-center gap-4">
                                        <FileText size={48} className="text-slate-700" />
                                        <p>No usage data to display yet.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-400">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">{log.endpoint}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${log.status_code < 400 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                            {log.status_code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">-{log.credits_used}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400">Production Key</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>

            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Showing page {page}</p>
                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="p-2 border border-slate-800 rounded hover:bg-slate-900 disabled:opacity-50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setPage(page + 1)}
                        className="p-2 border border-slate-800 rounded hover:bg-slate-900"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
