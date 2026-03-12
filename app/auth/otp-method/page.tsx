import { OtpMethodIntegrated } from "@/components/packiq/auth/otp-method-integrated";

type PageProps = {
  searchParams: Promise<{
    temptoken?: string;
    email?: string;
  }>;
};

export default async function OtpMethodPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const temptoken = params?.temptoken;
  const email = params?.email;

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-1xl">
        <OtpMethodIntegrated temptoken={temptoken} email={email} />
      </div>
    </div>
  );
}