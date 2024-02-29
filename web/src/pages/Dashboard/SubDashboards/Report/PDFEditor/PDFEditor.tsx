import { useEffect, useRef, ReactElement, useState } from 'react';
import Cookies from 'js-cookie';
import { Editor } from '@tinymce/tinymce-react';
import config from '../../../../../config';
import { IReport } from '../types';
import { getCookiePart } from '../../../../../crypto-utils';

export default function PdfViewerComponent(props: IReport): ReactElement {
    const editorRef = useRef(null);
    const handleExportPDF = async () => {
      const html_blob = new Blob([(editorRef.current as any).getContent()], { type: 'text/html' });
      const formData = new FormData();
      formData.append("mission", props.mission?.toString() || "");
      formData.append("template_name", props.template || "");
      formData.append("html_file", html_blob);
      const response = await fetch(`${config.apiUrl}/download-report/${props.id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Token ${getCookiePart(Cookies.get('Token')!, 'token')}`,
        },
      });

      response.json().then((data) => {
        console.log('Success:', data); // Log the successful response data
        const a = document.createElement("a");
        a.href = data.pdf_file;
        a.style.display = "none";
        a.download = "report.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }).catch(error => {
        console.error('Error in response:', error); // Log any errors during the fetch operation
      });
    }
  return (
    <>
    <Editor
       apiKey={import.meta.env.VITE_REACT_APP_TINYMCE_API_KEY}
        onInit={(evt, editor) => {
          (editorRef.current as any) = editor;
          editor.ui.registry.addButton('exportPdf', {
            text: 'Export PDF',
            onAction: handleExportPDF, 
          })
        }}
        initialValue={props.html_file}
        init={{
        selector: "textarea#reportEditor" as any,
        height: 500,
        menubar: false,
        plugins: [
          'exportPdf',
           'advlist','autolink',
           'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',
           'fullscreen','insertdatetime','media','table','help','wordcount'
        ],
        toolbar: 'undo redo | bold italic backcolor | exportPdf | ' +
           'bullist numlist | media image',
        content_style: props.css_style!
        }}
    />
    </>
  );
}

/*

import PSPDFKit, { Instance } from 'pspdfkit';
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
*/
