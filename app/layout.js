export const metadata = {
  title: "Rey Control",
  description: "Sistema de administración de clientes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
