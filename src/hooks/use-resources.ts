import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceService, CourseResource } from '@/lib/resource-service';
import { useToast } from '@/hooks/use-toast';

export const resourceKeys = {
	all: ['resources'] as const,
	byCourse: (courseId: string) => [...resourceKeys.all, 'course', courseId] as const,
};

export const useResourcesByCourse = (courseId: string) => {
	return useQuery({
		queryKey: resourceKeys.byCourse(courseId),
		queryFn: () => resourceService.listByCourse(courseId),
		enabled: !!courseId,
		staleTime: 5 * 60 * 1000,
	});
};

export const useUploadResource = (courseId: string) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: resourceService.uploadResource,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: resourceKeys.byCourse(courseId) });
			toast({ title: 'Uploaded', description: 'Resource uploaded successfully.' });
		},
		onError: (error: Error) => {
			toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
		},
	});
};

export const useDeleteResource = (courseId: string) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: resourceService.deleteResource,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: resourceKeys.byCourse(courseId) });
			toast({ title: 'Deleted', description: 'Resource deleted.' });
		},
		onError: (error: Error) => {
			toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
		},
	});
};

export const useSignedUrl = (filePath: string | null) => {
	return useQuery({
		queryKey: ['signedUrl', filePath],
		queryFn: () => resourceService.getSignedUrl(filePath as string),
		enabled: !!filePath,
		staleTime: 60 * 1000,
	});
};


