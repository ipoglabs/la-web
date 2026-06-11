export async function uploadFileToR2(file: File, title?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);

  const res = await fetch("/api/media/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Upload failed (${res.status})`);
  }

  const { publicUrl } = await res.json();
  return publicUrl;
}
