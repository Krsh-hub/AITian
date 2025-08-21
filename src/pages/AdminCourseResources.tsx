import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResourcesByCourse, useUploadResource, useDeleteResource } from '@/hooks/use-resources';
import RequireAdmin from '@/components/RequireAdmin';

const AdminCourseResources = () => {
	const { id: courseId } = useParams<{ id: string }>();
	const { data: resources, isLoading, error } = useResourcesByCourse(courseId || '');
	const uploadMutation = useUploadResource(courseId || '');
	const deleteMutation = useDeleteResource(courseId || '');

	const [title, setTitle] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [fileType, setFileType] = useState<'video' | 'pdf' | 'other'>('other');

	if (!courseId) return null;

	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file || !title.trim()) return;
		await uploadMutation.mutateAsync({ courseId, file, title: title.trim(), fileType });
		setTitle('');
		setFile(null);
	};

	return (
		<RequireAdmin>
			<div className="max-w-4xl mx-auto p-4 space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">Manage Course Resources</h1>
					<Link to={`/admin/courses/edit/${courseId}`} className="text-primary underline">Back to course</Link>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Upload Resource</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="grid gap-4" onSubmit={handleUpload}>
							<div className="grid md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="title">Title</Label>
									<Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
								</div>
								<div className="space-y-2">
									<Label htmlFor="type">Type</Label>
									<select id="type" className="h-10 border rounded-md px-3 bg-background" value={fileType} onChange={(e) => setFileType(e.target.value as any)}>
										<option value="video">Video</option>
										<option value="pdf">PDF</option>
										<option value="other">Other</option>
									</select>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="file">File</Label>
								<Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
							</div>
							<Button type="submit" disabled={uploadMutation.isPending}>{uploadMutation.isPending ? 'Uploading...' : 'Upload'}</Button>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Resources</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div>Loading...</div>
						) : error ? (
							<div className="text-destructive">Failed to load resources.</div>
						) : (
							<div className="space-y-3">
								{(resources || []).length === 0 ? (
									<div className="text-muted-foreground">No resources uploaded yet.</div>
								) : (
									<ul className="divide-y">
										{resources!.map((r) => (
											<li key={r.id} className="py-3 flex items-center justify-between">
												<div>
													<div className="font-medium">{r.title}</div>
													<div className="text-xs text-muted-foreground">{r.file_type.toUpperCase()} · {r.file_path}</div>
												</div>
												<Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate({ id: r.id, file_path: r.file_path })} disabled={deleteMutation.isPending}>
													{deleteMutation.isPending ? 'Deleting...' : 'Delete'}
												</Button>
											</li>
										))}
									</ul>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</RequireAdmin>
	);
};

export default AdminCourseResources;


