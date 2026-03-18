'use client'

import { useEffect, useRef, useState } from 'react';
import { skillCategories, researchItems, blogPosts } from '@/lib/data';
type TabKey = 'skills' | 'research' | 'blog'

const SKILL_COLORS: Record<string, string> = {
  violet: 'bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20',
}

const RESEARCH_TYPE_COLORS: Record<string, string> = {
  Experiment: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  Research: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  Security: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
}

export default function SkillsResearchBlog() {
  const [activeTab, setActiveTab] = useState<TabKey>('skills')
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'skills', label: 'Skills' },
    { key: 'research', label: 'Research' },
    { key: 'blog', label: 'Blog' },
  ]

  return (
    <section ref={sectionRef} className="py-20 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Tab nav */}
          <div className="flex gap-1 p-1 glass-card border border-white/10 rounded-xl w-fit mb-10">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 ${
                  activeTab === tab.key
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Skills */}
          {activeTab === 'skills' && (
            <div id="skills" className="space-y-8">
              <div>
                <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-2">Expertise</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                  Technical <span className="gradient-text">Skillset</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {skillCategories.map((cat, ci) => (
                  <div
                    key={cat.id}
                    className="glass-card border border-white/10 p-6 glow-violet-hover transition-all duration-300 hover:-translate-y-1"
                    style={{ transitionDelay: `${ci * 100}ms` }}
                  >
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 ${
                      cat.color === 'violet' ? 'bg-violet-500/15 text-violet-400' :
                      cat.color === 'cyan' ? 'bg-cyan-500/15 text-cyan-400' :
                      'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {cat.category}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map(skill => (
                        <span
                          key={skill}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-default ${SKILL_COLORS[cat.color]}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research */}
          {activeTab === 'research' && (
            <div id="research" className="space-y-4">
              <div>
                <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-2">Notebooks & Experiments</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                  Research <span className="gradient-text">Notes</span>
                </h2>
              </div>
              {researchItems.map((item, i) => (
                <a
                  key={item.id}
                  href={item.notebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block glass-card border border-white/10 hover:border-violet-500/30 p-5 transition-all duration-300 hover:-translate-y-0.5 glow-violet-hover"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${RESEARCH_TYPE_COLORS[item.type] ?? 'bg-zinc-700 text-zinc-300'}`}>
                          {item.type}
                        </span>
                        <span className="text-zinc-600 text-xs">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h3 className="text-zinc-100 font-semibold mb-1.5 group-hover:text-white group-hover:text-violet-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <svg className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-zinc-800/80 text-zinc-500 border border-zinc-700/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Blog */}
          {activeTab === 'blog' && (
            <div id="blog" className="space-y-4">
              <div>
                <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-2">Writing</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                  Latest <span className="gradient-text">Articles</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {blogPosts.map((post, i) => (
                  <div
                    key={post.id}
                    className="group glass-card border border-white/10 hover:border-violet-500/30 cursor-pointer transition-all duration-300 hover:-translate-y-1 glow-violet-hover overflow-hidden"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-zinc-400 text-xs border border-white/10">
                        {post.readTime} min read
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-zinc-600 text-xs">
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-zinc-100 font-semibold text-sm mb-2 group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
