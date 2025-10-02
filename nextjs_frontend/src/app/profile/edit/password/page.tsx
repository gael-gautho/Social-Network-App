'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/libs/apiService';
import { toast } from 'sonner';

export default function EditPasswordPage() {
  const [form, setForm] = useState({
    old_password: '',
    new_password1: '',
    new_password2: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!form.old_password) {
      newErrors.push('Old password is required');
    }

    if (!form.new_password1) {
      newErrors.push('New password is required');
    } else if (form.new_password1.length < 8) {
      newErrors.push('New password must be at least 8 characters');
    }

    if (form.new_password1 !== form.new_password2) {
      newErrors.push('The passwords do not match');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setErrors([]);

    const formData = new FormData();
    formData.append('old_password', form.old_password);
    formData.append('new_password1', form.new_password1);
    formData.append('new_password2', form.new_password2);

    const result = await apiService.post('/api/editpassword/', formData);

    if (result?.message === 'success') {

        toast.success('Password updated successfully');
        router.back()
    } else {
      try {
        const errorData = typeof result?.message === 'string' 
          ? JSON.parse(result.message) 
          : result?.message;

        const errorMessages: string[] = [];
        
        for (const key in errorData) {
          if (Array.isArray(errorData[key])) {
            errorData[key].forEach((error: any) => {
              errorMessages.push(error.message || error);
            });
          }
        }
        
        setErrors(errorMessages.length > 0 ? errorMessages : ['Failed to update password']);
      } catch {
        setErrors(['Failed to update password. Please try again.']);
      }
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });

    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (

<div className="max-w-7xl mx-auto grid grid-cols-2 gap-4">
      <div className="main-left">
        <div className="p-12 bg-white border border-gray-200 rounded-lg">
          <h1 className="mb-6 text-2xl font-bold">Edit password</h1>

          <p className="mb-6 text-gray-500">
            Here you can change your password!
          </p>
        </div>
      </div>

    <div className="main-right">
    <div className="p-12 bg-white border border-gray-200 rounded-lg">
      <form className="space-y-6" onSubmit={submitForm}>
        <div>
          <label htmlFor="old_password" className="block text-sm font-medium text-gray-700 mb-2">
            Old password
          </label>
          <input
            id="old_password"
            type="password"
            value={form.old_password}
            onChange={(e) => handleInputChange('old_password', e.target.value)}
            placeholder="Your old password"
            className="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors"
            disabled={isSubmitting}
            autoComplete="current-password"
          />
        </div>

        <div>
          <label htmlFor="new_password1" className="block text-sm font-medium text-gray-700 mb-2">
            New password
          </label>
          <input
            id="new_password1"
            type="password"
            value={form.new_password1}
            onChange={(e) => handleInputChange('new_password1', e.target.value)}
            placeholder="Your new password"
            className="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors"
            disabled={isSubmitting}
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 8 characters
          </p>
        </div>

        <div>
          <label htmlFor="new_password2" className="block text-sm font-medium text-gray-700 mb-2">
            Repeat password
          </label>
          <input
            id="new_password2"
            type="password"
            value={form.new_password2}
            onChange={(e) => handleInputChange('new_password2', e.target.value)}
            placeholder="Repeat password"
            className="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors"
            disabled={isSubmitting}
            autoComplete="new-password"
          />
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm">
                    {error}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </form>
    </div>
    </div>

</div>


  );
}