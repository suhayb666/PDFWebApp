import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PostFrontmatter {
  title: string;
  date: string;
  author: string;
  excerpt: string;
}

export default function BlogPage() {
  const files = fs.readdirSync(path.join(process.cwd(), "src", "blogs"));

  const posts = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), "src", "blogs", filename),
      "utf-8"
    );
    const { data: frontmatter } = matter(markdownWithMeta);
    const slug = filename.replace(".md", "");

    return {
      slug,
      frontmatter: frontmatter as PostFrontmatter,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Navbar />

      <div className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Blogs</h1>

          {posts.map(({ slug, frontmatter }) => (
            <div
              key={slug}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-200"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {frontmatter.title}
              </h2>
              <p className="text-gray-500 mb-2">
                {frontmatter.date} — {frontmatter.author}
              </p>
              <p className="text-gray-700 mb-4">{frontmatter.excerpt}</p>
              <Link
                href={`/blog/${slug}`}
                className="text-indigo-600 hover:underline font-medium"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
