import { Facebook, Linkedin, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-16 lg:py-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex mb-6">
              <div className="p-3 bg-white rounded-xl shadow-lg">
                <img src="/bdspro-logo-ngang.png" alt="BDSPro Logo" className="h-10 lg:h-12" />
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed text-lg">
              BDSPro - Giải pháp phần mềm quản lý bất động sản hàng đầu Việt Nam. Giúp doanh nghiệp tối ưu hóa quy trình
              và tăng hiệu quả kinh doanh.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-12 h-12 bg-gray-800 hover:bg-[#3B82F6] rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg group"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gray-800 hover:bg-[#3B82F6] rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg group"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gray-800 hover:bg-[#3B82F6] rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg group"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#home" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1"
                >
                  Trang chủ
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1"
                >
                  Giới thiệu
                </a>
              </li>
              <li>
                <a 
                  href="#products" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1"
                >
                  Sản phẩm
                </a>
              </li>
              <li>
                <a 
                  href="#customers" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1"
                >
                  Khách hàng
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1"
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Hỗ trợ</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/huong-dan-su-dung" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1"
                >
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1"
                >
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a 
                  href="/chinh-sach-bao-mat" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a 
                  href="/dieu-khoan-su-dung" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1"
                >
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              © 2024 BDSPro. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="/chinh-sach-bao-mat" className="hover:text-white transition-colors">
                Bảo mật
              </a>
              <a href="/dieu-khoan-su-dung" className="hover:text-white transition-colors">
                Điều khoản
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
