import { NextIntlClientProvider } from 'next-intl';
import { Providers } from '../../components/Providers';
import { getMessages } from '../../lib/getMessages';
import Header from '../../components/header/Header';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header></Header>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
