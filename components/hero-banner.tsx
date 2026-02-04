import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroBanner() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 py-20 lg:py-28">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              🚀 Giải pháp công nghệ hàng đầu
            </div>
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
              Giải pháp bất động sản
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">
                toàn diện
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              BDSPro - Giải pháp phần mềm quản lý bất động sản toàn diện, giúp bạn tối ưu hóa quy trình kinh doanh và
              tăng hiệu quả công việc.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/app/install"
                style={{ backgroundColor: "#3B82F6" }}
                className="rounded-md text-white hover:bg-[#2563EB] px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Dùng thử miễn phí
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white px-8 py-6 text-lg bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                Xem demo
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-2xl transform rotate-3"></div>
            <div className="relative transform hover:scale-[1.02] transition-transform duration-500">
              <img
                src="/real-estate-dashboard.png"
                alt="BDSPro Dashboard"
                className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white/50"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
