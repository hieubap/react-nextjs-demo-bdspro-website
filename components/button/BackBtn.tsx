"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

const BackBtn = () => {
  return (
    <Button
      variant="ghost"
      onClick={(e) => {
        window.history.back();
      }}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft className="w-4 h-4 mr-1" />
      Quay lại trang trước
    </Button>
  );
};

export default BackBtn;
