"use client";

import { useState } from "react";

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="card max-w-lg w-full mx-auto">
          <h2 className="text-xl font-bold text-destructive mb-4">
            Something went wrong
          </h2>
          <p className="mb-4">An error occurred in the application.</p>
          {error && (
            <pre className="p-4 bg-secondary rounded-md text-sm overflow-auto max-h-40">
              {error.toString()}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mt-4 w-full"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onError={(error) => {
        console.error("Error caught by ErrorBoundary:", error);
        setError(error);
        setHasError(true);
      }}
    >
      {children}
    </div>
  );
}
