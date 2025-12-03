import { Target, Eye, Award, TrendingUp } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-accent to-warning text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About erswelfareindia
          </h1>
          <p className="text-xl text-black max-w-3xl">
            Engineering Professionals Self Support Scheme - Empowering technical
            professionals through mutual support and comprehensive benefits
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                erswelfareindia was founded with a singular vision: to create a
                comprehensive support system exclusively for engineering
                professionals. Understanding the unique challenges faced by
                engineers and technicians, we developed a scheme that addresses
                their specific needs.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our organization brings together experienced engineering
                professionals, financial experts, and support staff to deliver
                exceptional service and meaningful benefits to our members.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, we proudly serve thousands of engineering professionals
                across the country, providing them with financial security,
                community support, and peace of mind.
              </p>
            </div>
            <div>
              <img
                src="https://i.pinimg.com/736x/98/91/a1/9891a147d9d29846153c1192058cf812.jpg"
                alt="Engineering Team Planning"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-blueprint rounded-lg border-2 border-accent">
              <div className="bg-warning w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-steel-100 mb-2">
                Our Mission
              </h3>
              <p className="text-steel-50">
                Empower Indian engineers with networking, insurance, technical,
                and financial support for domestic and global projects.
              </p>
            </div>

            <div className="text-center p-6 bg-blueprint rounded-lg border-2 border-blue-200">
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-steel-100 mb-2">
                Our Vision
              </h3>
              <p className="text-steel-50">
                To be the most trusted support scheme for technical
                professionals nationwide
              </p>
            </div>

            <div className="text-center p-6 bg-blueprint rounded-lg border-2 border-accent">
              <div className="bg-warning w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-steel-100 mb-2">
                Our Values
              </h3>
              <p className="text-steel-50">
                Integrity, transparency, and unwavering commitment to our
                members
              </p>
            </div>

            <div className="text-center p-6 bg-blueprint rounded-lg border-2 border-blue-200">
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-steel-100 mb-2">
                Our Growth
              </h3>
              <p className="text-steel-50">
                Continuously expanding benefits and services for our growing
                community
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-accent to-warning text-white rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6">Why We're Different</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Professional Focus
                </h3>
                <p className="text-black leading-relaxed">
                  Unlike general support schemes, we focus exclusively on the
                  needs and challenges of engineering professionals, ensuring
                  our benefits are truly relevant.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
                <p className="text-black leading-relaxed">
                  Our scheme is built on the principle of mutual support, where
                  engineering professionals help each other through
                  contributions and shared resources.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Transparent Operations
                </h3>
                <p className="text-black leading-relaxed">
                  We maintain complete transparency in our operations, ensuring
                  members understand exactly how their contributions are managed
                  and utilized.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Comprehensive Coverage
                </h3>
                <p className="text-black leading-relaxed">
                  Our benefits extend beyond individual members to include
                  family coverage and nominee support, providing complete peace
                  of mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
