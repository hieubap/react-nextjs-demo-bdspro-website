"use client"
// app/map/page.tsx
import dynamic from "next/dynamic";

const BDSMap = dynamic(() => import("@/components/map/BDSMap"), {
  ssr: false, // ⛔️ server không được đụng vào
});

export default function Page() {
  return <BDSMap />;
}
