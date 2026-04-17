export type ParsedEmailContent = {
  preview: string;
  body: string;
};

export type ParsedSenderIdentity = {
  email: string;
  domain: string;
};

const HTML_ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

function decodeHtmlEntities(text: string) {
  return Object.entries(HTML_ENTITY_MAP).reduce(
    (acc, [entity, value]) => acc.replace(new RegExp(entity, 'gi'), value),
    text,
  );
}

function decodeQuotedPrintable(text: string) {
  try {
    const normalized = text
      .replace(/=\r\n/g, '')
      .replace(/=\n/g, '')
      .replace(/=([0-9A-F]{2})/gi, '%$1');

    return decodeURIComponent(normalized);
  } catch {
    return text
      .replace(/=\r\n/g, '')
      .replace(/=\n/g, '')
      .replace(/=([0-9A-F]{2})/gi, (_, hex: string) =>
        String.fromCharCode(parseInt(hex, 16)),
      );
  }
}

function decodeBase64(text: string, charset = 'utf-8') {
  try {
    const bytes = Uint8Array.from(Buffer.from(text.replace(/\s/g, ''), 'base64'));
    const normalizedCharset = charset.toLowerCase();
    const decoder =
      normalizedCharset.includes('8859-1') || normalizedCharset.includes('latin1')
        ? new TextDecoder('iso-8859-1')
        : new TextDecoder('utf-8');

    return decoder.decode(bytes);
  } catch {
    return text;
  }
}

function fixMojibake(text: string) {
  if (!/[ÃÂâ€]/.test(text)) return text;

  try {
    const bytes = Uint8Array.from(text, char => char.charCodeAt(0));
    const repaired = new TextDecoder('utf-8').decode(bytes);
    if (repaired && repaired !== text) return repaired;
  } catch {
    // noop
  }

  return text
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã/g, 'Á')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã/g, 'Í')
    .replace(/Ã“/g, 'Ó')
    .replace(/Ãš/g, 'Ú')
    .replace(/Ã‘/g, 'Ñ')
    .replace(/Â¿/g, '¿')
    .replace(/Â¡/g, '¡')
    .replace(/Â /g, ' ')
    .replace(/â€”/g, '—')
    .replace(/â€“/g, '–')
    .replace(/â€œ/g, '“')
    .replace(/â€/g, '”')
    .replace(/â€˜/g, '‘')
    .replace(/â€™/g, '’')
    .replace(/â€¢/g, '•')
    .replace(/â€¦/g, '…');
}

function extractHeadersAndBody(raw: string) {
  const separator = raw.indexOf('\r\n\r\n') !== -1 ? '\r\n\r\n' : '\n\n';
  const index = raw.indexOf(separator);

  if (index === -1) return { headers: '', body: raw };

  return {
    headers: raw.slice(0, index),
    body: raw.slice(index + separator.length),
  };
}

function stripHtml(html: string) {
  const cleaned = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<(td|th)[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');

  return decodeHtmlEntities(cleaned)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanupText(text: string) {
  return fixMojibake(decodeHtmlEntities(text))
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseMultipart(raw: string, boundary: string) {
  const safeBoundary = boundary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const segments = raw.split(new RegExp(`--${safeBoundary}(?:--)?`, 'i'));

  let plainText = '';
  let htmlText = '';

  for (const segment of segments) {
    const { headers, body } = extractHeadersAndBody(segment.trim());
    const lowerHeaders = headers.toLowerCase();

    if (
      !lowerHeaders.includes('content-type: text/plain') &&
      !lowerHeaders.includes('content-type: text/html')
    ) {
      continue;
    }

    const charset = headers.match(/charset="?([^";\r\n]+)"?/i)?.[1] || 'utf-8';
    let decodedBody = body.trim();

    if (/content-transfer-encoding:\s*base64/i.test(headers)) {
      decodedBody = decodeBase64(decodedBody, charset);
    } else if (/content-transfer-encoding:\s*quoted-printable/i.test(headers)) {
      decodedBody = decodeQuotedPrintable(decodedBody);
    }

    if (lowerHeaders.includes('content-type: text/html')) {
      htmlText = stripHtml(decodedBody);
    } else {
      plainText = cleanupText(decodedBody);
    }
  }

  return plainText || htmlText;
}

function removeTransportNoise(text: string) {
  return text
    .replace(/^(received|dkim-signature|authentication-results|return-path|x-[^:]+):.*$/gim, '')
    .replace(/^(mime-version|content-type|content-transfer-encoding):.*$/gim, '')
    .replace(/^\s*(charset|boundary)=.*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function summarizeForPreview(text: string) {
  return text.replace(/\s+/g, ' ').trim().slice(0, 220);
}

export function parseSenderIdentity(sender: string): ParsedSenderIdentity {
  const normalizedSender = sender.trim().toLowerCase();
  const emailMatch = normalizedSender.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  const email = emailMatch?.[0] || normalizedSender;
  const domain = email.includes('@') ? email.split('@').pop() || '' : '';

  return {
    email,
    domain,
  };
}

export function parseEmailBody(rawText: string): ParsedEmailContent {
  if (!rawText?.trim()) return { preview: '', body: '' };

  try {
    const boundary = rawText.match(/boundary="?([^"\r\n;]+)"?/i)?.[1];
    let decoded = boundary ? parseMultipart(rawText, boundary) : '';

    if (!decoded) {
      const { headers, body } = extractHeadersAndBody(rawText);
      const charset = headers.match(/charset="?([^";\r\n]+)"?/i)?.[1] || 'utf-8';
      const lowerHeaders = headers.toLowerCase();
      let content = body.trim() || rawText;

      if (lowerHeaders.includes('content-transfer-encoding: base64')) {
        content = decodeBase64(content, charset);
      } else if (lowerHeaders.includes('content-transfer-encoding: quoted-printable')) {
        content = decodeQuotedPrintable(content);
      }

      decoded = lowerHeaders.includes('content-type: text/html')
        ? stripHtml(content)
        : cleanupText(content);
    }

    decoded = cleanupText(removeTransportNoise(decoded));
    const safeBody = decoded || '[Correo sin contenido legible]';

    return {
      body: safeBody,
      preview: summarizeForPreview(safeBody),
    };
  } catch {
    const fallback = cleanupText(rawText.slice(0, 2000)) || '[Error al decodificar correo]';
    return {
      body: fallback,
      preview: summarizeForPreview(fallback),
    };
  }
}
