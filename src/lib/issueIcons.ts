import React from 'react';
import {
  Layers,
  Sliders,
  Moon,
  Fingerprint,
  Zap,
  Sparkles,
  Monitor,
  ShieldAlert,
  AlertTriangle,
  Wrench,
  Cpu,
  Smartphone,
  Tablet,
  Watch,
  Eye,
  Flame,
  Activity,
  Sun,
  Battery,
  Crosshair,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

export interface DisplayIssueItem {
  id: string;
  title: string;
  icon: string;
  customIconUrl?: string | null;
  badge?: string;
  color?: string; // 'amber' | 'emerald' | 'indigo' | 'sky' | 'purple' | 'teal' | 'rose' | 'green'
}

export const ISSUE_ICON_REGISTRY: Record<string, LucideIcon> = {
  Layers,
  Sliders,
  Moon,
  Fingerprint,
  Zap,
  Sparkles,
  Monitor,
  ShieldAlert,
  AlertTriangle,
  Wrench,
  Cpu,
  Smartphone,
  Tablet,
  Watch,
  Eye,
  Flame,
  Activity,
  Sun,
  Battery,
  Crosshair,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
};

export const AVAILABLE_ISSUE_ICONS: Array<{ name: string; label: string; component: LucideIcon }> = [
  { name: 'Layers', label: 'Layers (Glass/Touch)', component: Layers },
  { name: 'Sliders', label: 'Sliders (Lines/Laser)', component: Sliders },
  { name: 'Moon', label: 'Moon (Black Screen/Blank)', component: Moon },
  { name: 'Fingerprint', label: 'Fingerprint (Digitizer/Touch)', component: Fingerprint },
  { name: 'Zap', label: 'Zap (Flicker/Voltage)', component: Zap },
  { name: 'Sparkles', label: 'Sparkles (TrueTone/Calibration)', component: Sparkles },
  { name: 'Monitor', label: 'Monitor (Panel/Flex)', component: Monitor },
  { name: 'ShieldAlert', label: 'Shield Alert (Damage/Impact)', component: ShieldAlert },
  { name: 'AlertTriangle', label: 'Alert Triangle (Fault/Warning)', component: AlertTriangle },
  { name: 'Wrench', label: 'Wrench (Hardware/Repair)', component: Wrench },
  { name: 'Cpu', label: 'Cpu (IC Chip/Flex Cable)', component: Cpu },
  { name: 'Smartphone', label: 'Smartphone (Mobile Screen)', component: Smartphone },
  { name: 'Tablet', label: 'Tablet (Large Display)', component: Tablet },
  { name: 'Watch', label: 'Watch (Sapphire Glass)', component: Watch },
  { name: 'Eye', label: 'Eye (Vision/Display Optics)', component: Eye },
  { name: 'Flame', label: 'Flame (Burn-in/Heat)', component: Flame },
  { name: 'Activity', label: 'Activity (Refresh Rate/Lag)', component: Activity },
  { name: 'Sun', label: 'Sun (Brightness/Backlight)', component: Sun },
  { name: 'Battery', label: 'Battery (Power Supply)', component: Battery },
  { name: 'Crosshair', label: 'Crosshair (Ghost Touch/Calibration)', component: Crosshair },
  { name: 'CheckCircle2', label: 'Check (Tested/OEM)', component: CheckCircle2 },
  { name: 'RefreshCw', label: 'Refresh (Cycle/Sync)', component: RefreshCw },
  { name: 'AlertCircle', label: 'Notice (General Issue)', component: AlertCircle },
];

export const DEFAULT_DISPLAY_ISSUES: DisplayIssueItem[] = [
  {
    id: 'issue-1',
    title: 'Cracked or Shattered Front Glass (Touch & OLED Working)',
    icon: 'Layers',
    badge: 'Glass Layer Malfunction',
    color: 'amber',
  },
  {
    id: 'issue-2',
    title: 'Green Line / Vertical & Horizontal Display Lines',
    icon: 'Sliders',
    badge: 'Laser Line Fault',
    color: 'emerald',
  },
  {
    id: 'issue-3',
    title: 'OLED Black Screen / Blank Display Malfunction',
    icon: 'Moon',
    badge: 'No Display / Backlight Off',
    color: 'indigo',
  },
  {
    id: 'issue-4',
    title: 'Touch Digitizer Not Responding / Ghost Touch',
    icon: 'Fingerprint',
    badge: 'Digitizer Touch Lag',
    color: 'sky',
  },
  {
    id: 'issue-5',
    title: 'Flickering, Pink Tint or Distorted Display',
    icon: 'Zap',
    badge: 'Refresh Voltage Flickering',
    color: 'purple',
  },
  {
    id: 'issue-6',
    title: 'TrueTone & Ambient Light Sensor Calibration',
    icon: 'Sparkles',
    badge: 'Hardware Sensor Alignment',
    color: 'teal',
  },
  {
    id: 'issue-7',
    title: 'Pressure Damage / Internal Display Bleed',
    icon: 'ShieldAlert',
    badge: 'Physical Screen Impact',
    color: 'rose',
  },
  {
    id: 'issue-8',
    title: 'White Screen Flex Bonding Laser Issue',
    icon: 'Monitor',
    badge: 'Flex Bonding Laser Fault',
    color: 'green',
  },
];

export const ISSUE_COLOR_STYLES: Record<string, { color: string; selectedClass: string }> = {
  amber: {
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/20',
    selectedClass: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10',
  },
  emerald: {
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/20',
    selectedClass: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10',
  },
  indigo: {
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 dark:bg-indigo-500/20',
    selectedClass: 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10',
  },
  sky: {
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/20 dark:bg-sky-500/20',
    selectedClass: 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-500/5 dark:bg-sky-500/10',
  },
  purple: {
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20 dark:bg-purple-500/20',
    selectedClass: 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10',
  },
  teal: {
    color: 'text-[#00B2A2] bg-[#00B2A2]/10 border-[#00B2A2]/20 dark:bg-[#00B2A2]/20',
    selectedClass: 'border-[#00B2A2] ring-2 ring-[#00B2A2]/20 bg-[#00B2A2]/5 dark:bg-[#00B2A2]/10',
  },
  rose: {
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20 dark:bg-rose-500/20',
    selectedClass: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10',
  },
  green: {
    color: 'text-green-500 bg-green-500/10 border-green-500/20 dark:bg-green-500/20',
    selectedClass: 'border-green-500 ring-2 ring-green-500/20 bg-green-500/5 dark:bg-green-500/10',
  },
};

export function getIssueIcon(iconName?: string): LucideIcon {
  if (iconName && ISSUE_ICON_REGISTRY[iconName]) {
    return ISSUE_ICON_REGISTRY[iconName];
  }
  return AlertTriangle;
}

export function getIssueStyles(colorName?: string) {
  if (colorName && ISSUE_COLOR_STYLES[colorName]) {
    return ISSUE_COLOR_STYLES[colorName];
  }
  return ISSUE_COLOR_STYLES.teal;
}
