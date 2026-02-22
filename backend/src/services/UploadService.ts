/**
 * Upload Service - Cloudinary
 */

import cloudinary from '../config/cloudinary';
import { AppError } from '../utils/AppError';

export class UploadService {
  async uploadImage(fileBuffer: Buffer, folder: string = 'barbearia_web'): Promise<string> {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(fileBuffer);
      });

      return result.secure_url;
    } catch (error: any) {
      console.error('Erro no upload Cloudinary:', error.message);
      throw new AppError('Erro ao fazer upload da imagem', 500);
    }
  }

  async deleteImage(publicUrl: string): Promise<void> {
    try {
      // Extrair public_id da URL do Cloudinary
      const parts = publicUrl.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex === -1) return;

      // Pegar tudo depois de "upload/v{version}/"
      const pathAfterUpload = parts.slice(uploadIndex + 2).join('/');
      const publicId = pathAfterUpload.replace(/\.[^/.]+$/, ''); // remover extensão

      await cloudinary.uploader.destroy(publicId);
    } catch (error: any) {
      console.error('Erro ao deletar imagem:', error.message);
    }
  }
}
