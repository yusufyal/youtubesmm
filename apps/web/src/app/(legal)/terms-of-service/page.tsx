import { Metadata } from 'next';
import api from '@/lib/api';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Our terms of service outline the rules and guidelines for using our platform.',
};

async function getPageContent() {
  try {
    return await api.getPage('terms-of-service');
  } catch (error) {
    return null;
  }
}

export default async function TermsOfServicePage() {
  const page = await getPageContent();

  return (
    <div className="container max-w-3xl pt-28 pb-12">
      <h1 className="mb-8 text-3xl font-bold">{page?.title || 'Terms of Service'}</h1>
      {page?.content ? (
        <div
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <div className="prose max-w-none dark:prose-invert">
          <p>Terms of service content will be available soon.</p>
        </div>
      )}
    </div>
  );
}
