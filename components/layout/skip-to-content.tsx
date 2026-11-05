import type { ReactNode } from "react";

export function SkipToContent(): ReactNode {
  return (
    <a href="#main-content" className="skip-to-content">
      跳到主要内容
    </a>
  );
}
