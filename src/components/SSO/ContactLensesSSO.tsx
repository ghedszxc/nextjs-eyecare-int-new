"use client";

import { generateContactLensesSSOUrl } from "@/lib/server-actions";
import { useCallback } from "react";

interface ContactLensesSSOProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetUrl: string;
  className?: string;
  children?: React.ReactNode;
}

const ContactLensesSSO = ({
  targetUrl,
  className,
  children,
  ...props
}: ContactLensesSSOProps) => {
  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      try {
        const ssoUrl = await generateContactLensesSSOUrl(targetUrl);
        window.location.href = ssoUrl;
      } catch (error) {
        console.error("Failed to generate SSO URL:", error);
      }
    },
    [targetUrl],
  );

  return (
    <a href="#" onClick={handleClick} className={className} {...props}>
      {children || "Open Contact Lenses"}
    </a>
  );
}

export default ContactLensesSSO;
