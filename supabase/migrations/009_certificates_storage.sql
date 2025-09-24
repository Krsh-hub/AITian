-- Create certificates storage bucket
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', true);

-- Create storage policies for certificates
create policy "Certificates are publicly accessible"
on storage.objects for select
using (bucket_id = 'certificates');

create policy "Only authenticated users can upload certificates"
on storage.objects for insert
with check (bucket_id = 'certificates' and auth.role() = 'authenticated');

create policy "Only admins can update certificates"
on storage.objects for update
using (bucket_id = 'certificates' and is_admin());

create policy "Only admins can delete certificates"
on storage.objects for delete
using (bucket_id = 'certificates' and is_admin());
