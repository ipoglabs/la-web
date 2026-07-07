// src/app/actions/property/addPropertyPost.ts
'use server';

import connectDB from '../../../config/database';
import Post from '../../../models/post';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';

export async function addPost(formData: FormData) {
  await connectDB();

  // --- Parse core fields ---
  const category = (formData.get('category') as string)?.trim() || '';
  const subcategory = (formData.get('subcategory') as string)?.trim() || '';
  const name = (formData.get('name') as string)?.trim() || '';
  const description = (formData.get('description') as string)?.trim() || '';

  // locationData is expected to be a JSON string
  const locationRaw = (formData.get('locationData') as string) || '';
  const location = locationRaw ? JSON.parse(locationRaw) : {};

  const seller_info = {
    name: ((formData.get('seller_info.name') as string) || '').trim(),
    email: ((formData.get('seller_info.email') as string) || '').trim(),
    phone: ((formData.get('seller_info.phone') as string) || '').trim(),
  };


  // --- Collect images (urls + files) ---
  const imageUrlEntries = formData.getAll('imageUrl') as string[];
  const imageFiles = formData.getAll('images') as File[];
  const images: string[] = [...imageUrlEntries];

  for (const file of imageFiles) {
    if (!(file instanceof File) || !file.size || !file.type?.startsWith('image/')) continue;
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(new Uint8Array(buffer)).toString('base64');
    try {
      const result = await cloudinary.uploader.upload(
        `data:${file.type};base64,${base64}`,
        { folder: 'posts' }
      );
      images.push(result.secure_url);
    } catch (uploadErr) {
      console.error('❌ Cloudinary upload failed:', uploadErr);
    }
  }

  // --- Optional fields (may arrive as JSON strings if you stringified on client) ---
  const facilitiesRaw = formData.get('facilities') as string | null;

  const postData = {
    category,
    subcategory,
    name,
    description,
    location,
    seller_info,
    images,

    propertyType: (formData.get('propertyType') as string) || undefined,
    beds: formData.get('beds')
      ? Number(tryParse(formData.get('beds') as string))
      : undefined,
    baths: formData.get('baths')
      ? Number(tryParse(formData.get('baths') as string))
      : undefined,
    rentPrice: formData.get('rentPrice')
      ? Number(tryParse(formData.get('rentPrice') as string))
      : undefined,
    deposit: formData.get('deposit')
      ? Number(tryParse(formData.get('deposit') as string))
      : undefined,
    occupancy: (formData.get('occupancy') as string) || undefined,
    gender_pref: (formData.get('gender_pref') as string) || undefined,
    facilities: facilitiesRaw ? tryParse(facilitiesRaw) : [],
  } as const;

  // --- Validate required fields (matches your Mongoose 'required') ---
  const errors: string[] = [];
  if (!postData.name) errors.push('Title (name) is required');
  if (!postData.description) errors.push('Description is required');
  if (!postData.category) errors.push('Category is required');
  if (!postData.subcategory) errors.push('Subcategory is required');
  if (!postData.location?.address) errors.push('Location address is required');
  if (!postData.seller_info.name) errors.push('Contact name is required');
  if (!postData.seller_info.email) errors.push('Contact email is required');
  if (!postData.seller_info.phone) errors.push('Contact phone is required');

  if (errors.length) {
    console.error('❌ Validation errors:', errors, { postData });
    // Throw a readable error that you surface on the client
    throw new Error(errors.join(' • '));
  }

  // Helpful log while debugging
  console.log('🧩 Saving Post with data:', postData);

  const newPost = new Post(postData);
  await newPost.save();

  revalidatePath('/', 'layout');
  redirect(`/post-details/${newPost._id}`);
}

// Safely parse JSON or return raw string/number
function tryParse(val: string) {
  try {
    return JSON.parse(val);
  } catch {
    return val; // already a primitive
  }
}
