import { useState, useEffect } from "react";
import { SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import classNames from "classnames";

import useTitle from "@/hooks";

// Dummy data for demonstration
const BLOG_TYPES = [
    { label: "Tất cả", value: "" },
    { label: "Review", value: "review" },
    { label: "Tin tức", value: "news" },
    { label: "Phân tích", value: "analysis" },
    { label: "Top list", value: "toplist" },
];

const SORT_OPTIONS = [
    { label: "Mới nhất", value: "newest" },
    { label: "Cũ nhất", value: "oldest" },
];

const TAGS = [
    "Hành động",
    "Kinh dị",
    "Lãng mạn",
    "Hài",
    "Phiêu lưu",
    "Gia đình",
    "Hoạt hình",
    "Khoa học viễn tưởng",
    "Tâm lý",
    "Thể thao",
];

const DUMMY_BLOGS = Array.from({ length: 18 }).map((_, i) => ({
    id: i + 1,
    title: `Bài viết mẫu số ${i + 1}`,
    type: BLOG_TYPES[(i % (BLOG_TYPES.length - 1)) + 1].label,
    typeValue: BLOG_TYPES[(i % (BLOG_TYPES.length - 1)) + 1].value,
    excerpt:
        "Đây là mô tả ngắn cho bài viết mẫu. Nội dung này sẽ giúp bạn hiểu sơ lược về bài viết.",
    author: `Tác giả ${i % 4 + 1}`,
    date: `2024-0${(i % 6) + 1}-0${(i % 9) + 1}`,
    thumbnail: `https://picsum.photos/seed/blog${i + 1}/400/250`,
    tags: [TAGS[i % TAGS.length], TAGS[(i + 2) % TAGS.length]],
    featured: i % 7 === 0,
}));

const POPULAR_TAGS = TAGS.slice(0, 6);

const PAGE_SIZE = 6;

function Blog() {

    useTitle('Movie Ticket Booking - Blog');
    // State
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [sort, setSort] = useState("newest");
    const [selectedTags, setSelectedTags] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [total, setTotal] = useState(0);

    // Sidebar data
    const featuredBlogs = DUMMY_BLOGS.filter((b) => b.featured).slice(0, 3);
    const recentBlogs = DUMMY_BLOGS.slice(-3).reverse();

    // Filter, search, sort, paginate
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            let filtered = DUMMY_BLOGS.filter((b) => {
                const matchSearch =
                    b.title.toLowerCase().includes(search.toLowerCase()) ||
                    b.excerpt.toLowerCase().includes(search.toLowerCase());
                const matchType = !type || b.typeValue === type;
                const matchTags =
                    selectedTags.length === 0 ||
                    selectedTags.every((tag) => b.tags.includes(tag));
                return matchSearch && matchType && matchTags;
            });

            filtered = filtered.sort((a, b) => {
                if (sort === "newest") return new Date(b.date) - new Date(a.date);
                return new Date(a.date) - new Date(b.date);
            });

            setTotal(filtered.length);
            setBlogs(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
            setLoading(false);
        }, 500); // Simulate loading
    }, [search, type, sort, selectedTags, page]);

    // Pagination
    const totalPages = Math.ceil(total / PAGE_SIZE);

    // Tag select
    const toggleTag = (tag) => {
        setPage(1);
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    // Reset page on filter change
    useEffect(() => {
        setPage(1);
    }, [search, type, sort, selectedTags]);

    return (
        <div className="bg-[#0e1014] min-h-screen pt-24 pb-10 px-2 md:px-8">
            
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Search & Filters */}
                    <div className="bg-gray-900/80 rounded-xl p-4 mb-6 shadow flex flex-col md:flex-row md:items-center gap-4">
                        {/* Search */}
                        <div className="flex-1 flex items-center bg-gray-800 rounded px-3 py-2">
                            <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                className="bg-transparent outline-none text-white flex-1"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {/* Type */}
                        <select
                            className="bg-gray-800 text-white rounded px-3 py-2"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            {BLOG_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                        {/* Sort */}
                        <select
                            className="bg-gray-800 text-white rounded px-3 py-2"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            {SORT_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    className={classNames(
                                        "px-3 py-1 rounded-full text-xs border transition",
                                        selectedTags.includes(tag)
                                            ? "bg-primary text-white border-primary"
                                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-primary/20"
                                    )}
                                    onClick={() => toggleTag(tag)}
                                    type="button"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Blog List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading
                            ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse bg-gray-800 rounded-xl h-72"
                                ></div>
                            ))
                            : blogs.map((blog) => (
                                <div
                                    key={blog.id}
                                    className="group bg-gray-900/80 rounded-xl shadow hover:shadow-lg transition hover:-translate-y-1 overflow-hidden flex flex-col"
                                >
                                    <div className="relative">
                                        <img
                                            src={blog.thumbnail}
                                            alt={blog.title}
                                            className="w-full h-44 object-cover group-hover:scale-105 transition"
                                            loading="lazy"
                                        />
                                        <span className="absolute top-2 left-2 bg-primary text-xs px-2 py-1 rounded-full font-semibold">
                                            {blog.type}
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col p-4">
                                        <h2 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition">
                                            {blog.title}
                                        </h2>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {blog.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-gray-800 text-xs px-2 py-0.5 rounded-full text-gray-400"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                            {blog.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span>{blog.author}</span>
                                                <span>•</span>
                                                <span>
                                                    {new Date(blog.date).toLocaleDateString("vi-VN")}
                                                </span>
                                            </div>
                                            <a
                                                href={`/blog/${blog.id}`}
                                                className="text-primary font-semibold text-xs hover:underline"
                                            >
                                                Đọc tiếp
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            className="p-2 rounded-full hover:bg-gray-800 disabled:opacity-50"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            aria-label="Trang trước"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                className={classNames(
                                    "px-3 py-1 rounded font-semibold text-sm transition",
                                    page === i + 1
                                        ? "bg-primary text-white"
                                        : "bg-gray-800 text-gray-300 hover:bg-primary/20"
                                )}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="p-2 rounded-full hover:bg-gray-800 disabled:opacity-50"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            aria-label="Trang sau"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        {/* Load more button (alternative to pagination) */}
                        {/* <button
              className="ml-4 px-5 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Tải thêm
            </button> */}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="w-full md:w-80 flex-shrink-0 space-y-8">
                    {/* Featured */}
                    <div className="bg-gray-900/80 rounded-xl p-4 shadow">
                        <h3 className="font-bold text-lg mb-3 text-primary">
                            Bài viết nổi bật
                        </h3>
                        <div className="space-y-3">
                            {featuredBlogs.map((blog) => (
                                <a
                                    key={blog.id}
                                    href={`/blog/${blog.id}`}
                                    className="flex items-center gap-3 group"
                                >
                                    <img
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        className="w-16 h-12 object-cover rounded-lg group-hover:scale-105 transition"
                                    />
                                    <div>
                                        <div className="font-semibold text-sm group-hover:text-primary transition line-clamp-2">
                                            {blog.title}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(blog.date).toLocaleDateString("vi-VN")}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                    {/* Popular tags */}
                    <div className="bg-gray-900/80 rounded-xl p-4 shadow">
                        <h3 className="font-bold text-lg mb-3 text-primary">
                            Thẻ phổ biến
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {POPULAR_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    className={classNames(
                                        "px-3 py-1 rounded-full text-xs border transition",
                                        selectedTags.includes(tag)
                                            ? "bg-primary text-white border-primary"
                                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-primary/20"
                                    )}
                                    onClick={() => toggleTag(tag)}
                                    type="button"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Recent posts */}
                    <div className="bg-gray-900/80 rounded-xl p-4 shadow">
                        <h3 className="font-bold text-lg mb-3 text-primary">
                            Bài viết gần đây
                        </h3>
                        <div className="space-y-3">
                            {recentBlogs.map((blog) => (
                                <a
                                    key={blog.id}
                                    href={`/blog/${blog.id}`}
                                    className="flex items-center gap-3 group"
                                >
                                    <img
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        className="w-14 h-10 object-cover rounded-lg group-hover:scale-105 transition"
                                    />
                                    <div>
                                        <div className="font-semibold text-sm group-hover:text-primary transition line-clamp-2">
                                            {blog.title}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(blog.date).toLocaleDateString("vi-VN")}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                    {/* Banner quảng cáo */}
                    <div className="bg-gray-900/80 rounded-xl p-4 shadow flex items-center justify-center min-h-[100px]">
                        <img
                            src="https://dummyimage.com/250x100/222/fff&text=Quảng+c%C3%A1o"
                            alt="Banner quảng cáo"
                            className="rounded"
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Blog;