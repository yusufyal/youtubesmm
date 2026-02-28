import { Metadata } from 'next';
import api from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Comprehensive Refund Policy',
  description: 'Review the AYN YouTube refund policy to understand your rights, eligibility, and service terms. Learn how refunds work and contact support for help today.',
};

async function getPageContent() {
  try {
    return await api.getPage('refund-policy');
  } catch (error) {
    return null;
  }
}

export default async function RefundPolicyPage() {
  const page = await getPageContent();

  return (
    <div className="container max-w-3xl pt-28 pb-12">
      <h1 className="mb-8 text-3xl font-bold">{page?.title || 'Refund Policy'}</h1>
      {page?.content ? (
        <div
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <div className="prose max-w-none dark:prose-invert">
          <p>Refund policy content will be available soon.</p>
        </div>
      )}
    </div>
  );
}
