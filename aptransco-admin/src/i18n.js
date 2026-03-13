import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation dictionaries
const resources = {
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Internships": "Internships",
      "Employees": "Employees",
      "Courses": "Courses",
      "Batches": "Batches",
      "Announcements": "Announcements",
      "Live Sessions": "Live Sessions",
      "Settings": "Settings",
      "Log out": "Log out",
      "Search...": "Search...",
      "Overview": "Overview",
      "Welcome back, Admin. Here's what's happening today.": "Welcome back, Admin. Here's what's happening today.",
      "Total Users": "Total Users",
      "Active Courses": "Active Courses",
      "Avg Progress": "Avg Progress",
      "Live Now": "Live Now"
    }
  },
  te: {
    translation: {
      "Dashboard": "ప్రధాన పలక (Dashboard)",
      "Internships": "ఇంటర్న్‌షిప్‌లు (Internships)",
      "Employees": "ఉద్యోగులు (Employees)",
      "Courses": "కార్యక్రమాలు (Courses)",
      "Batches": "బ్యాచ్‌లు (Batches)",
      "Announcements": "ప్రకటనలు (Announcements)",
      "Live Sessions": "ప్రత్యక్ష ప్రసారాలు (Live Sessions)",
      "Settings": "సెట్టింగ్‌లు (Settings)",
      "Log out": "లాగ్ అవుట్ (Log out)",
      "Search...": "శోధించండి... (Search...)",
      "Overview": "అవలోకనం (Overview)",
      "Welcome back, Admin. Here's what's happening today.": "తిరిగి స్వాగతం, అడ్మిన్. ఈ రోజు ఏం జరుగుతుందో ఇక్కడ ఉంది.",
      "Total Users": "మొత్తం వినియోగదారులు",
      "Active Courses": "సక్రియ కోర్సులు",
      "Avg Progress": "సగటు పురోగతి",
      "Live Now": "ఇప్పుడు ప్రత్యక్షం"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
