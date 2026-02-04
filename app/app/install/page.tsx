"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Apple, Chrome, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// App Store và Google Play links
const APP_LINKS = {
  ios: "https://apps.apple.com/vn/app/11-11-shopee-%C4%91%E1%BA%A1i-ti%E1%BB%87c-cu%E1%BB%91i-n%C4%83m/id959841449",
  android: "https://play.google.com/store/apps/details?id=com.shopee.vn",
  fallback: "https://bdspro.vn",
};

// Thời gian delay trước khi redirect (milliseconds) - rất ngắn để user thấy trang
const REDIRECT_DELAY = 500;

export default function InstallPage() {
  const router = useRouter();
  const [device, setDevice] = useState<"ios" | "android" | "unknown">(
    "unknown"
  );
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    // Detect device type từ user agent - tối ưu hóa để nhanh hơn
    const detectDevice = () => {
      if (typeof window === "undefined") return;

      const userAgent = window.navigator.userAgent.toLowerCase();

      // Check iOS (iPhone, iPad, iPod)
      const isIOS = /iphone|ipad|ipod/.test(userAgent);

      // Check Android
      const isAndroid = /android/.test(userAgent);

      if (isIOS) {
        setDevice("ios");
        setRedirectUrl(APP_LINKS.ios);
      } else if (isAndroid) {
        setDevice("android");
        setRedirectUrl(APP_LINKS.android);
      } else {
        setDevice("unknown");
      }
    };

    // Chạy ngay lập tức
    detectDevice();
  }, []);

  // Tự động redirect sau delay ngắn
  useEffect(() => {
    if (!redirectUrl) return;

    // Redirect sau delay ngắn để user thấy trang
    const redirectTimer = setTimeout(() => {
      window.location.href = redirectUrl;
    }, REDIRECT_DELAY);

    return () => clearTimeout(redirectTimer);
  }, [redirectUrl]);

  const handleManualRedirect = (platform: "ios" | "android") => {
    if (platform === "ios") {
      window.location.href = APP_LINKS.ios;
    } else {
      window.location.href = APP_LINKS.android;
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  // Hiển thị trang mời cài đặt cho iOS/Android - tự động redirect sau 500ms
  if (device === "ios" || device === "android") {
    const platformName = device === "ios" ? "App Store" : "Google Play";
    const PlatformIcon = device === "ios" ? Apple : Chrome;
    const iconBgColor = device === "ios" ? "bg-blue-100" : "bg-green-100";
    const iconColor = device === "ios" ? "text-blue-600" : "text-green-600";
    const buttonBgColor =
      device === "ios"
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-green-600 hover:bg-green-700";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div
                className={`mx-auto mb-4 w-20 h-20 ${iconBgColor} rounded-full flex items-center justify-center`}
              >
                <PlatformIcon className={`w-10 h-10 ${iconColor}`} />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Mời bạn tải ứng dụng BDSPro
              </CardTitle>
              <CardDescription className="text-gray-600">
                Ứng dụng quản lý bất động sản hàng đầu Việt Nam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <button
                  onClick={() => handleManualRedirect(device)}
                  className={`w-full ${buttonBgColor} text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2`}
                >
                  <PlatformIcon className="w-5 h-5" />
                  Tải ngay trên {platformName}
                </button>

                <button
                  onClick={handleGoHome}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Về trang chủ
                </button>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>Ứng dụng BDSPro hỗ trợ iOS 12.0+ và Android 6.0+</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Download className="w-10 h-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Tải ứng dụng BDSPro
            </CardTitle>
            <CardDescription className="text-gray-600">
              Chọn nền tảng của bạn để tải ứng dụng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-800 mb-4">
                  Không thể tự động phát hiện thiết bị của bạn. Vui lòng chọn
                  nền tảng:
                </p>
              </div>

              <button
                onClick={() => handleManualRedirect("ios")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Apple className="w-5 h-5" />
                Tải trên App Store (iOS)
              </button>

              <button
                onClick={() => handleManualRedirect("android")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Chrome className="w-5 h-5" />
                Tải trên Google Play (Android)
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Về trang chủ
              </button>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>Ứng dụng BDSPro hỗ trợ iOS 12.0+ và Android 6.0+</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
