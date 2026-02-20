export const metadata = {
  title: "Imperio S&D",
  description: "Sistema",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
