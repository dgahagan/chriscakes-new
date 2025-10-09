'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ContactFormData {
  eventStartDate: string;
  eventStartTime: string;
  eventEndTime: string;
  numberToServe: string;
  organizationName: string;
  servingAddress: string;
  city: string;
  state: string;
  zip: string;
  contactName: string;
  contactPhone: string;
  eventPhone: string;
  contactEmail: string;
  hasVolunteers: boolean;
  isFundraiser: boolean;
  typeOfFundraiser: string;
  typeOfBreakfast: string;
  typeOfMenusNMore: string;
  whereDidYouHear: string;
  message: string;
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message:
            'Thank you for your inquiry! We will contact you shortly to discuss your event.',
        });
        reset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to send message. Please try again.',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again or call us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Event Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="eventStartDate"
            className="block text-sm font-medium text-gray-700"
          >
            Event Start Date
          </label>
          <input
            type="date"
            id="eventStartDate"
            {...register('eventStartDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="eventStartTime"
            className="block text-sm font-medium text-gray-700"
          >
            Event Start Time
          </label>
          <input
            type="time"
            id="eventStartTime"
            {...register('eventStartTime')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="eventEndTime"
            className="block text-sm font-medium text-gray-700"
          >
            Event End Time
          </label>
          <input
            type="time"
            id="eventEndTime"
            {...register('eventEndTime')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Number to Serve */}
      <div>
        <label
          htmlFor="numberToServe"
          className="block text-sm font-medium text-gray-700"
        >
          Number of people to serve?
        </label>
        <input
          type="text"
          id="numberToServe"
          {...register('numberToServe')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Organization Name */}
      <div>
        <label
          htmlFor="organizationName"
          className="block text-sm font-medium text-gray-700"
        >
          Organization Name
        </label>
        <input
          type="text"
          id="organizationName"
          {...register('organizationName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Address Fields */}
      <div>
        <label
          htmlFor="servingAddress"
          className="block text-sm font-medium text-gray-700"
        >
          Serving Address
        </label>
        <input
          type="text"
          id="servingAddress"
          {...register('servingAddress')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            {...register('city')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            {...register('state')}
            defaultValue="MI"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="zip"
            className="block text-sm font-medium text-gray-700"
          >
            Zip Code
          </label>
          <input
            type="text"
            id="zip"
            {...register('zip')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <label
          htmlFor="contactName"
          className="block text-sm font-medium text-gray-700"
        >
          Contact Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="contactName"
          {...register('contactName', { required: 'Contact name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.contactName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.contactName.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contactPhone"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="contactPhone"
            {...register('contactPhone', {
              required: 'Contact phone is required',
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.contactPhone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.contactPhone.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="eventPhone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone number for day of event
          </label>
          <input
            type="tel"
            id="eventPhone"
            {...register('eventPhone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contactEmail"
          className="block text-sm font-medium text-gray-700"
        >
          Contact Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="contactEmail"
          {...register('contactEmail', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.contactEmail && (
          <p className="mt-1 text-sm text-red-600">
            {errors.contactEmail.message}
          </p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasVolunteers"
            {...register('hasVolunteers')}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="hasVolunteers"
            className="ml-3 text-sm font-medium text-gray-700"
          >
            Will you have 2-3 volunteers?
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isFundraiser"
            {...register('isFundraiser')}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="isFundraiser"
            className="ml-3 text-sm font-medium text-gray-700"
          >
            Is this event a fundraiser?
          </label>
        </div>
      </div>

      {/* Menu Selection Dropdowns */}
      <div>
        <label
          htmlFor="typeOfFundraiser"
          className="block text-sm font-medium text-gray-700"
        >
          Type of fundraiser you wish to book?
        </label>
        <select
          id="typeOfFundraiser"
          {...register('typeOfFundraiser')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a fundraiser type</option>
          <option value="Original Chris Cakes">Original Chris Cakes</option>
          <option value="Hot Dog Bash">Hot Dog Bash</option>
          <option value="Coney Night">Coney Night</option>
          <option value="Spaghetti Dinner">Spaghetti Dinner</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="typeOfBreakfast"
          className="block text-sm font-medium text-gray-700"
        >
          Type of Premier Breakfast you wish to book?
        </label>
        <select
          id="typeOfBreakfast"
          {...register('typeOfBreakfast')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a breakfast type</option>
          <option value="Easy Breezy">Easy Breezy</option>
          <option value="Cakes and Eggs">Cakes and Eggs</option>
          <option value="Top Cake">Top Cake</option>
          <option value="Chris Cakes Deluxe">Chris Cakes Deluxe</option>
          <option value="Big Chris">Big Chris</option>
          <option value="French Toast Lite">French Toast Lite</option>
          <option value="French Toast and Eggs">French Toast and Eggs</option>
          <option value="Biscuits and Gravy">Biscuits and Gravy</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="typeOfMenusNMore"
          className="block text-sm font-medium text-gray-700"
        >
          Type of Menus n More you wish to book?
        </label>
        <select
          id="typeOfMenusNMore"
          {...register('typeOfMenusNMore')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a menu type</option>
          <option value="Box Lunches">Box Lunches</option>
          <option value="Dogs N More">Dogs N More</option>
          <option value="Coneys N More">Coneys N More</option>
          <option value="Taco Bar/ Nacho Bar">Taco Bar/ Nacho Bar</option>
          <option value="Brats N More">Brats N More</option>
          <option value="Burgers N More">Burgers N More</option>
          <option value="Burgers N Dogs">Burgers N Dogs</option>
          <option value="Burgers N Brats">Burgers N Brats</option>
          <option value="Grill Chicken N More">Grill Chicken N More</option>
          <option value="Pasta N More">Pasta N More</option>
          <option value="BBQ N More">BBQ N More</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="whereDidYouHear"
          className="block text-sm font-medium text-gray-700"
        >
          Where did you hear about us?
        </label>
        <select
          id="whereDidYouHear"
          {...register('whereDidYouHear')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select an option</option>
          <option value="Word of Mouth">Word of Mouth</option>
          <option value="Google">Google</option>
          <option value="Facebook">Facebook</option>
          <option value="Twitter">Twitter</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          {...register('message')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Tell us more about your event..."
        />
      </div>

      {/* Status Messages */}
      {submitStatus.type && (
        <div
          className={`rounded-md p-4 ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#dc143c] hover:bg-[#b01030] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc143c] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
        </button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        We typically respond within 24 hours. For urgent requests, please call
        us directly.
      </p>
    </form>
  );
}
