import { useEffect, useRef, ReactElement } from "react";
import PSPDFKit from "pspdfkit";

interface PdfViewerProps {
  document: string; // Assuming `document` is a string representing the document URL
}

export default function PdfViewerComponent(props: PdfViewerProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
      const loadPSPDFKit = async () => {
      try {
        // Dynamically import pspdfkit during runtime

        // Now you can use pspdfkit
        // For example:
        PSPDFKit.unload(container);

        PSPDFKit.load({
          licenseKey: import.meta.env.VITE_REACT_APP_PSPDFKIT_LICENSE_KEY,
          // Container where PSPDFKit should be mounted.
          container: containerRef.current!,
          // The document to open.
          document: props.document,
          baseUrl: `${window.location.protocol}//${window.location.host}/assets/`,
          toolbarItems: [...PSPDFKit.defaultToolbarItems, {type: "content-editor"}],
        }).then(() => {
          console.log("PSPDFKit for Web successfully loaded!!!");
        });
      } catch (error) {
        console.error('Error loading PSPDFKit:', error);
      }
    };

    loadPSPDFKit();

  }, [props.document]);

  // This div element will render the document to the DOM.
  return <div id="pdf-editor" ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
