import { useEffect, useRef, ReactElement, useState } from 'react';
import PSPDFKit, { Instance } from 'pspdfkit';
import config from '../../../../../config';
import Cookies from 'js-cookie';
import { IReport } from '../types';

export default function PdfViewerComponent(
  props: IReport
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
        document: props.pdf_file!,
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
              const arrayBuffer = await (instance as Instance).exportPDF();
              const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
              const objectUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = objectUrl;
              a.style.display = "none";
              a.download = "report.pdf";
              document.body.appendChild(a);
              a.click();
              URL.revokeObjectURL(objectUrl);
              document.body.removeChild(a);

              const formData = new FormData();
              formData.append("mission", props.mission?.toString() || "");
              formData.append("template_name", props.template || "");
              formData.append("file", blob);
              await fetch(`${config.apiUrl}/download-report/${props.id}`, {
                method: "PUT",
                body: formData,
                headers: {
                  Authorization: `Token ${Cookies.get('Token')}`,
                },
              });
            },
          },
        ]);
      }
    };

    loadPSPDFKit();
  }, [props.pdf_file]);

  // This div element will render the document to the DOM.
  return (
    <div
      id="pdf-editor"
      ref={containerRef}
      style={{ width: '100%', height: '100vh' }}
    />
  );
}
