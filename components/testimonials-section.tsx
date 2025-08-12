"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
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
    <section id="customers" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Khách hàng nói gì về chúng tôi</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hàng nghìn khách hàng đã tin tưởng và sử dụng BDSPro để phát triển kinh doanh bất động sản của họ.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed">
              "{testimonials[currentSlide].content}"
            </blockquote>

            <div className="flex items-center justify-center space-x-4">
              <img
                src={testimonials[currentSlide].avatar || "/placeholder.svg"}
                alt={testimonials[currentSlide].name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900">{testimonials[currentSlide].name}</h4>
                <p className="text-gray-600">{testimonials[currentSlide].position}</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 rounded-full w-12 h-12 p-0 bg-transparent"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 rounded-full w-12 h-12 p-0 bg-transparent"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-[#3B82F6]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
