export type OutreachSignature = {
  companyName: string;
  contactEmail: string;
  accentColor?: string;
};

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, character => HTML_ESCAPE_MAP[character] || character);
}

export function personalizeTemplate(
  template: string,
  variables: Record<string, string>,
) {
  return Object.entries(variables).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value),
    template,
  );
}

export function buildEmailHtml(
  content: string,
  signature: OutreachSignature,
) {
  const accentColor = signature.accentColor || '#7c3aed';
  const paragraphs = content
    .split('\n')
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .map(
      paragraph =>
        `<p style="margin: 0 0 16px 0; line-height: 1.6;">${escapeHtml(paragraph)}</p>`,
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${paragraphs}
      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
      <p style="color: #666; font-size: 14px;">
        ${escapeHtml(signature.companyName)}<br/>
        <a href="mailto:${escapeHtml(signature.contactEmail)}" style="color: ${accentColor};">
          ${escapeHtml(signature.contactEmail)}
        </a>
      </p>
    </div>
  `.trim();
}

export function buildWhatsAppLink(phone: string) {
  const cleanPhone = phone.replace(/\s|-|\(|\)|\+/g, '');
  return `https://wa.me/${cleanPhone}`;
}

export function buildMailtoLink(email: string) {
  return `mailto:${email.trim()}`;
}
