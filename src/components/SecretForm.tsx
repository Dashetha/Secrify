import React, { useState } from 'react';
import { Lock, Clock, Eye, Shield, AlertCircle } from 'lucide-react';
import { SecretCreateRequest } from '../types';

interface SecretFormProps {
  onSecretCreated: (data: any) => void;
  loading?: boolean;
}

const SecretForm: React.FC<SecretFormProps> = ({ onSecretCreated, loading = false }) => {
  const [formData, setFormData] = useState<SecretCreateRequest>({
    message: '',
    password: '',
    expiresIn: '24',
    maxViews: 1,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.message.trim()) {
      setError('Please enter a secret message');
      return;
    }

    try {
      const response = await fetch('/api/secrets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create secret');
      }

      onSecretCreated(data);
    } catch (err: any) {
      setError(err.message || 'Failed to create secret');
    }
  };

  const handleChange = (field: keyof SecretCreateRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Create One-Time Secret</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Secret Message *
          </label>
          <textarea
            id="message"
            rows={6}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Enter your sensitive information here... (passwords, private notes, confidential messages)"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.message.length}/10000 characters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4" />
              Password (Optional)
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Add extra security"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="expiresIn" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Expires In
            </label>
            <select
              id="expiresIn"
              value={formData.expiresIn}
              onChange={(e) => handleChange('expiresIn', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={loading}
            >
              <option value="1">1 Hour</option>
              <option value="6">6 Hours</option>
              <option value="24">24 Hours</option>
              <option value="168">7 Days</option>
            </select>
          </div>

          <div>
            <label htmlFor="maxViews" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Eye className="w-4 h-4" />
              Max Views
            </label>
            <select
              id="maxViews"
              value={formData.maxViews}
              onChange={(e) => handleChange('maxViews', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={loading}
            >
              <option value="1">1 View</option>
              <option value="2">2 Views</option>
              <option value="5">5 Views</option>
              <option value="10">10 Views</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.message.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating Secure Link...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Generate Secure Link
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SecretForm;