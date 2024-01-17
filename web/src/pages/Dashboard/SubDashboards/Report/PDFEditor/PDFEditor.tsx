import { useEffect, useRef, ReactElement, useState } from 'react';
import PSPDFKit, { Instance } from 'pspdfkit';

/* eslint-disable */
interface PdfViewerProps {
    document: string; // Assuming `document` is a string representing the document URL
    mission?: number;
    template?: string;
    reportId?: number;
}
/* eslint-enable */
export default function PdfViewerComponent(
    props: PdfViewerProps
): ReactElement {
    const containerRef = useRef<HTMLDivElement>(null);
    const [instance, setInstance] = useState<Instance | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        const loadPSPDFKit = async () => {
            PSPDFKit.unload(container);
            PSPDFKit.load({
                autoSaveMode: PSPDFKit.AutoSaveMode.DISABLED,
                licenseKey: import.meta.env.VITE_REACT_APP_PSPDFKIT_LICENSE_KEY,
                container: containerRef.current!,
                document: props.document,
                baseUrl: `${window.location.protocol}//${window.location.host}/public/`,
                toolbarItems: [
                    ...PSPDFKit.defaultToolbarItems.map((item) => {
                        if (item.type === 'export-pdf') {
                            return {
                                type: 'custom' as any,
                                title: 'Save',
                                onPress: async () => {
                                    const arrayBuffer = await (
                                        instance as Instance
                                    ).exportPDF();
                                    const blob = new Blob([arrayBuffer], {
                                        type: 'application/pdf',
                                    });
                                    const formData = new FormData();
                                    formData.append(
                                        'mission',
                                        props.mission?.toString() || ''
                                    );
                                    formData.append(
                                        'template_name',
                                        props.template || ''
                                    );
                                    formData.append('file', blob);
                                    await fetch('/download-report', {
                                        method: 'POST',
                                        body: formData,
                                    });
                                },
                            };
                        }
                        return item;
                    }),
                    { type: 'content-editor' },
                ],
            })
                .then((response) => {
                    setInstance(response);
                })
                .catch((error) => {
                    throw error.message;
                });
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
