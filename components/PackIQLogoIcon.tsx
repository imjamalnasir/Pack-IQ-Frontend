import Image from "next/image";

export function PackIQLogoIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/Pack-IQ-App-Logo-v6.svg"
      alt="Pack IQ"
      width={150}
      height={66}
      className={className}
    />
  );
}