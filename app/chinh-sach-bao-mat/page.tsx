"use client";

import Link from "next/link";
import { Inter } from "next/font/google";
import {
  ArrowLeft,
  Shield,
  FileText,
  Scale,
  Database,
  Target,
  Gavel,
  Share2,
  Clock,
  Lock,
  Key,
  Building2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  BookOpen,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export default function ChinhSachBaoMat({}: {}) {
  const searchParams = useSearchParams();
  const inApp = searchParams.get("inapp") === "true";

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 ${inter.className}`}
    >
      {/* Header */}
      {!inApp && (
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex items-center justify-between gap-2">
              <Link
                href="/"
                className="flex items-center space-x-1 sm:space-x-2 hover:transition-colors font-medium text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Quay lại trang chủ</span>
                <span className="sm:hidden">Trang chủ</span>
              </Link>
              <img
                src="/bdspro-logo-ngang.png"
                alt="BDSPro Logo"
                className="h-6 sm:h-8"
              />
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-xl overflow-hidden">
          <div className="text-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
                Chính sách quyền riêng tư
              </h1>
            </div>
            <div className="inline-block">
              <p className="text-md md:text-base text-gray-700">
                <i>(Phiên bản 1.0 – Ban hành ngày 05/11/2025)</i>
              </p>
            </div>
          </div>

          <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8 md:space-y-10">
            {/* Section 1 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                1. Mục đích và phạm vi áp dụng
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <p className="leading-relaxed text-sm sm:text-base">
                  Chính sách này giải thích cách <b>Công ty Cổ phần BDS Pro</b>{" "}
                  (“<b>BDS Pro</b>“, “<b>chúng tôi</b>“) thu thập, sử dụng, lưu
                  trữ, bảo vệ và chia sẻ thông tin cá nhân của <b>Người dùng</b>{" "}
                  ("<b>bạn</b>") khi truy cập, đăng ký hoặc sử dụng các sản
                  phẩm, dịch vụ, ứng dụng, website, và hệ thống liên kết của BDS
                  Pro
                </p>
                <p className="leading-relaxed text-sm sm:text-base">
                  Chính sách này áp dụng cho <b>toàn bộ người dùng</b> trên nền
                  tảng BDS Pro, bao gồm{" "}
                  <b>cá nhân, doanh nghiệp, môi giới, và tổ chức đối tác.</b>
                </p>
                <p className="leading-relaxed text-sm sm:text-base">
                  Việc sử dụng dịch vụ đồng nghĩa với việc bạn đã đọc, hiểu và
                  đồng ý với Chính sách này.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                2. Căn cứ pháp lý
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <p className="leading-relaxed text-sm sm:text-base">
                  Chính sách này được xây dựng và thực thi theo các văn bản pháp
                  luật Việt Nam sau:
                </p>
                <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                  {[
                    [
                      <b>Nghị định 13/2023/NĐ-CP</b>,
                      " ngày 17/4/2023 của Chính phủ về bảo vệ dữ liệu cá nhân;",
                    ],
                    <b>Luật An ninh mạng 2018;</b>,
                    [
                      <b>Luật Giao dịch điện tử 2023</b>,
                      " (hiệu lực 01/7/2024);",
                    ],
                    "Các văn bản hướng dẫn thi hành liên quan đến bảo mật và an toàn thông tin.",
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <span className="flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                3. Dữ liệu cá nhân được thu thập
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                  3.1. Dữ liệu do bạn cung cấp
                </h3>
                <ul className="space-y-1 sm:space-y-2 pl-4 leading-relaxed">
                  {[
                    "Họ tên, ngày sinh, giới tính, số điện thoại, email, địa chỉ liên hệ;",
                    "CMND/CCCD hoặc giấy tờ định danh khác (nếu cần xác minh);",
                    "Ảnh đại diện, ảnh sản phẩm BĐS, hồ sơ pháp lý BĐS (nếu bạn tải lên);",
                    "Thông tin tài khoảng hoặc ví điện tử khi sử dụng dịch vụ trả phí.",
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <span className="flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                    3.2. Dữ liệu được thu thập tự động
                  </h3>
                  <ul className="space-y-1 sm:space-y-2 pl-4 leading-relaxed">
                    {[
                      "Địa chỉ IP, loại thiết bị, hệ điều hành, trình duyệt, mã định danh thiết bị (IDFA/IMEI);",
                      "Thông tin vị trí (GPS) khi bạn bật định vị;",
                      "Cookie, token, lịch sử truy cập, log hệ thống;",
                      "Dữ liệu hành vi: tin đăng, lượt xem, tìm kiếm, tương tác.",
                    ].map((item, index) => (
                      <li className="flex items-start gap-2" key={index}>
                        <span className="flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                    3.3. Dữ liệu từ bên thứ ba (nếu có)
                  </h3>
                  <ul className="space-y-1 sm:space-y-2 pl-4 leading-relaxed">
                    {[
                      "Dữ liệu được chia sẻ hợp pháp từ đối táp (OAuth, ví điện tử, nhà cung cấp dịch vụ SMS, Zalo/Google/Facebook…).",
                      "Dữ liệu từ các cơ quan quản lý hoặc đơn vị có thẩm quyền khi phục vụ yêu cầu pháp lý.",
                    ].map((item, index) => (
                      <li className="flex items-start gap-2" key={index}>
                        <span className="flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                4. Mục đích xử lý dữ liệu cá nhân
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                  {[
                    "1. Cung cấp, duy trì và cải thiện các sản phẩm, dịch vụ của BDS Pro;",
                    "2. Xác minh danh tính, bảo vệ tài khoản và phòng chống gian lận;",
                    "3. Gửi thông báo, xác nhận OTP, hỗ trợ kỹ thuật, chăm sóc khách hàng;",
                    "4. Phân tích hành vi sử dụng để gợi ý nội dung, sản phẩm hoặc dịch vụ phù hợp;",
                    "5. Cung cấp dịch vụ quảng cáo, marketing, CRM (nếu bạn đồng ý);",
                    "6. Thực hiện nghĩa vụ kế toán, thuế và tuân thủ yêu cầu của cơ quan nhà nước;",
                    "7. Đảm bảo an toàn thông tin và bảo mật hệ thống.",
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                5. Cơ sở pháp lý cho việc xử lý dữ liệu
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <p className="leading-relaxed text-sm sm:text-base">
                  Chúng tôi chỉ xử lý dữ liệu cá nhân của bạn khi:
                </p>
                <ul className="space-y-1 sm:space-y-2 pl-4 leading-relaxed">
                  {[
                    [
                      "Có ",
                      <b>sự đồng ý rõ ràng</b>,
                      " của bạn (đăng ký, tick chấp thuận, sử dụng dịch vụ);",
                    ],
                    [
                      "Việc xử lý là ",
                      <b>cần thiết để thực hiện hợp đồng</b>,
                      " giữa bạn và BDS Pro;",
                    ],
                    [
                      "Cần thiết để ",
                      <b>bảo vệ quyền lợi hợp pháp</b>,
                      " của BDS Pro hoặc bên thứ ba;",
                    ],
                    [
                      "Theo",
                      <b>
                        {" "}
                        nghĩa vụ pháp lý hoặc yêu cầu của cơ quan nhà nước có
                        thẩm quyền.
                      </b>,
                    ],
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <span className="flex-shrink-0">•</span>
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                6. Phạm vi và hình thức chia sẻ dữ liệu
              </h2>
              <div className="space-y-2 leading-tight">
                <p className="leading-relaxed text-sm sm:text-base">
                  BDS Pro cam kết{" "}
                  <b>
                    không bán, cho thuê hoặc chia sẻ trái phép dữ liệu cá nhân
                  </b>{" "}
                  cho bất kỳ tổ chức hay cá nhân nào.
                </p>
                <p className="leading-relaxed text-sm sm:text-base">
                  Tuy nhiên, dữ liệu có thể được chia sẻ trong các trường hợp
                  sau:
                </p>
                <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                  {[
                    [
                      "1. Với ",
                      <b>đối tác kỹ thuật</b>,
                      " hỗ trợ vận hành dịch vụ (SMS OTP, thanh toán, email, AI, phân tích dữ liệu…);",
                    ],
                    [
                      "2. Với ",
                      <b>đơn vị pháp lý, công chứng, đo đạc</b>,
                      " khi bạn chủ động yêu cầu dịch vụ;",
                    ],
                    [
                      "3. Theo ",
                      <b>yêu cầu hợp pháp của cơ quan nhà nước</b>,
                      " có thẩm quyền;",
                    ],
                    [
                      "4. Khi có ",
                      <b>sự đồng ý rõ ràng</b>,
                      " của bạn cho từng trường hợp cụ thể.",
                    ],
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <span className="flex-shrink-0">•</span>
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="leading-relaxed text-sm">
                  Mọi đối tác được chia sẻ dữ liệu đều phải ký{" "}
                  <b>cam kết bảo mật</b> hoặc <b>thỏa thuận xử lý dữ liệu</b>{" "}
                  theo quy định của Nghị định 13/2023/NĐ-CP.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                7. Thời hạn lưu trữ dữ liệu
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                  {[
                    "Dữ liệu cá nhân được lưu trữ chừng nào tài khoản của bạn còn hoạt động hoặc trong thời hạn cần thiết để cung cấp dịch vụ.",
                    "Khi bạn yêu cầu xóa tài khoản: Dữ liệu sẽ được xóa hoặc ẩn trong vòng 30 ngày kể từ ngày xác nhận yêu cầu, trừ trường hợp pháp luật yêu cầu lưu trữ lâu hơn.",
                    "Log kỹ thuật, dữ liệu giao dịch có thể được lưu tối đa 05 năm cho mục đích kiểm toán và tuân thủ pháp luật.",
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <span>•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                8. Biện pháp bảo mật
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <p className="leading-relaxed text-sm sm:text-base">
                  BDS Pro áp dụng nhiều biện pháp bảo mật kỹ thuật và tổ chức:
                </p>
                <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                  {[
                    [
                      "Mã hóa dữ liệu và truyền tải qua giao thức ",
                      <b>HTTPS/TLS;</b>,
                    ],
                    "Quản lý phân quyền, xác thực đa yếu tố, giới hạn truy cập nội bộ;",
                    "Sao lưu định kỳ và kiểm soát truy cập vào máy chủ;",
                    "Ghi log toàn bộ thao tác truy xuất dữ liệu;",
                    [
                      "Thực hiện ",
                      <b>đánh giá tác động bảo vệ dữ liệu (DPIA)</b>,
                      " định kỳ theo Nghị định 13/2023/NĐ-CP.",
                    ],
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <span className="flex-shrink-0">•</span>
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <p className="leading-relaxed text-sm sm:text-base">
                    Trong trường hợp xảy ra{" "}
                    <b>sự cố rò rỉ hoặc xâm nhập dữ liệu</b>, BDS Pro sẽ:
                  </p>
                  <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                    {[
                      [
                        "Thông báo ngay cho ",
                        <b>Cục An toàn thông tin</b>,
                        " và người dùng bị ảnh hưởng trong vòng ",
                        <b>72 giờ;</b>,
                      ],
                      "Áp dụng biện pháp khắc phục và phục hồi hệ thống ngay lập tức.",
                    ].map((item, index) => (
                      <li className="flex items-start gap-2" key={index}>
                        <span className="flex-shrink-0">•</span>
                        <span className="text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                9. Quyền của chủ thể dữ liệu cá nhân
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <p className="leading-relaxed text-sm sm:text-base">
                  Bạn có các quyền hợp pháp sau:
                </p>
                <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                  {[
                    [
                      <b>1. Quyền được biết</b>,
                      " về mục đích và phạm vi xử lý dữ liệu;",
                    ],
                    [
                      <b>
                        2. Quyền truy cập, sao chép, chỉnh sửa hoặc cập nhật
                      </b>,
                      " thông tin cá nhân;",
                    ],
                    [
                      <b>3. Quyền xóa hoặc yêu cầu xóa dữ liệu cá nhân</b>,
                      " (trừ trường hợp pháp luật yêu cầu lưu giữ);",
                    ],
                    [
                      <b>4. Quyền rút lại sự đồng ý</b>,
                      " xử lý dữ liệu bất kỳ lúc nào;",
                    ],
                    [
                      <b>5. Quyền phản đối hoặc khiếu nại</b>,
                      " nếu cho rằng dữ liệu bị sử dụng trái phép;",
                    ],
                    [
                      <b>
                        6. Quyền yêu cầu cung cấp hồ sơ đánh giá tác động xử lý
                        dữ liệu
                      </b>,
                      " (nếu có).",
                    ],
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <span className="flex-shrink-0">•</span>
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="leading-relaxed">
                  Mọi yêu cầu sẽ được xử lý trong vòng{" "}
                  <strong>07 ngày làm việc</strong> kể từ khi BDS Pro nhận được
                  đề nghị hợp lệ.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                10. Trách nhiệm của BDS Pro và bên thứ ba
              </h2>
              <ul className="space-y-2 sm:space-y-3 leading-relaxed">
                {[
                  "BDS Pro chịu trách nhiệm trực tiếp về việc thu thập, lưu trữ và xử lý dữ liệu cá nhân của người dùng.",
                  [
                    "Các đối tác, nhà thầu và bên thứ ba được ủy quyền xử lý dữ liệu ",
                    <b>
                      phải ký thỏa thuận bảo mật và chịu trách nhiệm pháp lý
                      liên đới.
                    </b>,
                  ],
                  "BDS Pro có quyền tạm ngừng chia sẻ hoặc xử lý dữ liệu với bất kỳ bên thứ ba nào nếu phát hiện vi phạm.",
                ].map((item, index) => (
                  <li className="flex items-start gap-2" key={index}>
                    <span className="flex-shrink-0">•</span>
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            {/* Section 10 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                10. Trách nhiệm của BDS Pro và bên thứ ba
              </h2>
              <div className="space-y-2 leading-relaxed">
                <p className="leading-relaxed text-sm sm:text-base">
                  BDS Pro chịu trách nhiệm trực tiếp về việc thu thập, lưu trữ
                  và xử lý dữ liệu cá nhân của người dùng.
                </p>
                <p className="leading-relaxed text-sm sm:text-base">
                  Các đối tác, nhà thầu, hoặc bên thứ ba được ủy quyền xử lý dữ
                  liệu phải{" "}
                  <b>
                    ký thỏa thuận bảo mật và chịu trách nhiệm pháp lý liên đới.
                  </b>
                </p>
                <p className="leading-tight">
                  BDS Pro có quyền tạm ngừng chia sẻ hoặc xử lý dữ liệu với bất
                  kỳ bên thứ ba nào nếu phát hiện vi phạm.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                11. Cập nhật và thay đổi chính sách
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <p className="leading-relaxed text-sm sm:text-base">
                  BDS Pro có thể điều chỉnh Chính sách này để phù hợp quy định
                  pháp luật mới hoặc cải thiện bảo mật.
                </p>
                <p className="leading-relaxed text-sm sm:text-base">
                  Mọi thay đổi sẽ được công bố trên website và/hoặc ứng dụng,
                  kèm ngày hiệu lực.
                </p>
                <p className="leading-relaxed">
                  Việc bạn tiếp tục sử dụng dịch vụ sau khi chính sách được cập
                  nhật được coi là <b>đồng ý với bản sửa đổi mới nhất.</b>
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                12. Liên hệ và yêu cầu xử lý dữ liệu
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <p className="leading-relaxed text-sm sm:text-base">
                  Nếu bạn có thắc mắc hoặc yêu cầu liên quan đến dữ liệu cá
                  nhân, vui lòng liên hệ: 
                </p>
                <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                  {[
                    "Địa chỉ: 182 Lê Lợi, Sơn Tây, Hà Nội",
                    "Email: privacy@bdspro.com",
                    "Hotline: 1900.xxx.xxx",
                    [
                      "Người phụ trách bảo vệ dữ liệu cá nhân (DPO): ",
                      <i>Cập nhật khi chỉ định chính thức</i>,
                    ],
                    ["Thời gian phản hồi: Trong vòng ", <b>72 giờ làm việc</b>],
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <span className="flex-shrink-0">•</span>
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 13 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                13. Hiệu lực thi hành
              </h2>
              <ul className="space-y-2 leading-relaxed">
                {[
                  "Chính sách này có hiệu lực kể từ ngày công bố.",
                  [
                    "Việc bạn đăng ký, truy cập hoặc sử dụng dịch vụ BDS Pro được coi là ",
                    <b>xác nhận rằng bạn đã đọc, hiểu và đồng ý</b>,
                    " với toàn bộ nội dung của ",
                    <b>Chính sách quyền riêng tư</b>,
                    " này.",
                  ],
                ].map((item, index) => (
                  <li className="flex items-start gap-2" key={index}>
                    <span className="flex-shrink-0">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 14 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                14. Tham chiếu pháp luật
              </h2>
              <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                {[
                  "Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân;",
                  "Luật An ninh mạng 2018;",
                  "Luật Giao dịch điện tử 2023;",
                  "Các quy định có liên quan của pháp luật Việt Nam.",
                ].map((item, index) => (
                  <li className="flex items-start gap-2" key={index}>
                    <span className="flex-shrink-0">•</span>
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Contact Section */}
            <section className="mt-6 sm:mt-8 md:mt-10">
              <div className="sm:p-5 md:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
                      Thông tin liên hệ hỗ trợ
                    </h3>
                    <p className="mb-3 leading-relaxed text-sm sm:text-base">
                      Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này,
                      vui lòng liên hệ với chúng tôi:
                    </p>
                    <div className="grid md:grid-cols-1 gap-2 sm:gap-3 text-sm sm:text-base">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div>
                          <strong className="text-gray-900">Email:</strong>
                          <span className="ml-2">support@bdspro.vn</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div>
                          <strong className="text-gray-900">Điện thoại:</strong>
                          <span className="ml-2">0877814988</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div>
                          <strong className="text-gray-900">Địa chỉ:</strong>
                          <span className="ml-2">
                            182 Lê Lợi, Sơn Tây, Hà Nội
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
