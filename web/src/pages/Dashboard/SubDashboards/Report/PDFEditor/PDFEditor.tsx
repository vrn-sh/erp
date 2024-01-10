import { useEffect, useRef, ReactElement } from "react";
import PSPDFKit from "pspdfkit";


interface PdfViewerProps {
  document: string; // Assuming `document` is a string representing the document URL
}

export default function PdfViewerComponent(props: PdfViewerProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
        // Ensure that there's only one PSPDFKit instance.
        PSPDFKit.unload(container);

        PSPDFKit.load({
          licenseKey: import.meta.env.VITE_REACT_APP_PSPDFKIT_LICENSE_KEY,
          // Container where PSPDFKit should be mounted.
          container: containerRef.current!,
          // The document to open.
          document: props.document,
          baseUrl: `${window.location.protocol}//${window.location.host}/public/`,
          toolbarItems: [...PSPDFKit.defaultToolbarItems, {type: "content-editor"}],
        }).then((instance) => {
          // PSPDFKit is ready to be used.
          console.log(instance);
          console.log("PSPDFKit for Web successfully loaded!!!");
        });
  }, [props.document]);

  // This div element will render the document to the DOM.
  return <div id="pdf-editor" ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
