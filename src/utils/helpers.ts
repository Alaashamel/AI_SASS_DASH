export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => false
    );
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  } finally {
    document.body.removeChild(textarea);
  }
}

export function exportChatAsMarkdown(title: string, messages: { role: string; content: string }[]): string {
  let md = `# ${title}\n\n`;
  messages.forEach((msg) => {
    const role = msg.role === "user" ? "**You**" : "**Assistant**";
    md += `### ${role}\n\n${msg.content}\n\n---\n\n`;
  });
  return md;
}

export function getInitialsFromName(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
