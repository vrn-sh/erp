export interface IReport {
    id: number;
    template?: string;
    mission?: number;
    pdf_file?: string;
    html_file?: string;
    logo?: string | null;
    version?: number;
    mission_title?: string;
    updated_at?: string;
    css_style?: string;
    documentURL?: string;
}
