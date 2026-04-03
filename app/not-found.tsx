import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Search } from "lucide-react";
import BackBtn from "@/components/button/BackBtn";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-red-600">404</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Trang không tìm thấy
            </CardTitle>
            <CardDescription className="text-gray-600">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di
              chuyển.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-500">
              <p>
                Có thể bạn đã nhập sai địa chỉ hoặc trang đã được chuyển đến vị
                trí khác.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Về trang chủ
                </Link>
              </Button>

              <Button variant="outline" asChild className="flex-1">
                <Link
                  href="/tin"
                  className="flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Xem tin tức
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <BackBtn />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Nếu bạn nghĩ đây là lỗi, vui lòng{" "}
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              liên hệ với chúng tôi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
