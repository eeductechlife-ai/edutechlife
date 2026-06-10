export default function DashboardBgPattern() {
  return (
    <>
      <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[length:60px_60px]" />
      <div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(77,168,196,0.12)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(0,75,99,0.06)_0%,rgba(255,255,255,0)_70%)]" />
    </>
  );
}
