import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog - YouTube Growth Tips & Insights',
  description:
    'Learn how to grow your YouTube channel with our expert tips, strategies, and industry insights.',
  openGraph: {
    title: 'Blog | AYN YouTube',
    description: 'YouTube growth tips, strategies, and industry insights.',
  },
};

async function getPosts() {
  try {
    const response = await api.getPosts();
    return response;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0, from: 0, to: 0 } };
  }
}

export default async function BlogPage() {
  const result = await getPosts();
  const posts = result?.data ?? [];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white py-16 dark:from-red-950/20 dark:to-background">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Tips, strategies, and insights to grow your YouTube channel.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container">
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                    {post.featured_image && (
                      <div className="relative aspect-video">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      {post.category && (
                        <Badge variant="secondary" className="w-fit">
                          {post.category.name}
                        </Badge>
                      )}
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {post.published_at && formatDate(post.published_at)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>No blog posts available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
