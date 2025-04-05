'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Experience } from '@/types/experience'
import { Skill } from '@/services/skillService'
import { About } from '@/services/aboutService'
import Modal from '@/components/Modal'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [about, setAbout] = useState<About | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [aboutContent, setAboutContent] = useState('')
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    title: '',
    company: '',
    period: '',
    description: ''
  })
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    category: 'Frontend'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  useEffect(() => {
    if (about) {
      setAboutContent(about.content)
    }
  }, [about])

  const fetchData = async () => {
    try {
      const [experiencesRes, skillsRes, aboutRes] = await Promise.all([
        fetch('/api/experiences'),
        fetch('/api/skills'),
        fetch('/api/about')
      ])

      if (!experiencesRes.ok || !skillsRes.ok || !aboutRes.ok) {
        throw new Error('Erro ao carregar dados')
      }

      const [experiencesData, skillsData, aboutData] = await Promise.all([
        experiencesRes.json(),
        skillsRes.json(),
        aboutRes.json()
      ])

      setExperiences(experiencesData)
      setSkills(skillsData)
      setAbout(aboutData)
    } catch (err) {
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleAddExperience = async () => {
    try {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExperience)
      })

      if (!res.ok) throw new Error('Erro ao criar experiência')
      fetchData()
      setIsExperienceModalOpen(false)
      setNewExperience({
        title: '',
        company: '',
        period: '',
        description: ''
      })
      setSuccess('Experiência criada com sucesso!')
    } catch (err) {
      setError('Erro ao criar experiência')
    }
  }

  const handleUpdateExperience = async (experience: Experience) => {
    try {
      const res = await fetch(`/api/experiences/${experience.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experience)
      })

      if (!res.ok) throw new Error('Erro ao atualizar experiência')
      fetchData()
      setEditingExperience(null)
      setSuccess('Experiência atualizada com sucesso!')
    } catch (err) {
      setError('Erro ao atualizar experiência')
    }
  }

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta experiência?')) return

    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Erro ao deletar experiência')
      fetchData()
      setSuccess('Experiência excluída com sucesso!')
    } catch (err) {
      setError('Erro ao deletar experiência')
    }
  }

  const handleAddSkill = async () => {
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill)
      })

      if (!res.ok) throw new Error('Erro ao criar habilidade')
      fetchData()
      setIsSkillModalOpen(false)
      setNewSkill({
        name: '',
        category: 'Frontend'
      })
      setSuccess('Habilidade criada com sucesso!')
    } catch (err) {
      setError('Erro ao criar habilidade')
    }
  }

  const handleUpdateSkill = async (skill: Skill) => {
    try {
      const res = await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill)
      })

      if (!res.ok) throw new Error('Erro ao atualizar habilidade')
      fetchData()
      setEditingSkill(null)
      setSuccess('Habilidade atualizada com sucesso!')
    } catch (err) {
      setError('Erro ao atualizar habilidade')
    }
  }

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta habilidade?')) return

    try {
      const res = await fetch('/api/skills', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (!res.ok) throw new Error('Erro ao deletar habilidade')
      fetchData()
      setSuccess('Habilidade excluída com sucesso!')
    } catch (err) {
      setError('Erro ao deletar habilidade')
    }
  }

  const handleUpdateAbout = async (content: string) => {
    try {
      const res = await fetch('/api/about', {
        method: about ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(about ? { id: about.id, content } : { content })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Erro ao atualizar conteúdo Sobre Mim')
      }

      const updatedAbout = await res.json()
      setAbout(updatedAbout)
      setSuccess('Conteúdo Sobre Mim atualizado com sucesso!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar conteúdo Sobre Mim')
    }
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (status === 'loading' || loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}

      {/* Experiências */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Experiências</h2>
          <button
            onClick={() => setIsExperienceModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
          >
            Adicionar Experiência
          </button>
        </div>
        <div className="grid gap-4">
          {experiences.map((experience) => (
            <div key={experience.id} className="bg-gray-800 p-6 rounded-lg">
              {editingExperience?.id === experience.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Título</label>
                    <input
                      type="text"
                      value={editingExperience.title}
                      onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })}
                      className="bg-gray-700 px-3 py-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Empresa</label>
                    <input
                      type="text"
                      value={editingExperience.company}
                      onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                      className="bg-gray-700 px-3 py-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Período</label>
                    <input
                      type="text"
                      value={editingExperience.period}
                      onChange={(e) => setEditingExperience({ ...editingExperience, period: e.target.value })}
                      className="bg-gray-700 px-3 py-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <textarea
                      value={editingExperience.description}
                      onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                      className="bg-gray-700 px-3 py-2 rounded w-full h-32"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateExperience(editingExperience)}
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingExperience(null)}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{experience.title}</h3>
                    <p className="text-gray-400">{experience.company}</p>
                    <p className="text-gray-400">{experience.period}</p>
                    <p className="mt-2 text-gray-300">{experience.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingExperience(experience)}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(experience.id)}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Habilidades */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Habilidades</h2>
          <button
            onClick={() => setIsSkillModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
          >
            Adicionar Habilidade
          </button>
        </div>
        <div className="grid gap-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">{category}</h3>
              <div className="grid gap-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="bg-gray-800 p-6 rounded-lg">
                    {editingSkill?.id === skill.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nome</label>
                          <input
                            type="text"
                            value={editingSkill.name}
                            onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                            className="bg-gray-700 px-3 py-2 rounded w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Categoria</label>
                          <select
                            value={editingSkill.category}
                            onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                            className="bg-gray-700 px-3 py-2 rounded w-full"
                          >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Banco de Dados">Banco de Dados</option>
                            <option value="DevOps">DevOps</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateSkill(editingSkill)}
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingSkill(null)}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold">{skill.name}</h3>
                          <p className="text-gray-400">{skill.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingSkill(skill)}
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre Mim */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Sobre Mim</h2>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Conteúdo</label>
              <textarea
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                className="bg-gray-700 px-3 py-2 rounded w-full h-32"
                placeholder="Digite seu conteúdo Sobre Mim aqui..."
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleUpdateAbout(aboutContent)}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Nova Experiência */}
      <Modal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        title="Nova Experiência"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={newExperience.title}
              onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
              className="bg-gray-700 px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Empresa</label>
            <input
              type="text"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              className="bg-gray-700 px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Período</label>
            <input
              type="text"
              value={newExperience.period}
              onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
              className="bg-gray-700 px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              className="bg-gray-700 px-3 py-2 rounded w-full h-32"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsExperienceModalOpen(false)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddExperience}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors"
            >
              Criar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Nova Habilidade */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title="Nova Habilidade"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="bg-gray-700 px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="bg-gray-700 px-3 py-2 rounded w-full"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Banco de Dados">Banco de Dados</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsSkillModalOpen(false)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddSkill}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors"
            >
              Criar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
} 