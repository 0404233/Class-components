export async function getMessages(locale: string) {
  try {
    const messagesModule = await import(`../locales/${locale}.json`);
    return JSON.parse(JSON.stringify(messagesModule.default));
  } catch {
    return null;
  }
}
