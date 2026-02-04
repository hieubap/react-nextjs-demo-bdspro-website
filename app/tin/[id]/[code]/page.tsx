import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ArticleInteractions from "@/components/article-interactions";

// Mock data - trong thực tế sẽ lấy từ database hoặc CMS
const articles = {
  "huong-dan-su-dung-bdspro": {
    title: "Hướng dẫn sử dụng BDSPro - Phần mềm quản lý bất động sản",
    description:
      "Hướng dẫn chi tiết cách sử dụng BDSPro để quản lý bất động sản hiệu quả. Từ cài đặt ban đầu đến các tính năng nâng cao.",
    content: `
# Hướng dẫn sử dụng BDSPro

BDSPro là phần mềm quản lý bất động sản hàng đầu Việt Nam, được thiết kế để giúp các doanh nghiệp bất động sản quản lý hoạt động kinh doanh một cách hiệu quả và chuyên nghiệp.

## 🚀 Bắt đầu với BDSPro

### 1. Đăng ký tài khoản
- Truy cập website BDSPro
- Chọn gói dịch vụ phù hợp
- Điền thông tin công ty
- Xác thực email

### 2. Cài đặt ban đầu
- Thiết lập thông tin công ty
- Tạo cấu trúc tổ chức
- Phân quyền người dùng
- Nhập dữ liệu khách hàng

## 📊 Các tính năng chính

### Quản lý khách hàng
- **CRM tích hợp**: Lưu trữ thông tin khách hàng đầy đủ
- **Lịch sử giao dịch**: Theo dõi tất cả hoạt động
- **Phân loại khách hàng**: Tiềm năng, VIP, thường xuyên
- **Tự động hóa**: Email marketing, nhắc nhở

### Quản lý dự án
- **Danh mục bất động sản**: Nhà, đất, căn hộ, biệt thự
- **Thông tin chi tiết**: Diện tích, giá, vị trí, tiện ích
- **Hình ảnh và video**: Gallery đa phương tiện
- **Trạng thái dự án**: Đang bán, đã bán, tạm ngừng

### Quản lý hợp đồng
- **Tạo hợp đồng**: Mẫu có sẵn, tùy chỉnh linh hoạt
- **Theo dõi tiến độ**: Thanh toán, giao nhà
- **Thông báo tự động**: Nhắc lịch, cảnh báo
- **Lưu trữ an toàn**: Backup tự động

### Báo cáo và thống kê
- **Dashboard tổng quan**: Doanh thu, khách hàng, dự án
- **Báo cáo chi tiết**: Excel, PDF export
- **Phân tích xu hướng**: Biểu đồ trực quan
- **Dự báo kinh doanh**: AI-powered insights

## 💡 Mẹo sử dụng hiệu quả

### 1. Tối ưu hóa workflow
- Sử dụng template có sẵn
- Thiết lập quy trình chuẩn
- Đào tạo nhân viên đầy đủ

### 2. Tận dụng tính năng tự động
- Email marketing tự động
- Nhắc nhở lịch hẹn
- Backup dữ liệu định kỳ

### 3. Phân tích dữ liệu
- Xem báo cáo hàng tuần
- Phân tích xu hướng thị trường
- Điều chỉnh chiến lược kinh doanh

## 🔧 Troubleshooting

### Lỗi thường gặp
1. **Không thể đăng nhập**: Kiểm tra email/mật khẩu
2. **Dữ liệu không đồng bộ**: Refresh trang web
3. **Upload file thất bại**: Kiểm tra dung lượng và định dạng

### Liên hệ hỗ trợ
- Email: support@bdspro.vn
- Hotline: 1900 1234
- Chat trực tuyến: 24/7

## 📈 Kết luận

BDSPro không chỉ là một phần mềm quản lý mà còn là đối tác tin cậy trong việc phát triển kinh doanh bất động sản. Với giao diện thân thiện và tính năng mạnh mẽ, BDSPro giúp bạn tiết kiệm thời gian, tăng hiệu quả và nâng cao chất lượng phục vụ khách hàng.

**Bắt đầu hành trình số hóa với BDSPro ngay hôm nay!**
    `,
    author: "BDSPro Team",
    publishDate: "2024-12-19",
    readTime: "8 phút",
    tags: ["hướng dẫn", "tutorial", "bdspro", "quản lý bất động sản"],
    image: "/real-estate-dashboard.png",
    category: "Tutorial",
    media: [
      "/real-estate-dashboard.png",
      "/placeholder.jpg",
      "/bdspro.png",
      "/placeholder-logo.png",
    ],
    likes: 42,
    comments: 8,
  },
  "tinh-nang-moi-bdspro-2024": {
    title: "Tính năng mới BDSPro 2024 - Nâng cấp đột phá",
    description:
      "Khám phá những tính năng mới nhất của BDSPro 2024. AI-powered insights, mobile app, và nhiều cải tiến khác.",
    content: `
# Tính năng mới BDSPro 2024 - Nâng cấp đột phá

Chúng tôi rất vui mừng thông báo về phiên bản BDSPro 2024 với nhiều tính năng đột phá và cải tiến đáng kể, mang lại trải nghiệm tốt nhất cho người dùng.

## 🤖 AI-Powered Insights

### Trí tuệ nhân tạo thông minh
- **Dự báo xu hướng thị trường**: Phân tích dữ liệu lớn để dự đoán xu hướng
- **Gợi ý giá bán tối ưu**: AI tính toán giá phù hợp với thị trường
- **Phân tích khách hàng**: Nhận diện khách hàng tiềm năng
- **Chatbot hỗ trợ**: Trả lời tự động 24/7

### Machine Learning
- **Recommendation engine**: Gợi ý sản phẩm phù hợp
- **Fraud detection**: Phát hiện giao dịch bất thường
- **Customer segmentation**: Phân nhóm khách hàng tự động

## 📱 Mobile App mới

### Tính năng di động
- **Native app**: iOS và Android
- **Offline mode**: Làm việc không cần internet
- **Push notification**: Thông báo real-time
- **Camera integration**: Chụp ảnh bất động sản trực tiếp

### UI/UX cải tiến
- **Material Design 3**: Giao diện hiện đại
- **Dark mode**: Chế độ tối tiết kiệm pin
- **Gesture navigation**: Điều hướng bằng cử chỉ
- **Accessibility**: Hỗ trợ người khuyết tật

## 🔗 Tích hợp nâng cao

### Third-party integrations
- **Banking API**: Tích hợp ngân hàng
- **Government systems**: Kết nối cơ quan nhà nước
- **Social media**: Facebook, Zalo, Instagram
- **Marketing tools**: Google Ads, Facebook Ads

### API mở rộng
- **RESTful API**: Dễ dàng tích hợp
- **Webhook support**: Real-time notifications
- **SDK**: JavaScript, Python, PHP
- **Documentation**: API docs chi tiết

## 🛡️ Bảo mật nâng cao

### Security features
- **Two-factor authentication**: Xác thực 2 lớp
- **End-to-end encryption**: Mã hóa toàn bộ dữ liệu
- **GDPR compliance**: Tuân thủ quy định bảo mật
- **Audit logs**: Ghi log chi tiết

### Backup & Recovery
- **Automated backup**: Sao lưu tự động hàng ngày
- **Point-in-time recovery**: Khôi phục theo thời điểm
- **Disaster recovery**: Phục hồi thảm họa
- **Multi-region**: Lưu trữ đa vùng

## 📊 Analytics & Reporting

### Advanced analytics
- **Real-time dashboards**: Bảng điều khiển thời gian thực
- **Custom reports**: Báo cáo tùy chỉnh
- **Data visualization**: Biểu đồ trực quan
- **Export options**: Xuất nhiều định dạng

### Business intelligence
- **KPI tracking**: Theo dõi chỉ số hiệu suất
- **Trend analysis**: Phân tích xu hướng
- **Competitive analysis**: Phân tích đối thủ
- **Market insights**: Thông tin thị trường

## 🚀 Performance improvements

### Tốc độ xử lý
- **50% faster loading**: Tải trang nhanh hơn 50%
- **Reduced server response time**: Giảm thời gian phản hồi
- **Optimized database**: Tối ưu cơ sở dữ liệu
- **CDN integration**: Mạng phân phối nội dung

### Scalability
- **Auto-scaling**: Tự động mở rộng
- **Load balancing**: Cân bằng tải
- **Microservices**: Kiến trúc vi dịch vụ
- **Cloud-native**: Tối ưu cho đám mây

## 🎯 Cập nhật ngay hôm nay

### Hướng dẫn nâng cấp
1. **Backup dữ liệu**: Sao lưu trước khi nâng cấp
2. **Check system requirements**: Kiểm tra yêu cầu hệ thống
3. **Update gradually**: Nâng cấp từng bước
4. **Test thoroughly**: Kiểm tra kỹ lưỡng

### Hỗ trợ nâng cấp
- **Migration service**: Dịch vụ chuyển đổi
- **Training sessions**: Đào tạo sử dụng
- **24/7 support**: Hỗ trợ 24/7
- **Documentation**: Tài liệu chi tiết

## 💰 Pricing & Plans

### Gói cơ bản - 2.990.000đ/tháng
- Tối đa 100 dự án
- 5 người dùng
- Hỗ trợ email

### Gói chuyên nghiệp - 5.990.000đ/tháng
- Không giới hạn dự án
- 20 người dùng
- Hỗ trợ 24/7
- API access

### Gói doanh nghiệp - 9.990.000đ/tháng
- Tất cả tính năng
- Không giới hạn người dùng
- Dedicated support
- Custom integrations

## 🎉 Kết luận

BDSPro 2024 mang đến một cuộc cách mạng trong việc quản lý bất động sản với AI, mobile app, và nhiều tính năng đột phá khác. Đây không chỉ là một bản nâng cấp mà là một bước tiến lớn trong việc số hóa ngành bất động sản Việt Nam.

**Trải nghiệm ngay hôm nay và cảm nhận sự khác biệt!**
    `,
    author: "BDSPro Development Team",
    publishDate: "2024-12-19",
    readTime: "6 phút",
    tags: ["tính năng mới", "2024", "AI", "mobile app", "nâng cấp"],
    image: "/bdspro-logo-ngang.png",
    category: "News",
    media: [
      "/bdspro-logo-ngang.png",
      "/bdspro.png",
      "/placeholder.jpg",
      "/real-estate-dashboard.png",
      "/placeholder-logo.png",
    ],
    likes: 128,
    comments: 24,
  },
  "case-study-cong-ty-bds-abc": {
    title: "Case Study: Công ty BDS ABC tăng 300% hiệu suất với BDSPro",
    description:
      "Khám phá cách Công ty BDS ABC đã tăng hiệu suất kinh doanh 300% chỉ sau 6 tháng sử dụng BDSPro.",
    content: `
# Case Study: Công ty BDS ABC tăng 300% hiệu suất với BDSPro

## 🏢 Tổng quan về Công ty BDS ABC

Công ty BDS ABC là một trong những doanh nghiệp bất động sản hàng đầu tại TP.HCM với hơn 15 năm kinh nghiệm trong lĩnh vực phát triển và kinh doanh bất động sản.

### Thông tin công ty
- **Thành lập**: 2009
- **Quy mô**: 150+ nhân viên
- **Chuyên môn**: Nhà phố, căn hộ cao cấp, đất nền
- **Thị trường**: TP.HCM và các tỉnh lân cận

## ❌ Thách thức trước khi sử dụng BDSPro

### Vấn đề quản lý dữ liệu
- **Dữ liệu phân tán**: Thông tin khách hàng và dự án lưu trữ trên nhiều file Excel
- **Không đồng bộ**: Dữ liệu cũ, không cập nhật kịp thời
- **Mất dữ liệu**: Rủi ro mất thông tin quan trọng
- **Khó tìm kiếm**: Mất nhiều thời gian để tìm thông tin

### Vấn đề quy trình
- **Quy trình thủ công**: Tất cả công việc làm bằng tay
- **Thiếu chuẩn hóa**: Không có quy trình thống nhất
- **Báo cáo chậm**: Phải mất nhiều ngày để có báo cáo
- **Thiếu kiểm soát**: Khó theo dõi tiến độ công việc

### Vấn đề hiệu suất
- **Thời gian xử lý chậm**: Mất nhiều thời gian cho các tác vụ đơn giản
- **Sai sót cao**: Nhiều lỗi do làm thủ công
- **Khách hàng không hài lòng**: Phản hồi chậm, thiếu chuyên nghiệp
- **Doanh thu giảm**: Hiệu suất kinh doanh không tối ưu

## ✅ Giải pháp với BDSPro

### Triển khai hệ thống
- **Thời gian triển khai**: 3 tháng
- **Đào tạo nhân viên**: 2 tuần
- **Migration dữ liệu**: 1 tháng
- **Go-live**: Thành công 100%

### Các module được triển khai
1. **CRM**: Quản lý khách hàng toàn diện
2. **Project Management**: Quản lý dự án bất động sản
3. **Contract Management**: Quản lý hợp đồng
4. **Reporting**: Báo cáo và thống kê
5. **Mobile App**: Ứng dụng di động

## 📊 Kết quả đạt được

### Tăng hiệu suất kinh doanh
- **Doanh thu tăng 300%**: Từ 50 tỷ/năm lên 150 tỷ/năm
- **Số lượng giao dịch tăng 250%**: Từ 200 giao dịch/năm lên 500 giao dịch/năm
- **Thời gian xử lý giảm 70%**: Từ 3 ngày xuống còn 8 giờ
- **Tỷ lệ chuyển đổi tăng 180%**: Từ 15% lên 42%

### Cải thiện quản lý
- **Dữ liệu tập trung**: Tất cả thông tin trong một hệ thống
- **Quy trình chuẩn hóa**: Quy trình thống nhất cho toàn công ty
- **Báo cáo real-time**: Báo cáo tức thì, chính xác
- **Kiểm soát tốt hơn**: Theo dõi mọi hoạt động

### Nâng cao trải nghiệm khách hàng
- **Phản hồi nhanh**: Từ 24h xuống còn 2h
- **Thông tin chính xác**: Dữ liệu luôn cập nhật
- **Dịch vụ chuyên nghiệp**: Quy trình chuẩn hóa
- **Hài lòng tăng 95%**: Từ 60% lên 95%

## 💡 Các tính năng được sử dụng hiệu quả

### AI-Powered Insights
- **Phân tích khách hàng**: Nhận diện khách hàng tiềm năng
- **Dự báo xu hướng**: Dự đoán xu hướng thị trường
- **Gợi ý giá bán**: Tối ưu hóa giá bán
- **Recommendation engine**: Gợi ý sản phẩm phù hợp

### Automation
- **Email marketing**: Tự động gửi email chăm sóc
- **Nhắc nhở lịch**: Tự động nhắc lịch hẹn
- **Báo cáo tự động**: Báo cáo hàng tuần/tháng
- **Workflow automation**: Tự động hóa quy trình

### Mobile App
- **Làm việc mọi lúc mọi nơi**: Truy cập từ điện thoại
- **Offline mode**: Làm việc không cần internet
- **Push notification**: Thông báo tức thì
- **Camera integration**: Chụp ảnh trực tiếp

## 🎯 ROI và hiệu quả đầu tư

### Chi phí đầu tư
- **Phần mềm BDSPro**: 120 triệu/năm
- **Triển khai và đào tạo**: 50 triệu
- **Tổng chi phí**: 170 triệu/năm

### Lợi ích đạt được
- **Tăng doanh thu**: +100 tỷ/năm
- **Tiết kiệm chi phí**: 30 triệu/năm
- **Tăng hiệu suất**: 70% thời gian làm việc
- **ROI**: 588% trong năm đầu

### Break-even
- **Thời gian hoàn vốn**: 2 tháng
- **Lợi nhuận ròng năm đầu**: 1 tỷ đồng

## 📈 Kế hoạch phát triển

### Giai đoạn 2 (2025)
- **Advanced Analytics**: Phân tích nâng cao
- **Machine Learning**: Học máy cho dự báo
- **IoT Integration**: Tích hợp thiết bị thông minh
- **Blockchain**: Ứng dụng blockchain

### Mục tiêu dài hạn
- **Số hóa toàn diện**: 100% quy trình số hóa
- **AI-driven decisions**: Quyết định dựa trên AI
- **Customer-centric**: Tập trung vào khách hàng
- **Sustainable growth**: Tăng trưởng bền vững

## 🏆 Lời khuyên cho doanh nghiệp khác

### Chuẩn bị triển khai
1. **Đánh giá hiện trạng**: Phân tích quy trình hiện tại
2. **Xác định mục tiêu**: Đặt mục tiêu rõ ràng
3. **Chuẩn bị dữ liệu**: Làm sạch và chuẩn hóa dữ liệu
4. **Đào tạo nhân viên**: Đảm bảo nhân viên sẵn sàng

### Thực hiện thành công
1. **Triển khai từng bước**: Không vội vàng
2. **Hỗ trợ liên tục**: Đảm bảo có hỗ trợ
3. **Đo lường hiệu quả**: Theo dõi KPI thường xuyên
4. **Cải tiến liên tục**: Không ngừng tối ưu hóa

## 🎉 Kết luận

BDSPro đã giúp Công ty BDS ABC thực hiện một cuộc chuyển đổi số thành công, tăng hiệu suất kinh doanh 300% và trở thành một trong những doanh nghiệp bất động sản hàng đầu Việt Nam.

**Câu chuyện thành công này chứng minh rằng đầu tư vào công nghệ là chìa khóa để phát triển bền vững trong thời đại số.**

### Thông tin liên hệ
- **Website**: https://bdspro.vn
- **Hotline**: 1900 1234
- **Email**: contact@bdspro.vn
    `,
    author: "BDSPro Marketing Team",
    publishDate: "2024-12-19",
    readTime: "12 phút",
    tags: ["case study", "success story", "ROI", "tăng trưởng", "BDS ABC"],
    image: "/real-estate-dashboard.png",
    category: "Case Study",
    media: [
      "/real-estate-dashboard.png",
      "/placeholder.jpg",
      "/bdspro.png",
      "/placeholder-logo.png",
      "/bdspro-logo-ngang.png",
    ],
    likes: 89,
    comments: 15,
  },
};

interface ArticlePageProps {
  params: {
    code: string;
  };
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = articles[params.code as keyof typeof articles];

  if (!article) {
    return {
      title: "Bài viết không tìm thấy - BDSPro",
      description: "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    };
  }

  return {
    title: `${article.title} - BDSPro`,
    description: article.description,
    keywords: article.tags.join(", "),
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishDate,
      authors: [article.author],
      tags: article.tags,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = articles[params.code as keyof typeof articles];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-blue-600">
              Trang chủ
            </a>
            <span>/</span>
            <a href="/tin" className="hover:text-blue-600">
              Tin tức
            </a>
            <span>/</span>
            <span className="text-gray-900">{article.category}</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span>{article.publishDate}</span>
            <span>•</span>
            <span>{article.readTime}</span>
            <span>•</span>
            <span>Bởi {article.author}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          {article.description}
        </p>

        {/* Featured Image */}
        <div className="mb-8">
          <Image
            src={article.image}
            alt={article.title}
            width={1200}
            height={630}
            className="w-full h-auto rounded-lg shadow-lg"
            priority
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 leading-relaxed">
            {article.content
              .split("\n")
              .map((line, index) => {
                // Handle headings
                if (line.startsWith("# ")) {
                  return (
                    <h1
                      key={index}
                      className="text-3xl font-bold text-gray-900 mt-8 mb-4"
                    >
                      {line.replace("# ", "")}
                    </h1>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <h2
                      key={index}
                      className="text-2xl font-bold text-gray-900 mt-6 mb-3"
                    >
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3
                      key={index}
                      className="text-xl font-bold text-gray-900 mt-4 mb-2"
                    >
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("#### ")) {
                  return (
                    <h4
                      key={index}
                      className="text-lg font-bold text-gray-900 mt-3 mb-2"
                    >
                      {line.replace("#### ", "")}
                    </h4>
                  );
                }

                // Handle bullet points
                if (line.startsWith("- ")) {
                  return (
                    <div key={index} className="ml-4 mb-2">
                      <span className="text-blue-600">•</span>{" "}
                      {line.replace("- ", "")}
                    </div>
                  );
                }

                // Handle numbered lists
                if (/^\d+\. /.test(line)) {
                  return (
                    <div key={index} className="ml-4 mb-2">
                      {line}
                    </div>
                  );
                }

                // Handle empty lines
                if (line.trim() === "") {
                  return <br key={index} />;
                }

                // Handle regular paragraphs
                if (line.trim()) {
                  // Handle bold and italic text
                  const processedLine = line
                    .split(/(\*\*.*?\*\*|\*.*?\*)/)
                    .map((part, partIndex) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong
                            key={partIndex}
                            className="font-semibold text-gray-900"
                          >
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      if (part.startsWith("*") && part.endsWith("*")) {
                        return (
                          <em key={partIndex} className="italic">
                            {part.slice(1, -1)}
                          </em>
                        );
                      }
                      return part;
                    });

                  return (
                    <p key={index} className="mb-4">
                      {processedLine}
                    </p>
                  );
                }

                return null;
              })
              .filter(Boolean)}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Media Gallery */}
        {article.media && article.media.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Hình ảnh & Video
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {article.media.map((mediaUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={mediaUrl}
                    alt={`${article.title} - Hình ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Like, Comment, Share */}
        <div className="mt-12">
          <ArticleInteractions
            initialLikes={article.likes || 0}
            initialComments={article.comments || 0}
          />
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(articles).map((code) => ({
    code,
  }));
}
