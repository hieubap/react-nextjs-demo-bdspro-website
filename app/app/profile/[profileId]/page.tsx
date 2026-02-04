"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Edit, LogOut, ExternalLink } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

// Thời gian delay trước khi redirect (milliseconds) - rất ngắn để user thấy trang
const REDIRECT_DELAY = 500;

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const profileId = params?.profileId as string;
  const [isEditing, setIsEditing] = useState(false);
  
  // Tạo deeplink URL
  const deeplinkUrl = profileId ? `bdspro://profile/${profileId}` : null;

  // Mock user data - có thể thay thế bằng data từ API hoặc context
  const [userData, setUserData] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
  });

  // Tự động mở deeplink sau delay ngắn
  useEffect(() => {
    if (!deeplinkUrl) return;

    // Redirect sau delay ngắn để user thấy trang
    const redirectTimer = setTimeout(() => {
      window.location.href = deeplinkUrl;
    }, REDIRECT_DELAY);

    return () => clearTimeout(redirectTimer);
  }, [deeplinkUrl]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    // Logic đăng xuất - có thể thêm sau
    router.push("/");
  };

  const handleOpenDeeplink = () => {
    if (deeplinkUrl) {
      window.location.href = deeplinkUrl;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Thông tin cá nhân
            </CardTitle>
            <CardDescription className="text-gray-600">
              Quản lý thông tin tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Họ và tên</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) =>
                            setUserData({ ...userData, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">
                          {userData.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">
                          {userData.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) =>
                            setUserData({ ...userData, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">
                          {userData.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userData.address}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">
                          {userData.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {deeplinkUrl && (
                <button
                  onClick={handleOpenDeeplink}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Mở trong ứng dụng
                </button>
              )}
              
              <button
                onClick={handleEdit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-5 h-5" />
                {isEditing ? "Lưu thay đổi" : "Chỉnh sửa thông tin"}
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Đăng xuất
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
              <p>BDSPro - Ứng dụng quản lý bất động sản hàng đầu</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

