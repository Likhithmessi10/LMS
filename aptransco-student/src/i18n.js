import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation dictionaries
const resources = {
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Catalog": "Course Catalog",
      "Certificates": "Certificates",
      "Settings": "Settings",
      "Log out": "Log out",
      "Welcome back, Student. Ready to learn?": "Welcome back, Student. Ready to learn?",
      "Active Courses": "Active Courses",
      "Completed": "Completed",
      "Hours Learned": "Hours Learned",
      "Enroll": "Enroll"
    }
  },
  te: {
    translation: {
      "Dashboard": "ప్రధాన పలక (Dashboard)",
      "Catalog": "కార్యక్రమాల జాబితా (Course Catalog)",
      "Certificates": "ధృవపత్రాలు (Certificates)",
      "Settings": "సెట్టింగ్‌లు (Settings)",
      "Log out": "లాగ్ అవుట్ (Log out)",
      "Welcome back, Student. Ready to learn?": "తిరిగి స్వాగతం, విద్యార్థి. నేర్చుకోవడానికి సిద్ధంగా ఉన్నారా?",
      "Active Courses": "సక్రియ కోర్సులు",
      "Completed": "పూర్తయింది",
      "Hours Learned": "నేర్చుకున్న గంటలు",
      "Enroll": "నమోదు ప్రారంభించు"
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
