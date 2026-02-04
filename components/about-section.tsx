export default function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            Về chúng tôi
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Về BDSPro
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
            BDSPro là phần mềm quản lý bất động sản hàng đầu Việt Nam, được thiết kế đặc biệt cho các công ty môi giới,
            đại lý và nhà đầu tư bất động sản. Với giao diện thân thiện và tính năng mạnh mẽ, BDSPro giúp bạn quản lý
            toàn bộ quy trình kinh doanh một cách hiệu quả và chuyên nghiệp.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-bold text-white">5+</span>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Năm kinh nghiệm</h3>
            <p className="text-gray-600 leading-relaxed">Phục vụ hàng nghìn khách hàng</p>
          </div>
          <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold text-white">24/7</span>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Hỗ trợ</h3>
            <p className="text-gray-600 leading-relaxed">Đội ngũ kỹ thuật chuyên nghiệp</p>
          </div>
          <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-bold text-white">99%</span>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Uptime</h3>
            <p className="text-gray-600 leading-relaxed">Đảm bảo hoạt động ổn định</p>
          </div>
        </div>
      </div>
    </section>
  )
}
