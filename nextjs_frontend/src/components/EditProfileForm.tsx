'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/libs/apiService';
import { toast } from 'sonner';
import { setRefreshToken } from '@/libs/actions';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface EditProfileFormProps {
  user: User;
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!form.email.trim()) {
      newErrors.push('Your e-mail is missing');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.push('Please enter a valid e-mail address');
    }

    if (!form.name.trim()) {
      newErrors.push('Your name is missing');
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
    
    if (fileInputRef.current?.files?.[0]) {
      formData.append('avatar', fileInputRef.current.files[0]);
    }
    
    formData.append('name', form.name.trim());
    formData.append('email', form.email.trim());

    const result = await apiService.post('/api/editprofile/', formData);

    if (result && result.message === 'information updated') {
      if (result.refresh) {
        await setRefreshToken(result.refresh);
      }
      
      toast.success('Profile updated successfully');
      console.log('Profile updated successfully');
      
      router.refresh();
      // router.back();
      
    } else {
      setErrors([result?.message || 'Failed to update profile. Please try again']);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="p-12 bg-white border border-gray-200 rounded-lg">
      <form className="space-y-6" onSubmit={submitForm}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your full name"
            className="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Your e-mail address"
            className="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
            Avatar
          </label>
          <input
            id="avatar"
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="w-full mt-2 py-2 px-4 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer cursor-pointer"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-500">
            Accepted formats: JPG, PNG, GIF (max 5MB)
          </p>
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
  );
}