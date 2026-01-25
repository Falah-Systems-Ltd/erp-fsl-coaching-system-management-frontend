export const MENU_STRUCTURE = [
  {
    section: "Main",
    items: [
      { title: "Dashboard", icon: "📊", href: "/", permission: "view_dashboard" },
    ],
  },
  { 
    section: "Management",
    items: [
      { title: "Admins", icon: "🛡️", href: "/admins", permission: "view_admins" },
    ],
  },
  {
    section: "Peoples",
    items: [
      { title: "Students", icon: "🎓", href: "/students", permission: "view_students" },
      { title: "Teachers", icon: "👨‍🏫", href: "/teachers", permission: "view_teachers" },
    ],
  },
  {
    section: "Academic",
    items: [
      { title: "Attendance", icon: "📝", href: "/attendance", permission: "view_attendance" },
      { title: "Classes", icon: "🏫", href: "/classes", permission: "view_classes" },
    ],
  },
];