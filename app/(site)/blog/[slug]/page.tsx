import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import prisma from "@/lib/prisma";
import BotanicalFrame from "@/components/ui/BotanicalFrame";

interface Props {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });
  if (!post) return { title: "Article Not Found | Org & Aura" };

  return {
    title: `${post.title} | Org & Aura`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.publishedAt));

  return (
    <div className="w-full relative flex flex-col items-center">
      <BotanicalFrame position="top" className="w-full max-w-4xl" />

      <article className="w-full max-w-3xl px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900 transition-colors bg-cream-50 hover:bg-cream-200 px-3.5 py-1.5 rounded-full border border-cream-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to News &amp; Insights</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 text-left">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              <span>{post.category}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-charcoal-600">
              <Calendar className="w-3 h-3" />
              <span>{dateFormatted}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-forest-900 leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-normal border-l-2 border-forest-500 pl-4 py-1 italic bg-cream-50/70 rounded-r-lg">
            {post.excerpt}
          </p>
        </header>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-cream-200 border border-cream-300 shadow-organic">
          <Image
            src={post.imageRef || "/assets/blog/waste-management.svg"}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="space-y-5 text-sm sm:text-base text-charcoal-800 leading-relaxed pt-4 font-normal">
          {post.body.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2
                  key={index}
                  className="text-xl sm:text-2xl font-serif font-bold text-forest-900 pt-4"
                >
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3
                  key={index}
                  className="text-lg sm:text-xl font-serif font-semibold text-forest-800 pt-2"
                >
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* Bottom CTA & Share Section */}
        <div className="pt-8 border-t border-cream-300">
          <div className="card-warm p-6 text-center space-y-3">
            <h3 className="text-base sm:text-lg font-serif font-bold text-forest-900">
              Partner with Org &amp; Aura
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-700 max-w-md mx-auto">
              Bring zero-emission, contactless sanitary disposal to your educational or healthcare institution.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/support"
                className="bg-forest-500 hover:bg-forest-600 text-white text-xs font-semibold px-5 py-2 rounded-full transition-all shadow-sm"
              >
                Request Consultation
              </Link>
            </div>
          </div>
        </div>
      </article>

      <BotanicalFrame position="bottom" className="w-full max-w-4xl" />
    </div>
  );
}
