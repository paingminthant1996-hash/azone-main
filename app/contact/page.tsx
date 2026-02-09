"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Send, Facebook, X, MessageCircle, Send as SendIcon } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openPopup, setOpenPopup] = useState<"facebook" | "telegram" | "viber" | null>(null);

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
                  href="mailto:paingminthant1996@gmail.com"
                  className="text-white hover:text-azone-purple transition-colors duration-200 font-medium focus-visible:outline-2 focus-visible:outline-azone-purple focus-visible:outline-offset-2 focus-visible:rounded"
                >
                  paingminthant1996@gmail.com
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
                  <p className="text-white font-medium">Azone</p>
                  <p>Myanmar</p>
                  <p className="text-sm text-gray-400 mt-2">Remote Team</p>
                </div>
              </div>

              {/* Response Time */}
              <div className="pt-8 border-t border-gray-800">
                <p className="text-sm text-gray-300 leading-relaxed">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>

              {/* Social Media Contact */}
              <div className="pt-8 border-t border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  Connect With Us
                </h3>
                <div className="flex items-center gap-4">
                  {/* Facebook */}
                  <motion.button
                    onClick={() => setOpenPopup("facebook")}
                    className="w-12 h-12 bg-gray-950 border border-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-azone-purple hover:border-azone-purple transition-all duration-300 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Contact via Facebook"
                  >
                    <Facebook className="w-6 h-6" />
                  </motion.button>

                  {/* Telegram */}
                  <motion.button
                    onClick={() => setOpenPopup("telegram")}
                    className="w-12 h-12 bg-gray-950 border border-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-azone-purple hover:border-azone-purple transition-all duration-300 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Contact via Telegram"
                  >
                    <TelegramIcon />
                  </motion.button>

                  {/* Viber */}
                  <motion.button
                    onClick={() => setOpenPopup("viber")}
                    className="w-12 h-12 bg-gray-950 border border-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-azone-purple hover:border-azone-purple transition-all duration-300 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Contact via Viber"
                  >
                    <ViberIcon />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Social Media Popups */}
      <AnimatePresence>
        {openPopup && (
          <SocialMediaPopup
            platform={openPopup}
            onClose={() => setOpenPopup(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Telegram Icon Component
function TelegramIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
    </svg>
  );
}

// Viber Icon Component
function ViberIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.5 0C6.701 0 2 4.701 2 10.5c0 1.788.52 3.453 1.415 4.86L1 23l7.64-2.415C10.047 21.48 11.712 22 13.5 22 19.299 22 24 17.299 24 11.5S18.299 1 12.5 1zm0 19.5c-1.577 0-3.06-.44-4.32-1.205l-.302-.18-3.178.89.89-3.178-.18-.302C4.44 14.56 4 13.077 4 11.5 4 6.529 7.529 3 12.5 3S21 6.529 21 11.5 17.471 20 12.5 20zm5.5-6.5c-.276 0-.5-.224-.5-.5s.224-.5.5-.5.5.224.5.5-.224.5-.5.5zm-3 0c-.276 0-.5-.224-.5-.5s.224-.5.5-.5.5.224.5.5-.224.5-.5.5zm-3 0c-.276 0-.5-.224-.5-.5s.224-.5.5-.5.5.224.5.5-.224.5-.5.5z" />
    </svg>
  );
}

// Social Media Popup Component
interface SocialMediaPopupProps {
  platform: "facebook" | "telegram" | "viber";
  onClose: () => void;
}

function SocialMediaPopup({ platform, onClose }: SocialMediaPopupProps) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const platformInfo = {
    facebook: {
      title: "Contact via Facebook",
      description: "Send us a message on Facebook Messenger",
      placeholder: "Type your message here...",
      icon: <Facebook className="w-6 h-6" />,
    },
    telegram: {
      title: "Contact via Telegram",
      description: "Send us a message through Telegram Bot",
      placeholder: "Type your message here...",
      icon: <TelegramIcon />,
    },
    viber: {
      title: "Contact via Viber",
      description: "Send us a message on Viber",
      placeholder: "Type your message here...",
      icon: <ViberIcon />,
    },
  };

  const info = platformInfo[platform];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - no actual logic yet
    alert(`Message will be sent via ${platform} (UI only - not implemented yet)`);
    setMessage("");
    setName("");
    setEmail("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-950 border border-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center text-azone-purple">
              {info.icon}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{info.title}</h3>
              <p className="text-gray-400 text-sm">{info.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
            aria-label="Close popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-azone-purple transition-colors"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-azone-purple transition-colors"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-azone-purple transition-colors resize-none"
              placeholder={info.placeholder}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-azone-purple text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <SendIcon className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </form>

        {/* Note */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          This is a UI preview. Integration will be implemented later.
        </p>
      </motion.div>
    </motion.div>
  );
}
