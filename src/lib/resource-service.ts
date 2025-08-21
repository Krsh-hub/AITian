import { supabase } from '@/integrations/supabase/client';

export type CourseResource = {
	id: string;
	course_id: string;
	title: string;
	file_path: string;
	file_type: 'video' | 'pdf' | 'other';
	position: number;
	created_by: string | null;
	created_at: string;
};

export const RESOURCE_BUCKET = 'course-resources';

export const resourceService = {
	async listByCourse(courseId: string): Promise<CourseResource[]> {
		const { data, error } = await supabase
			.from('course_resources')
			.select('*')
			.eq('course_id', courseId)
			.order('position', { ascending: true })
			.order('created_at', { ascending: true });

		if (error) {
			console.error('Error fetching resources:', error);
			throw new Error(error.message || 'Failed to fetch resources');
		}

		return data as CourseResource[];
	},

	async getSignedUrl(
		filePath: string,
		options?: { expiresInSeconds?: number; forceDownload?: boolean; downloadFilename?: string }
	): Promise<string> {
		const expiresIn = options?.expiresInSeconds ?? 3600;
		const { data, error } = await supabase.storage
			.from(RESOURCE_BUCKET)
			.createSignedUrl(filePath, expiresIn);

		if (error || !data) {
			console.error('Error creating signed URL:', error);
			throw new Error('Failed to create download URL');
		}

		let url = data.signedUrl;
		if (options?.forceDownload) {
			try {
				const u = new URL(url);
				const filename = options.downloadFilename || filePath.split('/').pop() || 'file';
				u.searchParams.set('download', filename);
				url = u.toString();
			} catch {}
		}

		return url;
	},

	async uploadResource(params: {
		courseId: string;
		file: File;
		title: string;
		fileType: 'video' | 'pdf' | 'other';
		position?: number;
	}): Promise<CourseResource> {
		const { courseId, file, title, fileType } = params;

		const resourceId = crypto.randomUUID();
		const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
		const path = `course/${courseId}/${resourceId}/${safeFileName}`;

		// derive content type
		const extension = safeFileName.split('.').pop()?.toLowerCase();
		const fallbackType = extension === 'pdf' ? 'application/pdf' : extension === 'mp4' ? 'video/mp4' : 'application/octet-stream';
		const contentType = file.type || fallbackType;

		const { error: uploadError } = await supabase.storage
			.from(RESOURCE_BUCKET)
			.upload(path, file, { upsert: false, contentType });

		if (uploadError) {
			console.error('Upload failed:', uploadError);
			throw new Error(uploadError.message || 'Failed to upload file');
		}

		const { data, error } = await supabase
			.from('course_resources')
			.insert({
				course_id: courseId,
				title,
				file_path: path,
				file_type: fileType,
				position: params.position ?? 0,
			})
			.select()
			.single();

		if (error || !data) {
			console.error('Insert resource failed:', error);
			// best-effort cleanup
			await supabase.storage.from(RESOURCE_BUCKET).remove([path]);
			throw new Error(error?.message || 'Failed to save resource');
		}

		return data as CourseResource;
	},

	async deleteResource(resource: Pick<CourseResource, 'id' | 'file_path'>): Promise<void> {
		const { error } = await supabase
			.from('course_resources')
			.delete()
			.eq('id', resource.id);

		if (error) {
			console.error('Delete resource row failed:', error);
			throw new Error(error.message || 'Failed to delete resource');
		}

		// attempt to remove the file as well (admin policies allow this)
		await supabase.storage.from(RESOURCE_BUCKET).remove([resource.file_path]);
	},
};


