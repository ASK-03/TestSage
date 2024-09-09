import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/navigation";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-primary">
      <Navigation isHero />
      <section className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Your Ultimate Testing Companion
        </h2>
        <p className="text-lg mb-6">
          TestSage helps you generate comprehensive test cases and instructions
          from your screenshots. Streamline your testing process with AI-powered
          insights.
        </p>
        <Image
          src="/testsage-hero.png"
          alt="TestSage Hero"
          width={600}
          height={400}
          className="rounded-lg shadow-lg shadow-primary/20 dark:shadow-primary/40"
        />
      </section>

      {/* Features Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Easy Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Upload multiple screenshots effortlessly to generate detailed
                  test cases.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Leverage advanced AI to analyze screenshots and provide
                  accurate testing instructions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Test Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Get detailed test cases with pre-conditions, steps, and
                  expected results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-primary-background text-primary py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} TestSage. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
