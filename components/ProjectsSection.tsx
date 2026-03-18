'use client'

import { useState, useEffect, useRef } from 'react';
import { projects } from '@/lib/data';
import { Project } from '@/lib/types';
const CATEGORIES = ['All', 'LLM Applications', 'NLP', 'ML Systems', 'Computer Vision', 'AI Agents']

export default function ProjectsSection({
  onProjectSelect,
  selectedProject,
  onProjectClose,
}: {
  onProjectSelect: (p: Project) => void
  selectedProject: Project | null
  onProjectClose: () => void
}) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [showFeatured, setShowFeatured] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const filtered = projects.filter(p => {
    const catMatch = activeCategory === 'All' || p.category === activeCategory
    const featMatch = !showFeatured || p.featured
    return catMatch && featMatch
  })

  return (
    <section id="projects" ref={sectionRef} className="py-20 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-2">Portfolio</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Featured <span className="gradient-text">Projects</span>
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${showFeatured ? 'bg-violet-600' : 'bg-zinc-700'}`}
                onClick={() => setShowFeatured((p: boolean) => !p)}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${showFeatured ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-zinc-400 text-sm">Featured only</span>
            </label>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${
                  activeCategory === cat
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                    : 'glass-card text-zinc-400 hover:text-zinc-200 hover:border-violet-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold text-zinc-400">No projects found</p>
              <p className="text-sm mt-1">Try a different filter or toggle off featured-only</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectSelect(project)}
                  delay={i * 80}
                  visible={visible}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={onProjectClose} />
      )}
    </section>
  )
}

function ProjectCard({ project, onClick, delay, visible }: {
  project: Project
  onClick: () => void
  delay: number
  visible: boolean
}) {
  return (
    <div
      onClick={onClick}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group glass-card border border-white/10 hover:border-violet-500/40 cursor-pointer transition-all duration-300 hover:-translate-y-2 glow-violet-hover overflow-hidden flex flex-col ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
        {project.featured && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-violet-600/90 backdrop-blur-sm text-white text-xs font-semibold">
            Featured
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-zinc-300 text-xs border border-white/10">
            {project.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-zinc-100 font-semibold text-base mb-2 group-hover:text-white transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="text-zinc-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 4).map(tech => (
            <span key={tech} className="px-2 py-0.5 text-xs rounded-md bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-zinc-800/80 text-zinc-500 border border-zinc-700/50">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg glass-card border border-white/10 hover:border-violet-500/40 text-zinc-400 hover:text-white text-xs font-medium transition-all duration-200 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-600/20 border border-violet-500/30 hover:bg-violet-600/40 text-violet-400 hover:text-violet-300 text-xs font-medium transition-all duration-200 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Live Demo
          </a>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl glass-card border border-white/15 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ animation: 'scaleIn 0.25s ease forwards' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full glass-card border border-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative h-52 overflow-hidden">
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="px-2.5 py-1 rounded-full bg-violet-600/80 backdrop-blur-sm text-white text-xs font-semibold">
              {project.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-3">{project.title}</h2>
          <p className="text-zinc-400 leading-relaxed mb-5 text-sm">{project.longDescription}</p>

          <div className="mb-5">
            <h4 className="text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <span key={tech} className="px-3 py-1 text-xs rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl glass-card border border-white/15 hover:border-violet-500/40 text-zinc-300 hover:text-white text-sm font-medium transition-all duration-200 active:scale-95"
            >
              View on GitHub
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/20"
            >
              Live Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}