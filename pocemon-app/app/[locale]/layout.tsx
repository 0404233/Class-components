import { NextIntlClientProvider } from 'next-intl';
import { Providers } from '../../components/Providers';
import { getMessages } from '../../lib/getMessages';
import Header from '../../components/header/Header';
import '../globals.css';
import { notFound } from 'next/navigation';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  if (!messages) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
