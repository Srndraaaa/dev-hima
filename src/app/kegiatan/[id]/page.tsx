"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Activity } from "@/types/activity";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ActivityDetailPageProps {
  params: {
    id: string;
  };
}

export default function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

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
        notFound();
      } else if (!data || !data.published) {
        notFound();
      } else {
        setActivity(data);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      notFound();
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

  if (!activity) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="flex items-center text-blue-600 dark:text-blue-400 mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
        
        <Card className="overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{activity.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{activity.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(activity.created_at)}</span>
                </div>
              </div>
              
              {activity.image_url && (
                <div className="mb-6 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src={activity.image_url} 
                    alt={activity.title} 
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: activity.content }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}