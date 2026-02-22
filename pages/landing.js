import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Landing() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast Generation",
      description: "Create professional CVs in seconds using advanced AI technology powered by GPT-4 Turbo."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "ATS-Optimized Content",
      description: "AI-crafted content designed to pass Applicant Tracking Systems and catch recruiters' attention."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: "9 Professional Templates",
      description: "Choose from modern, creative, and executive templates designed by HR professionals."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: "Full Customization",
      description: "Personalize fonts, colors, and layouts. Your CV, your style, powered by AI intelligence."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "Smart Profile System",
      description: "Save your details once, and AI automatically tailors them for every job application."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "3 Input Modes",
      description: "Paste existing CV, build manually, or let AI generate from job descriptions - you choose!"
    }
  ];

  const benefits = [
    {
      stat: "95%",
      label: "Pass Rate",
      description: "Our AI-generated CVs pass ATS systems"
    },
    {
      stat: "30 sec",
      label: "Average Time",
      description: "From job listing to polished CV"
    },
    {
      stat: "9",
      label: "Templates",
      description: "Professional designs to choose from"
    },
    {
      stat: "100%",
      label: "Free",
      description: "No hidden fees, completely free"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Choose Your Mode",
      description: "Paste existing CV, build manually, or use AI generation",
      color: "from-blue-500 to-blue-600"
    },
    {
      step: "2",
      title: "AI Analyzes & Generates",
      description: "GPT-4 Turbo crafts ATS-optimized content tailored to your job",
      color: "from-purple-500 to-purple-600"
    },
    {
      step: "3",
      title: "Customize & Export",
      description: "Fine-tune with our editor, then export as PDF",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <>
      <Head>
        <title>CV Maker Pro - AI-Powered Resume Builder | Create Perfect CVs in Seconds</title>
        <meta name="description" content="Create professional, ATS-optimized CVs with AI technology. Choose from 9 templates, customize everything, and export to PDF. Fast, free, and powerful." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        {/* Navigation */}
        <nav className="bg-gray-900 bg-opacity-50 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">CV Maker Pro</span>
              </div>
              <button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Launch App →
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
            <div className="text-center">
              <div className="inline-block mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold px-6 py-2 rounded-full">
                  🚀 Powered by GPT-4 Turbo AI
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                Create Perfect CVs
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                  With AI in Seconds
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Stop struggling with CV formatting. Let advanced AI craft professional, 
                ATS-optimized resumes tailored to your dream job.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all transform hover:scale-105 shadow-2xl"
                >
                  Start Creating Free →
                </button>
                <button
                  onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-lg text-white font-semibold py-4 px-10 rounded-xl text-lg border-2 border-white border-opacity-20 transition-all"
                >
                  See How It Works
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 text-center transform hover:scale-105 transition-all">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-2">
                    {benefit.stat}
                  </div>
                  <div className="text-white font-semibold mb-1">{benefit.label}</div>
                  <div className="text-gray-400 text-sm">{benefit.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why AI for CVs */}
        <section className="py-24 bg-gray-900 bg-opacity-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why Use AI for Your CV?
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Traditional CV writing is time-consuming and often ineffective. AI changes everything.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Traditional Way */}
              <div className="bg-red-900 bg-opacity-20 border-2 border-red-500 border-opacity-30 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white">Traditional CV Writing</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Hours of formatting and rewriting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Rejected by ATS systems (70% failure rate)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Generic content that doesn't stand out</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Manual tailoring for each job application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Difficult to know what recruiters want</span>
                  </li>
                </ul>
              </div>

              {/* AI Way */}
              <div className="bg-green-900 bg-opacity-20 border-2 border-green-500 border-opacity-30 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white">AI-Powered CV Maker</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Professional CV in under 30 seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>95% ATS pass rate with optimized keywords</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>AI crafts compelling, unique content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Automatically tailored to each job description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Based on millions of successful CVs analyzed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Three simple steps to your perfect CV
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 h-full transform hover:scale-105 transition-all">
                    <div className={`bg-gradient-to-r ${step.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg`}>
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-gray-900 bg-opacity-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Everything you need to create the perfect CV
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all group">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-all shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of job seekers who've transformed their careers with AI-powered CVs
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Create Your CV Now - It's Free! →
              </button>
              <p className="text-blue-200 text-sm mt-4">No credit card required • No sign up • 100% Free</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 bg-opacity-50 border-t border-gray-700 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">CV Maker Pro</span>
              </div>
              <div className="text-gray-400 text-center md:text-right">
                <p>© 2025 CV Maker Pro. Powered by AI.</p>
                <p className="text-sm mt-1">Create professional CVs in seconds with GPT-4 Turbo</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
