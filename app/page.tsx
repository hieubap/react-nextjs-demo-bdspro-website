import Header from "@/components/header"
import HeroBanner from "@/components/hero-banner"
import AboutSection from "@/components/about-section"
import ProductsSection from "@/components/products-section"
import TestimonialsSection from "@/components/testimonials-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 antialiased">
      <Header />
      <main className="overflow-hidden">
        <HeroBanner />
        <AboutSection />
        <ProductsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
