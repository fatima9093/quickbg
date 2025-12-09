"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Menu, X, Sun, Moon, ChevronDown, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/lib/theme-provider";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { useTranslation } from "@/lib/useTranslation";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isAdmin = session?.user?.role === "admin";
  const displayName = session?.user?.name || (session?.user?.email ? session.user.email.split("@")[0] : undefined);
  const userInitial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative w-36 h-36 group-hover:scale-110 transition-all duration-200">
                <Image
                  src="/quickbg.png"
                  alt="QuickBG Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-8">
            <Link href="/#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              {t("nav.features")}
            </Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              {t("nav.about")}
            </Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              {t("nav.contact")}
            </Link>
          </div>

          {/* Right side auth controls */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {!session ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t("nav.signIn")}</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">{t("nav.getStarted")}</Button>
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">{t("nav.admin")}</Button>
                  </Link>
                )}
                
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors"
                  >
                    {/* User Initial Circle */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center text-white font-semibold text-sm">
                      {userInitial}
                    </div>
                    {/* User Name */}
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {displayName}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{session.user?.email}</p>
                      </div>
                      
                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("nav.logout")}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/#features"
              className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.features")}
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.contact")}
            </Link>
            
            {/* Mobile Language Selector */}
            <div className="px-4 py-2">
              <LanguageSelector />
            </div>
            
            {/* Mobile Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-5 h-5" />
                  <span>{t("nav.darkMode")}</span>
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5" />
                  <span>{t("nav.lightMode")}</span>
                </>
              )}
            </button>

            <div className="pt-3 space-y-2">
              {!session ? (
                <>
                  <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">{t("nav.signIn")}</Button>
                  </Link>
                  <Link href="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">{t("nav.getStarted")}</Button>
                  </Link>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">Admin</Button>
                    </Link>
                  )}
                  <div className="px-4 py-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{session.user?.email}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  >
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

