import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SecretForm from './components/SecretForm';
import SecretLinkDisplay from './components/SecretLinkDisplay';
import ViewSecret from './components/ViewSecret';
import { Shield, Lock, Zap } from 'lucide-react';

function App() {
  const [secretData, setSecretData] = useState<any>(null);

  const handleSecretCreated = (data: any) => {
    setSecretData(data);
  };

  const handleCreateNew = () => {
    setSecretData(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-subtle">
        {/* Premium Header */}
        <header className="glass border-b border-gray-100/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-xl shadow-soft">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">OneTimeSecret</h1>
                  <p className="text-xs text-gray-500">Secure • Private • Encrypted</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center gap-1">
                <a href="#features" className="nav-link">Features</a>
                <a href="#security" className="nav-link">Security</a>
                <a href="#how-it-works" className="nav-link">How it Works</a>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={
              <div className="space-y-12">
                {/* Hero Section */}
                <section className="text-center max-w-4xl mx-auto animate-fade-in">
                  <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Zap className="w-4 h-4" />
                    Military-Grade Encryption
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Share Secrets{' '}
                    <span className="gradient-text">Securely</span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Send sensitive information via encrypted, self-destructing links. 
                    Your secrets are protected with AES-256 encryption and automatically 
                    deleted after viewing.
                  </p>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                        <Lock className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">End-to-End Encrypted</h3>
                      <p className="text-gray-600 text-sm">AES-256 encryption ensures maximum security</p>
                    </div>
                    
                    <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">Auto-Destruct</h3>
                      <p className="text-gray-600 text-sm">Secrets automatically delete after being viewed</p>
                    </div>
                    
                    <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                        <Zap className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">No Registration</h3>
                      <p className="text-gray-600 text-sm">Completely anonymous - no account required</p>
                    </div>
                  </div>
                </section>

                {/* Main Content */}
                <section className="max-w-4xl mx-auto">
                  {secretData ? (
                    <SecretLinkDisplay secretData={secretData} onCreateNew={handleCreateNew} />
                  ) : (
                    <SecretForm onSecretCreated={handleSecretCreated} />
                  )}
                </section>

                {/* Security Section */}
                <section className="max-w-4xl mx-auto text-center">
                  <div className="card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Protect Your Secrets</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-sm">1</span>
                          </div>
                          <span className="font-medium text-gray-800">Client-Side Encryption</span>
                        </div>
                        <p className="text-gray-600 text-sm ml-11">Your data is encrypted in the browser before sending to our servers</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-sm">2</span>
                          </div>
                          <span className="font-medium text-gray-800">Zero-Knowledge Architecture</span>
                        </div>
                        <p className="text-gray-600 text-sm ml-11">We never have access to your unencrypted secrets</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-sm">3</span>
                          </div>
                          <span className="font-medium text-gray-800">Automatic Deletion</span>
                        </div>
                        <p className="text-gray-600 text-sm ml-11">Secrets are permanently deleted after being viewed or expiring</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-sm">4</span>
                          </div>
                          <span className="font-medium text-gray-800">No Metadata Retention</span>
                        </div>
                        <p className="text-gray-600 text-sm ml-11">We don't store any identifying information about users</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            } />
            <Route path="/view/:id" element={<ViewSecret />} />
          </Routes>
        </main>

        {/* Premium Footer */}
        <footer className="bg-white border-t mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold gradient-text">OneTimeSecret</span>
                </div>
                <p className="text-gray-600 max-w-md">
                  The most secure way to share sensitive information. 
                  Your privacy and security are our top priorities.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="#" className="hover:text-primary-600 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-primary-600 transition-colors">Security</a></li>
                  <li><a href="#" className="hover:text-primary-600 transition-colors">API</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="#" className="hover:text-primary-600 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-primary-600 transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
              <p>© 2024 OneTimeSecret. All rights reserved. Built with security in mind.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;