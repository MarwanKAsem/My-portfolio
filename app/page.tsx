"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Calendar, ExternalLink, Code, MapPin, Phone, Globe } from "lucide-react"
import Image from "next/image"
import { AnimatedBorderBox } from "../components/animated-border-box"

// Generate an array of random dust particles
const generateDustParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }))
}

// Function to generate stars
const generateStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const isEdgeStar = Math.random() > 0.6
    let left, top

    if (isEdgeStar) {
      const edge = Math.floor(Math.random() * 4)
      if (edge === 0) {
        left = Math.random() * 100
        top = Math.random() * 15
      } else if (edge === 1) {
        left = 85 + Math.random() * 15
        top = Math.random() * 100
      } else if (edge === 2) {
        left = Math.random() * 100
        top = 85 + Math.random() * 15
      } else {
        left = Math.random() * 15
        top = Math.random() * 100
      }
    } else {
      left = Math.random() * 100
      top = Math.random() * 100
    }

    return {
      id: i,
      size: isEdgeStar ? Math.random() * 4 + 2 : Math.random() * 3 + 1,
      left,
      top,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      isShiny: isEdgeStar && Math.random() > 0.5,
    }
  })
}

const StarField = ({ count = 100 }) => {
  const [stars, setStars] = useState<ReturnType<typeof generateStars>>([])
  useEffect(() => {
    setStars(generateStars(count)) // Generate stars only on the client
  }, [count])

  return (
    <div className="absolute inset-0">
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.left}%`,
            top: `${star.top}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  )
}

const DustCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; life: number }>>(
    [],
  )
  const particleCount = 15
  const maxLife = 20

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Create new particles at mouse position
      const newParticles = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        size: Math.random() * 3 + 1,
        life: maxLife,
      }))

      setParticles((prev) => [...prev, ...newParticles])
    }

    // Update particles life and remove dead ones
    const updateParticles = () => {
      setParticles((prev) => prev.map((p) => ({ ...p, life: p.life - 1 })).filter((p) => p.life > 0))
    }

    const intervalId = setInterval(updateParticles, 50)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Main cursor glow */}
      <motion.div
        className="absolute w-[40px] h-[40px] bg-[#9d4edd]/20 blur-md rounded-full pointer-events-none"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
        }}
      />

      {/* Dust particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-[#c77dff]/40 rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: particle.x,
            top: particle.y,
            opacity: particle.life / maxLife,
          }}
          animate={{
            x: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 60],
            y: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 60 + 20],
            opacity: [particle.life / maxLife, 0],
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

const BackgroundLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {/* Horizontal lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute h-[1px] w-full bg-[#9d4edd]/20"
          style={{ top: `${i * 10 + Math.random() * 5}%` }}
        />
      ))}

      {/* Vertical lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute w-[1px] h-full bg-[#9d4edd]/20"
          style={{ left: `${i * 10 + Math.random() * 5}%` }}
        />
      ))}

      {/* Diagonal lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`d-${i}`}
          className="absolute w-[1px] h-[200%] bg-[#9d4edd]/20 origin-bottom-left rotate-45"
          style={{
            left: `${i * 20 + Math.random() * 10}%`,
            top: `${Math.random() * 50}%`,
          }}
        />
      ))}
    </div>
  )
}

const LightBeams = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top-left light beam */}
      <div className="absolute -top-20 -left-20 w-[300px] h-[500px] bg-gradient-to-br from-[#9d4edd]/20 to-transparent transform rotate-45 blur-3xl"></div>

      {/* Top-right light beam */}
      <div className="absolute -top-40 right-0 w-[400px] h-[600px] bg-gradient-to-bl from-[#7b2cbf]/15 to-transparent transform -rotate-30 blur-3xl"></div>

      {/* Bottom-left light beam */}
      <div className="absolute bottom-0 -left-20 w-[300px] h-[400px] bg-gradient-to-tr from-[#c77dff]/10 to-transparent transform -rotate-15 blur-3xl"></div>

      {/* Bottom-right light beam */}
      <div className="absolute bottom-10 right-0 w-[500px] h-[400px] bg-gradient-to-tl from-[#9d4edd]/15 to-transparent transform rotate-15 blur-3xl"></div>

      {/* Center-right beam */}
      <div className="absolute top-1/3 right-0 w-[200px] h-[700px] bg-gradient-to-l from-[#c77dff]/10 to-transparent blur-3xl"></div>

      {/* Center-left beam */}
      <div className="absolute top-2/3 -left-20 w-[300px] h-[500px] bg-gradient-to-r from-[#7b2cbf]/10 to-transparent blur-3xl"></div>
    </div>
  )
}

const SkillBadge = ({ skill }: { skill: string }) => (
  <span className="bg-[#7b2cbf]/10 text-[#c77dff] px-3 py-1.5 rounded-md text-sm">{skill}</span>
)

export default function Portfolio() {
  const projects = [
    {
      title: "Grapheme to Phoneme",
      description: "Python-based system for converting written text to phonetic transcriptions",
      technologies: ["Python", "Linguistics", "NLP"],
      githubLink: "#",
    },
    {
      title: "Speech Annotation",
      description: "Speech annotation and analysis using Praat software",
      technologies: ["Praat", "Phonetics", "Audio Analysis"],
      githubLink: "#",
    },
    {
      title: "Parkinson Disease Analysis",
      description: "Experimental analysis of speech patterns in Parkinson's disease patients",
      technologies: ["Audacity", "Praat", "Data Analysis"],
      githubLink: "#",
    },
    {
      title: "Accounting System",
      description: "Python-based accounting system for market use",
      technologies: ["Python", "Database", "UI/UX"],
      githubLink: "#",
    },
  ]

  const experiences = [
    {
      title: "Video Editor",
      company: "Ulum Al-Azhar Academy",
      period: "2024 - Present",
      type: "Freelance",
      description:
        "Create video ads for students to learn about Quran and other Ulum Al-Azhar fields using Wondershare Filmora, Adobe Premiere, and Capcut.",
    },
    {
      title: "Food Services Worker",
      company: "Mondelez International",
      period: "Jul 2022 - Sep 2022",
      type: "Alexandria, Egypt",
      description:
        "Directed subordinate managers in day-to-day operations, planned and controlled administrative activities, allocated duties, and maintained service areas.",
    },
  ]

  const volunteering = [
    {
      title: "Head of Video Editing",
      organization: "TensorFlow Alex",
      period: "Mar 2024 - Present",
    },
    {
      title: "Video Editor",
      organization: "Google DSC Club",
      period: "Dec 2023 - Present",
    },
    {
      title: "Graphic Designer",
      organization: "Phonetics Family",
      period: "Feb 2022 - Feb 2024",
    },
    {
      title: "Registration Organizer",
      organization: "Techne Summit Alexandria",
      period: "Oct 2023",
    },
  ]

  const skills = [
    "Python",
    "NLTK",
    "Numpy",
    "Pandas",
    "C++",
    "Machine Learning",
    "Sound Engineering",
    "Sound Transcription",
    "Phonetics",
    "Linguistics",
    "Video Editing",
    "Graphic Design",
    "Microsoft Office",
    "Leadership",
    "Teamwork",
    "Problem Solving",
    "Google Cloud Platform",
    "Gen AI Tools",
  ]

  return (
    <div className="relative bg-[#050a14] text-white min-h-screen font-sans overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 bg-[#050a14] z-0"></div>
      <LightBeams />
      <BackgroundLines />
      <StarField count={150} />
      <DustCursor />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-[#050a14]/80 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd]"
            >
              Marwan Kasem
            </motion.div>

            <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 items-center">
              {["About", "Projects", "Experience", "Skills", "Contact"].map((section) => (
                <li key={section}>
                  <a
                    href={`#${section.toLowerCase()}`}
                    className="text-[#c77dff] hover:text-[#9d4edd] transition-colors text-sm"
                  >
                    {section}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>
        </nav>

        {/* Hero Section */}
        <header id="about" className="container mx-auto px-4 pt-36 pb-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd]"
              >
                Marwan Kasem
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd]"
              >
                Phonetics & Linguistics Specialist
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col space-y-2 text-gray-300 mb-6"
              >
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-[#c77dff]" />
                  <span>Agamy, Alexandria, Egypt</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-[#c77dff]" />
                  <span>01020745631 | 01221101413</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-[#c77dff]" />
                  <span>marokasem85@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-[#c77dff]" />
                  <a href="https://marwankasem.github.io/" className="hover:text-[#c77dff] transition-colors">
                    marwankasem.github.io
                  </a>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 mb-6 max-w-lg"
              >
                Specializing in Phonetics and Linguistics, with hard skills in sound engineering, sound transcription,
                and programming languages: Python, and various libraries like NLTK, NumPy, Pandas. A creative individual
                with a talent for graphic design and video editing.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex space-x-4 mb-8"
              >
                <a href="#" className="text-[#c77dff] hover:text-[#9d4edd] transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="text-[#c77dff] hover:text-[#9d4edd] transition-colors">
                  <Linkedin size={20} />
                </a>
                <a
                  href="mailto:marokasem85@gmail.com"
                  className="text-[#c77dff] hover:text-[#9d4edd] transition-colors"
                >
                  <Mail size={20} />
                </a>
                <a
                  href="https://marwankasem.github.io/"
                  className="text-[#c77dff] hover:text-[#9d4edd] transition-colors"
                >
                  <Globe size={20} />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="#contact"
                  className="bg-[#7b2cbf]/20 text-[#c77dff] border border-[#9d4edd]/30 px-6 py-2 rounded-md hover:bg-[#7b2cbf]/30 transition-colors flex items-center text-sm"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </a>
                <a
                  href="#projects"
                  className="bg-[#7b2cbf]/20 text-[#c77dff] border border-[#9d4edd]/30 px-6 py-2 rounded-md hover:bg-[#7b2cbf]/30 transition-colors flex items-center text-sm"
                >
                  <Code className="mr-2 h-4 w-4" />
                  View Projects
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="relative mx-auto md:ml-auto"
            >
              <AnimatedBorderBox className="p-0">
                <div className="relative w-[280px] h-[350px] md:w-[320px] md:h-[400px]">
                  {/* Main photo container */}
                  <div className="relative w-full h-full bg-[#7b2cbf]/10 rounded-xl overflow-hidden shadow-lg shadow-[#7b2cbf]/10">
                    <Image src="/images/profile.png" alt="Marwan Kasem" fill className="object-cover object-center" />
                  </div>
                </div>
              </AnimatedBorderBox>
            </motion.div>
          </div>
        </header>

        {/* Education Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd]">
            Education
          </h2>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <AnimatedBorderBox className="p-8">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#c77dff]">Bachelor of Arts in Phonetics and Linguistics</h3>
                <span className="text-[#9d4edd]">Sep 2021 — Jun 2025</span>
              </div>
              <h4 className="text-lg mb-4 text-white">Alexandria University</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>
                  Hard skills in sound engineering, sound transcription, programming languages: Python, and various
                  libraries NLTK, NumPy, Pandas and all linguistic fields.
                </li>
                <li>
                  Ability to understand and treat speech and language deficits as a speech and language therapist.
                </li>
              </ul>
            </AnimatedBorderBox>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd]">
            Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <AnimatedBorderBox className="p-6" delay={index * 0.1}>
                  <h3 className="text-xl font-semibold mb-2 text-[#c77dff]">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="bg-[#7b2cbf]/10 text-[#c77dff] px-2 py-1 rounded-md text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.githubLink}
                    className="text-[#c77dff] flex items-center text-sm hover:text-[#9d4edd]/80"
                  >
                    View Project <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </AnimatedBorderBox>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd]">
            Experience
          </h2>

          <div className="space-y-8 max-w-4xl mx-auto">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <AnimatedBorderBox className="p-6" delay={index * 0.1}>
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <h3 className="text-xl font-semibold text-[#c77dff]">{exp.title}</h3>
                    <span className="text-[#9d4edd]">{exp.period}</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <h4 className="text-lg text-white">{exp.company}</h4>
                    <span className="text-gray-400">{exp.type}</span>
                  </div>
                  <p className="text-gray-300">{exp.description}</p>
                </AnimatedBorderBox>
              </motion.div>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd]">
              Volunteering
            </h3>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {volunteering.map((vol, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <AnimatedBorderBox className="p-5" delay={index * 0.05}>
                    <h4 className="text-lg font-medium text-[#c77dff] mb-1">{vol.title}</h4>
                    <div className="flex justify-between">
                      <span className="text-white">{vol.organization}</span>
                      <span className="text-gray-400 text-sm">{vol.period}</span>
                    </div>
                  </AnimatedBorderBox>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd]">
            Skills
          </h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <SkillBadge skill={skill} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd]">
              Languages
            </h3>

            <AnimatedBorderBox className="p-6">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-[#c77dff] mb-1">Arabic</h4>
                  <p className="text-white">Native Language</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-[#c77dff] mb-1">English</h4>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Listening</p>
                      <p className="text-white">B2</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Reading</p>
                      <p className="text-white">B1</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Writing</p>
                      <p className="text-white">A1</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Speaking</p>
                      <p className="text-white">B2</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedBorderBox>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="container mx-auto px-4 py-16 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <AnimatedBorderBox className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd]">
                Get In Touch
              </h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 bg-[#050a14] border border-[#9d4edd]/20 rounded-md text-gray-300 focus:ring-2 focus:ring-[#9d4edd]/30 focus:border-[#9d4edd]/50"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 bg-[#050a14] border border-[#9d4edd]/20 rounded-md text-gray-300 focus:ring-2 focus:ring-[#9d4edd]/30 focus:border-[#9d4edd]/50"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full p-3 bg-[#050a14] border border-[#9d4edd]/20 rounded-md text-gray-300 focus:ring-2 focus:ring-[#9d4edd]/30 focus:border-[#9d4edd]/50"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-[#7b2cbf]/20 text-[#c77dff] border border-[#9d4edd]/30 py-3 rounded-md hover:bg-[#7b2cbf]/30 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </AnimatedBorderBox>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-[#050a14] py-8 border-t border-[#9d4edd]/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff00dd] font-bold mb-4 md:mb-0">
                Marwan Kasem
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-[#c77dff] hover:text-[#9d4edd] transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="text-[#c77dff] hover:text-[#9d4edd] transition-colors">
                  <Linkedin size={20} />
                </a>
                <a
                  href="mailto:marokasem85@gmail.com"
                  className="text-[#c77dff] hover:text-[#9d4edd] transition-colors"
                >
                  <Mail size={20} />
                </a>
                <a
                  href="https://marwankasem.github.io/"
                  className="text-[#c77dff] hover:text-[#9d4edd] transition-colors"
                >
                  <Globe size={20} />
                </a>
              </div>
            </div>
            <div className="text-center mt-6 text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Marwan Kasem. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}