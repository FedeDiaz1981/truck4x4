import Header from "@/components/Header";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header mode="fixed" />
      <div className="pt-[7.5rem]">{children}</div>
    </div>
  );
}
