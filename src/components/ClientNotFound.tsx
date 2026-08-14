"use client";

import { Teaser5050WithCta } from "@digital-b2c/coreui-kit";
import React from "react";

export default function ClientNotFound() {
  return (
    <Teaser5050WithCta
      ctas={[{ isExternal: false, label: "Back to homepage", url: "/" }]}
      title="Page Not Found"
      subtitle="Oops! The page you're looking for can't be found. Click the button below to return to the homepage and continue exploring."
      image={{ src: "/images/404.png", alt: "404 icon" }}
    />
  );
}
