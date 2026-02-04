import { Building2, Users, FileText, BarChart3, Shield, Smartphone } from "lucide-react"

export default function ProductsSection() {
  const features = [
    {
      icon: Building2,
      title: "Quản lý tài sản",
      description: "Quản lý toàn bộ danh mục bất động sản với thông tin chi tiết, hình ảnh và tài liệu đầy đủ.",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-white",
    },
    {
      icon: Users,
      title: "Quản lý khách hàng",
      description: "Theo dõi thông tin khách hàng, lịch sử giao dịch và tương tác một cách có hệ thống.",
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-white",
    },
    {
      icon: FileText,
      title: "Quản lý hợp đồng",
      description: "Tạo, quản lý và theo dõi hợp đồng mua bán, cho thuê với quy trình tự động hóa.",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-white",
    },
    {
      icon: BarChart3,
      title: "Báo cáo thống kê",
      description: "Phân tích doanh thu, hiệu suất kinh doanh với các báo cáo chi tiết và trực quan.",
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-white",
    },
    {
      icon: Shield,
      title: "Bảo mật cao",
      description: "Đảm bảo an toàn dữ liệu với hệ thống bảo mật đa lớp và sao lưu tự động.",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-white",
    },
    {
      icon: Smartphone,
      title: "Ứng dụng di động",
      description: "Truy cập và quản lý công việc mọi lúc, mọi nơi với ứng dụng mobile thân thiện.",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-white",
    },
  ]

  return (
    <section id="products" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            Tính năng
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Tính năng sản phẩm
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            BDSPro cung cấp đầy đủ các tính năng cần thiết để quản lý hoạt động kinh doanh bất động sản một cách hiệu
            quả và chuyên nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group bg-gradient-to-br ${feature.bgGradient} p-8 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden`}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className={`relative w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 relative">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed relative">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
