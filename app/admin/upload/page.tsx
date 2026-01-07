"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, X, Check, AlertCircle, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/auth/supabase-client";
import { cache, CacheKeys } from "@/lib/utils/cache";

type Status = "draft" | "private" | "public";

export default function AdminUploadPage() {
    const [formData, setFormData] = useState({
        title: "",
        category: "SaaS",
        priceType: "paid" as "free" | "paid",
        price: "",
        // Hidden fields with defaults
        shortDescription: "",
        description: "",
        status: "public" as Status,
        version: "1.0.0",
        demoUrl: "",
        framework: ["Next.js"] as string[],
        language: "typescript",
        styling: "tailwind",
        licenseType: "commercial" as const,
        licenseSummary: "",
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        downloadPermission: "purchase" as "public" | "purchase" | "admin",
    });

    const [downloadUrls, setDownloadUrls] = useState<string[]>([""]);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [zipFiles, setZipFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<string>("");

    // Debounce timer for auto-fill
    const autoFillTimerRef = useRef<NodeJS.Timeout | null>(null);

    const categoryOptions = [
        "SaaS",
        "Dashboard",
        "E-commerce",
        "Landing Page",
        "Admin Panel",
        "Portfolio",
        "Other"
    ];

    // Auto-fill helper - only runs on blur, not every keystroke
    const autoFillFromTitle = (title: string) => {
        if (!title || title.length < 3) return;

        const suggestions: Partial<typeof formData> = {};

        // Auto-detect category
        const titleLower = title.toLowerCase();
        if (titleLower.includes("dashboard") || titleLower.includes("admin")) {
            suggestions.category = "Dashboard";
        } else if (titleLower.includes("ecommerce") || titleLower.includes("shop")) {
            suggestions.category = "E-commerce";
        } else if (titleLower.includes("landing") || titleLower.includes("marketing")) {
            suggestions.category = "Landing Page";
        } else if (titleLower.includes("portfolio")) {
            suggestions.category = "Portfolio";
        }

        // Auto-generate descriptions
        if (!formData.shortDescription) {
            suggestions.shortDescription = `Premium ${title} - Production-ready template with modern design and best practices.`;
        }
        if (!formData.description) {
            suggestions.description = `A high-end, production-ready ${title.toLowerCase()} template built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion. Features dark mode design and smooth animations.`;
        }

        // Auto-generate meta fields
        if (!formData.metaTitle) {
            suggestions.metaTitle = `${title} | Premium Template | Azone.store`;
        }
        if (!formData.metaDescription) {
            suggestions.metaDescription = suggestions.shortDescription || `Premium ${title} template`;
        }
        if (!formData.keywords) {
            const words = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            suggestions.keywords = words.join(", ");
        }

        if (Object.keys(suggestions).length > 0) {
            setFormData((prev) => ({ ...prev, ...suggestions }));
        }
    };

    // Simple input change handler - no auto-fill on every keystroke
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    // Auto-fill on blur (when user leaves title field)
    const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const title = e.target.value;
        if (title && title.length >= 3) {
            // Clear any existing timer
            if (autoFillTimerRef.current) {
                clearTimeout(autoFillTimerRef.current);
            }
            // Run auto-fill after a short delay
            autoFillTimerRef.current = setTimeout(() => {
                autoFillFromTitle(title);
            }, 300);
        }
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (autoFillTimerRef.current) {
                clearTimeout(autoFillTimerRef.current);
            }
        };
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB");
                return;
            }
            setImageFile(file);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleZipChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.name.endsWith(".zip")) {
                setError("Please select a ZIP file");
                return;
            }
            if (file.size > 100 * 1024 * 1024) {
                setError("ZIP file size must be less than 100MB");
                return;
            }
            const newZipFiles = [...zipFiles];
            newZipFiles[index] = file;
            setZipFiles(newZipFiles);
            setError(null);
        }
    };

    const addZipFile = () => {
        setZipFiles([...zipFiles, null as any]);
    };

    const removeZipFile = (index: number) => {
        if (zipFiles.length > 1) {
            const newZipFiles = zipFiles.filter((_, i) => i !== index);
            setZipFiles(newZipFiles);
        }
    };

    const addDownloadUrl = () => {
        setDownloadUrls([...downloadUrls, ""]);
    };

    const removeDownloadUrl = (index: number) => {
        if (downloadUrls.length > 1) {
            const newUrls = downloadUrls.filter((_, i) => i !== index);
            setDownloadUrls(newUrls);
            const newZipFiles = zipFiles.filter((_, i) => i !== index);
            setZipFiles(newZipFiles);
        }
    };

    const handleDownloadUrlChange = (index: number, value: string) => {
        const newUrls = [...downloadUrls];
        newUrls[index] = value;
        setDownloadUrls(newUrls);
    };

    // Upload file directly to Supabase Storage
    const uploadFileToStorage = async (file: File, folder: "previews" | "downloads", templateSlug: string): Promise<string> => {
        const fileSizeMB = file.size / (1024 * 1024);
        console.log(`[Direct Upload] Starting upload: ${file.name} (${fileSizeMB.toFixed(2)}MB) to ${folder}/`);

        try {
            const supabase = createClient();
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseAnonKey) {
                throw new Error("Supabase environment variables are not configured");
            }

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                throw new Error("You must be logged in to upload files");
            }

            const bucketName = "template-assets";
            const userId = session.user.id;
            const fileExt = file.name.split(".").pop();
            const uniqueFileName = `${templateSlug}-${Date.now()}.${fileExt}`;
            const filePath = `${userId}/${folder}/${uniqueFileName}`;

            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file, {
                    contentType: file.type || "application/octet-stream",
                    upsert: false,
                });

            if (error) {
                throw new Error(`Upload failed: ${error.message}`);
            }

            const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
            if (!publicUrl) {
                throw new Error("Failed to get public URL");
            }

            return publicUrl;
        } catch (error: any) {
            console.error("[Direct Upload] Error:", error);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Simple validation - only essential fields
        if (!formData.title.trim()) {
            setError("Title is required");
            return;
        }
        if (formData.priceType === "paid" && (!formData.price || parseFloat(formData.price) <= 0)) {
            setError("Valid price is required for paid templates");
            return;
        }
        if (!imageFile) {
            setError("Preview image is required");
            return;
        }

        // Check if at least one download URL or ZIP file is provided
        const hasDownloadUrls = downloadUrls.some(url => url.trim() !== "");
        const hasZipFiles = zipFiles.some(file => file !== null && file !== undefined);
        if (!hasDownloadUrls && !hasZipFiles) {
            setError("At least one download URL or ZIP file is required");
            return;
        }

        // Auto-fill descriptions if empty
        if (!formData.shortDescription) {
            formData.shortDescription = `Premium ${formData.title} - Production-ready template`;
        }
        if (!formData.description) {
            formData.description = `A high-end, production-ready ${formData.title.toLowerCase()} template built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.`;
        }

        setIsSubmitting(true);
        setUploadProgress("Preparing upload...");

        try {
            const slug = formData.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_-]+/g, "-")
                .replace(/^-+|-+$/g, "");

            setUploadProgress("Uploading files...");
            const imageUrl = await uploadFileToStorage(imageFile, "previews", slug);

            // Upload ZIP files if any
            const uploadedZipUrls: string[] = [];
            for (let i = 0; i < zipFiles.length; i++) {
                if (zipFiles[i]) {
                    const zipUrl = await uploadFileToStorage(zipFiles[i]!, "downloads", slug);
                    uploadedZipUrls.push(zipUrl);
                }
            }

            // Combine download URLs (from input fields + uploaded ZIP files)
            const allDownloadUrls = [
                ...downloadUrls.filter(url => url.trim() !== ""),
                ...uploadedZipUrls
            ];

            // Use first download URL as primary (for backward compatibility)
            const primaryDownloadUrl = allDownloadUrls[0] || "";

            setUploadProgress("Saving template data...");
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("shortDescription", formData.shortDescription);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("price", formData.priceType === "free" ? "0" : formData.price);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("status", formData.status);
            formDataToSend.append("version", formData.version);
            formDataToSend.append("demoUrl", formData.demoUrl);
            formDataToSend.append("imageUrl", imageUrl);
            formDataToSend.append("zipUrl", primaryDownloadUrl);
            formDataToSend.append("downloadUrls", JSON.stringify(allDownloadUrls));
            formDataToSend.append("downloadPermission", formData.downloadPermission);
            formDataToSend.append("techStack", JSON.stringify({
                framework: formData.framework,
                language: formData.language,
                styling: formData.styling,
            }));
            formDataToSend.append("licenseType", formData.licenseType);
            formDataToSend.append("licenseSummary", formData.licenseSummary);
            formDataToSend.append("metaTitle", formData.metaTitle || formData.title);
            formDataToSend.append("metaDescription", formData.metaDescription || formData.shortDescription);
            formDataToSend.append("keywords", formData.keywords);

            const response = await fetch("/api/upload-template", {
                method: "POST",
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Upload failed" }));
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }

            setSuccess(`Template "${formData.title}" uploaded successfully!`);

            // Clear cache so new template shows immediately
            cache.delete(CacheKeys.TEMPLATES);
            cache.delete(CacheKeys.FEATURED_TEMPLATES);

            // Reset form
            setFormData({
                title: "",
                category: "SaaS",
                priceType: "paid",
                price: "",
                shortDescription: "",
                description: "",
                status: "public",
                version: "1.0.0",
                demoUrl: "",
                framework: ["Next.js"],
                language: "typescript",
                styling: "tailwind",
                licenseType: "commercial",
                licenseSummary: "",
                metaTitle: "",
                metaDescription: "",
                keywords: "",
                downloadPermission: "purchase",
            });
            setImageFile(null);
            setPreviewUrl(null);
            setZipFiles([]);
            setDownloadUrls([""]);

            const imageInput = document.getElementById("image") as HTMLInputElement;
            if (imageInput) imageInput.value = "";

            setUploadProgress("");
            setIsSubmitting(false);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Failed to upload template");
            setUploadProgress("");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-azone-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Upload Template</h1>
                    <p className="text-gray-400">Simple upload form - only essential fields</p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 space-y-6"
                >
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Name (Title) <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            onBlur={handleTitleBlur}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                            placeholder="e.g., Premium SaaS Dashboard Template"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            💡 Auto-fills category and descriptions when you leave this field
                        </p>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Category <span className="text-red-400">*</span>
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                            required
                        >
                            {categoryOptions.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Price Type <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, priceType: "free", price: "0" }));
                                }}
                                className={`px-4 py-3 rounded-lg border-2 transition-all ${formData.priceType === "free"
                                    ? "border-azone-purple bg-azone-purple/20 text-white"
                                    : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600"
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-lg">🆓</span>
                                    <span className="font-medium">Free</span>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, priceType: "paid" }));
                                }}
                                className={`px-4 py-3 rounded-lg border-2 transition-all ${formData.priceType === "paid"
                                    ? "border-azone-purple bg-azone-purple/20 text-white"
                                    : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600"
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-lg">💰</span>
                                    <span className="font-medium">Paid</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Price (only show if paid) */}
                    {formData.priceType === "paid" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Price (USD) <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full pl-8 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                                    placeholder="89.00"
                                    required={formData.priceType === "paid"}
                                />
                            </div>
                        </div>
                    )}

                    {/* Demo URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Demo URL <span className="text-gray-500 text-xs">(Optional)</span>
                        </label>
                        <input
                            type="url"
                            name="demoUrl"
                            value={formData.demoUrl}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                            placeholder="https://demo.example.com"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Live demo URL for the template (optional)
                        </p>
                    </div>

                    {/* Preview Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Preview Image <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-azone-purple file:text-white hover:file:bg-azone-purple/80 transition-all cursor-pointer"
                            required
                        />
                        {previewUrl && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-4 relative w-full h-64 rounded-lg overflow-hidden border border-gray-700"
                            >
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </motion.div>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                            Recommended: 1280x800px, max 5MB
                        </p>
                    </div>

                    {/* Download Permission */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Download Permission <span className="text-red-400">*</span>
                        </label>
                        <select
                            name="downloadPermission"
                            value={formData.downloadPermission}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                            required
                        >
                            <option value="public">Public - Anyone can download</option>
                            <option value="purchase">Purchase Required - Must buy to download</option>
                            <option value="admin">Admin Only - Only admins can download</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            Control who can download this template
                        </p>
                    </div>

                    {/* Download URLs */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Download URLs <span className="text-red-400">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={addDownloadUrl}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add URL
                            </button>
                        </div>
                        {downloadUrls.map((url, index) => (
                            <div key={index} className="mb-3 flex items-start gap-2">
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleDownloadUrlChange(index, e.target.value)}
                                    placeholder="https://example.com/download/template.zip"
                                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent transition-all"
                                />
                                {downloadUrls.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDownloadUrl(index)}
                                        className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all"
                                        aria-label="Remove download URL"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <p className="mt-1 text-xs text-gray-500">
                            Add one or more download URLs. At least one URL is required.
                        </p>
                    </div>

                    {/* ZIP Files (Optional) */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-300">
                                ZIP Files <span className="text-gray-500 text-xs">(Optional)</span>
                            </label>
                            <button
                                type="button"
                                onClick={addZipFile}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add File
                            </button>
                        </div>
                        {zipFiles.map((file, index) => (
                            <div key={index} className="mb-3">
                                <div className="flex items-start gap-2">
                                    <input
                                        type="file"
                                        accept=".zip"
                                        onChange={(e) => handleZipChange(index, e)}
                                        className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-azone-purple file:text-white hover:file:bg-azone-purple/80 transition-all cursor-pointer"
                                    />
                                    {zipFiles.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeZipFile(index)}
                                            className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all"
                                            aria-label="Remove ZIP file"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                {file && (
                                    <div className="mt-2 flex items-center gap-2 p-3 bg-gray-800/30 border border-gray-700 rounded-lg">
                                        <Check className="w-5 h-5 text-green-400" />
                                        <span className="text-sm text-gray-300">{file.name}</span>
                                        <span className="text-xs text-gray-500 ml-auto">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                        <p className="mt-1 text-xs text-gray-500">
                            Optional: Upload ZIP files directly. Max 100MB per file.
                        </p>
                    </div>

                    {/* Progress */}
                    {uploadProgress && (
                        <div className="p-4 bg-azone-purple/10 border border-azone-purple/50 rounded-lg">
                            <p className="text-sm text-azone-purple">{uploadProgress}</p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-400">Upload Failed</p>
                                <p className="text-sm text-red-300 mt-1">{error}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Success */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-start gap-3"
                        >
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-400">{success}</p>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 bg-azone-purple hover:bg-azone-purple/80 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload Template
                            </>
                        )}
                    </button>
                </motion.form>
            </div>
        </div>
    );
}

