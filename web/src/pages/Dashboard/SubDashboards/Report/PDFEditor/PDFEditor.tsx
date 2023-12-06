import { useEffect, useRef, ReactElement } from "react";

interface PdfViewerProps {
  document: string; // Assuming `document` is a string representing the document URL
}

export default function PdfViewerComponent(props: PdfViewerProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    let PSPDFKit: any, instance: any;

    (async function () {
      try {
        PSPDFKit = await import("pspdfkit");

        // Ensure that there's only one PSPDFKit instance.
        PSPDFKit.unload(container);

        instance = await PSPDFKit.load({
          // Container where PSPDFKit should be mounted.
          container,
          // The document to open.
          document: props.document,
          // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
          baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
        });
      } catch (error) {
        console.error("Error loading PSPDFKit:", error);
      }
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [props.document]);

  // This div element will render the document to the DOM.
  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
