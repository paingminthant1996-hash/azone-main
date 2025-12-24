"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, TrendingUp, Clock, Users, Zap } from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  result: string;
  metrics: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
  imageUrl: string;
  templateUsed: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: "1",
    title: "Scaling FinTech UI in 4 Weeks",
    company: "PayFlow",
    industry: "Financial Technology",
    challenge:
      "PayFlow needed to launch their payment platform MVP within a tight deadline. Building a production-ready UI from scratch would take months, delaying their go-to-market strategy and investor milestones.",
    solution:
      "PayFlow's engineering team selected Azone's Enterprise Dashboard template as their foundation. The template provided authentication flows, transaction tables, and analytics components that matched their requirements. Customization focused on brand integration and payment-specific features.",
    result:
      "PayFlow launched their MVP 4 weeks ahead of schedule. The production-ready components eliminated 200+ hours of development time. The platform processed $2M in transactions within the first month.",
    metrics: [
      {
        label: "Faster Deployment",
        value: "80%",
        icon: <Clock className="w-5 h-5" />,
      },
      {
        label: "Time Saved",
        value: "200+ hrs",
        icon: <Zap className="w-5 h-5" />,
      },
      {
        label: "User Growth",
        value: "45%",
        icon: <TrendingUp className="w-5 h-5" />,
      },
    ],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    templateUsed: "Enterprise Dashboard",
  },
  {
    id: "2",
    title: "Modernizing E-commerce Architecture",
    company: "RetailHub",
    industry: "E-commerce",
    challenge:
      "RetailHub's legacy platform couldn't handle peak traffic during sales events. Their existing UI was built on outdated frameworks, making it difficult to implement modern features like real-time inventory and personalized recommendations.",
    solution:
      "RetailHub rebuilt their frontend using Azone's SaaS Landing Page template, integrated with their existing backend. The template's scalable architecture and modern tech stack (Next.js, TypeScript) provided the foundation for real-time features and improved performance.",
    result:
      "The new platform handled 3x traffic during Black Friday without performance issues. User engagement increased by 30%, and conversion rates improved by 18%. The modern architecture enabled rapid feature development.",
    metrics: [
      {
        label: "Traffic Capacity",
        value: "3x",
        icon: <TrendingUp className="w-5 h-5" />,
      },
      {
        label: "User Engagement",
        value: "30%",
        icon: <Users className="w-5 h-5" />,
      },
      {
        label: "Conversion Rate",
        value: "18%",
        icon: <ArrowRight className="w-5 h-5" />,
      },
    ],
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop",
    templateUsed: "SaaS Landing Page",
  },
  {
    id: "3",
    title: "Launching AI Platform Interface",
    company: "DataViz AI",
    industry: "Artificial Intelligence",
    challenge:
      "DataViz AI required a sophisticated dashboard to visualize complex AI model outputs and analytics. Building custom data visualization components would require specialized expertise and significant development time.",
    solution:
      "DataViz AI leveraged Azone's Analytics Dashboard template, which included advanced charting libraries and data visualization components. The template's modular architecture allowed seamless integration with their AI backend APIs.",
    result:
      "DataViz AI launched their platform 6 weeks ahead of schedule. The pre-built visualization components reduced development costs by 60%. Client onboarding time decreased from 2 weeks to 3 days.",
    metrics: [
      {
        label: "Cost Reduction",
        value: "60%",
        icon: <TrendingUp className="w-5 h-5" />,
      },
      {
        label: "Onboarding Time",
        value: "3 days",
        icon: <Clock className="w-5 h-5" />,
      },
      {
        label: "Client Satisfaction",
        value: "92%",
        icon: <Users className="w-5 h-5" />,
      },
    ],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    templateUsed: "Analytics Dashboard",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-azone-black pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 leading-[1.15] tracking-tight">
            <span className="text-white">Case</span>
            <span className="text-azone-purple ml-3">Studies</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Real-world implementations. Production deployments. Proven results.
            <br />
            <span className="text-gray-500 text-base mt-1 block">
              How funded startups accelerate their product development with Azone templates.
            </span>
          </p>
        </div>

        {/* Case Studies */}
        <div className="space-y-24">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={study.id} study={study} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
}

function CaseStudyCard({ study, index }: CaseStudyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Glassmorphism Card Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900 backdrop-blur-2xl border border-gray-800/40 rounded-3xl transition-all duration-250 ease-[cubic-bezier(0.25,0.1,0.25,1)] shadow-2xl group-hover:border-gray-700/60"></div>

      {/* Content Container */}
      <div className="relative z-10 p-8 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded-md border text-gray-400 bg-gray-900/40 border-gray-800/30">
              {study.industry}
            </span>
            <span className="text-sm text-gray-500 font-mono">
              {study.templateUsed}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2 leading-[1.15] tracking-tight">
            {study.title}
          </h2>
          <p className="text-lg text-gray-400">{study.company}</p>
        </div>

        {/* Project Screenshot */}
        <div className="relative h-64 md:h-96 mb-12 rounded-2xl overflow-hidden">
          <Image
            src={study.imageUrl}
            alt={study.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
        </div>

        {/* Three Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* The Challenge */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-azone-purple"></span>
              The Challenge
            </h3>
            <p className="text-gray-400 leading-relaxed">{study.challenge}</p>
          </div>

          {/* The Solution */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-azone-purple"></span>
              The Solution
            </h3>
            <p className="text-gray-400 leading-relaxed mb-2">{study.solution}</p>
            <p className="text-sm text-gray-500 font-mono">
              Using Azone: {study.templateUsed}
            </p>
          </div>

          {/* The Result */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-azone-purple"></span>
              The Result
            </h3>
            <p className="text-gray-400 leading-relaxed">{study.result}</p>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-800">
          {study.metrics.map((metric, metricIndex) => (
            <motion.div
              key={metricIndex}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 + metricIndex * 0.05 }}
              className="p-6 bg-gray-950 border border-gray-800/50 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-gray-500">{metric.icon}</div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {metric.label}
                </span>
              </div>
              <p className="text-3xl font-semibold text-white">{metric.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

