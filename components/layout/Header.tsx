"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
// import AdminNav from "@/components/admin/AdminNav"; // DISABLED: Admin panel completely removed
import { Search, X, User, ChevronDown, LayoutGrid, Home, FileText, Info, Mail, ShoppingBag, Download, Settings } from "lucide-react";
// import { isAdmin, getSession } from "@/lib/auth/auth"; // DISABLED: Admin panel completely removed
import { getAllTemplates } from "@/lib/db/queries";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { EditableText } from "@/components/shared/EditableText";

// Prevent double rendering
let headerRendered = false;

export default function Header() {
  // Prevent double rendering in development/preview
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => {
      headerRendered = false;
    };
  }, []);
  
  if (!mounted && typeof window !== 'undefined') {
    return null;
  }
  const router = useRouter();
  const pathname = usePathname();
  const { settings, t } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [userIsAdmin, setUserIsAdmin] = useState(false); // DISABLED: Admin panel completely removed
  const [user, setUser] = useState<any>(null);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [allTemplates, setAllTemplates] = useState<any[]>([]);
  const adminDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Get site name from settings or use default
  const siteName = settings?.siteName || "Azone";

  // Check if user is admin - DISABLED: Admin panel completely removed
  // useEffect(() => {
  //   const checkUser = async () => {
  //     const { user: sessionUser } = await getSession();
  //     setUser(sessionUser);
  //     if (sessionUser) {
  //       const admin = await isAdmin();
  //       setUserIsAdmin(admin);
  //     }
  //   };
  //   checkUser();
  // }, []);

  // Fetch categories and templates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const templates = await getAllTemplates();
        setAllTemplates(templates);
        const uniqueCategories = Array.from(new Set(templates.map(t => t.category))).sort();
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      const suggestions = allTemplates
        .filter((template) => {
          const titleMatch = template.title.toLowerCase().includes(query);
          const descMatch = template.description?.toLowerCase().includes(query);
          const categoryMatch = template.category?.toLowerCase().includes(query);
          const techMatch = template.techStack?.some((tech: string) =>
            tech.toLowerCase().includes(query)
          );
          return titleMatch || descMatch || categoryMatch || techMatch;
        })
        .slice(0, 5); // Limit to 5 suggestions
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, allTemplates]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAdminDropdownOpen(false);
      }
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node)
      ) {
        setSearchSuggestions([]);
      }
    };

    if (isAdminDropdownOpen || isAccountDropdownOpen || isCategoryDropdownOpen || searchSuggestions.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdminDropdownOpen, isAccountDropdownOpen, isCategoryDropdownOpen, searchSuggestions.length]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/templates?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Keyboard navigation for dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close dropdowns on Escape
      if (e.key === "Escape") {
        setIsCategoryDropdownOpen(false);
        setIsAccountDropdownOpen(false);
        setIsAdminDropdownOpen(false);
        setIsSearchOpen(false);
        setSearchSuggestions([]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keyboard navigation for search suggestions
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  useEffect(() => {
    const handleSearchKeyDown = (e: KeyboardEvent) => {
      if (!searchSuggestions.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < searchSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : searchSuggestions.length - 1
        );
      } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        const selected = searchSuggestions[selectedSuggestionIndex];
        if (selected) {
          router.push(`/templates/${selected.slug}`);
          setSearchQuery("");
          setSearchSuggestions([]);
          setSelectedSuggestionIndex(-1);
        }
      }
    };

    if (searchInputRef.current) {
      searchInputRef.current.addEventListener("keydown", handleSearchKeyDown);
      return () => {
        searchInputRef.current?.removeEventListener("keydown", handleSearchKeyDown);
      };
    }
  }, [searchSuggestions, selectedSuggestionIndex, router]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [searchQuery]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? "bg-azone-black/80 backdrop-blur-md shadow-sm border-b border-gray-800"
        : "bg-azone-black"
        }`}
      style={{ position: 'sticky' }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
            aria-label={`${siteName} Home`}
          >
            <div className="text-2xl md:text-3xl font-bold">
              <EditableText
                id="header-site-name"
                defaultText={siteName}
                className="text-white"
                onSave={async (newText) => {
                  // Update siteName in settings
                  await fetch("/api/settings", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ siteName: newText }),
                  });
                  // Refresh settings context
                  window.location.reload();
                }}
              />
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative" ref={searchDropdownRef}>
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) {
                    // Suggestions will show automatically via useEffect
                  }
                }}
                placeholder="Search templates..."
                className="w-full px-4 py-2 pl-10 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-azone-purple transition-colors text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </form>
            {/* Search Suggestions Dropdown */}
            {searchSuggestions.length > 0 && (
              <div
                role="listbox"
                aria-label="Search suggestions"
                className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
              >
                {searchSuggestions.map((template, index) => (
                  <Link
                    key={template.id}
                    href={`/templates/${template.slug}`}
                    onClick={() => {
                      setSearchQuery("");
                      setSearchSuggestions([]);
                      setSelectedSuggestionIndex(-1);
                    }}
                    role="option"
                    aria-selected={selectedSuggestionIndex === index}
                    className={`block px-4 py-3 transition-colors border-b border-gray-800 last:border-b-0 ${selectedSuggestionIndex === index
                      ? "bg-azone-purple/20 border-azone-purple/50"
                      : "hover:bg-gray-800"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      {template.imageUrl && (
                        <img
                          src={template.imageUrl}
                          alt={template.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {template.title}
                        </h4>
                        <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                          {template.shortDescription || template.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-azone-purple font-medium">
                            ${Math.round(template.price)}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-300">{template.category}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 focus-visible:rounded ${pathname === "/"
                ? "text-azone-purple border-b-2 border-azone-purple pb-1"
                : "text-gray-300 hover:text-white"
                }`}
            >
              {t("home")}
            </Link>
            {/* Categories Dropdown */}
            {categories.length > 0 && (
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                    }
                  }}
                  aria-expanded={isCategoryDropdownOpen}
                  aria-haspopup="true"
                  aria-label="Categories menu"
                  className={`text-sm font-medium transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 focus-visible:rounded ${pathname?.startsWith("/templates")
                    ? "text-azone-purple border-b-2 border-azone-purple pb-1"
                    : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    {t("categories")}
                    <ChevronDown
                    className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {/* Categories Dropdown Menu */}
                {isCategoryDropdownOpen && (
                  <div
                    role="menu"
                    aria-label="Categories"
                    className="absolute top-full left-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    <Link
                      href="/templates"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                      role="menuitem"
                      className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors border-b border-gray-800 focus-visible:bg-gray-800 focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-[-2px]"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4" />
                        {t("all-templates")}
                      </div>
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/templates?category=${encodeURIComponent(category)}`}
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        role="menuitem"
                        className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors focus-visible:bg-gray-800 focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-[-2px]"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            <Link
              href="/templates"
              className={`text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 focus-visible:rounded ${pathname?.startsWith("/templates")
                ? "text-azone-purple border-b-2 border-azone-purple pb-1"
                : "text-gray-300 hover:text-white"
                }`}
            >
              {t("templates")}
            </Link>
            <Link
              href="/case-studies"
              className={`text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 focus-visible:rounded ${pathname?.startsWith("/case-studies")
                ? "text-azone-purple border-b-2 border-azone-purple pb-1"
                : "text-gray-300 hover:text-white"
                }`}
            >
              {t("case-studies")}
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 focus-visible:rounded ${pathname === "/about"
                ? "text-azone-purple border-b-2 border-azone-purple pb-1"
                : "text-gray-300 hover:text-white"
                }`}
            >
              {t("about")}
            </Link>
            {/* Admin Dropdown - DISABLED: Completely removed from public UI */}
            {/* Account Dropdown - Only show if user is logged in */}
            {user && (
              <div className="relative" ref={accountDropdownRef}>
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsAccountDropdownOpen(!isAccountDropdownOpen);
                    }
                  }}
                  aria-expanded={isAccountDropdownOpen}
                  aria-haspopup="true"
                  aria-label="Account menu"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 focus-visible:rounded"
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isAccountDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {/* Account Dropdown Menu */}
                {isAccountDropdownOpen && (
                  <div
                    role="menu"
                    aria-label="Account"
                    className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    <Link
                      href="/account"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      role="menuitem"
                      className={`block px-4 py-3 text-sm transition-colors focus-visible:bg-gray-800 focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-[-2px] ${pathname === "/account"
                        ? "text-azone-purple bg-gray-800"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Dashboard
                      </div>
                    </Link>
                    <Link
                      href="/account/purchases"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      role="menuitem"
                      className={`block px-4 py-3 text-sm transition-colors focus-visible:bg-gray-800 focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-[-2px] ${pathname === "/account/purchases"
                        ? "text-azone-purple bg-gray-800"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        Purchases
                      </div>
                    </Link>
                    <Link
                      href="/account/downloads"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      role="menuitem"
                      className={`block px-4 py-3 text-sm transition-colors focus-visible:bg-gray-800 focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-[-2px] ${pathname === "/account/downloads"
                        ? "text-azone-purple bg-gray-800"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Downloads
                      </div>
                    </Link>
                    <div className="border-t border-gray-800">
                      <Link
                        href="/account/settings"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        role="menuitem"
                        className={`block px-4 py-3 text-sm transition-colors focus-visible:bg-gray-800 focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-[-2px] ${pathname === "/account/settings"
                          ? "text-azone-purple bg-gray-800"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Settings
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-5">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 focus-visible:rounded"
              aria-label="Search"
              aria-expanded={isSearchOpen}
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* AdminNav - DISABLED: Completely removed from public UI */}
            {false ? (
              null
            ) : (
              <>
                <Link
                  href="/contact"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/services"
                  className="hidden sm:inline-block px-6 py-2.5 text-sm font-semibold bg-azone-purple text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-azone-purple/50"
                  aria-label="Get Started"
                >
                  Get Started
                </Link>
              </>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 focus-visible:rounded"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 px-4 relative" ref={searchDropdownRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full px-4 py-2 pl-10 pr-10 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-azone-purple transition-colors text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 focus-visible:rounded"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
            {/* Mobile Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
                {searchSuggestions.map((template) => (
                  <Link
                    key={template.id}
                    href={`/templates/${template.slug}`}
                    onClick={() => {
                      setSearchQuery("");
                      setSearchSuggestions([]);
                      setIsSearchOpen(false);
                    }}
                    className="block px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {template.imageUrl && (
                        <img
                          src={template.imageUrl}
                          alt={template.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {template.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ${Math.round(template.price)} • {template.category}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${pathname === "/"
                  ? "text-azone-purple bg-gray-900/50"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                  }`}
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
              {categories.length > 0 && (
                <div className="px-4 py-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Categories
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/templates"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${pathname?.startsWith("/templates") && !pathname.includes("?category")
                        ? "text-azone-purple bg-gray-900/50"
                        : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                        }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      All Templates
                    </Link>
                    {categories.slice(0, 5).map((category) => (
                      <Link
                        key={category}
                        href={`/templates?category=${encodeURIComponent(category)}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${pathname?.includes(`category=${encodeURIComponent(category)}`)
                          ? "text-azone-purple bg-gray-900/50"
                          : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                          }`}
                      >
                        <div className="w-4 h-4 rounded bg-gray-700" />
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <Link
                href="/templates"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${pathname?.startsWith("/templates")
                  ? "text-azone-purple bg-gray-900/50"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                  }`}
              >
                <FileText className="w-5 h-5" />
                Templates
              </Link>
              <Link
                href="/case-studies"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${pathname?.startsWith("/case-studies")
                  ? "text-azone-purple bg-gray-900/50"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                  }`}
              >
                <FileText className="w-5 h-5" />
                Case Studies
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${pathname === "/about"
                  ? "text-azone-purple bg-gray-900/50"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                  }`}
              >
                <Info className="w-5 h-5" />
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${pathname === "/contact"
                  ? "text-azone-purple bg-gray-900/50"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                  }`}
              >
                <Mail className="w-5 h-5" />
                Contact
              </Link>
            </div>

            {/* Account Section - Mobile */}
            {user && (
              <div className="border-t border-gray-800 pt-2 mt-2">
                <div className="px-4 py-2 text-xs font-semibold text-azone-purple uppercase tracking-wider">
                  Account
                </div>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${pathname === "/account"
                    ? "text-azone-purple bg-gray-900/50"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                    }`}
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/account/purchases"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${pathname === "/account/purchases"
                    ? "text-azone-purple bg-gray-900/50"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                    }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Purchases
                </Link>
                <Link
                  href="/account/downloads"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${pathname === "/account/downloads"
                    ? "text-azone-purple bg-gray-900/50"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                    }`}
                >
                  <Download className="w-4 h-4" />
                  Downloads
                </Link>
                <Link
                  href="/account/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${pathname === "/account/settings"
                    ? "text-azone-purple bg-gray-900/50"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/30"
                    }`}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </div>
            )}
            {/* Mobile Admin Section - DISABLED: Completely removed from public UI */}
            <Link
              href="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block mx-4 mt-4 px-6 py-2.5 text-sm font-semibold bg-azone-purple text-white rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-azone-purple/50"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

