import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/lib/utils/locale";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Org & Aura | A Path to Sustainable Solutions",
  description:
    "We are dedicated to bridging the gap between necessary daily hygiene and environmental responsibility through contactless zero-emission sanitary waste elimination.",
  keywords: [
    "Org and Aura",
    "SanDi Machine",
    "sustainable hygiene",
    "sanitary waste disposal",
    "thermal degradation",
    "zero emission",
  ],
  authors: [{ name: "Org & Aura Foundation" }],
  icons: {
    icon: "/assets/branding/logo.png",
  },
  openGraph: {
    title: "Org & Aura | Sustainable Waste Elimination",
    description:
      "Bridging necessary daily hygiene and environmental responsibility with The SanDi Machine.",
    siteName: "Org & Aura",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${plusJakarta.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  if(typeof Number!=='undefined'&&Number.prototype.toLocaleString){
    var oN=Number.prototype.toLocaleString;
    Number.prototype.toLocaleString=function(l,o){return oN.call(this,l||'en-US',o);};
  }
  if(typeof Date!=='undefined'){
    var oD=Date.prototype.toLocaleString;
    Date.prototype.toLocaleString=function(l,o){return oD.call(this,l||'en-US',o);};
    var oDate=Date.prototype.toLocaleDateString;
    Date.prototype.toLocaleDateString=function(l,o){return oDate.call(this,l||'en-US',o);};
    var oTime=Date.prototype.toLocaleTimeString;
    Date.prototype.toLocaleTimeString=function(l,o){return oTime.call(this,l||'en-US',o);};
  }
})();
            `.trim(),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans min-h-screen flex flex-col bg-cream-100 text-charcoal-900 antialiased selection:bg-forest-100 selection:text-forest-900"
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
