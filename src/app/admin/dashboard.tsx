"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@/types/activity";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Plus, Edit, Trash, Eye, Calendar, User, BarChart3, FileText, FileSlip } from "lucide-react";
import { DataTable } from "./components/data-table";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      fetchActivities();
    }
  }, [isSignedIn]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching activities:", error);
      } else {
        setActivities(data || []);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) {
      try {
        const { error } = await supabase
          .from("activities")
          .delete()
          .eq("id", id);

        if (error) {
          throw error;
        }

        toast.success("Kegiatan berhasil dihapus!");
        setActivities(prev => prev.filter(activity => activity.id !== id));
      } catch (error) {
        console.error("Error deleting activity:", error);
        toast.error("Gagal menghapus kegiatan. Silakan coba lagi.");
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center p-8 rounded-xl backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 max-w-md">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600 dark:text-gray-300">Anda harus masuk terlebih dahulu untuk mengakses halaman admin.</p>
        </div>
      </div>
    );
  }

  const adminEmail = user?.emailAddresses[0]?.emailAddress;
  const isAdmin = process.env.ADMIN_USERS?.split(',').includes(adminEmail) || 
                 adminEmail === process.env.ADMIN_EMAIL;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center p-8 rounded-xl backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 max-w-md">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600 dark:text-gray-300">Anda tidak memiliki izin admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Kelola kegiatan organisasi Anda</p>
          </div>
          <Link href="/admin/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Buat Kegiatan Baru
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Kegiatan</CardTitle>
              <FileText className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activities.length}</div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Dipublikasikan</CardTitle>
              <BarChart3 className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activities.filter(activity => activity.published).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
              <FileSlip className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activities.filter(activity => !activity.published).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 overflow-hidden shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Daftar Kegiatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Memuat kegiatan...</div>
            ) : (
              <DataTable 
                activities={activities} 
                onEdit={(id) => console.log('Edit:', id)}
                onDelete={handleDelete}
                onView={(id) => console.log('View:', id)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}