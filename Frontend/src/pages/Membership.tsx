import { Check, Users, Shield, Heart, Star, Gear, HardHat, Schematic, Networking } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Membership() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-accent to-warning to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Membership Details
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Comprehensive benefits designed exclusively for engineering
            professionals and their families
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Membership Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our membership provides comprehensive coverage and support for you
              and your loved ones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-steel-800 bg-engineering-grid p-6 rounded-xl border-2 border-blue-200">
              <Users className="text-warning mb-4" size={40} />
              <h3 className="text-xl font-semibold text-steel-100 mb-2">
                Equipment Grant Support
              </h3>
              <p className="text-steel-50">
                Get financial assistance for tools, software, and field
                equipment essential to your practice as a professional engineer.
              </p>
            </div>

            <div className="bg-blueprint p-6 rounded-xl border-2 border-accent">
              <HardHat className="text-accent mb-4" size={40} />
              <h3 className="text-xl font-semibold text-white mb-2">
                Project Insurance
              </h3>
              <p className="text-steel-100">
                Safeguard your technical projects with professional insurance,
                liability protection, and legal support for members.
              </p>
            </div>

            <div className="bg-blueprint p-6 rounded-xl border-2 border-blue-200">
              <Shield className="text-warning mb-4" size={40} />
              <h3 className="text-xl font-semibold text-white mb-2 mb-2">
                Nominee Technical Protection
              </h3>
              <p className="text-steel-100">
                Designated nominee receives comprehensive benefits and support
              </p>
            </div>

            <div className="bg-blueprint p-6 rounded-xl border-2 border-accent">
              <Star className="text-accent mb-4" size={40} />
              <h3 className="text-xl font-semibold text-white mb-2 mb-2">
                Priority Support
              </h3>
              <p className="text-steel-100">
                24/7 dedicated support team for all member queries and needs
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-accent to-warning rounded-2xl p-8 md:p-12 text-white mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              What's Included for Engineers
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Primary Member (Engineer) Benefits
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Comprehensive technical support scheme</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Professional liability and field safety support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Engineering practice support services</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Annual technical check/inspection coverage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>
                      Exclusive networking and professional development events
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Family Technical Coverage
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Counseling, education and wellness programs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Emergency family assistance</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Family health and wellness programs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Educational support for dependents</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Counseling and support services</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Nominee Technical Benefits
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Technical and legal claims processing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Full benefit transfer provisions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Legal and documentation support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Priority claims processing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Dedicated support coordinator</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Additional Engineering Services
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>
                      Professional engineering networking opportunities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Continuing engineering education support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>
                      Technical insurance and project planning assistance
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-3 flex-shrink-0 mt-1" size={20} />
                    <span>Member exclusive events and seminars</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Eligibility Criteria for Engineers
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Who Can Join?
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Check
                      className="text-blue-600 mr-3 flex-shrink-0 mt-1"
                      size={20}
                    />
                    <span>
                      Registered graduate engineers (B.E., B.Tech., diploma,
                      M.E., etc.)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      className="text-blue-600 mr-3 flex-shrink-0 mt-1"
                      size={20}
                    />
                    <span>
                      Valid engineering council registration/license (if
                      required)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      className="text-blue-600 mr-3 flex-shrink-0 mt-1"
                      size={20}
                    />
                    <span>
                      Currently practicing, employed or retired professionals
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Required Documents
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Check
                      className="text-blue-600 mr-3 flex-shrink-0 mt-1"
                      size={20}
                    />
                    <span>Valid government-issued ID proof</span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      className="text-blue-600 mr-3 flex-shrink-0 mt-1"
                      size={20}
                    />
                    <span>Professional engineering degree certificates</span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      className="text-blue-600 mr-3 flex-shrink-0 mt-1"
                      size={20}
                    />
                    <span>
                      Engineering council (or board) registration certificate
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      className="text-blue-600 mr-3 flex-shrink-0 mt-1"
                      size={20}
                    />
                    <span>Recent passport-size photograph</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Join?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Take the first step towards securing your future and that of your
              family
            </p>
            <Link
              to="/join"
              className="inline-block bg-accent text-white px-10 py-4 rounded-lg font-semibold hover:bg-warning transition-colors text-lg"
            >
              Apply for Membership
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
