import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Input } from '../components/ui';
import { User, Bell, Webhook, CreditCard, ShieldCheck } from 'lucide-react';

export const Settings = () => {
    const { user } = useAuth();
    const [email, setEmail] = useState(user?.email || '');

    const sections = [
        { id: 'account', icon: User, label: 'Account Information' },
        { id: 'webhooks', icon: Webhook, label: 'Webhooks' },
        { id: 'billing', icon: CreditCard, label: 'Billing & Plans' },
        { id: 'security', icon: ShieldCheck, label: 'Security' },
    ];

    const [activeSection, setActiveSection] = useState('account');

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2 font-display">Settings</h2>
                <p className="text-slate-400">Manage your account and platform preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Mini */}
                <div className="w-full md:w-64 space-y-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === section.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-slate-400 hover:bg-slate-800'
                                }`}
                        >
                            <section.icon size={20} />
                            <span className="font-medium">{section.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeSection === 'account' && (
                        <Card className="space-y-6">
                            <h3 className="text-xl font-bold mb-4">Account Information</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-slate-500">Email Address</label>
                                        <Input value={email} readOnly disabled />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-slate-500">Member Since</label>
                                        <Input value="Jan 2024" readOnly disabled />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-800">
                                    <Button variant="outline">Update Profile</Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeSection === 'webhooks' && (
                        <Card className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Webhooks</h3>
                                <Button size="sm">Add Webhook</Button>
                            </div>
                            <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-lg">
                                <Webhook size={48} className="mx-auto text-slate-700 mb-4" />
                                <p className="text-slate-500 italic">Receive real-time notifications for API events.</p>
                            </div>
                        </Card>
                    )}

                    {activeSection === 'billing' && (
                        <Card className="space-y-6">
                            <h3 className="text-xl font-bold mb-4">Current Plan</h3>
                            <div className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl border border-primary/20">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Free Plan</span>
                                        <h4 className="text-2xl font-bold mt-1">10 Credits / Month</h4>
                                    </div>
                                    <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-xs font-bold">ACTIVE</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full mb-2 overflow-hidden">
                                    <div className="h-full bg-primary w-[30%]" />
                                </div>
                                <p className="text-xs text-slate-400">3 of 10 credits used. Resets on Feb 1st.</p>
                                <div className="mt-6">
                                    <Button className="w-full">Upgrade to Pro</Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeSection === 'security' && (
                        <Card className="space-y-6">
                            <h3 className="text-xl font-bold mb-4">Password & Security</h3>
                            <div className="space-y-4">
                                <Button variant="outline">Change Password</Button>
                                <p className="text-sm text-slate-500">Security notifications will be sent to your primary email.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
