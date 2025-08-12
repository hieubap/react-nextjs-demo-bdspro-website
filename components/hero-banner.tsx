import { Button } from "@/components/ui/button"

export default function HeroBanner() {
  return (
    <section id="home" className="relative bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Giải pháp bất động sản
              <span className="text-[#3B82F6]"> toàn diện</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              BDSPro - Giải pháp phần mềm quản lý bất động sản toàn diện, giúp bạn tối ưu hóa quy trình kinh doanh và
              tăng hiệu quả công việc.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                style={{ backgroundColor: "#3B82F6" }}
                className="text-white hover:opacity-90 px-8 py-3"
              >
                Dùng thử miễn phí
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white px-8 py-3 bg-transparent"
              >
                Xem demo
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <img
              src="/real-estate-dashboard.png"
              alt="BDSPro Dashboard"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
