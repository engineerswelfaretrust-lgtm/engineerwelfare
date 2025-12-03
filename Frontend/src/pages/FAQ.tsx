import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-blue-600 flex-shrink-0" size={24} />
        ) : (
          <ChevronDown className="text-blue-600 flex-shrink-0" size={24} />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const faqs = [
    {
      question: 'Who is eligible to join erswelfareindia?',
      answer: 'erswelfareindia membership is open to all registered engineers who hold valid degrees (B.E., B.Tech., diploma, M.E., etc.) and have an active registration with their respective engineering council/board. Both employed and self-employed professionals are eligible to join.',
    },
    {
      question: 'What documents do I need to submit for registration?',
      answer: 'You need to submit a valid government-issued ID proof, professional engineering degree certificates, engineering council or board registration certificate, and a recent passport-size photograph. All documents should be clear and legible for verification purposes.',
    },
    {
      question: 'How long does the verification process take?',
      answer: 'The document verification process typically takes 2-3 business days. Once your documents are verified, you will receive an email confirmation with further instructions for completing your membership.',
    },
    {
      question: 'Can I include my family members in the scheme?',
      answer: 'Yes, erswelfareindia allows you to include up to 2 family members in your membership. Family members can be your spouse, children, or parents. Each family member will need to provide basic personal information during registration.',
    },
    {
      question: 'What is a nominee and why is it required?',
      answer: 'A nominee is the person designated to receive the benefits of your membership in case of unforeseen circumstances. Providing nominee details ensures that your benefits are transferred smoothly to your chosen beneficiary. It is mandatory to designate a nominee during registration.',
    },
    {
      question: 'What benefits do members receive?',
      answer: 'Members receive comprehensive technical and financial support, project assistance fund access, professional liability support, practice support services, workplace inspection coverage, and much more. Family members also receive extended coverage including educational support and technical wellness programs.',
    },
    {
      question: 'How much does membership cost?',
      answer: 'Membership fees vary based on coverage level and additional family members included. For detailed pricing information, please contact our support team or visit our office. Flexible payment options are available.',
    },
    {
      question: 'Is there a renewal process for membership?',
      answer: 'Yes, erswelfareindia memberships are renewed annually. Members will receive renewal notifications in advance, with instructions for completing the renewal process online or through our office.',
    },
    {
      question: 'Can I change my nominee details after registration?',
      answer: 'Yes, you can update your nominee details at any time by logging into your member portal or by contacting our support team. Changes typically take effect within 24-48 hours after verification.',
    },
    {
      question: 'What happens if I need to make a claim?',
      answer: 'If you need to make a claim, simply contact our support team or submit a claim request through your member portal. Our dedicated claims processing team will guide you through the process and ensure quick resolution.',
    },
    {
      question: 'Is there a waiting period for benefits to activate?',
      answer: 'No, your membership benefits become active immediately upon payment confirmation. You can start accessing all member services and support from day one.',
    },
    {
      question: 'Can I cancel my membership?',
      answer: 'Yes, you can cancel your membership at any time. However, please note that membership fees are non-refundable. For cancellation requests, please contact our support team who will assist you with the process.',
    },
    {
      question: 'How do I contact support if I have questions?',
      answer: 'Our support team is available 24/7 to assist you. You can reach us via phone at +1 (555) 765-4321, email at erswelfareindia@gmail.com, or through the contact form on our Contact Us page. We typically respond within 24 hours.',
    },
    {
      question: 'Are there any age restrictions for membership?',
      answer: 'There are no strict age restrictions for primary members. However, family members included in your plan must meet certain age criteria. Children can be covered up to 25 years of age if they are students, or 21 years otherwise.',
    },
    {
      question: 'What makes erswelfareindia different from other schemes?',
      answer: 'erswelfareindia is exclusively designed for engineers by engineers. We understand the unique challenges faced by engineering professionals, and our benefits are tailored to address these needs. Our transparent operations, technical coverage, and strong professional community set us apart.',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-accent to-warning text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Find answers to common questions about erswelfareindia membership,
            engineering benefits, and processes
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-lg text-gray-600">
              Can't find what you're looking for? Contact our support team for
              assistance.
            </p>
          </div>

          <div>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>

          <div className="mt-12 bg-steel-800 bg-engineering-grid border border-accent rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-steel-100 mb-4">
              Still Have Engineering Questions?
            </h3>
            <p className="text-steel-50 mb-6">
              Our technical support team is here to help you—reach out for
              project or membership queries.
            </p>
            <a
              href="/contact"
              className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-warning transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
