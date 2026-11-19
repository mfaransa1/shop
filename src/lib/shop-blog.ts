export type BlogPost = {
  id: string; title: string; slug: string; excerpt: string; content: string;
  category: string; cover_image: string; author: string; status: "draft" | "published" | "archived";
  published_at: string | null; read_minutes: number; featured: boolean; tags: string[];
  created_at?: string; updated_at?: string;
};
const fields = "id,title,slug,excerpt,content,category,cover_image,author,status,published_at,read_minutes,featured,tags,created_at,updated_at";
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)return [];
  try {
    const q=new URLSearchParams({select:fields,status:"eq.published",order:"featured.desc,published_at.desc",limit:"100"});
    const r=await fetch(`${url}/rest/v1/shop_blog_posts?${q}`,{headers:{apikey:key,Authorization:`Bearer ${key}`},next:{revalidate:60}});
    if(!r.ok)return []; const data:unknown=await r.json(); return Array.isArray(data)?data as BlogPost[]:[];
  } catch{return []}
}
export async function getPublishedBlogPost(slug:string):Promise<BlogPost|null>{return (await getPublishedBlogPosts()).find(p=>p.slug===slug)??null}
export function blogDate(value:string|null){if(!value)return "Recently published";const d=new Date(value);return Number.isNaN(d.getTime())?"Recently published":new Intl.DateTimeFormat("en-KE",{day:"numeric",month:"long",year:"numeric"}).format(d)}
