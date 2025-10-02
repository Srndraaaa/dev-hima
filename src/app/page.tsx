"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity } from "@/types/activity";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Calendar, User, Activity as ActivityIcon } from "lucide-react";

export default function HomePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-lg">Memuat kegiatan...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative px-4 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-blue-100/50 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
            <ActivityIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-6">
            Organisasi Kegiatan
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Portal dokumentasi lengkap semua kegiatan organisasi
          </p>
        </div>
      </div>

      {/* Activities Section */}
      <div className="container mx-auto px-4 pb-16 max-w-6xl">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Belum ada kegiatan yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <Card 
                key={activity.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 hover:border-blue-300/50 dark:hover:border-blue-700/50"
              >
                <div className="p-5">
                  <div className="mb-3">
                    <h2 className="text-xl font-bold line-clamp-2 mb-2">{activity.title}</h2>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(activity.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="text-muted-foreground mb-4 line-clamp-3">
                    {activity.description || activity.content.substring(0, 100) + "..."}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="w-4 h-4 mr-1" />
                      <span>{activity.author}</span>
                    </div>
                    <Link href={`/kegiatan/${activity.id}`}>
                      <Button variant="outline" size="sm" className="group">
                        Lihat Selengkapnya
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}