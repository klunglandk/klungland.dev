import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Parses `[text](url)` markdown-style links in a string into React nodes.
 * Internal links (starting with "/") use React Router's Link for client-side
 * navigation; everything else opens as an external link in a new tab. */
export function linkify(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    const [fullMatch, label, url] = match;
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      url.startsWith("/") ? (
        <Link key={match.index} to={url}>
          {label}
        </Link>
      ) : (
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      ),
    );
    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
