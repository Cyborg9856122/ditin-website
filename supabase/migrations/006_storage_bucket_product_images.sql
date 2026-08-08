insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public bucket: anyone can read via the public URL (needed for statically generated pages).
-- Only owner/editor can upload, replace, or delete.
create policy "product_images_bucket_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.current_role() in ('owner', 'editor'));

create policy "product_images_bucket_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.current_role() in ('owner', 'editor'))
  with check (bucket_id = 'product-images' and public.current_role() in ('owner', 'editor'));

create policy "product_images_bucket_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.current_role() in ('owner', 'editor'));
