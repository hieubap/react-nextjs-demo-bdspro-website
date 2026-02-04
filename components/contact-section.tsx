"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.")
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    })
    setIsSubmitting(false)
  }

  return (
    <section id="contact" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            Liên hệ
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hãy để lại thông tin để được tư vấn miễn phí về giải pháp quản lý bất động sản phù hợp nhất cho doanh nghiệp
            của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">Thông tin liên hệ</h3>
              <div className="space-y-6">
                <div className="group flex items-start space-x-4 p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-[#3B82F6]/20 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Điện thoại</h4>
                    <p className="text-gray-600 text-lg">0877814988</p>
                  </div>
                </div>

                <div className="group flex items-start space-x-4 p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-[#3B82F6]/20 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">info@bdspro.vn</p>
                    <p className="text-gray-600">support@bdspro.vn</p>
                  </div>
                </div>

                <div className="group flex items-start space-x-4 p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-[#3B82F6]/20 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Địa chỉ</h4>
                    <p className="text-gray-600 leading-relaxed">
                      182 Lê Lợi, Sơn Tây, Hà Nội
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Giờ làm việc</h4>
              </div>
              <div className="space-y-3 text-gray-700">
                <p className="flex justify-between">
                  <span className="font-medium">Thứ 2 - Thứ 6</span>
                  <span>8:00 - 17:30</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Thứ 7</span>
                  <span>8:00 - 12:00</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Chủ nhật</span>
                  <span className="text-gray-500">Nghỉ</span>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Gửi tin nhắn cho chúng tôi</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                    className="w-full h-12 border-gray-300 focus:border-[#3B82F6] focus:ring-[#3B82F6] transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ email"
                    className="w-full h-12 border-gray-300 focus:border-[#3B82F6] focus:ring-[#3B82F6] transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full h-12 border-gray-300 focus:border-[#3B82F6] focus:ring-[#3B82F6] transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Công ty
                  </label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Nhập tên công ty"
                    className="w-full h-12 border-gray-300 focus:border-[#3B82F6] focus:ring-[#3B82F6] transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tin nhắn *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Nhập nội dung tin nhắn..."
                  className="w-full border-gray-300 focus:border-[#3B82F6] focus:ring-[#3B82F6] transition-all duration-200 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: "#3B82F6" }}
                className="w-full text-white hover:bg-[#2563EB] py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
