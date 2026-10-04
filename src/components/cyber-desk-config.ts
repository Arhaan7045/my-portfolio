export const CYBER_DESK_STORAGE_KEY = "arhaan-cyberdesk-v4";
export type AppId =
  | "home"
  | "case"
  | "files"
  | "terminal"
  | "lab"
  | "about"
  | "projects"
  | "settings"
  | "system";

export type VirtualEntry = {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  content: string;
  created?: boolean;
};

export type CyberDeskThemeId =
  | "graphite"
  | "violet"
  | "steel"
  | "reactor"
  | "doom"
  | "obsidian"
  | "noir";

export const CYBER_DESK_THEMES: Array<{
  id: CyberDeskThemeId;
  label: string;
  descriptor: string;
  accent: string;
  accentSoft: string;
  glow: string;
  surface: string;
  surfaceRaised: string;
  screen: string;
}> = [
  {
    id: "graphite",
    label: "Graphite",
    descriptor: "Default / Neutral",
    accent: "204 210 218",
    accentSoft: "204 210 218",
    glow: "172 182 194",
    surface: "#17191d",
    surfaceRaised: "#202329",
    screen: "#0d0f12",
  },
  {
    id: "violet",
    label: "Violet",
    descriptor: "Restrained violet",
    accent: "184 154 255",
    accentSoft: "184 154 255",
    glow: "150 110 238",
    surface: "#18171d",
    surfaceRaised: "#24212c",
    screen: "#0f0d14",
  },
  {
    id: "steel",
    label: "Steel / Storm",
    descriptor: "Cool blue steel",
    accent: "156 193 232",
    accentSoft: "156 193 232",
    glow: "88 135 184",
    surface: "#161b20",
    surfaceRaised: "#202934",
    screen: "#0c1116",
  },
  {
    id: "reactor",
    label: "Reactor",
    descriptor: "Restrained red",
    accent: "235 157 151",
    accentSoft: "235 157 151",
    glow: "176 75 74",
    surface: "#1b1719",
    surfaceRaised: "#2a2023",
    screen: "#100d0f",
  },
  {
    id: "doom",
    label: "Doom",
    descriptor: "Muted green",
    accent: "177 201 167",
    accentSoft: "177 201 167",
    glow: "88 126 88",
    surface: "#171b18",
    surfaceRaised: "#222a23",
    screen: "#0d110e",
  },
  {
    id: "obsidian",
    label: "Obsidian",
    descriptor: "Deep violet",
    accent: "201 182 236",
    accentSoft: "201 182 236",
    glow: "114 87 162",
    surface: "#17151b",
    surfaceRaised: "#24202a",
    screen: "#0e0b12",
  },
  {
    id: "noir",
    label: "Noir",
    descriptor: "Silver / blue",
    accent: "179 199 221",
    accentSoft: "179 199 221",
    glow: "93 121 154",
    surface: "#15181c",
    surfaceRaised: "#20252c",
    screen: "#0b0e12",
  },
];

export const APP_META: Array<{
  id: AppId;
  label: string;
  icon: string;
  hint: string;
}> = [
  { id: "home", label: "Home", icon: "⌂", hint: "Your desktop and recent activity" },
  { id: "case", label: "Mystery Cases", icon: "?", hint: "Solve a short security investigation" },
  { id: "files", label: "File Explorer", icon: "▤", hint: "Create, edit, rename and delete virtual files" },
  { id: "terminal", label: "Terminal", icon: ">_", hint: "Use safe simulated shell commands" },
  { id: "lab", label: "Security Lab", icon: "◈", hint: "Try quick cybersecurity challenges" },
  { id: "about", label: "About Arhaan", icon: "AS", hint: "Learn about the person behind the desk" },
  { id: "projects", label: "Projects", icon: "▦", hint: "Open approved portfolio project pages" },
  { id: "settings", label: "Settings", icon: "⚙", hint: "Change the ARHAAN OS appearance and settings" },
  { id: "system", label: "System Info", icon: "◫", hint: "View fictional workstation information" },
];

export const DEFAULT_VIRTUAL_ENTRIES: VirtualEntry[] = [
  { id: "folder-case", name: "Case Files", type: "folder", path: "/", content: "" },
  { id: "folder-documents", name: "Documents", type: "folder", path: "/", content: "" },
  { id: "folder-downloads", name: "Downloads", type: "folder", path: "/", content: "" },
  { id: "folder-notes", name: "Notes", type: "folder", path: "/", content: "" },
  { id: "folder-projects", name: "Projects", type: "folder", path: "/", content: "" },
  {
    id: "file-case-notes",
    name: "case-notes.txt",
    type: "file",
    path: "/",
    content: "Clues I found:\\n\\n",
  },
  {
    id: "file-ideas",
    name: "ideas.txt",
    type: "file",
    path: "/",
    content: "Ideas for my next security project:\\n",
  },
  {
    id: "file-read-me",
    name: "read-me.txt",
    type: "file",
    path: "/",
    content: "Welcome to Arhaan OS.\\nEverything here is a safe, fictional sandbox.\\n",
  },
];

export const CASE_CLUES = [
  {
    id: "email",
    time: "09:08",
    title: "Unexpected email",
    detail: "A message asked Maya to verify her account through a shortened link.",
    insight: "The email arrived before any unusual account activity.",
  },
  {
    id: "login",
    time: "09:12",
    title: "Unusual sign-in",
    detail: "A successful sign-in came from a new location after several failed attempts.",
    insight: "The sign-in happened four minutes after the email.",
  },
  {
    id: "file",
    time: "09:16",
    title: "Confidential file opened",
    detail: "The account opened a private folder a few minutes later.",
    insight: "This happened after the unusual sign-in.",
  },
] as const;

export const SECURITY_CHALLENGES = [
  {
    id: "link",
    label: "01",
    title: "Spot the suspicious link",
    prompt: "A delivery message asks you to confirm an address using a strange website. What should you do first?",
    options: [
      { id: "click", label: "Click it quickly before the parcel expires." },
      { id: "official", label: "Open the delivery company's official site yourself." },
      { id: "share", label: "Forward it to a friend and use the link." },
    ],
    answer: "official",
    explanation:
      "Good security habit: avoid unexpected links and visit the official site yourself instead of trusting the message.",
  },
  {
    id: "login",
    label: "02",
    title: "Which login looks unusual?",
    prompt: "A familiar account suddenly logs in from a new country on an unknown device. What stands out?",
    options: [
      { id: "normal", label: "Nothing; all logins are always normal." },
      { id: "unusual", label: "The new location and unknown device." },
      { id: "password", label: "Only the font used on the sign-in page." },
    ],
    answer: "unusual",
    explanation:
      "A new location plus an unknown device is worth investigating, especially when it does not match the user's normal activity.",
  },
  {
    id: "password",
    label: "03",
    title: "Which password is stronger?",
    prompt: "Choose the better example for a strong, memorable password.",
    options: [
      { id: "short", label: "Arhaan123" },
      { id: "phrase", label: "River!Coffee!Window!42" },
      { id: "name", label: "MyName2026" },
    ],
    answer: "phrase",
    explanation:
      "A longer unique passphrase is generally harder to guess than a short password based on common personal patterns.",
  },
  {
    id: "phishing",
    label: "04",
    title: "Spot the phishing message",
    prompt: "An email says your account will close in 10 minutes unless you sign in through its link. What is the strongest warning sign?",
    options: [
      { id: "urgency", label: "Pressure and urgency designed to make you act quickly." },
      { id: "greeting", label: "The email uses a greeting." },
      { id: "length", label: "The email has two paragraphs." },
    ],
    answer: "urgency",
    explanation:
      "Urgency is a common social-engineering tactic. Slow down, verify the sender and use an official route instead of the provided link.",
  },
  {
    id: "permission",
    label: "05",
    title: "Which permission looks risky?",
    prompt: "A simple flashlight app asks for access to your microphone, contacts and location. What should make you pause?",
    options: [
      { id: "permissions", label: "The permissions do not match what a flashlight needs." },
      { id: "icon", label: "The app icon is blue." },
      { id: "size", label: "The app is small." },
    ],
    answer: "permissions",
    explanation:
      "Permissions should match an app's purpose. Unnecessary access can increase privacy and security risk.",
  },
] as const;

export const KEYBOARD_ROWS = [
  [
    ["Escape", "ESC"],
    ["Digit1", "1"],
    ["Digit2", "2"],
    ["Digit3", "3"],
    ["Digit4", "4"],
    ["Digit5", "5"],
    ["Digit6", "6"],
    ["Digit7", "7"],
    ["Digit8", "8"],
    ["Digit9", "9"],
    ["Digit0", "0"],
    ["Minus", "−"],
    ["Equal", "="],
    ["Backspace", "⌫"],
  ],
  [
    ["Tab", "TAB"],
    ["KeyQ", "Q"],
    ["KeyW", "W"],
    ["KeyE", "E"],
    ["KeyR", "R"],
    ["KeyT", "T"],
    ["KeyY", "Y"],
    ["KeyU", "U"],
    ["KeyI", "I"],
    ["KeyO", "O"],
    ["KeyP", "P"],
    ["BracketLeft", "["],
    ["BracketRight", "]"],
    ["Backslash", "\\"],
  ],
  [
    ["CapsLock", "CAPS"],
    ["KeyA", "A"],
    ["KeyS", "S"],
    ["KeyD", "D"],
    ["KeyF", "F"],
    ["KeyG", "G"],
    ["KeyH", "H"],
    ["KeyJ", "J"],
    ["KeyK", "K"],
    ["KeyL", "L"],
    ["Semicolon", ";"],
    ["Quote", "'"],
    ["Enter", "ENTER"],
  ],
  [
    ["ShiftLeft", "SHIFT"],
    ["KeyZ", "Z"],
    ["KeyX", "X"],
    ["KeyC", "C"],
    ["KeyV", "V"],
    ["KeyB", "B"],
    ["KeyN", "N"],
    ["KeyM", "M"],
    ["Comma", ","],
    ["Period", "."],
    ["Slash", "/"],
    ["ShiftRight", "SHIFT"],
  ],
  [
    ["ControlLeft", "CTRL"],
    ["MetaLeft", "⌘"],
    ["AltLeft", "ALT"],
    ["Space", "SPACE"],
    ["AltRight", "ALT"],
    ["ArrowLeft", "←"],
    ["ArrowUp", "↑"],
    ["ArrowDown", "↓"],
    ["ArrowRight", "→"],
  ],
] as const;

export function makeVisitorCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function currentTime() {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}
