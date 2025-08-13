import Link from "next/link"
import { ArrowLeft, Shield, FileText, Users, AlertCircle } from "lucide-react"

export default function DieuKhoanSuDung() {
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
            <img src="/bdspro-logo-real-estate-software.png" alt="BDSPro Logo" className="h-8" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Điều khoản sử dụng BDSPro</h1>

          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <p className="text-sm text-gray-600">
              <strong>Cập nhật lần cuối:</strong> 01/01/2024
            </p>
          </div>

          {/* Terms Sections */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="h-6 w-6 text-[#3B82F6] mr-2" />
              1. Chấp nhận điều khoản
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Bằng việc truy cập và sử dụng phần mềm BDSPro, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và
              điều kiện sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử
              dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="h-6 w-6 text-[#3B82F6] mr-2" />
              2. Quyền và nghĩa vụ của người dùng
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Quyền của người dùng:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Sử dụng phần mềm theo gói dịch vụ đã đăng ký</li>
                  <li>Được hỗ trợ kỹ thuật trong giờ hành chính</li>
                  <li>Được bảo mật thông tin cá nhân và dữ liệu</li>
                  <li>Được cập nhật các tính năng mới</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nghĩa vụ của người dùng:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Thanh toán đầy đủ và đúng hạn các khoản phí</li>
                  <li>Không sử dụng phần mềm cho mục đích bất hợp pháp</li>
                  <li>Bảo mật thông tin đăng nhập tài khoản</li>
                  <li>Tuân thủ các quy định về bản quyền</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Shield className="h-6 w-6 text-[#3B82F6] mr-2" />
              3. Bảo mật và quyền riêng tư
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                BDSPro cam kết bảo vệ thông tin cá nhân và dữ liệu của khách hàng theo các tiêu chuẩn bảo mật cao nhất:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mã hóa dữ liệu SSL 256-bit</li>
                <li>Sao lưu dữ liệu tự động hàng ngày</li>
                <li>Không chia sẻ thông tin với bên thứ ba</li>
                <li>Tuân thủ các quy định về bảo vệ dữ liệu cá nhân</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Thanh toán và hoàn tiền</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chính sách thanh toán:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Thanh toán trước cho chu kỳ sử dụng</li>
                  <li>Hỗ trợ thanh toán qua chuyển khoản, thẻ tín dụng</li>
                  <li>Tự động gia hạn nếu đăng ký gói tự động</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chính sách hoàn tiền:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Hoàn tiền 100% trong 7 ngày đầu nếu không hài lòng</li>
                  <li>Hoàn tiền theo tỷ lệ thời gian chưa sử dụng khi hủy dịch vụ</li>
                  <li>Không hoàn tiền cho các gói khuyến mãi đặc biệt</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Giới hạn trách nhiệm</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                BDSPro không chịu trách nhiệm cho các thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả phát sinh
                từ việc sử dụng hoặc không thể sử dụng dịch vụ.
              </p>
              <p>
                Chúng tôi cam kết duy trì uptime 99.9% nhưng không đảm bảo dịch vụ hoạt động liên tục không bị gián đoạn
                do các yếu tố bất khả kháng.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Thay đổi điều khoản</h2>
            <p className="text-gray-600">
              BDSPro có quyền thay đổi các điều khoản sử dụng này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi
              được đăng tải trên website. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là bạn đã chấp nhận
              các điều khoản mới.
            </p>
          </section>

          <section>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Liên hệ</h3>
                  <p className="text-gray-600 mb-2">
                    Nếu bạn có bất kỳ câu hỏi nào về các điều khoản sử dụng này, vui lòng liên hệ:
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Email:</strong> support@bdspro.vn
                    </p>
                    <p>
                      <strong>Điện thoại:</strong> 0877814988
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> 182 Lê Lợi, Sơn Tây, Hà Nội
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
