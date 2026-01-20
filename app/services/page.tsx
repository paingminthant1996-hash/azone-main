"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Globe, 
  Code, 
  Search, 
  Wrench, 
  ArrowRight, 
  Check, 
  MessageCircle,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Users
} from "lucide-react";

const packages = [
  {
    id: "domain-setup",
    name: "Domain & Hosting Setup",
    nameMm: "Domain နှင့် Hosting Setup",
    price: "30,000 - 50,000",
    priceUsd: "$15-25",
    description: "Domain ဝယ်ပေး + DNS ချိတ်ပေး + Vercel Deployment",
    descriptionMm: "သင့် website ကို online တင်ပေးမယ်",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Domain registration ကူညီပေးမယ်",
      "Cloudflare DNS setup",
      "Vercel deployment",
      "SSL certificate (free)",
      "Basic guidance ပေးမယ်"
    ],
    delivery: "1-2 ရက်",
    popular: false
  },
  {
    id: "basic-website",
    name: "Basic Website",
    nameMm: "အခြေခံ Website",
    price: "100,000 - 200,000",
    priceUsd: "$50-100",
    description: "Template customize + Deploy + 1 month support",
    descriptionMm: "Template ကို သင့်အတွက် ပြင်ဆင်ပေးမယ်",
    icon: Code,
    color: "from-purple-500 to-pink-500",
    features: [
      "Template selection & customization",
      "Logo + Color change",
      "Content update (Myanmar text)",
      "Domain + DNS setup",
      "Vercel deployment",
      "1 month support"
    ],
    delivery: "3-5 ရက်",
    popular: true
  },
  {
    id: "custom-website",
    name: "Custom Website",
    nameMm: "သီးသန့် Website",
    price: "300,000 - 500,000",
    priceUsd: "$150-250",
    description: "Custom design + Full features + 3 months support",
    descriptionMm: "သင်လိုချင်တဲ့ပုံစံအတိုင်း အသစ်ဆောက်ပေးမယ်",
    icon: Sparkles,
    color: "from-amber-500 to-orange-500",
    features: [
      "Custom design (v0 + AI)",
      "Responsive (Mobile + Desktop)",
      "SEO optimization",
      "Contact form",
      "Social media integration",
      "Domain + Hosting setup",
      "3 months support"
    ],
    delivery: "1-2 ပတ်",
    popular: false
  },
  {
    id: "seo-setup",
    name: "SEO Setup",
    nameMm: "SEO Setup",
    price: "50,000 - 100,000",
    priceUsd: "$25-50",
    description: "Google Search Console + Optimization",
    descriptionMm: "Google မှာ ရှာလို့တွေ့အောင် လုပ်ပေးမယ်",
    icon: Search,
    color: "from-green-500 to-emerald-500",
    features: [
      "Google Search Console setup",
      "Sitemap submission",
      "Meta tags optimization",
      "robots.txt configuration",
      "Basic SEO audit",
      "Keyword suggestions"
    ],
    delivery: "2-3 ရက်",
    popular: false
  },
  {
    id: "maintenance",
    name: "Monthly Maintenance",
    nameMm: "လစဉ် ပြုပြင်ထိန်းသိမ်းမှု",
    price: "30,000 - 50,000/လ",
    priceUsd: "$15-25/mo",
    description: "Updates + Bug fixes + Support",
    descriptionMm: "Website ကို လစဉ် ကြည့်ရှုပေးမယ်",
    icon: Wrench,
    color: "from-indigo-500 to-violet-500",
    features: [
      "Content updates",
      "Bug fixes",
      "Security updates",
      "Performance monitoring",
      "Priority support",
      "Monthly report"
    ],
    delivery: "လစဉ်",
    popular: false
  }
];

const whyChooseUs = [
  { icon: Zap, title: "မြန်ဆန်တဲ့ Delivery", description: "အချိန်တိုအတွင်း အရည်အသွေးမြင့် website ရရှိမယ်" },
  { icon: Shield, title: "ယုံကြည်စိတ်ချရ", description: "Modern technology သုံးပြီး secure website ဆောက်ပေးမယ်" },
  { icon: Clock, title: "Support ပေးမယ်", description: "ပြဿနာရှိရင် အချိန်မရွေး ကူညီပေးမယ်" },
  { icon: Users, title: "Myanmar Market", description: "မြန်မာစီးပွားရေးလုပ်ငန်းတွေအတွက် အထူးပြုထားတယ်" }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-azone-black">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-azone-purple/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-azone-purple/20 rounded-full blur-[120px] opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-azone-purple/20 border border-azone-purple/30 rounded-full text-azone-purple text-sm font-medium mb-6">🇲🇲 Myanmar အတွက် ဝန်ဆောင်မှုများ</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Website <span className="text-transparent bg-clip-text bg-gradient-to-r from-azone-purple to-pink-500">ဝန်ဆောင်မှုများ</span></h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">Domain ချိတ်တာကနေ Custom Website ဆောက်တာအထိ၊ သင့်လုပ်ငန်းအတွက် Professional Website ရရှိအောင် ကူညီပေးပါမယ်။</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-azone-purple text-white rounded-xl font-semibold hover:bg-purple-600 transition-all hover:shadow-lg hover:shadow-azone-purple/30"><MessageCircle className="w-5 h-5" />ဆက်သွယ်ရန်</Link>
              <Link href="/templates" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all">Free Templates ကြည့်ရန်<ArrowRight className="w-5 h-5" /></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">ဝန်ဆောင်မှု Packages</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">သင့်လိုအပ်ချက်နှင့် Budget အလိုက် ရွေးချယ်နိုင်ပါတယ်</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {packages.map((pkg, index) => (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`relative group rounded-2xl border transition-all duration-300 ${pkg.popular ? "border-azone-purple bg-gradient-to-b from-azone-purple/10 to-transparent" : "border-gray-800 bg-gray-900/50 hover:border-gray-700"}`}>
                {pkg.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="px-4 py-1 bg-azone-purple text-white text-xs font-semibold rounded-full">လူကြိုက်အများဆုံး</span></div>}
                <div className="p-6 lg:p-8">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6`}><pkg.icon className="w-7 h-7 text-white" /></div>
                  <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{pkg.nameMm}</p>
                  <p className="text-gray-300 text-sm mb-6">{pkg.descriptionMm}</p>
                  <div className="mb-6"><div className="flex items-baseline gap-2"><span className="text-3xl font-bold text-white">{pkg.price}</span><span className="text-gray-400 text-sm">Ks</span></div><span className="text-xs text-gray-500">({pkg.priceUsd})</span></div>
                  <ul className="space-y-3 mb-8">{pkg.features.map((feature, i) => (<li key={i} className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 text-azone-purple flex-shrink-0 mt-0.5" /><span className="text-gray-300">{feature}</span></li>))}</ul>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-6"><Clock className="w-4 h-4" /><span>Delivery: {pkg.delivery}</span></div>
                  <Link href="/contact" className={`block w-full py-3 px-4 rounded-xl font-semibold text-center transition-all ${pkg.popular ? "bg-azone-purple text-white hover:bg-purple-600 hover:shadow-lg hover:shadow-azone-purple/30" : "bg-gray-800 text-white hover:bg-gray-700"}`}>ဆက်သွယ်ရန်</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-white mb-4">ဘာကြောင့် ကျွန်တော်တို့ကို ရွေးချယ်သင့်သလဲ?</h2></motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-6"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-azone-purple/20 flex items-center justify-center"><item.icon className="w-8 h-8 text-azone-purple" /></div><h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3><p className="text-gray-400 text-sm">{item.description}</p></motion.div>))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12"><h2 className="text-2xl md:text-3xl font-bold text-white mb-4">ငွေပေးချေမှု နည်းလမ်းများ</h2><p className="text-gray-400">အသေးစိတ်ကို ဆက်သွယ်ပြီး ညှိနှိုင်းနိုင်ပါတယ်</p></motion.div>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col items-center gap-3 p-6 bg-gray-900/50 border border-gray-800 rounded-2xl min-w-[140px]"><div className="w-16 h-16 rounded-xl bg-[#00A7E1]/20 flex items-center justify-center"><span className="text-2xl font-bold text-[#00A7E1]">KBZ</span></div><span className="text-white font-medium">KBZPay</span></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col items-center gap-3 p-6 bg-gray-900/50 border border-gray-800 rounded-2xl min-w-[140px]"><div className="w-16 h-16 rounded-xl bg-[#FF6B00]/20 flex items-center justify-center"><span className="text-2xl font-bold text-[#FF6B00]">Wave</span></div><span className="text-white font-medium">WavePay</span></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-3 p-6 bg-gray-900/50 border border-gray-800 rounded-2xl min-w-[140px]"><div className="w-16 h-16 rounded-xl bg-[#00843D]/20 flex items-center justify-center"><span className="text-2xl font-bold text-[#00843D]">AYA</span></div><span className="text-white font-medium">AYA Pay</span></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-3 p-6 bg-gray-900/50 border border-gray-800 rounded-2xl min-w-[140px]"><div className="w-16 h-16 rounded-xl bg-gray-700/50 flex items-center justify-center"><span className="text-2xl">🏦</span></div><span className="text-white font-medium">Bank Transfer</span></motion.div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-8">* ငွေပေးချေမှုအသေးစိတ်ကို ဆက်သွယ်ပြီးမှ ညှိနှိုင်းပါမယ်</p>
        </div>
      </section>

      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-white mb-4">ဘယ်လို လုပ်ဆောင်မလဲ?</h2><p className="text-gray-400">ရိုးရှင်းတဲ့ အဆင့် ၄ ဆင့်နဲ့ Website ရရှိမယ်</p></motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{ step: 1, title: "ဆက်သွယ်ပါ", desc: "လိုအပ်ချက်တွေ ပြောပြပါ" },{ step: 2, title: "Plan ချမယ်", desc: "သင့်အတွက် အကောင်းဆုံး plan ရွေးမယ်" },{ step: 3, title: "လုပ်ဆောင်မယ်", desc: "Website ဆောက်ပြီး ပြင်ဆင်မယ်" },{ step: 4, title: "Deliver လုပ်မယ်", desc: "Website အသင့်သုံးလို့ရအောင် ပေးမယ်" }].map((item, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="relative">{index < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-azone-purple/50 to-transparent" />}<div className="text-center"><div className="w-16 h-16 mx-auto mb-4 rounded-full bg-azone-purple/20 border-2 border-azone-purple flex items-center justify-center"><span className="text-2xl font-bold text-azone-purple">{item.step}</span></div><h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3><p className="text-gray-400 text-sm">{item.desc}</p></div></motion.div>))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-azone-purple to-pink-600" />
            <div className="relative z-10 py-16 px-8 text-center"><h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Website လိုချင်ပြီလား?</h2><p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">အခမဲ့ တိုင်ပင်ဆွေးနွေးနိုင်ပါတယ်။ သင့်လိုအပ်ချက်ကို ပြောပြပါ။</p><Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-azone-purple rounded-xl font-semibold hover:bg-gray-100 transition-all hover:shadow-lg"><MessageCircle className="w-5 h-5" />အခမဲ့ ဆက်သွယ်ရန်</Link></div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-white mb-4">🆓 Free Resources</h2><p className="text-gray-400">ကိုယ်တိုင်လုပ်ချင်ရင် ဒီတွေ အရင်ကြည့်ပါ</p></motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all"><div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4"><span className="text-2xl">📚</span></div><h3 className="text-lg font-semibold text-white mb-2">Free Templates</h3><p className="text-gray-400 text-sm mb-4">v0 နဲ့ လုပ်ထားတဲ့ templates တွေ free download လုပ်ပါ</p><Link href="/templates" className="text-azone-purple text-sm font-medium hover:underline">Templates ကြည့်ရန် →</Link></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all"><div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4"><span className="text-2xl">🎥</span></div><h3 className="text-lg font-semibold text-white mb-2">v0 Tutorial</h3><p className="text-gray-400 text-sm mb-4">v0.dev နဲ့ website ဘယ်လိုလုပ်ရတယ် ဆိုတာ လေ့လာပါ</p><Link href="/docs" className="text-azone-purple text-sm font-medium hover:underline">Tutorial ကြည့်ရန် →</Link></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all"><div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4"><span className="text-2xl">🚀</span></div><h3 className="text-lg font-semibold text-white mb-2">Vercel Deployment</h3><p className="text-gray-400 text-sm mb-4">Free hosting တင်နည်း step-by-step guide</p><Link href="/docs" className="text-azone-purple text-sm font-medium hover:underline">Guide ကြည့်ရန် →</Link></motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
