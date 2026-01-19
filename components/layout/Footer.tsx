"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAdmin, getSession } from "@/lib/auth/auth";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { EditableText } from "@/components/shared/EditableText";
import { Facebook, X, Send as SendIcon } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings, t, getText } = useSettings();
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [openPopup, setOpenPopup] = useState<"facebook" | "telegram" | "viber" | null>(null);

  // Get site name from settings or use default
  const siteName = settings?.siteName || "Azone.store";
  // Get footer text with granular translation
  const footerText = getText(settings?.footerTextEn, settings?.footerTextMm);

  // Check if user is logged in and admin
  useEffect(() => {
    const checkUser = async () => {
      const { user: sessionUser } = await getSession();
      setUser(sessionUser);
      if (sessionUser) {
        const admin = await isAdmin();
        setUserIsAdmin(admin);
      }
    };
    checkUser();
  }, []);

  return (
    <footer className="bg-azone-black border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-6">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link
              href="/"
              className="flex items-center space-x-2 mb-4"
              aria-label={`${siteName} Home`}
            >
              <div className="text-2xl font-bold">
                <EditableText
                  id="footer-site-name"
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
            <div className="text-gray-400 text-sm max-w-md mb-4 leading-relaxed transition-colors duration-300">
              <EditableText
                id="footer-description"
                defaultText={footerText || "Production-ready templates built for scale. Designed for funded startup founders and senior engineers."}
                className="text-gray-400"
                multiline={true}
                onSave={async (newText) => {
                  const currentLang = settings?.language || "en";
                  const field = currentLang === "my" ? "footerTextMm" : "footerTextEn";
                  await fetch("/api/settings", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ [field]: newText }),
                  });
                  window.location.reload();
                }}
              />
            </div>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-azone-gray hover:text-azone-purple transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-azone-gray hover:text-azone-purple transition-colors"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-azone-gray hover:text-azone-purple transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white">{t("Quick Links")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("Home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/templates"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("Templates")}
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("Case Studies")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("About")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("Contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white">{t("Legal")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("Privacy Policy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("Terms of Service")}
                </Link>
              </li>
              <li>
                <Link
                  href="/license"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t("License")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white">Social</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setOpenPopup("facebook")}
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors w-full text-left group"
                >
                  <div className="w-5 h-5 flex items-center justify-center text-gray-400 group-hover:text-azone-purple transition-colors">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <span>Messenger</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenPopup("telegram")}
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors w-full text-left group"
                >
                  <div className="w-5 h-5 flex items-center justify-center text-gray-400 group-hover:text-azone-purple transition-colors">
                    <TelegramIcon />
                  </div>
                  <span>Telegram</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenPopup("viber")}
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors w-full text-left group"
                >
                  <div className="w-5 h-5 flex items-center justify-center text-gray-400 group-hover:text-azone-purple transition-colors">
                    <ViberIcon />
                  </div>
                  <span>Viber</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} {siteName}. {t("All rights reserved.")}.
            </p>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              {t("Built for production. Designed for scale.")}
            </p>
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
    </footer>
  );
}

// Telegram Icon Component
function TelegramIcon() {
  return (
    <svg
      className="w-5 h-5"
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
      className="w-5 h-5"
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
