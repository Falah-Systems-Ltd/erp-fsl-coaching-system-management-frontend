export const MENU_STRUCTURE = [
  {
    section: "Main",
    items: [
      { title: "Dashboard", iconKey: "dashboard", href: "/", permission: "view_dashboard" },
    ],
  },
  { 
    section: "Management",
    items: [
      { title: "Admins", iconKey: "admins", href: "/admins", permission: "view_admins" },
    ],
  },
  {
    section: "Peoples",
    items: [
      { title: "Students", iconKey: "students", href: "/students", permission: "view_students" },
      { title: "Teachers", iconKey: "teachers", href: "/teachers", permission: "view_teachers" },
    ],
  },
  {
    section: "Academic",
    items: [
      { title: "Attendance", iconKey: "attendance", href: "/attendance", permission: "view_attendance" },
      { title: "Classes", iconKey: "classes", href: "/classes", permission: "view_classes" },
    ],
  },
];