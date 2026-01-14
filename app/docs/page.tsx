"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Code, 
  Palette, 
  Rocket, 
  Database, 
  Globe,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Rocket,
    content: `
      <h2>Welcome to Website Building</h2>
      <p>Building a website from scratch might seem daunting, but with the right approach, it's an exciting journey. This guide will walk you through every step.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>Planning your website</li>
        <li>Choosing the right tools</li>
        <li>Setting up your development environment</li>
        <li>Building your first page</li>
        <li>Deploying to the web</li>
      </ul>
      
      <h3>Prerequisites</h3>
      <p>Before we begin, make sure you have:</p>
      <ul>
        <li>A computer with internet connection</li>
        <li>Basic computer skills</li>
        <li>Enthusiasm to learn!</li>
      </ul>
    `,
  },
  {
    id: "planning",
    title: "Planning Your Website",
    icon: BookOpen,
    content: `
      <h2>Plan Before You Build</h2>
      <p>Good planning is the foundation of a successful website. Take time to think about what you want to achieve.</p>
      
      <h3>Define Your Goals</h3>
      <p>Ask yourself:</p>
      <ul>
        <li>What is the purpose of your website?</li>
        <li>Who is your target audience?</li>
        <li>What actions do you want visitors to take?</li>
        <li>What content will you need?</li>
      </ul>
      
      <h3>Create a Site Map</h3>
      <p>Sketch out the structure of your website:</p>
      <ul>
        <li>Home page</li>
        <li>About page</li>
        <li>Services/Products pages</li>
        <li>Contact page</li>
        <li>Blog (optional)</li>
      </ul>
      
      <h3>Choose Your Domain Name</h3>
      <p>Your domain name should be:</p>
      <ul>
        <li>Easy to remember</li>
        <li>Relevant to your brand</li>
        <li>Short and simple</li>
        <li>Available (check domain registrars)</li>
      </ul>
    `,
  },
  {
    id: "design",
    title: "Design & Wireframing",
    icon: Palette,
    content: `
      <h2>Design Your Website</h2>
      <p>Design is more than just making things look pretty. It's about creating an intuitive user experience.</p>
      
      <h3>Create Wireframes</h3>
      <p>Start with simple sketches or use tools like:</p>
      <ul>
        <li>Figma (free, web-based)</li>
        <li>Adobe XD</li>
        <li>Pen and paper (still works!)</li>
      </ul>
      
      <h3>Design Principles</h3>
      <ul>
        <li><strong>Simplicity:</strong> Keep it clean and uncluttered</li>
        <li><strong>Consistency:</strong> Use the same colors, fonts, and styles throughout</li>
        <li><strong>Navigation:</strong> Make it easy for users to find what they need</li>
        <li><strong>Mobile-first:</strong> Design for mobile devices first, then scale up</li>
      </ul>
      
      <h3>Color Scheme</h3>
      <p>Choose 2-3 main colors:</p>
      <ul>
        <li>Primary color (your brand color)</li>
        <li>Secondary color (for accents)</li>
        <li>Neutral colors (for text and backgrounds)</li>
      </ul>
      
      <h3>Typography</h3>
      <p>Select readable fonts:</p>
      <ul>
        <li>Use web-safe fonts or Google Fonts</li>
        <li>Limit to 2-3 font families</li>
        <li>Ensure good contrast for readability</li>
      </ul>
    `,
  },
  {
    id: "setup",
    title: "Setting Up Development Environment",
    icon: Code,
    content: `
      <h2>Get Your Tools Ready</h2>
      <p>Before coding, you need to set up your development environment.</p>
      
      <h3>Choose Your Tech Stack</h3>
      <p>For beginners, we recommend:</p>
      <ul>
        <li><strong>HTML:</strong> Structure of your website</li>
        <li><strong>CSS:</strong> Styling and layout</li>
        <li><strong>JavaScript:</strong> Interactivity</li>
        <li><strong>Next.js:</strong> Modern framework (optional but recommended)</li>
      </ul>
      
      <h3>Install Required Software</h3>
      <ol>
        <li><strong>Code Editor:</strong> Install VS Code (free)</li>
        <li><strong>Node.js:</strong> Download from nodejs.org</li>
        <li><strong>Git:</strong> Version control system</li>
        <li><strong>Browser:</strong> Chrome or Firefox with developer tools</li>
      </ol>
      
      <h3>Create Your Project</h3>
      <p>If using Next.js:</p>
      <pre><code>npx create-next-app@latest my-website
cd my-website
npm run dev</code></pre>
      
      <p>Your website will be available at <code>http://localhost:3000</code></p>
      
      <h3>Project Structure</h3>
      <p>Organize your files:</p>
      <ul>
        <li><code>pages/</code> or <code>app/</code> - Your website pages</li>
        <li><code>components/</code> - Reusable components</li>
        <li><code>styles/</code> - CSS files</li>
        <li><code>public/</code> - Images and static files</li>
      </ul>
    `,
  },
  {
    id: "building",
    title: "Building Your First Page",
    icon: Code,
    content: `
      <h2>Create Your Homepage</h2>
      <p>Let's build your first page step by step.</p>
      
      <h3>1. Create the HTML Structure</h3>
      <p>Start with a basic HTML structure:</p>
      <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;title&gt;My Website&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;header&gt;
    &lt;h1&gt;Welcome to My Website&lt;/h1&gt;
  &lt;/header&gt;
  &lt;main&gt;
    &lt;p&gt;This is my first website!&lt;/p&gt;
  &lt;/main&gt;
  &lt;footer&gt;
    &lt;p&gt;&copy; 2024 My Website&lt;/p&gt;
  &lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
      
      <h3>2. Add CSS Styling</h3>
      <p>Create a <code>styles.css</code> file:</p>
      <pre><code>body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

header {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}</code></pre>
      
      <h3>3. Add Interactivity with JavaScript</h3>
      <p>Create a <code>script.js</code> file:</p>
      <pre><code>// Example: Add a click event
document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('#myButton');
  button.addEventListener('click', function() {
    alert('Button clicked!');
  });
});</code></pre>
      
      <h3>4. Make It Responsive</h3>
      <p>Add media queries for mobile devices:</p>
      <pre><code>@media (max-width: 768px) {
  main {
    padding: 1rem;
  }
  
  header h1 {
    font-size: 1.5rem;
  }
}</code></pre>
    `,
  },
  {
    id: "database",
    title: "Adding Dynamic Content",
    icon: Database,
    content: `
      <h2>Connect to a Database</h2>
      <p>For dynamic content, you'll need a database.</p>
      
      <h3>Choose a Database</h3>
      <ul>
        <li><strong>Supabase:</strong> Free PostgreSQL database (recommended)</li>
        <li><strong>Firebase:</strong> Google's database solution</li>
        <li><strong>MongoDB:</strong> NoSQL database</li>
        <li><strong>MySQL:</strong> Traditional relational database</li>
      </ul>
      
      <h3>Set Up Supabase</h3>
      <ol>
        <li>Go to supabase.com and create a free account</li>
        <li>Create a new project</li>
        <li>Get your API keys from Settings → API</li>
        <li>Install Supabase client: <code>npm install @supabase/supabase-js</code></li>
      </ol>
      
      <h3>Connect to Your Database</h3>
      <pre><code>import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)</code></pre>
      
      <h3>Query Data</h3>
      <pre><code>// Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert([{ name: 'Example' }])</code></pre>
    `,
  },
  {
    id: "deployment",
    title: "Deploying Your Website",
    icon: Globe,
    content: `
      <h2>Go Live!</h2>
      <p>Once your website is ready, it's time to share it with the world.</p>
      
      <h3>Choose a Hosting Platform</h3>
      <ul>
        <li><strong>Vercel:</strong> Best for Next.js (free tier available)</li>
        <li><strong>Netlify:</strong> Great for static sites</li>
        <li><strong>GitHub Pages:</strong> Free hosting for static sites</li>
        <li><strong>Traditional Hosting:</strong> cPanel, shared hosting</li>
      </ul>
      
      <h3>Deploy to Vercel</h3>
      <ol>
        <li>Push your code to GitHub</li>
        <li>Go to vercel.com and sign up</li>
        <li>Click "New Project"</li>
        <li>Import your GitHub repository</li>
        <li>Click "Deploy"</li>
        <li>Your site will be live in minutes!</li>
      </ol>
      
      <h3>Connect Your Domain</h3>
      <ol>
        <li>Buy a domain from a registrar (Namecheap, GoDaddy, etc.)</li>
        <li>In Vercel, go to your project → Settings → Domains</li>
        <li>Add your domain</li>
        <li>Update DNS records as instructed</li>
        <li>Wait for DNS propagation (can take up to 48 hours)</li>
      </ol>
      
      <h3>SSL Certificate</h3>
      <p>Vercel automatically provides SSL certificates (HTTPS) for free. Your site will be secure by default!</p>
      
      <h3>Continuous Deployment</h3>
      <p>With Vercel, every time you push to GitHub, your site automatically updates. No manual deployment needed!</p>
    `,
  },
];

export default function DocsPage() {
  const [activeStep, setActiveStep] = useState(steps[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentStep = steps.find(step => step.id === activeStep) || steps[0];

  return (
    <div className="min-h-screen bg-azone-black">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-shrink-0 lg:w-64 lg:border-r lg:border-gray-800 bg-gray-900/30">
          <div className="flex flex-col w-full">
            <div className="p-6 border-b border-gray-800">
              <Link href="/" className="flex items-center gap-2 text-white hover:text-azone-purple transition-colors">
                <BookOpen className="w-5 h-5" />
                <span className="font-bold text-lg">Documentation</span>
              </Link>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        isActive
                          ? "bg-azone-purple/20 text-azone-purple border border-azone-purple/30"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{step.title}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </aside>

        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-gray-900/90 border border-gray-800 rounded-lg text-white"
          >
            <BookOpen className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-white">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-bold">Docs</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setActiveStep(step.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                        isActive
                          ? "bg-azone-purple/20 text-azone-purple"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{step.title}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const Icon = currentStep.icon;
                    return <Icon className="w-8 h-8 text-azone-purple" />;
                  })()}
                  <h1 className="text-4xl font-bold text-white">{currentStep.title}</h1>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-azone-purple to-blue-500 rounded-full"></div>
              </div>

              <div 
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-white
                  prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-ul:text-gray-300 prose-ul:space-y-2
                  prose-li:marker:text-azone-purple
                  prose-code:text-azone-purple prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800
                  prose-strong:text-white
                  prose-a:text-azone-purple prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: currentStep.content }}
              />

              {/* Next Steps Section */}
              <div className="mt-12 p-6 bg-gradient-to-r from-azone-purple/10 to-blue-500/10 border border-azone-purple/20 rounded-xl">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-azone-purple flex-shrink-0 mt-1" />
                  <h2 className="text-2xl font-bold text-white">Next Steps</h2>
                </div>
                <div className="space-y-3 text-gray-300">
                  {(() => {
                    const currentIndex = steps.findIndex(s => s.id === activeStep);
                    const nextStep = steps[currentIndex + 1];
                    
                    if (nextStep) {
                      return (
                        <div>
                          <p className="mb-3">Ready to continue? Move on to the next step:</p>
                          <Link
                            href={`#${nextStep.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveStep(nextStep.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-azone-purple hover:bg-azone-purple/80 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-azone-purple/50"
                          >
                            Continue to {nextStep.title}
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <p className="mb-3">Congratulations! You&apos;ve completed all the steps.</p>
                          <p className="mb-4">Now you&apos;re ready to build your own website. Here are some additional resources:</p>
                          <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Explore our <Link href="/templates" className="text-azone-purple hover:underline">premium templates</Link> for inspiration</li>
                            <li>Check out <Link href="/case-studies" className="text-azone-purple hover:underline">case studies</Link> to see real examples</li>
                            <li>Join our community for support and tips</li>
                          </ul>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
