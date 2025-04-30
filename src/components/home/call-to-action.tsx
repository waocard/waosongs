// src/components/home/call-to-action.tsx
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-2xl p-12 text-center backdrop-blur-sm">
        <h2 className="text-3xl text-pink-400 font-bold mb-6">Ready to Create Your Unique Song within 30 minutes?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Start your musical journey today and give the gift of personalized music that will be cherished for years to come.
        </p>
        <Link
          href="/order"
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium text-lg hover:opacity-90 transition inline-block text-white"
        >
          Get Started Now
        </Link>
      </div>
    </section>
  );
}