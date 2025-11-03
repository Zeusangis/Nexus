// Define the type for a single permission item
export interface PermissionItem {
  label: string;
  value: string;
}

// Define the type for a group of permissions
export interface PermissionGroup {
  category: string;
  items: PermissionItem[];
}

export const permissionsData: PermissionGroup[] = [
  {
    category: "Dashboard",
    items: [
      { label: "Dashboard", value: "dashboard" },
      { label: "Total Transactions", value: "total-transactions" },
      { label: "Total Families", value: "total-families" },
      { label: "Total Enrollments", value: "total-enrollments" },
      { label: "Unpaid Invoices", value: "unpaid-invoices" },
      { label: "Total Classes", value: "total-classes" },
      { label: "Total Staffs", value: "total-staffs" },
      { label: "Upcoming Birthdays", value: "upcoming-birthdays" },
      { label: "Revenue Analytics", value: "revenue-analytics" },
      { label: "Recent Enrollments", value: "recent-enrollments" },
    ],
  },
  {
    category: "Families",
    items: [
      { label: "Families", value: "families" },
      { label: "All Families", value: "all-families" },
      { label: "Quick Registration", value: "quick-registration" },
      { label: "Edit Family", value: "edit-family" },
      { label: "Delete Family", value: "delete-family" },
      { label: "View Family Details", value: "view-family-details" },
      { label: "Show Parents/Guardians", value: "show-parents-guardians" },
      { label: "Add Parent/Guardian", value: "add-parent-guardian" },
      { label: "Edit Parent/Guardian", value: "edit-parent-guardian" },
      { label: "Delete Parent/Guardian", value: "delete-parent-guardian" },
      { label: "Show Students", value: "show-students" },
      { label: "Show Transactions", value: "show-transactions" },
    ],
  },
  {
    category: "Students",
    items: [
      { label: "Students", value: "students" },
      { label: "All Students", value: "all-students" },
      { label: "Add Student", value: "add-student" },
      { label: "Edit Student", value: "edit-student" },
      { label: "Delete Student", value: "delete-student" },
      { label: "View Student Details", value: "view-student-details" },
      { label: "Edit Enrollment", value: "edit-enrollment" },
      { label: "Update Medical", value: "update-medical" },
      { label: "Add Feedback", value: "add-feedback" },
    ],
  },
  {
    category: "Classes",
    items: [
      { label: "Classes", value: "classes" },
      { label: "All Classes", value: "all-classes" },
      { label: "Add Class", value: "add-class" },
      { label: "Edit Class", value: "edit-class" },
      { label: "Delete Class", value: "delete-class" },
      { label: "Show Enrolled Students", value: "show-enrolled-students" },
      { label: "Enroll Student", value: "enroll-student" },
    ],
  },
  {
    category: "Staffs",
    items: [
      { label: "Staffs", value: "staffs" },
      { label: "All Staffs", value: "all-staffs" },
      { label: "Add Staff", value: "add-staff" },
      { label: "Edit Staff", value: "edit-staff" },
      { label: "Delete Staff", value: "delete-staff" },
    ],
  },
  {
    category: "Transactions",
    items: [
      { label: "Transactions", value: "transactions" },
      { label: "All Accounts", value: "all-accounts" },
      { label: "Add Account", value: "add-account" },
      { label: "Edit Account", value: "edit-account" },
      { label: "Delete Account", value: "delete-account" },
      { label: "All Transactions", value: "all-transactions" },
      { label: "Add Transaction", value: "add-transaction" },
      { label: "Show Transaction Details", value: "show-transaction-details" },
      { label: "All Petty Cash", value: "all-petty-cash" },
      { label: "Add Petty Cash", value: "add-petty-cash" },
      { label: "Show Petty Cash Details", value: "show-petty-cash-details" },
    ],
  },
  {
    category: "Reports",
    items: [
      { label: "Reports", value: "reports" },
      { label: "Profit and Loss Report", value: "profit-and-loss-report" },
      { label: "Family Report", value: "family-report" },
      { label: "Student Report", value: "student-report" },
      { label: "Class Report", value: "class-report" },
      { label: "Staff Report", value: "staff-report" },
    ],
  },
  {
    category: "Calendar",
    items: [
      { label: "Calendar", value: "calendar" },
      { label: "Show Calendar", value: "show-calendar" },
      { label: "Add Event", value: "add-event" },
    ],
  },
  {
    category: "Communications",
    items: [
      { label: "Communications", value: "communications" },
      { label: "Send SMS", value: "send-sms" },
      { label: "Send Email", value: "send-email" },
      { label: "Sent Items", value: "sent-items" },
      { label: "Details", value: "details" },
    ],
  },
  {
    category: "Billing",
    items: [{ label: "Billing", value: "billing" }],
  },
  {
    category: "Notification",
    items: [{ label: "Notification", value: "notification" }],
  },
];

export const allPermissionValues: string[] = permissionsData.flatMap((group) =>
  group.items.map((item) => item.value),
);
