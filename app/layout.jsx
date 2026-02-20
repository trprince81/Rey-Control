export const metadata = {
  title: "Imperio S&D",
  description: "Sistema de gestión",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
