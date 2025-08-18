'use client';

import { usePathname, useRouter } from '../../i18n/navigation';
import { locales } from '../../i18n/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    router.replace(pathWithoutLocale, { locale: newLocale });
  };

  return (
    <select onChange={handleChange} defaultValue={locale}>
      {locales.map((localeOption) => (
        <option key={localeOption} value={localeOption}>
          {localeOption.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
