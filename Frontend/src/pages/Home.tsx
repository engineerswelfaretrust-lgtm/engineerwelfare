import { Link } from 'react-router-dom';
import { Shield, Users, Heart, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  // removed backend status and doctors count display
  return (
    <div className="min-h-screen">
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(30,41,59,0.8), rgba(52,94,144,0.75)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1650&q=80')`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Building Engineers' Futures Together
            </h1>
            <p className="text-xl mb-8 text-white">
              Join erswelfareindia – India’s community for engineers. Advance
              your career, access exclusive technical benefits, and build a
              secure future for you and your family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/join"
                className="bg-white text-accent px-8 py-3 rounded-lg font-semibold hover:text-warning transition-colors text-center flex items-center justify-center"
              >
                Join Now <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/how-it-works"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-warning transition-colors text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {/* Use local image placed at public/images/medical-team.jpg (replace with your old image file) */}
              <img
                src="https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=800&q=80"
                alt="Engineering Team Collaboration"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-steel-900 mb-6">
                For Engineers, By Engineers
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle
                    className="text-warning mr-3 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <span className="text-steel-700">
                    Technical Support for Real-World Projects
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    className="text-warning mr-3 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <span className="text-steel-700">
                    Family & Nominee Security–Tailored to Engineering Risks
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    className="text-warning mr-3 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <span className="text-steel-700">
                    Up-skilling, Certifications & Transparent Policies
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle
                    className="text-warning mr-3 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <span className="text-steel-700">
                    Expert Help Desk, 24/7 Project Assistance
                  </span>
                </li>
              </ul>
              <Link
                to="/membership"
                className="inline-block mt-8 bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-warning transition-colors"
              >
                View Membership Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose erswelfareindia?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive support and benefits tailored
              specifically for engineering professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blueprint bg-engineering-grid p-8 rounded-xl hover:shadow-lg transition-shadow border-2 border-steel-200">
              <div className="bg-amber-400 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-accent">
                Project Insurance
              </h3>
              <p className="text-steel-100 leading-relaxed">
                Financial and liability support for technical projects, site
                risks, and engineering ventures.
              </p>
            </div>

            <div className="bg-blueprint bg-engineering-grid p-8 rounded-xl hover:shadow-lg transition-shadow border-2 border-steel-200">
              <div className="bg-accent w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-accent">
                Career Networking
              </h3>
              <p className="text-steel-100 leading-relaxed">
                Connect with engineers, find mentors, and unlock career
                opportunities in our national network.
              </p>
            </div>

            <div className="bg-blueprint bg-engineering-grid p-8 rounded-xl hover:shadow-lg transition-shadow border-2 border-steel-200">
              <div className="bg-steel-500 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Heart className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-accent">
                Technical Benefits
              </h3>
              <p className="text-steel-100 leading-relaxed">
                Exclusive learning resources, technical seminars,
                certifications, and wellness support for engineers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blueprint text-white bg-engineering-grid">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Take the first step towards securing your future and joining a
            supportive community of engineering professionals.
          </p>
          <Link
            to="/join"
            className="inline-block bg-white text-accent px-10 py-4 rounded-lg font-semibold hover:text-warning transition-colors text-lg"
          >
            Start Your Application Today
          </Link>
        </div>
      </section>
    </div>
  );
}
