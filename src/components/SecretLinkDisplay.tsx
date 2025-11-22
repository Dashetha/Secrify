import React, { useState } from 'react';
import { Copy, Check, Shield, Clock, Eye, ExternalLink } from 'lucide-react';
import { copyToClipboard, formatDate } from '../../utils/helpers';

interface SecretLinkDisplayProps {
  secretData: {
    secretId: string;
    accessToken: string;
    expiresAt: string;
    url: string;
  };
  onCreateNew: () => void;
}

const SecretLinkDisplay: React.FC<SecretLinkDisplayProps> = ({ secretData, onCreateNew }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openSecretLink = () => {
    window.open(secretData.url, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Secure Link Created!</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Secure Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={secretData.url}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(secretData.url)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={openSecretLink}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Expires</p>
              <p className="text-sm text-gray-600">{formatDate(secretData.expiresAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <Eye className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Access Token</p>
              <p className="text-sm text-gray-600 font-mono truncate" title={secretData.accessToken}>
                {secretData.accessToken.substring(0, 20)}...
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Important Security Notes
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• This link can only be viewed {secretData.accessToken ? 'the specified number of times' : 'once'}</li>
            <li>• The secret will be automatically deleted after viewing</li>
            <li>• Share this link securely with the intended recipient</li>
            <li>• The link will expire on {formatDate(secretData.expiresAt)}</li>
            <li>• Keep the access token safe - it's required to view the secret</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCreateNew}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Create Another Secret
          </button>
          <button
            onClick={() => handleCopy(secretData.url)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Link Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecretLinkDisplay;