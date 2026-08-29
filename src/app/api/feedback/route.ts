import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured, FeedbackMessage } from "@/lib/supabase";

// Fallback in-memory storage if Supabase credentials are not yet configured
let memoryFeedbacks: FeedbackMessage[] = [
  {
    id: "seed-1",
    name: "Alex Pratama",
    email: "alex@techlead.id",
    topic: "Konsultasi Arsitektur Backend",
    message: "Arsitektur topologinya rapi banget mas! Terutama implementasi token bucket sliding window dan circuit breakernya.",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "seed-2",
    name: "Devina Putri",
    email: "devina@startup.co",
    topic: "Tawaran Kerja / Rekrutmen",
    message: "Halo Devara, kami sedang mencari Senior Backend Engineer untuk platform scalable kami. Tertarik untuk diskusi?",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "seed-3",
    name: "Rian Hidayat",
    email: "rian.dev@gmail.com",
    topic: "Feedback & Ulasan",
    message: "UI dan animasi lanyard 3D physics-nya gila keren abis! Sangat profesional dan standar big tech.",
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Supabase GET error:", error);
        return NextResponse.json({
          source: "memory_fallback",
          isLiveSupabase: false,
          feedbacks: memoryFeedbacks,
        });
      }

      return NextResponse.json({
        source: "supabase",
        isLiveSupabase: true,
        feedbacks: data || [],
      });
    }

    return NextResponse.json({
      source: "memory_fallback",
      isLiveSupabase: false,
      feedbacks: memoryFeedbacks,
    });
  } catch (err: any) {
    console.error("Feedback GET route error:", err);
    return NextResponse.json({
      source: "memory_fallback",
      isLiveSupabase: false,
      feedbacks: memoryFeedbacks,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, topic, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: "Nama dan pesan wajib diisi!" },
        { status: 400 }
      );
    }

    const newFeedback: FeedbackMessage = {
      id: "fb-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: (email || "").trim(),
      topic: topic || "Feedback & Ulasan",
      message: message.trim(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("feedbacks")
        .insert([
          {
            name: newFeedback.name,
            email: newFeedback.email || null,
            topic: newFeedback.topic,
            message: newFeedback.message,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase INSERT error:", error);
        // Fallback to memory if insert fails
        memoryFeedbacks = [newFeedback, ...memoryFeedbacks];
        return NextResponse.json({
          success: true,
          source: "memory_fallback",
          isLiveSupabase: false,
          feedback: newFeedback,
        });
      }

      return NextResponse.json({
        success: true,
        source: "supabase",
        isLiveSupabase: true,
        feedback: data?.[0] || newFeedback,
      });
    }

    // Save in memory
    memoryFeedbacks = [newFeedback, ...memoryFeedbacks];

    return NextResponse.json({
      success: true,
      source: "memory_fallback",
      isLiveSupabase: false,
      feedback: newFeedback,
    });
  } catch (err: any) {
    console.error("Feedback POST route error:", err);
    return NextResponse.json(
      { error: "Gagal memproses feedback." },
      { status: 500 }
    );
  }
}
