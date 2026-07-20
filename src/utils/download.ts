export function downloadFile(content: string, filename: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJSON(data: unknown, filename: string) {
  const content = JSON.stringify(data, null, 2);
  downloadFile(content, filename, "application/json");
}

export function downloadCSV(headers: string[], rows: string[][], filename: string) {
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadFile(csvContent, filename, "text/csv");
}
