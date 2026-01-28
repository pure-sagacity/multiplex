import { supabaseAdmin } from "@/app/lib/supabase";

const BUCKET_NAME = 'profile_pics';

/**
 * Generates a random filename for the uploaded image
 */
function generateRandomFilename(file: File): string {
    const extension = file.name.split('.').pop();
    const randomString = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    return `${timestamp}_${randomString}.${extension}`;
}

/**
 * Uploads a profile picture to Supabase storage
 * @param file - The image file to upload
 * @returns Object containing the filepath and public URL, or error
 */
export async function uploadProfilePicture(file: File): Promise<{
    success: boolean;
    filepath?: string;
    publicUrl?: string;
    error?: string;
}> {
    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }

        // Generate random filepath
        const filepath = generateRandomFilename(file);

        // Upload to Supabase using admin client for server-side uploads
        const { data, error } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .upload(filepath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filepath);

        return {
            success: true,
            filepath: data.path,
            publicUrl: urlData.publicUrl
        };
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Downloads a profile picture from Supabase storage
 * @param filepath - The path to the file in the bucket
 * @returns Blob of the image file, or error
 */
export async function downloadProfilePicture(filepath: string) {
    try {
        const { data, error } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .download(filepath);

        if (error) {
            throw error;
        }

        return {
            success: true,
            blob: data
        };
    } catch (error) {
        console.error('Error downloading profile picture:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Gets the public URL for a profile picture
 * @param filepath - The path to the file in the bucket
 * @returns The public URL
 */
export function getProfilePictureUrl(filepath: string): string {
    const { data } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filepath);

    return data.publicUrl;
}

/**
 * Deletes a profile picture from Supabase storage
 * @param filepath - The path to the file in the bucket
 * @returns Success status or error
 */
export async function deleteProfilePicture(filepath: string) {
    try {
        const { error } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .remove([filepath]);

        if (error) {
            throw error;
        }

        return {
            success: true
        };
    } catch (error) {
        console.error('Error deleting profile picture:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}