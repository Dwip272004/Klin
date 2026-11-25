import SideNav from "@/components/SideNav";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: balance }, { data: profile }] = await Promise.all([
    supabase.rpc("my_credit_balance"),
    supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle(),
  ]);
  return (
    <div className="shell">
      <SideNav balance={balance ?? 0} email={user?.email ?? ""} name={profile?.full_name ?? ""} />
      <div className="workspace">{children}</div>
    </div>
  );
}
