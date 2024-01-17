import { useEffect, useRef, ReactElement, useState } from 'react';
import PSPDFKit, { Instance } from 'pspdfkit';

interface PdfViewerProps {
  document: string; // Assuming `document` is a string representing the document URL
  mission?: number;
  template?: string;
  reportId?: number;
}

export default function PdfViewerComponent(
    props: PdfViewerProps
): ReactElement {
    const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const loadPSPDFKit = async () => {
        PSPDFKit.unload(container);
        const instance = await PSPDFKit.load({
          autoSaveMode: PSPDFKit.AutoSaveMode.DISABLED,
          licenseKey: import.meta.env.VITE_REACT_APP_PSPDFKIT_LICENSE_KEY,
          container: containerRef.current!,
          document: props.document,
          baseUrl: `${window.location.protocol}//${window.location.host}/assets/`,
          toolbarItems: [
            ...PSPDFKit.defaultToolbarItems.filter((item) => item.type !== "export-pdf"),
            { type: "content-editor" },
          ],
        });
        if (instance) {
          instance.setToolbarItems((items) => [
            ...items,
            {
              type: "custom",
              title: "Save",
              onPress: async () => {
                console.log("Pressed this mf button");
              },
            },
          ]);
          console.log(instance.toolbarItems)
        }
    };

        loadPSPDFKit();
    }, [props.document]);

    // This div element will render the document to the DOM.
    return (
        <div
            id="pdf-editor"
            ref={containerRef}
            style={{ width: '100%', height: '100vh' }}
        />
    );
}
