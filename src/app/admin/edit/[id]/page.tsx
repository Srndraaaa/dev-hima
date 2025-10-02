"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { notFound } from "next/navigation";
import dynamic from 'next/dynamic';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface EditActivityPageProps {
  params: {
    id: string;
  };
}

export default function EditActivityPage({ params }: EditActivityPageProps) {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activityNotFound, setActivityNotFound] = useState(false);

  useEffect(() => {
    fetchActivity();
  }, [params.id]);

  const fetchActivity = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching activity:", error);
        setActivityNotFound(true);
      } else if (!data) {
        setActivityNotFound(true);
      } else {
        setTitle(data.title);
        setContent(data.content);
        setDescription(data.description || "");
        setAuthor(data.author);
        setImageUrl(data.image_url || "");
        setPublished(data.published);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      setActivityNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("activities")
        .update({
          title,
          content,
          description,
          author,
          image_url: imageUrl,
          published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id);

      if (error) {
        throw error;
      }

      toast.success("Kegiatan berhasil diperbarui!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Gagal memperbarui kegiatan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-lg">Memuat kegiatan...</div>
      </div>
    );
  }

  if (activityNotFound) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Kegiatan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul kegiatan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat kegiatan"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nama penulis"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL Gambar</Label>
                <Input
                  id="image_url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL gambar utama (opsional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Konten</Label>
                <div data-color-mode="light" className="w-full rounded-md border border-input bg-background p-1">
                  <MDEditor
                    id="content"
                    value={content}
                    onChange={(value = "") => setContent(value)}
                    height={400}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={setPublished}
                  />
                  <Label htmlFor="published">Publikasikan</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}