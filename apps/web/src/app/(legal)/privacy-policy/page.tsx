import { Metadata } from 'next';
import api from '@/lib/api';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our privacy policy explains how we collect, use, and protect your personal information.',
};

async function getPageContent() {
  try {
    return await api.getPage('privacy-policy');
  } catch (error) {
    return null;
  }
}

export default async function PrivacyPolicyPage() {
  const page = await getPageContent();

  return (
    <div className="container max-w-3xl py-12">
      <h1 className="mb-8 text-3xl font-bold">{page?.title || 'Privacy Policy'}</h1>
      {page?.content ? (
        <div
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <div className="prose max-w-none dark:prose-invert">
          <p>Privacy policy content will be available soon.</p>
        </div>
      )}
    </div>
  );
}
