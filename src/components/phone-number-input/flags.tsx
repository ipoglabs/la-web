import * as React from "react";

// Image-based flag with emoji fallback on error
export function FlagImage({ code, name, ...props }: { code: string; name: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = React.useState(false);
  if (failed) {
    return <FlagEmoji code={code} width={24} height={16} aria-label={name} />;
  }

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      src={`/flags/${code}.svg`}
      alt={name}
      width={24}
      height={16}
      loading="lazy"
      decoding="async"
      role="img"
      onError={() => setFailed(true)}
      {...props}
    />
  );
}

export const FlagUS = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="us" name="United States" {...props} />
);

export const FlagCA = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="ca" name="Canada" {...props} />
);

export const FlagMX = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="mx" name="Mexico" {...props} />
);

export const FlagIE = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="ie" name="Ireland" {...props} />
);

export const FlagFR = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="fr" name="France" {...props} />
);

export const FlagDE = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="de" name="Germany" {...props} />
);

export const FlagES = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="es" name="Spain" {...props} />
);

export const FlagIT = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="it" name="Italy" {...props} />
);

export const FlagNL = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="nl" name="Netherlands" {...props} />
);

export const FlagBE = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="be" name="Belgium" {...props} />
);

export const FlagSE = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="se" name="Sweden" {...props} />
);

export const FlagNO = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="no" name="Norway" {...props} />
);

export const FlagDK = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="dk" name="Denmark" {...props} />
);

export const FlagFI = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="fi" name="Finland" {...props} />
);

export const FlagRU = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="ru" name="Russia" {...props} />
);

export const FlagPL = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="pl" name="Poland" {...props} />
);

export const FlagCZ = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="cz" name="Czech Republic" {...props} />
);

export const FlagAT = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="at" name="Austria" {...props} />
);

export const FlagCH = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="ch" name="Switzerland" {...props} />
);

export const FlagPT = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="pt" name="Portugal" {...props} />
);

export const FlagGR = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="gr" name="Greece" {...props} />
);

export const FlagTR = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="tr" name="Turkey" {...props} />
);

export const FlagIL = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="il" name="Israel" {...props} />
);

export const FlagSA = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="sa" name="Saudi Arabia" {...props} />
);

export const FlagAE = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="ae" name="United Arab Emirates" {...props} />
);

export const FlagEG = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="eg" name="Egypt" {...props} />
);

export const FlagNG = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="ng" name="Nigeria" {...props} />
);

export const FlagZA = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="za" name="South Africa" {...props} />
);

export const FlagKE = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="ke" name="Kenya" {...props} />
);

export const FlagPK = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="pk" name="Pakistan" {...props} />
);

export const FlagBD = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="bd" name="Bangladesh" {...props} />
);

export const FlagLK = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="lk" name="Sri Lanka" {...props} />
);

export const FlagJP = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="jp" name="Japan" {...props} />
);

export const FlagKR = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="kr" name="South Korea" {...props} />
);

export const FlagCN = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="cn" name="China" {...props} />
);

export const FlagTW = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="tw" name="Taiwan" {...props} />
);

export const FlagHK = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="hk" name="Hong Kong" {...props} />
);

export const FlagNZ = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="nz" name="New Zealand" {...props} />
);

export const FlagBR = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="br" name="Brazil" {...props} />
);

export const FlagAR = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="ar" name="Argentina" {...props} />
);

export const FlagCL = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="cl" name="Chile" {...props} />
);

export const FlagCO = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="co" name="Colombia" {...props} />
);

export const FlagPE = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="pe" name="Peru" {...props} />
);

export const FlagVE = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="ve" name="Venezuela" {...props} />
);

export const FlagSG = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="sg" name="Singapore" {...props} />
);

export const FlagGB = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="gb" name="United Kingdom" {...props} />
);

export const FlagIN = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="in" name="India" {...props} />
);

export const FlagAU = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <FlagImage code="au" name="Australia" {...props} />
);

// Emoji-based flag renderer — renders the regional indicator emoji in an SVG
function codeToEmoji(code: string) {
  if (!code || code.length !== 2) return "🏳️";
  const A = 0x1f1e6;
  const chars = code.toUpperCase().split("").map((ch) => String.fromCodePoint(A + ch.charCodeAt(0) - 65));
  return chars.join("");
}

export const FlagEmoji = ({ code = "--", ...props }: { code?: string } & React.SVGProps<SVGSVGElement>) => {
  const emoji = codeToEmoji(code);
  return (
    <svg viewBox="0 0 24 16" width="24" height="16" role="img" aria-label={code} {...props}>
      <rect width="24" height="16" fill="transparent" />
      <text x="12" y="12" textAnchor="middle" fontSize="10" fontFamily="Apple Color Emoji,Segoe UI Emoji, Noto Color Emoji,EmojiSymbols" >{emoji}</text>
    </svg>
  );
};

// Programmatic SVG flag generator — lightweight placeholder SVGs for every country
function colorFromCode(code = "") {
  const s = code.toUpperCase().split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = s % 360;
  return `hsl(${hue} 70% 45%)`;
}

export const FlagAuto = ({ code = "--", ...props }: { code?: string } & React.SVGProps<SVGSVGElement>) => {
  const bg = colorFromCode(code || "--");
  const label = (code || "--").toUpperCase();
  return (
    <svg viewBox="0 0 24 16" width="24" height="16" role="img" aria-label={code} {...props}>
      <rect width="24" height="16" rx="2" fill={bg} />
      <text x="12" y="11" textAnchor="middle" fontSize="7" fontFamily="Inter, Arial, sans-serif" fill="#fff">{label}</text>
    </svg>
  );
};

// no default export
