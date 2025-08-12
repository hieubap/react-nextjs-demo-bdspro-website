export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Về BDSPro</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            BDSPro là phần mềm quản lý bất động sản hàng đầu Việt Nam, được thiết kế đặc biệt cho các công ty môi giới,
            đại lý và nhà đầu tư bất động sản. Với giao diện thân thiện và tính năng mạnh mẽ, BDSPro giúp bạn quản lý
            toàn bộ quy trình kinh doanh một cách hiệu quả và chuyên nghiệp.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">5+</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Năm kinh nghiệm</h3>
              <p className="text-gray-600">Phục vụ hàng nghìn khách hàng</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">24/7</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hỗ trợ</h3>
              <p className="text-gray-600">Đội ngũ kỹ thuật chuyên nghiệp</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">99%</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Uptime</h3>
              <p className="text-gray-600">Đảm bảo hoạt động ổn định</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
