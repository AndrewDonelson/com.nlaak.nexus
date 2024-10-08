import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';
import Footer from '@/components/app/Footer';
import { FeatureSection } from '@/components/shared/FeatureSection';
import { Features } from "@/constants/features";
import Hero from "@/components/shared/Hero";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-16">
      <Logo />
     
      <Hero 
        title="Example Modern PWA"
        subtitle="State-of-the-Art powerful web application, Compatiable with all devices, Installable, Authentication"
        ctaText="Get Started"
        ctaLink="/get-started"
        className="bg-gradient-to-r from-primary to-secondary"
      />
      
      {/* Feature Cards */}
      <FeatureSection features={Features} title={'Empowering the `little guy` with Cutting-Edge Technology'} />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8">Join us today and transform your web development process!</p>
          <Link href="https://nlaak.com">
          <Button variant="secondary" size="lg" className="animate-pulse">
            Sign Up Now
          </Button>
          </Link>
        </div>
      </section>

      <Footer
        startYear={2010}
        companyName="Nlaak Studios, LLC"
      />
    </div>
  );
};

export default LandingPage;