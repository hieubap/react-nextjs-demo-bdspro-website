"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const testimonials = [
    {
      name: "Nguyễn Văn An",
      position: "Giám đốc Công ty BDS Thành Đạt",
      avatar: "/vietnamese-businessman-avatar.png",
      content:
        "BDSPro đã giúp công ty chúng tôi tăng hiệu quả quản lý lên 300%. Giao diện thân thiện, tính năng đầy đủ và hỗ trợ khách hàng tuyệt vời!",
    },
    {
      name: "Trần Thị Bình",
      position: "Chủ tịch Tập đoàn Đất Vàng",
      avatar: "/vietnamese-businesswoman-avatar.png",
      content:
        "Từ khi sử dụng BDSPro, việc quản lý hàng nghìn bất động sản trở nên dễ dàng hơn bao giờ hết. Đây thực sự là giải pháp tối ưu cho doanh nghiệp.",
    },
    {
      name: "Lê Minh Cường",
      position: "Giám đốc Kinh doanh Century21",
      avatar: "/vietnamese-real-estate-avatar.png",
      content:
        "Phần mềm rất chuyên nghiệp với đầy đủ tính năng cần thiết. Đội ngũ hỗ trợ nhiệt tình, luôn sẵn sàng giải đáp mọi thắc mắc của chúng tôi.",
    },
    {
      name: "Phạm Thu Hương",
      position: "Founder Hương Land",
      avatar: "/vietnamese-female-entrepreneur-avatar.png",
      content:
        "BDSPro không chỉ là phần mềm quản lý mà còn là đối tác đáng tin cậy giúp chúng tôi phát triển kinh doanh bền vững và hiệu quả.",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="customers" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium mb-6">
            Phản hồi
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hàng nghìn khách hàng đã tin tưởng và sử dụng BDSPro để phát triển kinh doanh bất động sản của họ.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 rounded-3xl p-8 md:p-12 lg:p-16 shadow-xl border border-gray-100 relative overflow-hidden">
            {/* Decorative quote icon */}
            <Quote className="absolute top-8 right-8 h-24 w-24 text-blue-100 rotate-180" />
            
            <div className="flex justify-center mb-6 relative z-10">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current mx-1" />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl lg:text-3xl text-gray-700 text-center mb-10 leading-relaxed font-medium relative z-10">
              "{testimonials[currentSlide].content}"
            </blockquote>

            <div className="flex items-center justify-center space-x-6 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-lg opacity-30"></div>
                <img
                  src={testimonials[currentSlide].avatar || "/placeholder.svg"}
                  alt={testimonials[currentSlide].name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg relative"
                />
              </div>
              <div className="text-left">
                <h4 className="text-lg lg:text-xl font-bold text-gray-900">{testimonials[currentSlide].name}</h4>
                <p className="text-gray-600">{testimonials[currentSlide].position}</p>
              </div>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center gap-2 mt-8 relative z-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-8 bg-[#3B82F6]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 h-12 w-12 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 hover:border-[#3B82F6] transition-all duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 h-12 w-12 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 hover:border-[#3B82F6] transition-all duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  )
}
