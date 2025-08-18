import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '../lib/getMessages';
import NotFoundPage from '../components/notFoundPage/NotFoundPage';

type Props = {
  params: {
    locale: string;
  };
};

export default async function NotFound({ params }: Props) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <NotFoundPage />
      </NextIntlClientProvider>
    </html>
  );
}
