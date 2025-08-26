import React, { useState } from 'react';
import { Download, Mail, FileText, CheckCircle } from 'lucide-react';
import { UserInfo } from '../App';

interface FinalPageProps {
  userInfo: UserInfo;
}

const FinalPage: React.FC<FinalPageProps> = ({ userInfo }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // In a real app, you would send the email to a backend service
      console.log('Email submitted:', email);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your Personalized Tech Stack Guide
          </h1>
          <p className="text-xl text-gray-600">
            Hello! Here's your complete technology stack documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">Tech Stack Guide PDF</h2>
                </div>
              </div>
              
              <div className="p-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Complete Technology Stack Guide
                  </h3>
                  <p className="text-gray-600 mb-4">
                    A comprehensive 25-page PDF covering all your selected technologies, 
                    best practices, implementation guides, and architecture recommendations.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Frontend Development with React & TypeScript</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Backend Services with Node.js & Express</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Database Design with PostgreSQL & Prisma</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Deployment & DevOps with AWS & Docker</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Development Tools & Best Practices</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF Guide
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
          

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Get Updates
              </h3>
              
              {!isSubmitted ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Enter your email to receive updates about new technologies and best practices.
                  </p>
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Subscribe to Updates
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Thank you!</h4>
                    <p className="text-sm text-gray-600">
                      We've sent your personalized tech stack guide to <strong>{email}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalPage;