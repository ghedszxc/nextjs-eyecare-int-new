import React from "react";

type Props = {
  /** A schema.org object, or null to render nothing. */
  data: Record<string, unknown> | null;
};

/**
 * Renders a schema.org block as JSON-LD.
 *
 * `<` is escaped so CMS copy containing `</script>` cannot break out of the tag.
 */
export default function JsonLd({ data }: Props) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
