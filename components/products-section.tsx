import { Building2, Users, FileText, BarChart3, Shield, Smartphone } from "lucide-react"

export default function ProductsSection() {
  const features = [
    {
      icon: Building2,
      title: "Quản lý tài sản",
      description: "Quản lý toàn bộ danh mục bất động sản với thông tin chi tiết, hình ảnh và tài liệu đầy đủ.",
    },
    {
      icon: Users,
      title: "Quản lý khách hàng",
      description: "Theo dõi thông tin khách hàng, lịch sử giao dịch và tương tác một cách có hệ thống.",
    },
    {
      icon: FileText,
      title: "Quản lý hợp đồng",
      description: "Tạo, quản lý và theo dõi hợp đồng mua bán, cho thuê với quy trình tự động hóa.",
    },
    {
      icon: BarChart3,
      title: "Báo cáo thống kê",
      description: "Phân tích doanh thu, hiệu suất kinh doanh với các báo cáo chi tiết và trực quan.",
    },
    {
      icon: Shield,
      title: "Bảo mật cao",
      description: "Đảm bảo an toàn dữ liệu với hệ thống bảo mật đa lớp và sao lưu tự động.",
    },
    {
      icon: Smartphone,
      title: "Ứng dụng di động",
      description: "Truy cập và quản lý công việc mọi lúc, mọi nơi với ứng dụng mobile thân thiện.",
    },
  ]

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Tính năng sản phẩm</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            BDSPro cung cấp đầy đủ các tính năng cần thiết để quản lý hoạt động kinh doanh bất động sản một cách hiệu
            quả và chuyên nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3B82F6] rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
