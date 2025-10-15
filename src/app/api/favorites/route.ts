import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";

function getClientId(req: NextRequest): string | null {
  const fromHeader = req.headers.get("x-user-id");
  if (fromHeader && fromHeader.trim().length > 0) return fromHeader.trim();
  const { searchParams } = new URL(req.url);
  const fromQuery = searchParams.get("userId");
  if (fromQuery && fromQuery.trim().length > 0) return fromQuery.trim();
  return null;
}

export async function GET(req: NextRequest) {
  const clientId = getClientId(req);
  if (!clientId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as { userId?: string; assetId?: string } | null;
  const clientId = body?.userId || getClientId(req);
  const assetId = body?.assetId;
  if (!clientId || !assetId) {
    return NextResponse.json({ error: "Missing userId or assetId" }, { status: 400 });
  }
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("favorites").insert({ client_id: clientId, asset_id: assetId }).select().single();
  if (error) {
    if (error.message.toLowerCase().includes("duplicate") || error.code === "23505") {
      // Unique constraint; treat as success (idempotent)
      return NextResponse.json({ id: Date.now().toString(), userId: clientId, assetId, createdAt: new Date().toISOString() }, { status: 200 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ id: data.id, userId: clientId, assetId, createdAt: data.created_at });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ id, status: "removed" });
}


