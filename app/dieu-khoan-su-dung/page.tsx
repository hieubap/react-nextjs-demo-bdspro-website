"use client";

import Link from "next/link";
import { Inter } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export default function DieuKhoanSuDung({}: {}) {
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
                Điều khoản sử dụng BDSPro
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
                1. Giới thiệu chung
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <p className="leading-relaxed text-sm sm:text-base">
                  Chào mừng Quý khách đến với <b>BDS Pro</b> – nền tảng công
                  nghệ về <b>quản lý và giao dịch bất động sản</b> do{" "}
                  <b>Công ty Cổ phần BDS Pro</b> ("<b>Công ty</b>", "
                  <b>chúng tôi</b>") sở hữu và vận hành.
                </p>
                <p className="leading-relaxed text-sm sm:text-base">
                  Các <b>Điều khoản sử dụng này</b> ("<b>Điều khoản</b>") quy
                  định quyền, nghĩa vụ và giới hạn trách nhiệm giữa{" "}
                  <b>Công ty</b> và <b>Người dùng</b>
                  ("<b>bạn</b>") khi truy cập, đăng ký hoặc sử dụng website, ứng
                  dụng, API, và các dịch vụ liên quan của BDS Pro.
                </p>
                <p className="leading-relaxed text-sm sm:text-base">
                  Khi <b>đăng ký tài khoản, truy cập hoặc sử dụng dịch vụ</b>,
                  bạn được coi là đã <b>đọc, hiểu và đồng ý</b> bị ràng buộc bởi
                  Điều khoản này cùng <b>Chính sách quyền riêng tư</b>.
                </p>
                <p>Nếu bạn không đồng ý, vui lòng ngừng sử dụng nền tảng.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                2. Giải thích thuật ngữ
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <p className="leading-relaxed text-sm sm:text-base">
                  Trong tài liệu này:
                </p>
                {[
                  [
                    "Người dùng",
                    "Cá nhân hoặc tổ chức đăng ký và sử dụng dịch vụ BDS Pro.",
                  ],
                  [
                    "Tài khoản",
                    "Tài khoản được tạo qua số điện thoạu, email hoặc OAuth (Facebook, Google, Zalo).",
                  ],
                  [
                    "Sản phẩm bất động sản (BĐS)",
                    "Dữ liệu BĐS do người dùng tạo để quản lý, đăng tin hoặc khai thác.",
                  ],
                  [
                    "Tin đăng",
                    "Nội dung công khai giới thiệu hoặc rao bán BĐS trên hệ thống.",
                  ],
                  [
                    "Tài sản",
                    "BĐS thuộc quyền sở hữu hoặc khai thác hợp pháp của người dùng.",
                  ],
                  [
                    "Dịch vụ hỗ trợ",
                    "Dịch vụ bổ trợ như đo đạc, công chứng, pháp lý, marketing, CRM, AI...",
                  ],
                  [
                    "Doanh nghiệp/Nhóm",
                    "Thực thể tổ chức được người dùng tạo hoặc tham gia trong hệ thống.",
                  ],
                  [
                    "Hệ thống",
                    "Toàn bộ hạ tầng kỹ thuật, dữ liệu, phần mềm và dịch vụ thuộc BDS Pro.",
                  ],
                ].map(([term, description]) => (
                  <div key={term} className="text-sm sm:text-base">
                    • <b>{term}:</b> {description}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                3. Điều kiện và phạm vi sử dụng
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                  {[
                    "1. Người dùng phải từ 18 tuổi trở lên và có đầy đủ năng lực hành vi dân sự.",
                    "2. Mỗi người chỉ được sở hữu 01 tài khoản chính.",
                    "3. Tài khoản doanh nghiệp phải do cá nhân hợp lệ tạo và chịu trách nhiệm quản lý.",
                    [
                      "4. Người dùng không được:",
                      <br />,
                      [
                        "Tạo tài khoản giả mạo, dùng danh tính của người khác;",
                        "Đăng tin sai sự thật, spam, lừa đảo, phát tán nội dung vi phạm pháp luật;",
                        "Xâm nhập, can thiệp, sao chép hoặc khai thác hệ thống trái phép.",
                      ].map((item, index) => (
                        <li className="flex items-start gap-2 pl-2" key={index}>
                          • <span>{item}</span>
                        </li>
                      )),
                    ],
                    "5. Công ty có quyền tạm ngừng, từ chối hoặc chấm dứt tài khoản mà không cần thông báo trước nếu có vi phạm.",
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                4. Quyền và nghĩa vụ của người dùng
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                    Quyền của bạn
                  </h3>
                  <ul className="space-y-1 leading-relaxed">
                    {[
                      "Sử dụng hợp pháp các tính năng của hệ thống;",
                      "Tạo, chỉnh sửa, xóa sản phẩm, tin đăng, quản lý tài sản;",
                      "Sử dụng dịch vụ CRM, AI, marketing theo gói đã đăng ký;",
                      "Đề nghị hỗ trợ, khiếu nại, phản hồi dịch vụ.",
                    ].map((item, index) => (
                      <li className="flex items-start gap-2 pl-1" key={index}>
                        •<span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                    Nghĩa vụ của bạn
                  </h3>
                  <ul className="space-y-1 leading-relaxed">
                    {[
                      "Cung cấp thông tin chính xác, trung thực, kịp thời cập nhật khi có thay đổi;",
                      "Bảo mật tài khoản và chịu trách nhiệm về mọi hoạt động của mình;",
                      "Tuân thủ pháp luật và Điều khoản này;",
                      "Không đăng tải hoặc chia sẻ nội dung vi phạm pháp luật, thuần phong mỹ tục.",
                    ].map((item, index) => (
                      <li className="flex items-start gap-2" key={index}>
                        • <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                5. Quyền và nghĩa vụ của BDS Pro
              </h2>
              <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                {[
                  "Đảm bảo hệ thống hoạt động ổn định, bảo mật và đúng cam kết.",
                  "Kiểm duyệt, chỉnh sửa, ẩn hoặc xóa nội dung vi phạm.",
                  "Thu thập, phân tích dữ liệu sử dụng (ẩn danh hoặc được đồng ý) để cải thiện dịch vụ.",
                  "Tạm ngừng dịch vụ để bảo trì, nâng cấp hoặc theo yêu cầu pháp luật.",
                  "Không chịu trách nhiệm đối với lỗi hoặc thiệt hại phát sinh do hành vi của người dùng hoặc bên thứ ba.",
                ].map((item, index) => (
                  <li className="flex items-start gap-2" key={index}>
                    • <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 6 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                6. Hành vi và nội dung bị cấm
              </h2>
              <ul className="space-y-1 leading-relaxed">
                {[
                  "Đăng tin sai sự thật, gian dối hoặc giả mạo thông tin bất động sản.",
                  "Đăng tải nội dung phản cảm, bạo lực, phân biệt đối xử, vi phạm bản quyền.",
                  "Sử dụng nền tảng để spam, lừa đảo, quảng cáo sai quy định.",
                  "Can thiệp vào mã nguồn, khai thác dữ liệu trái phép, hoặc phát tán mã độc.",
                ].map((item, index) => (
                  <li className="flex items-start gap-2" key={index}>
                    • <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 7 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                7. Dịch vụ, giao dịch và thanh toán
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                {[
                  "Các gói dịch vụ trả phí, gói thành viên, ví người dùng, và công cụ marketing được công bố công khai.",
                  "Thanh toán qua đối tác trung gian được cấp phép (ngân hàng, ví điện tử, v.v.).",
                  "Lưu ý: Trừ khi có quy định khác, mọi khoản đã thanh toán đều không hoàn lại.",
                  "BDS Pro không chịu trách nhiệm pháp lý cho các giao dịch dân sự giữa người dùng với nhau (mua bán, cho thuê, môi giới…).",
                ].map((item, index) => (
                  <li className="flex items-start gap-2" key={index}>
                    • <span>{item}</span>
                  </li>
                ))}
              </div>
            </section>

            {/* Section 8 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                8. Sở hữu trí tuệ
              </h2>
              <ul className="space-y-2 sm:space-y-3 leading-relaxed">
                {[
                  [
                    "Toàn bộ mã nguồn, giao diện, hình ảnh, nhãn hiệu, dữ liệu và nội dung thuộc quyền sở hữu của BDS Pro.",
                    "Người dùng không được sao chép, chỉnh sửa, thương mại hóa bất kỳ phần nào của hệ thống nếu chưa được chấp thuận bằng văn bản.",
                    [
                      "Nội dung do người dùng đăng tải vẫn thuộc quyền sở hữu của họ, nhưng người dùng ",
                      <b>
                        cấp quyền sử dụng không độc quyền, toàn cầu, vô thời hạn
                      </b>,
                      " cho BDS Pro nhằm mục đích hiển thị và quảng bá nội dung đó.",
                    ],
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      • <span>{item}</span>
                    </li>
                  )),
                ]}
              </ul>
            </section>

            {/* Section 9 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                9. Bảo mật và dữ liệu cá nhân
              </h2>
              <ul className="space-y-2 sm:space-y-3 leading-relaxed">
                {[
                  "BDS Pro cam kết tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.",
                  [
                    "Việc thu thập, xử lý và lưu trữ dữ liệu được quy định rõ tại ",
                    <b>Chính sách quyền riêng tư.</b>,
                  ],
                  "Người dùng đồng ý cho phép BDS Pro xử lý dữ liệu cần thiết để cung cấp dịch vụ, phân tích hành vi, đề xuất nội dung và phòng ngừa gian lận.",
                ].map((item, index) => (
                  <li className="flex items-start gap-2" key={index}>
                    • <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 10 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                10. Tạm ngừng, khóa hoặc chấm dứt tài khoản
              </h2>
              <ul className="space-y-2 sm:space-y-3 leading-relaxed">
                {[
                  [
                    "BDS Pro có quyền tạm ngừng hoặc xóa tài khoản nếu:",
                    [
                      "Người dùng vi phạm Điều khoản hoặc pháp luật;",
                      "Có hành vi gian lận, gây rối, hoặc ảnh hưởng đến an toàn hệ thống;",
                      "Theo yêu cầu của cơ quan nhà nước có thẩm quyền.",
                    ].map((item, index) => (
                      <li className="flex items-start gap-2" key={index}>
                        • <span>{item}</span>
                      </li>
                    )),
                  ],
                  "Dữ liệu liên quan có thể được lưu trữ trong thời hạn pháp luật cho phép hoặc xóa theo yêu cầu chính đáng.",
                ].map((item, index) => (
                  <li className="flex items-start gap-2" key={index}>
                    • <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 11 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                11. Giới hạn và miễn trừ trách nhiệm
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                    1. Giới hạn trách nhiệm kỹ thuật
                  </h3>
                  <ul className="space-y-2 pl-4 leading-relaxed">
                    {[
                      "BDS Pro không bảo đảm dịch vụ luôn không gián đoạn, không lỗi, hoặc không bị ảnh hưởng bởi yếu tố khách quan.",
                      "Không chịu trách nhiệm cho mất mát dữ liệu, gián đoạn, hay thiệt hại gián tiếp phát sinh từ việc sử dụng dịch vụ.",
                      [
                        "Trách nhiệm tối đa của BDS Pro, nếu có, ",
                        <b>
                          không vượt quá tổng giá trị dịch vụ người dùng đã
                          thanh toán trong 06 tháng gần nhất.
                        </b>,
                      ],
                    ].map((item, index) => (
                      <li className="flex items-start gap-2" key={index}>
                        • <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                    2. Miễn trừ trách nhiệm pháp lý và giao dịch
                  </h3>
                  <ul className="space-y-2 pl-4 leading-relaxed">
                    {[
                      [
                        "BDS Pro không phải là ",
                        <b>sàn giao dịch bất động sản</b>,
                        " theo định nghĩa pháp luật hiện hành.",
                      ],
                      [
                        "Nền tảng chỉ cung cấp công cụ công nghệ để người dùng ",
                        <b>quản lý, đăng tin, và kết nối thông tin.</b>,
                      ],
                      [
                        "BDS Pro ",
                        <b>không tham gia, bảo đảm hay đại diện</b>,
                        " cho bất kỳ bên nào trong giao dịch dân sự giữa người dùng.",
                      ],
                      [
                        "Mọi thông tin, tin đăng, hoặc thỏa thuận phát sinh ",
                        <b>do người dùng tự chịu trách nhiệm.</b>,
                      ],
                      "BDS Pro được miễn trách nhiệm trong mọi trường hợp người dùng vi phạm quy định pháp luật hoặc sử dụng nền tảng sai mục đích.",
                    ].map((item, index) => (
                      <li className="flex items-start gap-2" key={index}>
                        • <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 12 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                12. Sửa đổi và cập nhật điều khoản
              </h2>
              <ul className="space-y-2 sm:space-y-3 leading-relaxed">
                {[
                  "BDS Pro có thể sửa đổi Điều khoản này bất kỳ lúc nào và sẽ thông báo qua email, app hoặc website.",
                  "Phiên bản mới có hiệu lực từ ngày công bố.",
                  "Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp thuận điều khoản mới.",
                ].map((item, index) => (
                  <li className="flex items-start gap-2" key={index}>
                    • <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 13 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                13. Luật áp dụng và giải quyết tranh chấp
              </h2>
              <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="flex-shrink-0">•</span>
                  <span>
                    Điều khoản này được điều chỉnh bởi <b>pháp luật Việt Nam</b>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="flex-shrink-0">•</span>
                  <span>
                    Mọi tranh chấp được ưu tiên giải quyết bằng thương lượng và
                    hòa giải.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="flex-shrink-0">•</span>
                  <span>
                    Nếu không đạt được thỏa thuận, tranh chấp sẽ do{" "}
                    <b>Tòa án nhân dân có thẩm quyền tại Hà Nội</b> giải quyết.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="flex-shrink-0">•</span>
                  <span>
                    Ngôn ngữ áp dụng là <b>tiếng Việt</b>.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 14 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                14. Liên hệ
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <ul className="space-y-1 sm:space-y-2 leading-relaxed">
                  {[
                    "Địa chỉ trụ sở: 182 Lê Lợi, Sơn Tây, Hà Nội",
                    "Email CSKH: support@bdspro.com",
                    "Hotline: 1900.xxx.xxx",
                    "Thời gian làm việc: 08h30 – 17h30 (Thứ Hai đến Thứ Sáu)",
                  ].map((item, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      • <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 15 */}
            <section className="">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                15. Hiệu lực và chấp thuận
              </h2>
              <div className="space-y-2 sm:space-y-3 leading-relaxed">
                <p className="leading-relaxed text-sm sm:text-base">
                  Khi bạn <b>đăng ký tài khoản hoặc sử dụng dịch vụ</b>, bạn xác
                  nhận đã <b>đọc, hiểu và đồng ý</b> với toàn bộ nội dung của{" "}
                  <b>Điều khoản sử dụng này</b> và{" "}
                  <b>Chính sách quyền riêng tư</b> của BDS Pro.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
