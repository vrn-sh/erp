import { useEffect, useRef, ReactElement, useState } from 'react';
import config from '../../../../../config';
import Cookies from 'js-cookie';
import { IReport } from '../types';
import { Editor } from '@tinymce/tinymce-react';


export default function PdfViewerComponent(
  props: IReport
): ReactElement {
      const editorRef = useRef(null);
    const log = () => {
    if (editorRef.current) {
        console.log((editorRef.current as any).getContent());
    }
  };
  return (
    <>
    {/* TODO: add an info modal to inform that h3 title will be counted as
              headers title in the pdf final version
     */}
    <Editor
      apiKey={import.meta.env.VITE_REACT_APP_TINYMCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current as any) = editor}
        initialValue={props.html_file}
        init={{
        height: 500,
        menubar: false,
        plugins: [
           'a11ychecker','advlist','advcode','advtable','autolink','checklist','export',
           'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',
           'powerpaste','fullscreen','formatpainter','insertdatetime','media','table','help','wordcount'
        ],
        toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
           'alignleft aligncenter alignright alignjustify | ' +
           'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
        //content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        // TODO: take care of content_style in case they don't take into account the font
        }}
    />
    <button onClick={log}>Log editor content</button>
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