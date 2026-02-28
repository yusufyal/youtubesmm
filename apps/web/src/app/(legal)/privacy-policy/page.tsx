import { Metadata } from 'next';
import api from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Privacy Policy | Protect Your Data',
  description: 'Read the AYN YouTube privacy policy to see how your data is collected and protected. Learn about your rights and how we keep your information secure today.',
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
    <div className="container max-w-3xl pt-28 pb-12">
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
