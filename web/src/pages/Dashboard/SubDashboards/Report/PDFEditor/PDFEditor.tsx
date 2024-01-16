import { useEffect, useRef, ReactElement } from "react";
import PSPDFKit from "pspdfkit";

interface PdfViewerProps {
  document: string; // Assuming `document` is a string representing the document URL
  mission?: number;
  template?: string;
}

export default function PdfViewerComponent(props: PdfViewerProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const loadPSPDFKit = async () => {
        PSPDFKit.unload(container);
        PSPDFKit.load({
          autoSaveMode: PSPDFKit.AutoSaveMode.DISABLED,
          licenseKey: import.meta.env.VITE_REACT_APP_PSPDFKIT_LICENSE_KEY,
          // Container where PSPDFKit should be mounted.
          container: containerRef.current!,
          // The document to open.
          document: props.document,
          baseUrl: `${window.location.protocol}//${window.location.host}/public/`,
          toolbarItems: [
            ...PSPDFKit.defaultToolbarItems,
            { type: "content-editor" },
          ],
        }).then((instance) => {
          instance.setToolbarItems((items) => {
            items.push({
              type: "custom",
              id: "save-as",
              title: "Save As",
              onPress: async (event: any): Promise<void> => {
                const arrayBuffer = await instance.exportPDF();
                const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
                const formData = new FormData();
                formData.append("mission", props.mission?.toString() || "");
                formData.append("template_name", props.template || "");
                formData.append("file", blob);
                await fetch("/download-report", {
                  method: "POST",
                  body: formData,
                });
              }
            });
            return items;
          })
        }).catch((error) => {
          console.error(error.message);
        });
    };

    loadPSPDFKit();

  }, [props.document]);

  // This div element will render the document to the DOM.
  return <div id="pdf-editor" ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
