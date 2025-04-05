import Image from 'next/image'
import { Experience } from '@/types/experience'
import { Skill } from '@/services/skillService'
import { About } from '@/services/aboutService'
import { getExperiences } from '@/services/experienceService'
import { getSkills } from '@/services/skillService'
import { getAbout } from '@/services/aboutService'

// Forçar atualização dinâmica e desabilitar cache
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const [experiences, skills, about] = await Promise.all([
    getExperiences(),
    getSkills(),
    getAbout()
  ])

  // Agrupar habilidades por categoria
  const skillsByCategory = skills.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start">
            <div className="w-40 h-40 rounded-full overflow-hidden mb-8 shadow-2xl shadow-blue-500/20 ring-4 ring-blue-500/20">
              <Image
                src="https://cdn-icons-png.flaticon.com/512/3239/3239279.png"
                alt="Foto do Perfil"
                width={160}
                height={160}
                className="object-cover transform hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Arthur Felix
            </h1>
            <p className="text-xl text-gray-300 mb-8 text-center md:text-left">Desenvolvedor Full Stack</p>
            <div className="flex gap-4">
              <a
                href="https://github.com/ArthurUFelix"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1"
              >
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                  alt="GitHub"
                  width={24}
                  height={24}
                />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/arthurufelix/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1"
              >
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                />
                LinkedIn
              </a>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Habilidades</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="font-bold text-blue-400 mb-3">{category}</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    {skills.map((skill) => (
                      <li key={skill.id} className="hover:text-blue-400 transition-colors">
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experiências Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Experiências
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.length > 0 ? (
            experiences.map((experience) => (
              <div 
                key={experience.id} 
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700/50 hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold mb-2 text-blue-400">{experience.title}</h3>
                <p className="text-gray-400 mb-2 font-medium">{experience.company}</p>
                <p className="text-gray-300 mb-4 text-sm">{experience.period}</p>
                <p className="text-gray-300 leading-relaxed">{experience.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center border border-gray-700/50">
              <p className="text-gray-300">
                Nenhuma experiência cadastrada ainda. Por favor, acesse a área administrativa para adicionar suas experiências.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Sobre Mim Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Sobre Mim
        </h2>
        <div className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700/50">
          <p className="text-gray-300 leading-relaxed text-lg">
            {about?.content || 'Conteúdo Sobre Mim ainda não cadastrado. Por favor, acesse a área administrativa para adicionar seu conteúdo.'}
          </p>
        </div>
      </section>
    </main>
  )
} 