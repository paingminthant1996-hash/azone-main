import { Suspense } from "react";

export default function PurchaseSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-azone-black flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-azone-purple"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

