import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const formData = await req.formData();
    const file = formData.get('file') as File;

    console.log('Successfully hit backend: ', file);

    if (!file) return failure('No file uploaded', 400);

    const fileExt = file.name.split('.').pop();
    const fileName = `${businessProfileId}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/business-logos/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('contakt_assets') // bucket name
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    if (uploadError) {
      return failure(`${uploadError.message}`, 500);
    }

    console.log('File Path: ', filePath);

    // Generate a public URL
    const { data: urlData } = supabase.storage.from('contakt_assets').getPublicUrl(filePath);

    const responseData = {
      url: urlData.publicUrl,
      path: filePath,
    };

    return success(responseData);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/uploads error:', message);
    return failure(message, 500);
  }
}
