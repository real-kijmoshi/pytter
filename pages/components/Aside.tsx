export default function Aside({ whoAmI }: { whoAmI: string }) {
  return (
    <aside
      className={`w-64 h-screen bg-white border border-[#e6e6e6] border-right`}
    >
      <div>{whoAmI}</div>
    </aside>
  );
}
