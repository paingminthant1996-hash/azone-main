import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-azone-black flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-azone-gray mb-6">
          Template Not Found
        </h2>
        <p className="text-azone-gray mb-8 max-w-md mx-auto">
          The template you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/templates"
          className="inline-block px-6 py-3 bg-azone-purple text-white rounded-lg font-semibold hover:bg-azone-purple/90 transition-colors"
        >
          Browse All Templates
        </Link>
      </div>
    </div>
  );
}

