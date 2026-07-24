'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CoverPair {
  id: number
  titleLeft: string
  slugLeft: string
  imgLeft: string
  titleRight: string
  slugRight: string
  imgRight: string
  badgeLeft?: string
  badgeRight?: string
}

const coverSets: CoverPair[] = [
  {
    id: 1,
    titleLeft: 'BIM Handbook: A Guide to Building Information Modeling',
    slugLeft: 'bim-handbook-a-guide-to-building-information-modeling-for-owners-designers-engineers-contractors-and-facility-managers',
    imgLeft: '/uploads/bim-handbook-a-guide-to-building-information-modeling-for-owners-designers-engineers-contractors-and-facility-managers.png',
    badgeLeft: 'Livro Técnico',
    titleRight: 'AU Arquitetura e Urbanismo — Especial BIM',
    slugRight: 'au-arquitetura-e-urbanismo-especial-bim',
    imgRight: '/uploads/au-arquitetura-e-urbanismo-especial-bim.png',
    badgeRight: 'Revista Especial'
  },
  {
    id: 2,
    titleLeft: 'ArchiCAD Passo a Passo — Volume I',
    slugLeft: 'archicad-passo-a-passo-volume-i',
    imgLeft: '/uploads/archicad-passo-a-passo-volume-i.png',
    badgeLeft: 'Manual Prático',
    titleRight: 'ArchiCAD Passo a Passo — Volume II',
    slugRight: 'archicad-passo-a-passo-volume-ii',
    imgRight: '/uploads/archicad-passo-a-passo-volume-ii.png',
    badgeRight: 'Manual Avançado'
  },
  {
    id: 3,
    titleLeft: '101 Conceitos de Arquitetura e Urbanismo na Era Digital',
    slugLeft: '101-conceitos-de-arquitetura-e-urbanismo-na-era-digital',
    imgLeft: '/uploads/101-conceitos-de-arquitetura-e-urbanismo-na-era-digital.png',
    badgeLeft: 'Arquitetura Digital',
    titleRight: 'BIM e Inovação em Gestão de Projetos',
    slugRight: 'bim-e-inovacao-em-gestao-de-projetos',
    imgRight: '/uploads/bim-e-inovacao-em-gestao-de-projetos.png',
    badgeRight: 'Gestão de Projetos'
  },
  {
    id: 4,
    titleLeft: 'Revista CADESIGN — Edição #106',
    slugLeft: 'cadesign-106',
    imgLeft: '/uploads/cadesign-106.jpg',
    badgeLeft: 'Revista Especializada',
    titleRight: 'Arte de Projetar em Arquitetura',
    slugRight: 'arte-de-projetar-em-arquitetura',
    imgRight: '/uploads/arte-de-projetar-em-arquitetura.jpg',
    badgeRight: 'Clássico de Projeto'
  },
  {
    id: 5,
    titleLeft: 'BIM and Construction Management',
    slugLeft: 'bim-and-construction-management-proven-tools-methods-and-workflows',
    imgLeft: '/uploads/bim-and-construction-management-proven-tools-methods-and-workflows.jpg',
    badgeLeft: 'Construção & BIM',
    titleRight: 'Anuário BIM Santa Catarina',
    slugRight: 'anuario-bim-santa-catarina',
    imgRight: '/uploads/anuario-bim-santa-catarina.png',
    badgeRight: 'Publicação Regional'
  }
]

export default function HeroCoverCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Autoplay a cada 4 segundos
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % coverSets.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isPaused])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % coverSets.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + coverSets.length) % coverSets.length)
  }

  const currentSet = coverSets[currentIndex]

  return (
    <div 
      className="relative flex flex-col items-center justify-center py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* ── Slides Showcase Container ── */}
      <div className="relative w-full max-w-[260px] h-[150px] flex items-center justify-center">
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute -left-4 z-20 w-6 h-6 rounded-full bg-white/90 shadow-md border border-border flex items-center justify-center text-slate-700 hover:text-primary hover:scale-110 transition-all cursor-pointer"
          title="Conjunto anterior"
        >
          <ChevronLeft size={14} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute -right-4 z-20 w-6 h-6 rounded-full bg-white/90 shadow-md border border-border flex items-center justify-center text-slate-700 hover:text-primary hover:scale-110 transition-all cursor-pointer"
          title="Próximo conjunto"
        >
          <ChevronRight size={14} />
        </button>

        {/* ── Active Cover Pair Render ── */}
        <div key={currentSet.id} className="flex gap-3 items-center transition-all duration-500 ease-in-out">
          
          {/* Left Book Cover Card */}
          <Link
            href={`/livro/${currentSet.slugLeft}`}
            className="group relative w-20 sm:w-24 h-28 sm:h-32 rounded-lg overflow-hidden shadow-lg origin-bottom -rotate-6 transform hover:rotate-0 hover:scale-105 transition-all duration-300 border border-slate-200/80 bg-white flex flex-col justify-between"
          >
            {/* Cover Image */}
            <div className="relative w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSet.imgLeft}
                alt={currentSet.titleLeft}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                <span className="text-[8px] font-bold text-white leading-tight line-clamp-2">
                  {currentSet.titleLeft}
                </span>
              </div>
            </div>
          </Link>

          {/* Right Book Cover Card */}
          <Link
            href={`/livro/${currentSet.slugRight}`}
            className="group relative w-20 sm:w-24 h-28 sm:h-32 rounded-lg overflow-hidden shadow-lg rotate-6 transform hover:rotate-0 hover:scale-105 transition-all duration-300 border border-slate-200/80 bg-white flex flex-col justify-between"
          >
            {/* Cover Image */}
            <div className="relative w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSet.imgRight}
                alt={currentSet.titleRight}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                <span className="text-[8px] font-bold text-white leading-tight line-clamp-2">
                  {currentSet.titleRight}
                </span>
              </div>
            </div>
          </Link>

        </div>

      </div>

      {/* ── Dots Pagination (1 to 5) ── */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {coverSets.map((set, index) => (
          <button
            key={set.id}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer border-none ${
              currentIndex === index
                ? 'bg-primary w-6'
                : 'bg-slate-300 hover:bg-slate-400'
            }`}
            title={`Ver conjunto ${index + 1}`}
          />
        ))}
      </div>

    </div>
  )
}
