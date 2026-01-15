import { useState } from 'react';
import { Card, Button } from '../components/ui';
import { Check, Star, Zap } from 'lucide-react';

export const UpgradeModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const plans = [
        {
            name: 'Free',
            price: '$0',
            credits: '10',
            features: ['Basic Try-On', '1 API Key', 'Community Support'],
            current: true
        },
        {
            name: 'Starter',
            price: '$49',
            credits: '1,000',
            features: ['Advanced Try-On', '5 API Keys', 'Email Support', 'Webhooks'],
            current: false,
            recommended: true
        },
        {
            name: 'Pro',
            price: '$199',
            credits: '5,000',
            features: ['Batch Processing', 'Unlimited Keys', 'Priority Support', 'SLA'],
            current: false
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-4xl relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2">Upgrade your plan</h2>
                    <p className="text-slate-400">Choose the right amount of credits for your brand.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`p-6 rounded-2xl border-2 transition-all ${plan.recommended
                                    ? 'border-primary bg-primary/5 scale-105 shadow-xl shadow-primary/10'
                                    : 'border-slate-800 bg-slate-900/50'
                                }`}
                        >
                            {plan.recommended && (
                                <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                                    <Star size={12} fill="currentColor" /> Recommended
                                </div>
                            )}
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                            <div className="mt-4 mb-6">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-slate-500">/mo</span>
                                <p className="text-sm text-slate-400 mt-2">{plan.credits} credits included</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                                        <Check size={16} className="text-success" /> {f}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.recommended ? 'primary' : 'outline'}
                                className="w-full"
                                disabled={plan.current}
                            >
                                {plan.current ? 'Current Plan' : 'Upgrade'}
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
