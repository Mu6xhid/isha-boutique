"use client";

import Image from "next/image";

export default function Gallery({ image }: { image: string }) {
  const src = image || "/placeholder.jpg";

  return (
    <div className="w-full">
      <Image
        src={src}
        alt=""
        width={700}
        height={700}
        priority
        className="rounded-lg bg-white object-contain w-full h-auto max-h-[600px]"
        unoptimized={src === "/placeholder.jpg"}
      />
    </div>
  );
}
