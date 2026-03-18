'use client'

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsResearchBlog from '@/components/SkillsResearchBlog';
import ContactChat from '@/components/ContactChat';
import { Project } from '@/lib/types';
export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(prev => !prev)
      }
      if (e.key === 'Escape') setCommandOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <main className="min-h-screen bg-[#030712] overflow-x-hidden">
      <NavBar onCommandOpen={() => setCommandOpen(true)} />
      <HeroSection />

      {/* About */}
      <section id="about" className="py-20 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center section-reveal" id="about-reveal">
            <div>
              <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">About Me</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Building the next generation of{' '}
                <span className="gradient-text">intelligent systems</span>
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-4">
                I'm an AI Engineer with 5+ years of experience designing and deploying production-grade machine learning systems. My focus is at the intersection of large language models, retrieval-augmented generation, and real-world application engineering.
              </p>
              <p className="text-zinc-400 text-base leading-relaxed mb-6">
                From fine-tuning frontier models to shipping full-stack AI products used by thousands, I bridge the gap between research breakthroughs and reliable software. Currently available for senior AI engineering roles and high-impact consulting.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Open to Work', 'Remote Friendly', 'AI/ML Focus'].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Years Experience', value: '5+', color: 'violet' },
                { label: 'Projects Shipped', value: '20+', color: 'cyan' },
                { label: 'GitHub Stars', value: '2.4k', color: 'emerald' },
                { label: 'Papers Read', value: '300+', color: 'violet' },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-6 glow-violet-hover transition-all duration-300 hover:-translate-y-1">
                  <div className={`text-3xl font-bold mb-1 ${
                    stat.color === 'violet' ? 'text-violet-400' :
                    stat.color === 'cyan' ? 'text-cyan-400' : 'text-emerald-400'
                  }`}>{stat.value}</div>
                  <div className="text-zinc-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProjectsSection onProjectSelect={setSelectedProject} selectedProject={selectedProject} onProjectClose={() => setSelectedProject(null)} />
      <SkillsResearchBlog />
      <ContactChat />

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="gradient-text font-bold text-lg">Alex Chen</div>
          <p className="text-zinc-600 text-sm">© 2024 — Built with Next.js, TypeScript & ❤️</p>
          <div className="flex gap-4 text-zinc-500 text-sm">
            <a href="#about" className="hover:text-violet-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-violet-400 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-violet-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Command Palette */}
      {commandOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setCommandOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-xl glass-card border border-white/20 shadow-2xl overflow-hidden"
            style={{ animation: 'scaleIn 0.2s ease forwards' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoFocus
                className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-sm"
                placeholder="Search projects, skills, posts..."
              />
              <kbd className="text-xs text-zinc-600 bg-zinc-800 px-2 py-1 rounded">ESC</kbd>
            </div>
            <div className="p-2">
              {[
                { label: 'View Projects', href: '#projects' },
                { label: 'Read Blog', href: '#blog' },
                { label: 'Research Notes', href: '#research' },
                { label: 'Contact Me', href: '#contact' },
                { label: 'Download Resume', href: '#' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setCommandOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
