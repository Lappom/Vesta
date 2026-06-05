import { ImageResponse } from "next/og";

export const alt = "Vesta — Our list for two";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`,
    { next: { revalidate: 60 * 60 * 24 * 30 } },
  ).then((res) => res.text());

  const match = css.match(
    /src: url\((.+)\) format\('(?:opentype|truetype)'\)/,
  );
  if (!match?.[1]) {
    throw new Error(`Failed to load font ${family}`);
  }

  return fetch(match[1]).then((res) => res.arrayBuffer());
}

export default async function Image() {
  const [fraunces, jakarta] = await Promise.all([
    loadGoogleFont("Fraunces", 500),
    loadGoogleFont("Plus+Jakarta+Sans", 500),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fffaf0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "#ffb084",
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            right: -60,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "#ff4d8b",
            opacity: 0.22,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 180,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "#a4d4c5",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 120,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "#b8a4ed",
            opacity: 0.28,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 72px",
            borderRadius: 32,
            background: "rgba(250, 245, 232, 0.92)",
            border: "1px solid #e5e5e5",
            boxShadow: "0 24px 80px rgba(10, 10, 10, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 28,
                background: "#faf5e8",
                border: "1px solid #e5e5e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#ffb084",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 22,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#ff4d8b",
                }}
              />
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderBottom: "22px solid #e8b94a",
                  marginTop: -8,
                }}
              />
            </div>
          </div>

          <div
            style={{
              fontFamily: "Fraunces",
              fontSize: 88,
              fontWeight: 500,
              color: "#0a0a0a",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: 18,
            }}
          >
            Vesta
          </div>

          <div
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: 34,
              fontWeight: 500,
              color: "#1a1a1a",
              marginBottom: 14,
            }}
          >
            Our list for two
          </div>

          <div
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: 24,
              fontWeight: 500,
              color: "#6a6a6a",
              textAlign: "center",
              maxWidth: 640,
              lineHeight: 1.4,
            }}
          >
            Plan dates, outings, and couple moments together
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontFamily: "Plus Jakarta Sans",
            fontSize: 20,
            fontWeight: 500,
            color: "#1a3a3a",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          vesta.lappom.fr
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 500 },
        {
          name: "Plus Jakarta Sans",
          data: jakarta,
          style: "normal",
          weight: 500,
        },
      ],
    },
  );
}
