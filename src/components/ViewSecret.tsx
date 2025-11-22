import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, Shield, Eye } from 'lucide-react';

const ViewSecret: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<'validate' | 'password' | 'view' | 'error'>('validate');
  const [password, setPassword] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [secretInfo, setSecretInfo] = useState<any>(null);

  useEffect(() => {
    validateSecret();
  }, [id]);

  const validateSecret = async () => {
    if (!id) {
      setError('Invalid secret ID');
      setStep('error');
      return;
    }

    try {
      const response = await fetch(`/api/secrets/validate/${id}`);
      const data = await response.json();

      if (!response.ok || !data.exists) {
        setError(data.error || 'Secret not found or expired');
        setStep('error');
        return;
      }

      setSecretInfo(data);
      
      if (data.requiresPassword) {
        setStep('password');
      } else {
        await viewSecret();
      }
    } catch (err: any) {
      setError('Failed to validate secret');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const viewSecret = async (userPassword?: string) => {
    if (!id) return;

    setIsLoading(true);
    try {
      // Generate a simple token for demo purposes
      const token = btoa(JSON.stringify({ secretId: id, timestamp: Date.now() }));
      
      const response = await fetch(`/api/secrets/view/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password: userPassword, 
          token 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to view secret');
      }

      setSecret(data.message);
      setStep('view');
      
      // Auto-redirect after viewing
      setTimeout(() => {
        navigate('/');
      }, 10000);
    } catch (err: any) {
      setError(err.message || 'Failed to view secret');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    viewSecret(password);
  };

  if (isLoading && step === 'validate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating secret...</p>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center animate-fade-in">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Secret Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Create New Secret
          </button>
        </div>
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Lock className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Password Required</h2>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Enter the secret password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Decrypting...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  View Secret
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'view') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">Secret Revealed</h2>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm">{secret}</pre>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-center flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              This secret has been destroyed and can no longer be accessed.
              {secretInfo?.viewsRemaining > 0 && ` ${secretInfo.viewsRemaining - 1} views remaining.`}
            </p>
          </div>

          <div className="mt-4 text-center text-gray-500 text-sm">
            <p>You will be redirected to the home page in 10 seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ViewSecret;