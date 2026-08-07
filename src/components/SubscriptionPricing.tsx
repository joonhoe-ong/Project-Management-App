import React, { useState } from 'react';
import { NavScreen } from '../types';

interface SubscriptionPricingProps {
  onSelectScreen?: (screen: NavScreen) => void;
}

export const SubscriptionPricing: React.FC<SubscriptionPricingProps> = ({ onSelectScreen }) => {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Market benchmark prices for PPM & Project Management SaaS
  const pricingData = {
    free: {
      name: 'Starter / Free',
      badge: 'Free Forever',
      description: 'Essential tools for small teams, freelancing project leads, and trial evaluations.',
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        'Up to 3 Active Projects',
        'Standard Kanban Task Board',
        'Basic Gantt Chart View',
        'Resource Allocation (Max 5 members)',
        'Disqus Team Q&A Integration',
        'Standard Email Support',
        '100 AI Optimization Credits / mo',
      ],
      ctaText: 'Current Plan',
      isCurrent: true,
      popular: false,
      color: 'slate',
    },
    pro: {
      name: 'Pro',
      badge: 'Most Popular',
      description: 'Advanced AI optimization and critical path engine for growing engineering teams.',
      priceMonthly: 49,
      priceAnnual: 39,
      features: [
        'Unlimited Active Projects',
        'AI Auto-Optimizer & Bottleneck Solver',
        'Advanced Critical Path Analysis',
        'Unlimited Team Workspace Seats',
        'Custom Disqus Forum Shortname',
        'Interactive Capacity Over-allocation Alerts',
        'Priority 24/7 Email & Live Chat Support',
        'Unlimited AI Optimization Runs',
        'Export Data to PDF, CSV & MS Project',
      ],
      ctaText: 'Upgrade to Pro',
      isCurrent: false,
      popular: true,
      color: 'blue',
    },
    enterprise: {
      name: 'Enterprise',
      badge: 'PMO & Multi-Team',
      description: 'Custom governance, SLA guarantees, and dedicated AI model training for enterprises.',
      priceMonthly: 199,
      priceAnnual: 159,
      features: [
        'Everything in Pro + Multi-Workspace Hub',
        'Dedicated CSM & Solution Architect',
        'Custom AI Capacity Model Fine-Tuning',
        'Enterprise SSO / SAML & Audit Logs',
        '99.9% Uptime SLA & Custom Data Retention',
        'Custom Webhooks, REST API & Jira Sync',
        'On-Premise / Private Cloud Deployment',
        'Tailored Onboarding & Training Workshops',
      ],
      ctaText: 'Contact Enterprise Sales',
      isCurrent: false,
      popular: false,
      color: 'indigo',
    },
  };

  const featureComparison = [
    { name: 'Active Projects', free: '3 Projects', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Team Members / Seats', free: '5 Members', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'AI Optimization Engine', free: 'Basic (100 runs/mo)', pro: 'Unlimited Real-time', enterprise: 'Custom Model Training' },
    { name: 'Critical Path & Gantt', free: 'Standard', pro: 'Advanced Multi-Dependency', enterprise: 'Enterprise Cross-Project' },
    { name: 'Disqus Forum Integration', free: 'Shared Shortname', pro: 'Custom Shortname', proCustom: true, enterprise: 'Dedicated Forum & SSO' },
    { name: 'Resource Allocation Solver', free: 'Manual', pro: 'Auto Balancing', enterprise: 'Predictive Workload AI' },
    { name: 'Data Exporting', free: 'CSV Only', pro: 'PDF, CSV, MS Project', enterprise: 'API & Custom Pipeline' },
    { name: 'Security & Compliance', free: 'Standard TLS', pro: '2FA & Encrypted Storage', enterprise: 'SSO, SAML & SOC2 Type II' },
    { name: 'Support SLA', free: '48h Response', pro: 'Priority 4h Chat', enterprise: '1h Response & 99.9% SLA' },
  ];

  const faqs = [
    {
      q: 'How is the market benchmark pricing calculated?',
      a: 'Our pricing tiers reflect industry standards derived from leading B2B Project Portfolio Management (PPM) benchmarks (such as Jira Enterprise, Asana Business, and Monday.com Pro), ensuring transparent value based on team seat capacity and AI compute intensity.',
    },
    {
      q: 'Can I switch between plans or cancel at any time?',
      a: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time with instant prorated adjustments. Unused annual balances are credited automatically to your workspace.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and wire transfers/invoicing for Enterprise annual billing.',
    },
    {
      q: 'How does the Disqus integration work across tiers?',
      a: 'Free plans use our community OptiPlan Disqus shortname. Pro and Enterprise tiers allow you to link your own custom Disqus forum shortname from disqus.com/admin directly to your project views.',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
          <span>Flexible Market-Driven Subscription Plans</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Choose the Right Plan for Your Engineering & PMO Team
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Scale your project management, resource balancing, and AI auto-optimization with clear, competitive pricing based on active compute needs.
        </p>

        {/* Annual vs Monthly Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
              billingCycle === 'annual' ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500'}`}>
              Annual Billing
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wide">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
        {/* FREE TIER */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:border-slate-300 transition-all relative">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{pricingData.free.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{pricingData.free.description}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                {pricingData.free.badge}
              </span>
            </div>

            <div className="py-2 border-y border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">$0</span>
                <span className="text-xs text-slate-500">/ month forever</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600">
              {pricingData.free.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6">
            <button
              disabled
              className="w-full py-2.5 px-4 bg-slate-100 text-slate-500 rounded-xl font-semibold text-xs cursor-default flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              Current Plan
            </button>
          </div>
        </div>

        {/* PRO TIER (POPULAR) */}
        <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-xl p-6 flex flex-col justify-between relative transform md:-translate-y-2">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">star</span>
            {pricingData.pro.badge}
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{pricingData.pro.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{pricingData.pro.description}</p>
              </div>
            </div>

            <div className="py-2 border-y border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  ${billingCycle === 'annual' ? pricingData.pro.priceAnnual : pricingData.pro.priceMonthly}
                </span>
                <span className="text-xs text-slate-500">
                  / user / mo {billingCycle === 'annual' && '(billed annually)'}
                </span>
              </div>
              {billingCycle === 'annual' && (
                <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                  Billed $468 annually — Save $120/yr
                </p>
              )}
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              {pricingData.pro.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[16px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setSelectedPlanModal('Pro')}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{pricingData.pro.ctaText}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* ENTERPRISE TIER */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">{pricingData.enterprise.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{pricingData.enterprise.description}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-semibold border border-slate-700">
                {pricingData.enterprise.badge}
              </span>
            </div>

            <div className="py-2 border-y border-slate-800">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">
                  ${billingCycle === 'annual' ? pricingData.enterprise.priceAnnual : pricingData.enterprise.priceMonthly}
                </span>
                <span className="text-xs text-slate-400">
                  / user / mo {billingCycle === 'annual' && '(billed annually)'}
                </span>
              </div>
              <p className="text-[10px] text-indigo-300 font-medium mt-0.5">
                Custom billing & PO support available
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              {pricingData.enterprise.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-indigo-400 text-[16px] shrink-0 mt-0.5">
                    verified
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setSelectedPlanModal('Enterprise')}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white border border-slate-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>{pricingData.enterprise.ctaText}</span>
              <span className="material-symbols-outlined text-[16px]">mail</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tier Feature Breakdown</h2>
            <p className="text-xs text-slate-500">Detailed comparison across Free, Pro, and Enterprise tiers</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
            Market Benchmarked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-bold">
                <th className="p-3 rounded-l-lg">Feature / Capability</th>
                <th className="p-3">Free Tier</th>
                <th className="p-3 text-blue-700">Pro Tier ($39–$49/mo)</th>
                <th className="p-3 rounded-r-lg">Enterprise ($159–$199/mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {featureComparison.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 font-semibold text-slate-900">{row.name}</td>
                  <td className="p-3 text-slate-600">{row.free}</td>
                  <td className="p-3 font-medium text-blue-700 bg-blue-50/20">{row.pro}</td>
                  <td className="p-3 text-slate-900 font-medium">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">help</span>
          <span>Subscription & Billing FAQ</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={faq.q}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-semibold text-xs text-slate-900 flex items-center justify-between bg-slate-50/50 hover:bg-slate-100/80 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="p-4 pt-2 text-xs text-slate-600 border-t border-slate-100 bg-white leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Modal Simulation */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[22px]">workspace_premium</span>
                <h3 className="font-bold text-base text-slate-900">
                  Upgrade to {selectedPlanModal} Plan
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You selected the <strong>{selectedPlanModal} Plan</strong> ({billingCycle === 'annual' ? 'Billed Annually' : 'Billed Monthly'}). This will unlock unlimited projects, advanced AI optimization models, and custom Disqus forum controls.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 space-y-1">
              <div className="font-semibold flex justify-between">
                <span>Total Due Today:</span>
                <span className="font-bold text-blue-700">
                  ${selectedPlanModal === 'Pro' ? (billingCycle === 'annual' ? 468 : 49) : (billingCycle === 'annual' ? 1908 : 199)}
                </span>
              </div>
              <p className="text-[11px] text-blue-700">Includes 14-day money-back guarantee & instant license key activation.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Successfully initiated checkout for ${selectedPlanModal} (${billingCycle})! License upgraded.`);
                  setSelectedPlanModal(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
