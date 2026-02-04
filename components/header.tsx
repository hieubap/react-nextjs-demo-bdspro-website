"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const searchParams = useSearchParams()
  const inApp = searchParams.get('inapp') === 'true'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ẩn header nếu inapp=true
  if (inApp) {
    return null
  }

  const menuItems = [
    { name: "Trang chủ", href: "#home" },
    { name: "Giới thiệu", href: "#about" },
    { name: "Sản phẩm", href: "#products" },
    { name: "Khách hàng", href: "#customers" },
    { name: "Liên hệ", href: "#contact" },
  ]

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white/95 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/bdspro-logo-ngang.png" alt="BDSPro Logo" className="h-10 lg:h-12 transition-all duration-300" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[#3B82F6] px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-blue-50/50 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3B82F6] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              style={{ backgroundColor: "#3B82F6" }} 
              className="text-white hover:bg-[#2563EB] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Dùng thử miễn phí
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6 mt-[3px]" /> : <Menu className="h-6 w-6 mt-[3px]" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/98 backdrop-blur-sm border-t border-gray-100 rounded-b-lg">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#3B82F6] block px-3 py-2.5 text-base font-medium rounded-lg hover:bg-blue-50/50 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-3 py-2">
                <Button 
                  style={{ backgroundColor: "#3B82F6" }} 
                  className="w-full text-white hover:bg-[#2563EB] transition-all duration-200"
                >
                  Dùng thử miễn phí
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
