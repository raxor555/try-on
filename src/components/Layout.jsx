import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from './ui';
import { UpgradeModal } from './UpgradeModal';
import {
    LayoutDashboard,
    Code2,
    BarChart3,
    Settings as SettingsIcon,
    LogOut,
    Zap
} from 'lucide-react';

export const Layout = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [credits, setCredits] = useState(0);
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

    useEffect(() => {
        if (user) {
            const fetchCredits = async () => {
                const { data } = await supabase.from('profiles').select('credits_remaining').eq('id', user.id).single();
                if (data) setCredits(data.credits_remaining);
            };
            fetchCredits();

            // Subscribe to profile changes
            const channel = supabase
                .channel('profile_changes')
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, (payload) => {
                    setCredits(payload.new.credits_remaining);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/docs', icon: Code2, label: 'API Docs' },
        { to: '/usage', icon: BarChart3, label: 'Usage' },
        { to: '/settings', icon: SettingsIcon, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-slate-900/50 backdrop-blur-md flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-2 bg-primary rounded-lg">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Tryout AI
                        </span>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200
                  ${isActive
                                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                `}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-border">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-error transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 border-b border-border bg-slate-900/30 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                        B2B Try-On Portal
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-800 rounded-full px-4 py-1.5 items-center gap-2 border border-slate-700">
                            <Zap className="w-4 h-4 text-warning fill-warning" />
                            <span className="text-sm font-medium">{credits} Credits Left</span>
                        </div>
                        <Button size="sm" variant="secondary" onClick={() => setIsUpgradeOpen(true)}>Upgrade</Button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
        </div>
    );
};
