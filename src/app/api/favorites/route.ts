import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";

type FavoriteRow = {
  id: string;
  client_id: string;
  asset_id: string;
  created_at: string;
};

function getClientId(req: NextRequest): string | null {
  const fromHeader = req.headers.get("x-client-id");
  if (fromHeader && fromHeader.trim().length > 0) return fromHeader.trim();
  const { searchParams } = new URL(req.url);
  const fromQuery = searchParams.get("clientId");
  if (fromQuery && fromQuery.trim().length > 0) return fromQuery.trim();
  return null;
}

export async function GET(req: NextRequest) {
  const clientId = getClientId(req);
  if (!clientId) {
    return NextResponse.json({ error: "Missing clientId" }, { status: 400 });
  }
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("favorites")
    .select<"asset_id", { asset_id: string }>("asset_id")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ clientId, favorites: (data || []).map((r) => r.asset_id) });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as { clientId?: string; assetId?: string } | null;
  const clientId = body?.clientId || getClientId(req);
  const assetId = body?.assetId;
  if (!clientId || !assetId) {
    return NextResponse.json({ error: "Missing clientId or assetId" }, { status: 400 });
  }
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("favorites").insert({ client_id: clientId, asset_id: assetId });
  if (error) {
    if (error.message.toLowerCase().includes("duplicate") || error.code === "23505") {
      // Unique constraint; treat as success (idempotent)
      return NextResponse.json({ clientId, assetId, status: "exists" }, { status: 200 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ clientId, assetId, status: "added" }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => null) as { clientId?: string; assetId?: string } | null;
  const clientId = body?.clientId || getClientId(req);
  const assetId = body?.assetId;
  if (!clientId || !assetId) {
    return NextResponse.json({ error: "Missing clientId or assetId" }, { status: 400 });
  }
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("client_id", clientId)
    .eq("asset_id", assetId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ clientId, assetId, status: "removed" });
}


