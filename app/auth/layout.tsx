import Image from "next/image";

export default function AuthLayout({
  children, // Will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="dashboard-wrapper">
        <div className="loginBg">
          <Image
          src="/piq-logo-Icon-h.png"
          alt="Company Logo"
          width={206}
          height={64}
          priority
        />
      
      {children}
      </div>
    </section>
  );
}
