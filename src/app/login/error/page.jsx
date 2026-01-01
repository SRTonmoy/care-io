'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages = {
    AccessDenied: "Access denied. Please check your OAuth configuration.",
    Configuration: "There's a problem with the server configuration.",
    OAuthSignin: "Error in OAuth sign in process.",
    OAuthCallback: "Error in OAuth callback process.",
    OAuthCreateAccount: "Could not create OAuth account.",
    EmailCreateAccount: "Could not create email account.",
    Callback: "Error in the OAuth callback.",
    OAuthAccountNotLinked: "Email already in use with another account.",
    EmailSignin: "Check your email address.",
    CredentialsSignin: "Sign in failed. Check your credentials.",
    SessionRequired: "Please sign in to access this page.",
    Default: "An unknown error occurred.",
  };

  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h1>
          <p className="text-gray-600">{errorMessage}</p>
          {error && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <code className="text-sm text-gray-700">Error code: {error}</code>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors ml-4"
          >
            Go Home
          </Link>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
          <h3 className="font-medium text-yellow-800 mb-2">Troubleshooting Tips:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Make sure Google OAuth credentials are correctly configured</li>
            <li>• Check that redirect URIs are correctly set in Google Cloud Console</li>
            <li>• Verify environment variables are set correctly</li>
            <li>• Ensure NEXTAUTH_URL matches your application URL</li>
          </ul>
        </div>
      </div>
    </div>
  );
}