export interface XlsxExportRequest {
    title: string;
    reportingDate: string;
    filters: string;
    summary?: Array<[string, string | number]>;
    headers: string[];
    rows: Array<Array<string | number>>;
    fileName: string;
    sheetName: string;
}

/** Creates a small standards-compliant .xlsx workbook without adding a client dependency. */
export function downloadXlsx(request: XlsxExportRequest): void {
    const data = new TextEncoder();
    const columns = Math.max(request.headers.length, 1);
    const summaryRows = request.summary?.map(([label, value]) => [label, value]) || [];
    const titleRows: Array<Array<string | number>> = [
        [request.title],
        [`Reporting date: ${request.reportingDate}`],
        [`Applied filters: ${request.filters}`],
        ...summaryRows,
        [],
        request.headers,
        ...request.rows
    ];
    const sheet = worksheetXml(titleRows, columns, 4 + summaryRows.length);
    const files = [
        ['[Content_Types].xml', contentTypesXml()],
        ['_rels/.rels', rootRelsXml()],
        ['xl/workbook.xml', workbookXml(request.sheetName)],
        ['xl/_rels/workbook.xml.rels', workbookRelsXml()],
        ['xl/styles.xml', stylesXml()],
        ['xl/worksheets/sheet1.xml', sheet]
    ].map(([name, content]) => ({ name, bytes: data.encode(content) }));

    const blob = new Blob([zip(files)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = request.fileName;
    anchor.click();
    URL.revokeObjectURL(url);
}

function worksheetXml(rows: Array<Array<string | number>>, columnCount: number, headerIndex: number): string {
    const widths = Array.from({ length: columnCount }, (_, index) => `<col min="${index + 1}" max="${index + 1}" width="${index === 0 ? 22 : 18}" customWidth="1"/>`).join('');
    const body = rows.map((row, index) => `<row r="${index + 1}">${row.map((value, column) => cellXml(index + 1, column + 1, value, index === 0 ? 1 : index === headerIndex ? 2 : 0)).join('')}</row>`).join('');
    const titleRange = `A1:${columnName(columnCount)}1`;
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${widths}</cols><sheetData>${body}</sheetData><mergeCells count="1"><mergeCell ref="${titleRange}"/></mergeCells></worksheet>`;
}

function cellXml(row: number, column: number, value: string | number, style: number): string {
    const reference = `${columnName(column)}${row}`;
    if (typeof value === 'number' && Number.isFinite(value)) return `<c r="${reference}" s="${style}" t="n"><v>${value}</v></c>`;
    return `<c r="${reference}" s="${style}" t="inlineStr"><is><t>${escapeXml(String(value))}</t></is></c>`;
}

function columnName(column: number): string {
    let result = '';
    let value = column;
    while (value > 0) {
        value--;
        result = String.fromCharCode(65 + value % 26) + result;
        value = Math.floor(value / 26);
    }
    return result;
}

function escapeXml(value: string): string {
    return value.replace(/[<>&'"]/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] || character);
}

function contentTypesXml(): string {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
}

function rootRelsXml(): string {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
}

function workbookXml(name: string): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${escapeXml(name.slice(0, 31))}" sheetId="1" r:id="rId1"/></sheets></workbook>`;
}

function workbookRelsXml(): string {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
}

function stylesXml(): string {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE2F0D9"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0"/></cellXfs></styleSheet>';
}

function zip(files: Array<{ name: string; bytes: Uint8Array }>): Uint8Array {
    const local: Uint8Array[] = [];
    const central: Uint8Array[] = [];
    let offset = 0;
    files.forEach(file => {
        const name = new TextEncoder().encode(file.name);
        const crc = crc32(file.bytes);
        const localHeader = localFileHeader(crc, file.bytes.length, name.length);
        local.push(localHeader, name, file.bytes);
        const centralHeader = centralDirectoryHeader(crc, file.bytes.length, name.length, offset);
        central.push(centralHeader, name);
        offset += localHeader.length + name.length + file.bytes.length;
    });
    const centralBytes = join(central);
    return join([...local, centralBytes, endOfCentralDirectory(files.length, centralBytes.length, offset)]);
}

function localFileHeader(crc: number, size: number, nameLength: number): Uint8Array {
    const bytes = new Uint8Array(30);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, size, true);
    view.setUint32(22, size, true);
    view.setUint16(26, nameLength, true);
    return bytes;
}

function centralDirectoryHeader(crc: number, size: number, nameLength: number, offset: number): Uint8Array {
    const bytes = new Uint8Array(46);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint32(16, crc, true);
    view.setUint32(20, size, true);
    view.setUint32(24, size, true);
    view.setUint16(28, nameLength, true);
    view.setUint32(42, offset, true);
    return bytes;
}

function endOfCentralDirectory(fileCount: number, centralSize: number, centralOffset: number): Uint8Array {
    const bytes = new Uint8Array(22);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, 0x06054b50, true);
    view.setUint16(8, fileCount, true);
    view.setUint16(10, fileCount, true);
    view.setUint32(12, centralSize, true);
    view.setUint32(16, centralOffset, true);
    return bytes;
}

function join(chunks: Uint8Array[]): Uint8Array {
    const result = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.length, 0));
    let offset = 0;
    chunks.forEach(chunk => { result.set(chunk, offset); offset += chunk.length; });
    return result;
}

function crc32(bytes: Uint8Array): number {
    let crc = -1;
    for (const byte of bytes) {
        crc ^= byte;
        for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
    return (crc ^ -1) >>> 0;
}
