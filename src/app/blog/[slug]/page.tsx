import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BlogPostProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), "src", "blogs"));
  return files.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
}

export default async function BlogPost({ params }: BlogPostProps) {
  const filePath = path.join(process.cwd(), "src", "blogs", `${params.slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const { data: frontmatter, content } = matter(fileContent);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Navbar />

      <div className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {frontmatter.title}
          </h1>
          <p className="text-gray-500 mb-8">
            {frontmatter.date} — {frontmatter.author}
          </p>
          <div
            className="prose prose-indigo max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
