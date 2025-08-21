import { useParams, Link } from 'react-router-dom';
import { useResourcesByCourse } from '@/hooks/use-resources';
import { resourceService } from '@/lib/resource-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RequireAuth from '@/components/RequireAuth';
import { useState } from 'react';

const CourseResources = () => {
	const { id: courseId } = useParams<{ id: string }>();
	const { data: resources, isLoading, error } = useResourcesByCourse(courseId || '');
	const [downloadingId, setDownloadingId] = useState<string | null>(null);

	if (!courseId) return null;

	const handleOpen = async (filePath: string, id: string) => {
		try {
			setDownloadingId(id);
			const url = await resourceService.getSignedUrl(filePath);
			window.open(url, '_blank');
		} finally {
			setDownloadingId(null);
		}
	};

	const handleDownload = async (filePath: string, id: string) => {
		try {
			setDownloadingId(id);
			const url = await resourceService.getSignedUrl(filePath, { forceDownload: true });
			window.open(url, '_blank');
		} finally {
			setDownloadingId(null);
		}
	};

	return (
		<RequireAuth>
			<div className="max-w-4xl mx-auto p-4 space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">Your Course Resources</h1>
					<Link to={`/course/${courseId}`} className="text-primary underline">Back to course</Link>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Resources</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div>Loading...</div>
						) : error ? (
							<div className="text-muted-foreground">You must enroll in this course to access resources.</div>
						) : (resources || []).length === 0 ? (
							<div className="text-muted-foreground">No resources available yet.</div>
						) : (
							<ul className="divide-y">
								{resources!.map((r) => (
									<li key={r.id} className="py-3 flex items-center justify-between">
										<div>
											<div className="font-medium">{r.title}</div>
											<div className="text-xs text-muted-foreground">{r.file_type.toUpperCase()}</div>
										</div>
										{r.file_type === 'pdf' ? (
											<Button size="sm" onClick={() => handleDownload(r.file_path, r.id)} disabled={downloadingId === r.id}>
												{downloadingId === r.id ? 'Preparing...' : 'Download'}
											</Button>
										) : (
											<Button size="sm" onClick={() => handleOpen(r.file_path, r.id)} disabled={downloadingId === r.id}>
												{downloadingId === r.id ? 'Preparing...' : 'Open'}
											</Button>
										)}
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>
			</div>
		</RequireAuth>
	);
};

export default CourseResources;


