import { UserPlus, FileCheck, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-accent to-warning to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Join erswelfareindia in four simple steps and start enjoying
            comprehensive engineering benefits for you and your family
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Simple Process, Lasting Benefits
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              Our streamlined process ensures you can become a member quickly
              and start enjoying benefits right away
            </p>
          </div>

          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-start">
                  <div className="bg-warning text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                      <UserPlus className="mr-3 text-warning" size={28} />
                      Complete Registration
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Fill out our comprehensive registration form with your
                      personal details, professional credentials, and family
                      information. The form is designed to be straightforward
                      and user-friendly.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>
                          Provide personal and engineering credentials
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>
                          Upload required technical certificates and
                          documentation
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>Add nominee and family member details</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80"
                  alt="Engineering Registration"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="https://images.pexels.com/photos/6289065/pexels-photo-6289065.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Document Verification"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <div className="flex items-start">
                  <div className="bg-warning text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                      <FileCheck className="mr-3 text-warning" size={28} />
                      Document Verification
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Our team will review your submitted documents and
                      credentials to verify your professional status. This
                      process typically takes 2-3 business days.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>
                          Professional credentials technical verification
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>Document authenticity engineering check</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>Email confirmation upon technical approval</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-start">
                  <div className="bg-warning text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                      <CreditCard className="mr-3 text-warning" size={28} />
                      Complete Payment
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Once approved, complete your membership payment through
                      our secure payment gateway. Multiple payment options are
                      available for your convenience.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>Secure online payment processing</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>Multiple payment method options</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>Instant payment confirmation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src="https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Payment"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="https://thumbs.dreamstime.com/b/young-teen-technician-industry-engineer-student-learning-using-metal-machine-university-workshop-plant-factory-steel-cutting-402020205.jpg"
                  alt="Membership Benefits"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <div className="flex items-start">
                  <div className="bg-warning text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 mr-4">
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                      <Shield className="mr-3 text-warning" size={28} />
                      Enjoy Full Benefits
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Your membership becomes active immediately upon payment
                      confirmation. Access all benefits and support services
                      right away.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>Immediate access to all member benefits</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>Member portal login credentials</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-warning mr-2 flex-shrink-0 mt-1"
                          size={18}
                        />
                        <span>24/7 support and assistance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-accent to-warning text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started as an Engineer?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of engineering professionals who trust
            erswelfareindia for their technical and financial future
          </p>
          <Link
            to="/join"
            className="inline-block bg-white text-accent px-10 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
          >
            Start Your Application
          </Link>
        </div>
      </section>
    </div>
  );
}
