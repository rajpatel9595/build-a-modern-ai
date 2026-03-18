'use client'

import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/lib/types';
const STORAGE_KEY = 'ai_portfolio_chat'

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

const AI_RESPONSES: Record<string, string> = {
  default: "Thanks for reaching out! I'm Alex's AI assistant. I can answer questions about his projects, skills, or experience. What would you like to know?",
  hello: "Hey there! 👋 Great to meet you. I'm Alex's portfolio assistant. Ask me about his projects, tech stack, or how to work with him!",
  project: "Alex has built 6 featured projects spanning LLM applications, NLP systems, computer vision, and AI agents. His most notable work includes an Autonomous Research Agent and an AI Health Assistant. Which one interests you most?",
  llm: "Alex specializes in LLM applications — from RAG pipelines and fine-tuning to multi-agent systems. He's worked with GPT-4, Claude, LLaMA, and has deep experience with LangChain and LangGraph.",
  hire: "Alex is currently open to senior AI engineering roles and consulting engagements. You can reach him via the contact form below, or connect on GitHub. He typically responds within 24 hours.",
  skill: "Alex's core skills span AI/ML (NLP, Computer Vision, LLMs), frameworks (PyTorch, TensorFlow, LangChain), and engineering (Next.js, TypeScript, Docker, FastAPI). He's a full-stack AI engineer.",
  contact: "You can reach Alex at alex@example.com or connect via LinkedIn. For project inquiries, use the contact form in this section. He's based in SF and available for remote work globally.",
  research: "Alex actively publishes research notes on topics like RAG architectures, LLaMA fine-tuning with LoRA/QLoRA, diffusion models for synthetic data, and LLM security red-teaming.",
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.match(/\b(hi|hello|hey|howdy)\b/)) return AI_RESPONSES.hello
  if (lower.match(/\b(project|work|built|created)\b/)) return AI_RESPONSES.project
  if (lower.match(/\b(llm|gpt|claude|language model|rag|langchain)\b/)) return AI_RESPONSES.llm
  if (lower.match(/\b(hire|job|role|opportunity|available|work with)\b/)) return AI_RESPONSES.hire
  if (lower.match(/\b(skill|experience|tech|stack|know|use)\b/)) return AI_RESPONSES.skill
  if (lower.match(/\b(contact|email|reach|message)\b/)) return AI_RESPONSES.contact
  if (lower.match(/\b(research|paper|experiment|notebook)\b/)) return AI_RESPONSES.research
  return AI_RESPONSES.default
}

export default function ContactChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formSent, setFormSent] = useState(false)
  const [formError, setFormError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setMessages(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: input.trim(), timestamp: Date.now() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: getAIResponse(userMsg.content),
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 900 + Math.random() * 600)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError('Please fill in all fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address.')
      return
    }
    setFormSent(true)
  }

  return (
    <section id="contact" ref={sectionRef} className="py-20 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-2">Get In Touch</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Let&apos;s <span className="gradient-text">Work Together</span>
            </h2>
            <p className="text-zinc-400 text-base max-w-xl mx-auto">
              Whether you have a project in mind, a role to fill, or just want to talk AI — I&apos;m always open to a conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="glass-card border border-white/10 p-6 glow-violet-hover transition-all duration-300">
              <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send a Message
              </h3>

              {formSent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-lg">Message Sent!</p>
                  <p className="text-zinc-400 text-sm">Thanks {name}! I&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setFormSent(false); setName(''); setEmail(''); setMessage('') }}
                    className="mt-2 px-4 py-2 text-sm text-violet-400 border border-violet-500/30 rounded-lg hover:bg-violet-500/10 transition-all active:scale-95"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-400 font-medium mb-1.5">Name</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-zinc-200 placeholder-zinc-600 text-sm outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 font-medium mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-zinc-200 placeholder-zinc-600 text-sm outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 font-medium mb-1.5">Message</label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Tell me about your project or opportunity..."
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-zinc-200 placeholder-zinc-600 text-sm outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
                    />
                  </div>
                  {formError && (
                    <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{formError}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 flex items-center justify-center gap-2"
                  >
                    Send Message
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              )}
            </div>

            {/* AI Chat Widget */}
            <div className="glass-card border border-white/10 p-5 flex flex-col glow-cyan-hover transition-all duration-300" style={{ minHeight: '400px' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                    AI
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Portfolio Assistant</p>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      <span className="text-emerald-400 text-xs">Online</span>
                    </div>
                  </div>
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={() => { setMessages([]); localStorage.removeItem(STORAGE_KEY) }}
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 min-h-0" style={{ maxHeight: '280px' }}>
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-zinc-400 text-sm font-medium">Ask me anything</p>
                    <p className="text-zinc-600 text-xs mt-1">Projects, skills, experience, hiring...</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {["Tell me about your projects", "What's your tech stack?", "Are you available to hire?"].map(q => (
                        <button
                          key={q}
                          onClick={() => { setInput(q); }}
                          className="px-3 py-1.5 text-xs rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:border-violet-500/40 hover:text-zinc-200 transition-all duration-200"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-violet-600/80 text-white rounded-br-sm'
                          : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-zinc-800/80 border border-zinc-700/50 flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Ask about projects, skills, hiring..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-zinc-200 placeholder-zinc-600 text-sm outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/20 flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            {[
              { label: 'GitHub', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z', href: 'https://github.com' },
              { label: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', href: 'https://linkedin.com' },
              { label: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', href: 'https://twitter.com' },
            ].map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 glass-card border border-white/10 hover:border-violet-500/30 text-zinc-400 hover:text-violet-400 text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
