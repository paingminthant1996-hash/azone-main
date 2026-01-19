"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Show success message
      alert("Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({ name: "", email: "", company: "", message: "" });
      setErrors({});
    } catch (error: any) {
      console.error("Form submission error:", error);
      alert(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-azone-black pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 leading-[1.15] tracking-tight">
            <span className="text-white">Contact</span>
            <span className="text-azone-purple ml-3">Us</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Need a custom solution or priority support? Our engineers are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`w-full px-4 py-3 bg-gray-950 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 ${
                    errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-800 focus:border-azone-purple"
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <span
                    id="name-error"
                    role="alert"
                    className="block mt-1 text-sm text-red-400"
                  >
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Professional Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full px-4 py-3 bg-gray-950 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-800 focus:border-azone-purple"
                  }`}
                  placeholder="your.email@company.com"
                />
                {errors.email && (
                  <span
                    id="email-error"
                    role="alert"
                    className="block mt-1 text-sm text-red-400"
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Company Field */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-azone-purple transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2"
                  placeholder="Your company"
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`w-full px-4 py-3 bg-gray-950 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors duration-200 resize-none focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 ${
                    errors.message
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-800 focus:border-azone-purple"
                  }`}
                  placeholder="Tell us about your project or requirements..."
                />
                {errors.message && (
                  <span
                    id="message-error"
                    role="alert"
                    className="block mt-1 text-sm text-red-400"
                  >
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                aria-label="Send message"
                className="w-full px-6 py-4 bg-azone-purple text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-azone-purple/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                transition={{
                  duration: 0.25,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.05,
                }}
              >
                <Send className="w-5 h-5" aria-hidden="true" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </motion.form>
          </div>

          {/* Side Details */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Email */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-950 border border-gray-800 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Email
                  </h3>
                </div>
                <a
                  href="mailto:hello@azone.store"
                  className="text-white hover:text-azone-purple transition-colors duration-200 font-medium focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 focus-visible:rounded"
                >
                  hello@azone.store
                </a>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-950 border border-gray-800 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-300" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Office
                  </h3>
                </div>
                <div className="text-gray-300 leading-relaxed space-y-1">
                  <p className="text-white font-medium">Azone.store</p>
                  <p>San Francisco, CA</p>
                  <p>United States</p>
                </div>
              </div>

              {/* Response Time */}
              <div className="pt-8 border-t border-gray-800">
                <p className="text-sm text-gray-300 leading-relaxed">
                  We typically respond within 24 hours during business days.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

