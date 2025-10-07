// app/layout.tsx
import { MasterKeyProvider } from '@/context/MasterKeyContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* The MasterKeyProvider wraps the whole app */}
        <MasterKeyProvider>
          {children}
        </MasterKeyProvider>
      </body>
    </html>
  );
}