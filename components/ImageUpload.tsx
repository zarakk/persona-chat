"use client";

import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (src: string) => void;
  disabled: boolean;
}
const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
  const placeholder =
    '<svg xmlns="http://www.w3.org/2000/svg" width="680.764" height="528.354" viewBox="0 0 180.119 139.794"><g transform="translate(-13.59 -66.639)" paint-order="fill markers stroke"><path fill="#d0d0d0" d="M13.591 66.639H193.71v139.794H13.591z"/><path d="m118.507 133.514-34.249 34.249-15.968-15.968-41.938 41.937H178.726z" opacity=".675" fill="#fff"/><circle cx="58.217" cy="108.555" r="11.773" opacity=".675" fill="#fff"/><path fill="none" d="M26.111 77.634h152.614v116.099H26.111z"/></g></svg>';
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      <CldUploadButton
        onUpload={(result: any) => onChange(result.info.secure_url)}
        options={{ maxFiles: 1 }}
        uploadPreset="ml_default"
      >
        <div
          className="p-4 border-4 border-primary/10 rounded-lg hover:opacity-75 
        transition flex flex-col space-y-2 items-center justify-center"
        >
          <div className="relative h-40 w-40">
            <Image
              fill
              alt="upload"
              src={value || placeholder}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};

export default ImageUpload;
