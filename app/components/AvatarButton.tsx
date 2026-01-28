"use client";

interface AvatarButtonProps {
    imageSrc: string;
    altText?: string;
}

export default function AvatarButton({ imageSrc, altText = "User avatar" }: AvatarButtonProps) {
    return (
        <img
            src={imageSrc}
            alt={altText}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />
    );
}
