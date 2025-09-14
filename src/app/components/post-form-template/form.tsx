'use client';

import { useState } from 'react';
import LocationPickerMap from '../LocationPickerMap';
import { addPost } from '../../../app/actions/addPost';
// import { addProperty } from '@/actions/addProperty'; // Adjust path to where your action lives

interface Props {
  category: string;
  subcategory: string;
}

export default function PostFormTemplate({ category, subcategory }: Props) {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  return (
    <form
      method="POST"
      encType="multipart/form-data"
      className="space-y-6"
      action={addPost}
    >
      <h2 className="text-2xl font-semibold mb-4">Add Post</h2>

      {/* Hidden category & subcategory input */}
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="subcategory" value={subcategory} />
      <input type="hidden" name="locationData" value={location ? JSON.stringify(location) : ''} />

      {/* Listing Name */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">
          Listing Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="border rounded w-full py-2 px-3"
          placeholder="eg. Beautiful Apartment In Miami"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="border rounded w-full py-2 px-3"
          rows={4}
          placeholder="Add an optional description of your property"
        ></textarea>
      </div>

      {/* Location Picker */}
      <div className="mb-20">
        <label className="block font-bold mb-2">Select Location</label>
        <LocationPickerMap onLocationSelect={(loc) => setLocation(loc)} />
        {location && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {location.address}
          </p>
        )}
      </div>

      {/* Seller Info */}
      <div>
        <label htmlFor="seller_name" className="block text-gray-700 font-bold mb-2">
          Seller Name
        </label>
        <input
          type="text"
          id="seller_name"
          name="seller_info.name"
          className="border rounded w-full py-2 px-3"
          placeholder="Name"
        />
      </div>
      <div>
        <label htmlFor="seller_email" className="block text-gray-700 font-bold mb-2">
          Seller Email
        </label>
        <input
          type="email"
          id="seller_email"
          name="seller_info.email"
          className="border rounded w-full py-2 px-3"
          placeholder="Email address"
          required
        />
      </div>
      <div>
        <label htmlFor="seller_phone" className="block text-gray-700 font-bold mb-2">
          Seller Phone
        </label>
        <input
          type="tel"
          id="seller_phone"
          name="seller_info.phone"
          className="border rounded w-full py-2 px-3"
          placeholder="Phone"
        />
      </div>

      {/* Images Upload */}
      <div>
        <label htmlFor="images" className="block text-gray-700 font-bold mb-2">
          Images (Select up to 4 images)
        </label>
        <input
          type="file"
          id="images"
          name="images"
          className="border rounded w-full py-2 px-3"
          accept="image/*"
          multiple
          required
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
