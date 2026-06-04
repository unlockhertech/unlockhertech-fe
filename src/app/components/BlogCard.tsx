import { Link } from "react-router";
import { HiArrowRight, HiOutlineClock } from "react-icons/hi2";
import type { BlogPost } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col"
    >
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <ImageWithFallback 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
      )}
      <div className="p-8 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {post.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-brand-coral bg-brand-coral/5 px-2.5 py-1 rounded-lg">
                {tag}
              </span>
            ))}
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              <HiOutlineClock className="w-3.5 h-3.5" />
              <span>{post.readingTime}</span>
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-coral transition-colors line-clamp-2">
          {post.title}
        </h2>
        
        <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed">
          {post.content?.substring(0, 160).replace(/[#*`]/g, '')}...
        </p>
        
        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">{post.author}</span>
            <span className="text-xs text-gray-500">
              {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-coral group-hover:text-white transition-all">
            <HiArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
