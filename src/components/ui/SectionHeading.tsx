import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  number?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  number,
  align = "left",
  theme = "light",
  className = "",
}: SectionHeadingProps) {
  const dark = theme === "dark";

  return (
    <div
      className={[
        "grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20",
        align === "center"
          ? "text-center"
          : "text-left",
        className,
      ].join(" ")}
    >
      {/* Label */}
      <div>
        {eyebrow && (
          <div
            className={[
              "flex items-center gap-4",
              align === "center"
                ? "justify-center lg:justify-start"
                : "",
            ].join(" ")}
          >
            {number && (
              <span
                className={[
                  "font-mono text-[9px]",
                  dark
                    ? "text-[#F3EDE2]/30"
                    : "text-[#111111]/35",
                ].join(" ")}
              >
                {number}
              </span>
            )}

            <p
              className={[
                "shop-eyebrow",
                dark
                  ? "text-[#F3EDE2]/45"
                  : "text-shop-muted",
              ].join(" ")}
            >
              {eyebrow}
            </p>
          </div>
        )}
      </div>

      {/* Main content */}
      <div>
        <h2
          className={[
            "shop-display max-w-6xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]",
            dark
              ? "text-[#F3EDE2]"
              : "text-[#111111]",
            align === "center"
              ? "mx-auto"
              : "",
          ].join(" ")}
        >
          {title}
        </h2>

        {description && (
          <div
            className={[
              "mt-8 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8",
              align === "center"
                ? "mx-auto"
                : "",
              dark
                ? "text-[#F3EDE2]/50"
                : "text-shop-muted",
            ].join(" ")}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
}