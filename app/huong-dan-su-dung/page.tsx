import Link from "next/link"
import { ArrowLeft, Play, Download, Settings, Users, BarChart3, FileText } from "lucide-react"

export default function HuongDanSuDung() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-[#3B82F6] hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>Quay lại trang chủ</span>
            </Link>
            <img src="/bdspro-logo-ngang.png" alt="BDSPro Logo" className="h-8" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Hướng dẫn sử dụng BDSPro</h1>

          {/* Getting Started */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Play className="h-6 w-6 text-[#3B82F6] mr-2" />
              Bắt đầu sử dụng
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">1. Đăng ký tài khoản</h3>
                <p className="text-gray-600">
                  Truy cập trang đăng ký và tạo tài khoản BDSPro với email doanh nghiệp của bạn.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">2. Thiết lập thông tin công ty</h3>
                <p className="text-gray-600">Cập nhật thông tin công ty, logo và cấu hình cơ bản cho hệ thống.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">3. Thêm nhân viên</h3>
                <p className="text-gray-600">Mời nhân viên tham gia và phân quyền phù hợp cho từng vị trí.</p>
              </div>
            </div>
          </section>

          {/* Main Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Settings className="h-6 w-6 text-[#3B82F6] mr-2" />
              Các tính năng chính
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-8 w-8 text-[#3B82F6] mr-3" />
                  <h3 className="text-lg font-medium">Quản lý tin đăng</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Tạo và chỉnh sửa tin đăng bán/cho thuê</li>
                  <li>• Upload hình ảnh và video</li>
                  <li>• Đăng tin lên nhiều website cùng lúc</li>
                  <li>• Theo dõi hiệu quả tin đăng</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-[#3B82F6] mr-3" />
                  <h3 className="text-lg font-medium">Quản lý khách hàng</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Lưu trữ thông tin khách hàng</li>
                  <li>• Theo dõi lịch sử giao dịch</li>
                  <li>• Phân loại khách hàng tiềm năng</li>
                  <li>• Gửi email marketing tự động</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-8 w-8 text-[#3B82F6] mr-3" />
                  <h3 className="text-lg font-medium">Báo cáo thống kê</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Báo cáo doanh thu theo tháng/quý</li>
                  <li>• Thống kê hiệu quả nhân viên</li>
                  <li>• Phân tích xu hướng thị trường</li>
                  <li>• Export báo cáo Excel/PDF</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Download className="h-8 w-8 text-[#3B82F6] mr-3" />
                  <h3 className="text-lg font-medium">Ứng dụng di động</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Quản lý tin đăng trên mobile</li>
                  <li>• Nhận thông báo khách hàng quan tâm</li>
                  <li>• Chụp ảnh và đăng tin nhanh</li>
                  <li>• Đồng bộ dữ liệu real-time</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Support */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hỗ trợ kỹ thuật</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                Nếu bạn gặp khó khăn trong quá trình sử dụng, đội ngũ hỗ trợ BDSPro luôn sẵn sàng giúp đỡ:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Hotline:</strong> 0877814988 (24/7)
                </p>
                <p>
                  <strong>Email:</strong> support@bdspro.vn
                </p>
                <p>
                  <strong>Live Chat:</strong> Góc phải màn hình trong ứng dụng
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
