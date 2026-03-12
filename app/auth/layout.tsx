import Image from "next/image";

export default function AuthLayout({
  children, // Will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <section className="dashboard-wrapper">

      
      {children}

    </section>
    </>
  );
}
