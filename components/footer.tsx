export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex mb-4">
            <div className="p-[8px] bg-white rounded-[4px] border-1">
              <img src="/bdspro-logo-ngang.png" alt="BDSPro Logo" className="h-12" />
            </div>
            </div>
            
            <p className="text-gray-300 mb-4 max-w-md">
              BDSPro - Giải pháp phần mềm quản lý bất động sản hàng đầu Việt Nam. Giúp doanh nghiệp tối ưu hóa quy trình
              và tăng hiệu quả kinh doanh.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                YouTube
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#products" className="text-gray-300 hover:text-white transition-colors">
                  Sản phẩm
                </a>
              </li>
              <li>
                <a href="#customers" className="text-gray-300 hover:text-white transition-colors">
                  Khách hàng
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <a href="/huong-dan-su-dung" className="text-gray-300 hover:text-white transition-colors">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="/dieu-khoan-su-dung" className="text-gray-300 hover:text-white transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">© 2024 BDSPro. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
