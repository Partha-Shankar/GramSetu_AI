'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SwachhAuditHeader } from '../components/SwachhAuditHeader';
import { auditService } from '../services/auditService';
import { SwachhAuditReport } from '../types/types';
import { DetectionPreview } from '../components/DetectionPreview';
import { CleanlinessScoreCard } from '../components/CleanlinessScoreCard';
import { SeverityBadge } from '../components/SeverityBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { 
  FileText, 
  LayoutDashboard, 
  Plus, 
  ChevronLeft, 
  Calendar, 
  Volume2, 
  VolumeX, 
  MessageSquare,
  Trash2,
  AlertCircle,
  PhoneCall,
  Languages,
  Sprout,
  Wrench
} from 'lucide-react';
import Link from 'next/link';

// Simple Bilingual Dictionary for Villagers
const translations = {
  en: {
    cleanArea: 'Clean Area 🟢',
    litterAlert: 'Litter Alert 🟡',
    urgentAction: 'Urgent Action Required 🔴',
    cleanDesc: 'Sufficiently clean surroundings. No critical action required.',
    litterDesc: 'Scattered waste detected. Please segregate and clear.',
    urgentDesc: 'High waste density, hazardous batteries, or drainage stagnation detected.',
    score: 'Cleanliness',
    inspectionMap: 'Visual Inspection Map',
    objects: 'objects',
    listen: '🔊 Listen to Report',
    tapListen: 'Tap to hear voice readout',
    stopListen: 'Click to stop reading aloud',
    playing: 'Playing',
    guideTitle: 'Village Segregation Guide (ಕಸ ವಿಂಗಡಣೆ ಮಾರ್ಗದರ್ಶಿ)',
    greenBin: 'Green Dustbin (ಹಸಿರು ಬುಟ್ಟಿ)',
    greenDesc: 'Biodegradable/Wet Waste: Discard fruits, leaves, and organic remains here.',
    blueBin: 'Blue Dustbin (ನೀಲಿ ಬುಟ್ಟಿ)',
    blueDesc: 'Dry/Recyclable Waste: Place wrappers, bottles, metal cans, and paper here.',
    redBin: 'Red Dustbin (ಕೆಂಪು ಬುಟ್ಟಿ)',
    redDesc: 'Hazardous Waste: Discard toxic batteries, lightbulbs, and e-waste here.',
    stagnantTitle: 'Stagnant Water / Sewer Blockages Detected',
    stagnantDesc: 'Severe drainage issue located. It is critical to notify the Gram Panchayat PDO immediately.',
    reportPdo: 'Report to PDO (WhatsApp)',
    callHelpline: '📞 Call GP Helpline (ಸಹಾಯವಾಣಿ)',
    reportId: 'Report ID',
    downloadPdf: 'Download PDF',
    newAudit: 'New Audit',
    dashboard: 'Dashboard',
    offlineSync: 'Audit complete • local offline sync generated',
    compostTitle: '🌱 Bio-Compost Calculator',
    compostDesc: 'Convert your organic/wet waste into rich organic fertilizer for your fields!',
    compostInput: 'Organic Waste Weight',
    compostYield: 'Compost Yield',
    compostTime: 'Decomposition Time',
    compostSteps: 'Composting: 1. Dig a small backyard pit. 2. Layer wet waste with leaves/soil. 3. Keep slightly damp. 4. Rich compost is ready in 6 weeks!',
    dispatchTitle: '🚨 Dispatch GP Cleaning Staff',
    dispatchDesc: 'Waste accumulation detected. Request immediate sweep and cleanup crew dispatch.',
    dispatchBtn: 'Dispatch Staff Now',
    dispatchConfirm: 'Panchayat sanitation dispatch logged! Crew scheduled to clear this zone within 24 hours.'
  },
  kn: {
    cleanArea: 'ಸ್ವಚ್ಛ ಪ್ರದೇಶ 🟢',
    litterAlert: 'ಕಸದ ಎಚ್ಚರಿಕೆ 🟡',
    urgentAction: 'ತುರ್ತು ಕ್ರಮ ಅಗತ್ಯವಿದೆ 🔴',
    cleanDesc: 'ಸುತ್ತಮುತ್ತಲಿನ ಪ್ರದೇಶವು ಸ್ವಚ್ಛವಾಗಿದೆ. ಯಾವುದೇ ತುರ್ತು ಕ್ರಮ ಅಗತ್ಯವಿಲ್ಲ.',
    litterDesc: 'ಸಣ್ಣ ಪ್ರಮಾಣದ ಕಸ ಪತ್ತೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ವಿಂಗಡಿಸಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ.',
    urgentDesc: 'ಹೆಚ್ಚಿನ ಕಸ ಅಥವಾ ಚರಂಡಿ ನೀರು ನಿಂತಿರುವುದು ಪತ್ತೆಯಾಗಿದೆ. ತಕ್ಷಣ ಸ್ವಚ್ಛಗೊಳಿಸಿ.',
    score: 'ಸ್ವಚ್ಛತೆ',
    inspectionMap: 'ದೃಶ್ಯ ತಪಾಸಣೆ ನಕ್ಷೆ',
    objects: 'ವಸ್ತುಗಳು',
    listen: '🔊 ವರದಿ ಕೇಳಿ (ಕನ್ನಡ)',
    tapListen: 'ವರದಿಯನ್ನು ಧ್ವನಿ ಮೂಲಕ ಕೇಳಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
    stopListen: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
    playing: 'ಪ್ಲೇ ಆಗುತ್ತಿದೆ',
    guideTitle: 'ಕಸ ವಿಂಗಡಣೆ ಮಾರ್ಗದರ್ಶಿ',
    greenBin: 'ಹಸಿರು ಬುಟ್ಟಿ (ಹಸಿ ಕಸ)',
    greenDesc: 'ಹಸಿ ಕಸ: ಹಣ್ಣುಗಳು, ತರಕಾರಿ ಸಿಪ್ಪೆಗಳು ಮತ್ತು ಕೊಳೆಯುವ ಕಸವನ್ನು ಇಲ್ಲಿ ಹಾಕಿ.',
    blueBin: 'ನೀಲಿ ಬುಟ್ಟಿ (ಒಣ ಕಸ)',
    blueDesc: 'ಒಣ ಕಸ: ಪ್ಲಾಸ್ಟಿಕ್ ಚೀಲಗಳು, ಬಾಟಲಿಗಳು ಮತ್ತು ಕಾಗದವನ್ನು ಇಲ್ಲಿ ಹಾಕಿ.',
    redBin: 'ಕೆಂಪು ಬುಟ್ಟಿ (ಅಪಾಯಕಾರಿ ಕಸ)',
    redDesc: 'ಅಪಾಯಕಾರಿ ಕಸ: ಬಳಸಿದ ಬ್ಯಾಟರಿಗಳು, ಬಲ್ಬ್‌ಗಳು ಮತ್ತು ಇ-ಕಸವನ್ನು ಇಲ್ಲಿ ಹಾಕಿ.',
    stagnantTitle: 'ನಿಂತ ನೀರು / ಚರಂಡಿ ಬ್ಲಾಕ್ ಪತ್ತೆಯಾಗಿದೆ',
    stagnantDesc: 'ತಕ್ಷಣವೇ ಗ್ರಾಮ ಪಂಚಾಯತ್ ಪಿಡಿಒ (PDO) ಅವರಿಗೆ ಮಾಹಿತಿ ನೀಡಿ ಚರಂಡಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ.',
    reportPdo: 'ಪಿಡಿಒಗೆ ವರದಿ ಮಾಡಿ (WhatsApp)',
    callHelpline: '📞 ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿ',
    reportId: 'ವರದಿ ಐಡಿ',
    downloadPdf: 'ವರದಿ ಡೌನ್‌ಲೋಡ್',
    newAudit: 'ಹೊಸ ತಪಾಸಣೆ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    offlineSync: 'ತಪಾಸಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ • ಆಫ್‌ಲೈನ್ ಪ್ರತಿಯನ್ನು ಉಳಿಸಲಾಗಿದೆ',
    compostTitle: '🌱 ಜೈವಿಕ ಗೊಬ್ಬರ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    compostDesc: 'ನಿಮ್ಮ ಹಸಿ ಕಸವನ್ನು ಹೊಲಗಳಿಗೆ ಉಪಯುಕ್ತವಾದ ಜೈವಿಕ ಗೊಬ್ಬರವಾಗಿ ಪರಿವರ್ತಿಸಿ!',
    compostInput: 'ಹಸಿ ಕಸದ ತೂಕ',
    compostYield: 'ಗೊಬ್ಬರದ ಇಳುವರಿ',
    compostTime: 'ಕೊಳೆಯಲು ಬೇಕಾಗುವ ಸಮಯ',
    compostSteps: 'ವಿಧಾನ: ೧. ಹಿತ್ತಲಿನಲ್ಲಿ ಸಣ್ಣ ಗುಂಡಿ ತೆಗೆಯಿರಿ. ೨. ಹಸಿ ಕಸದ ಮೇಲೆ ಒಣ ಎಲೆಗಳು ಅಥವಾ ಮಣ್ಣನ್ನು ಹಾಕಿ. ೩. ಸ್ವಲ್ಪ ತೇವವಾಗಿಡಿ. ೪. ೬ ವಾರಗಳಲ್ಲಿ ಪೌಷ್ಟಿಕ ಗೊಬ್ಬರ ಸಿದ್ಧವಾಗುತ್ತದೆ!',
    dispatchTitle: '🚨 ಪಂಚಾಯತ್ ಸ್ವಚ್ಛತಾ ಸಿಬ್ಬಂದಿ ನಿಯೋಜನೆ',
    dispatchDesc: 'ಕಸದ ರಾಶಿ ಪತ್ತೆಯಾಗಿದೆ. ತಕ್ಷಣ ಸ್ವಚ್ಛಗೊಳಿಸಲು ಸಿಬ್ಬಂದಿ ಕಳುಹಿಸುವಂತೆ ವಿನಂತಿ ಸಲ್ಲಿಸಿ.',
    dispatchBtn: 'ಸಿಬ್ಬಂದಿ ನಿಯೋಜಿಸಿ',
    dispatchConfirm: 'ಸ್ವಚ್ಛತಾ ಸಿಬ್ಬಂದಿ ನಿಯೋಜನೆ ವಿನಂತಿ ದಾಖಲಾಗಿದೆ! ೨೪ ಗಂಟೆಯೊಳಗೆ ಸಿಬ್ಬಂದಿ ತಲುಪಲಿದ್ದಾರೆ.'
  }
};

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [report, setReport] = useState<SwachhAuditReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'kn'>('en');
  const [wasteWeight, setWasteWeight] = useState<number>(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const reportId = searchParams.get('id');
      if (reportId) {
        const found = auditService.getReport(reportId);
        if (found) {
          setReport(found);
        }
      } else {
        const history = auditService.getHistory();
        if (history.length > 0) {
          setReport(history[0]);
        }
      }
      setLoading(false);
    }, 0);

    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined') {
        window.speechSynthesis?.cancel();
      }
    };
  }, [searchParams]);

  const handleDownloadPDF = () => {
    if (!report) return;
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to download the PDF report.');
        return;
      }

      const dateStrPrint = new Date(report.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const recommendationItems = report.recommendations.map(r => `<li>${r}</li>`).join('');
      const detectionsCount = report.detections.length;
      
      const detectionsList = report.detections.map((det, index) => {
        let binInfo = '';
        if (det.category === 'dry') {
          binInfo = ' - <strong style="color: #2563eb;">Discard in BLUE Dustbin (Dry Waste)</strong>';
        } else if (det.category === 'wet') {
          binInfo = ' - <strong style="color: #16a34a;">Discard in GREEN Dustbin (Wet Waste)</strong>';
        } else if (det.category === 'hazardous') {
          binInfo = ' - <strong style="color: #dc2626;">Discard in RED Dustbin (Hazardous/E-waste)</strong>';
        } else if (det.category === 'sanitation') {
          binInfo = ' - <strong style="color: #7c3aed;">Notify Gram Panchayat PDO</strong>';
        }
        return `
          <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 13px;">
            <strong>#${index + 1} ${det.label}</strong> (${Math.round(det.confidence * 100)}% Confidence)${binInfo}
          </div>
        `;
      }).join('');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>GramSetu AI - Sanitation Audit Report</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #1f2937;
              line-height: 1.5;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 3px solid #2563eb;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              color: #2563eb;
            }
            .title {
              font-size: 20px;
              font-weight: 700;
              margin-top: 8px;
            }
            .meta {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: #6b7280;
              margin-top: 12px;
            }
            .score-section {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-color: #f3f4f6;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 24px;
            }
            .score-box {
              text-align: center;
            }
            .score-num {
              font-size: 32px;
              font-weight: 800;
              color: #1e3a8a;
            }
            .severity-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              background-color: ${report.severity === 'critical' ? '#fee2e2' : report.severity === 'high' ? '#fef3c7' : '#d1fae5'};
              color: ${report.severity === 'critical' ? '#991b1b' : report.severity === 'high' ? '#92400e' : '#065f46'};
            }
            h3 {
              font-size: 15px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #4b5563;
              margin-top: 24px;
              margin-bottom: 12px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 6px;
            }
            ul {
              padding-left: 20px;
              margin: 0;
            }
            li {
              font-size: 13px;
              margin-bottom: 8px;
              font-weight: 500;
            }
            .footer {
              margin-top: 48px;
              border-top: 1px solid #e5e7eb;
              padding-top: 16px;
              text-align: center;
              font-size: 11px;
              color: #9ca3af;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">GramSetu AI</div>
            <div class="title">SwachhAudit Sanitation Report</div>
            <div class="meta">
              <span>Report ID: ${report.id}</span>
              <span>Audited on: ${dateStrPrint}</span>
            </div>
          </div>

          <div class="score-section">
            <div class="score-box">
              <div style="font-size: 11px; text-transform: uppercase; color: #4b5563;">Cleanliness Score</div>
              <div class="score-num">${report.cleanlinessScore}/100</div>
            </div>
            <div>
              <span class="severity-badge">Severity: ${report.severity}</span>
            </div>
          </div>

          <h3>Summary & Findings</h3>
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 16px;">${report.notes}</p>
          <p style="font-size: 13px; color: #4b5563;">Total detected anomalies: <strong>${detectionsCount} items</strong>.</p>

          <h3>Village Recommendations</h3>
          <ul>
            ${recommendationItems}
          </ul>

          <h3>Detailed Detections Map</h3>
          <div>
            ${detectionsList}
          </div>

          <div class="footer">
            Generated by GramSetu AI Sanitation Platform. Supporting Smart Gram Panchayats.
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (e) {
      console.error('Failed to generate printable PDF:', e);
    }
  };

  const handlePlayVoice = () => {
    if (!report) return;
    const synth = window.speechSynthesis;
    if (!synth) {
      alert("Voice readout is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    const score = report.cleanlinessScore;
    const categories = Array.from(new Set(report.detections.map(d => d.category)));

    if (lang === 'kn') {
      let scoreText = "";
      if (score >= 75) {
        scoreText = "ವರದಿ ಸಾರಾಂಶ. ಈ ಪ್ರದೇಶವು ಸ್ವಚ್ಛವಾಗಿದೆ. ತುಂಬಾ ಧನ್ಯವಾದಗಳು, ಹೀಗೆ ಮುಂದುವರೆಸಿ.";
      } else if (score >= 50) {
        scoreText = "ವರದಿ ಸಾರಾಂಶ. ಪ್ರದೇಶದಲ್ಲಿ ಕಸ ಪತ್ತೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ವಿಂಗಡಿಸಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ.";
      } else {
        scoreText = "ಎಚ್ಚರಿಕೆ. ಈ ಪ್ರದೇಶವು ತುಂಬಾ ಗಲೀಜಾಗಿದೆ. ತಕ್ಷಣ ಸ್ವಚ್ಛಗೊಳಿಸಬೇಕು.";
      }

      let binText = "";
      if (categories.includes('wet')) {
        binText += " ಹಸಿ ಕಸವನ್ನು ಹಸಿರು ಬುಟ್ಟಿಗೆ ಹಾಕಿ. ";
      }
      if (categories.includes('dry')) {
        binText += " ಒಣ ಕಸವನ್ನು ನೀಲಿ ಬುಟ್ಟಿಗೆ ಹಾಕಿ. ";
      }
      if (categories.includes('hazardous')) {
        binText += " ಅಪಾಯಕಾರಿ ಬ್ಯಾಟರಿ ಕಸವನ್ನು ಕೆಂಪು ಬುಟ್ಟಿಗೆ ಹಾಕಿ. ";
      }
      if (categories.includes('sanitation')) {
        binText += " ಚರಂಡಿ ಮತ್ತು ನಿಂತ ನೀರನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಲು ಗ್ರಾಮ ಪಂಚಾಯತ್ ಪಿಡಿಒ ಅವರಿಗೆ ತಕ್ಷಣ ತಿಳಿಸಿ. ";
      }

      const utterance = new SpeechSynthesisUtterance(`${scoreText} ${binText}`);
      utterance.lang = 'kn-IN';
      utterance.rate = 0.82;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synth.speak(utterance);
    } else {
      let scoreText = "";
      if (score >= 75) {
        scoreText = "Sanitation Report. The audited area is clean. Good job, keep it up!";
      } else if (score >= 50) {
        scoreText = "Sanitation Report. The area is moderately clean. Scattered waste is detected, cleaning is recommended.";
      } else {
        scoreText = "Alert. The area is dirty and requires cleanup. Important actions are needed.";
      }

      let binText = "";
      if (categories.includes('wet')) {
        binText += " Put wet organic waste in the green dustbin. ";
      }
      if (categories.includes('dry')) {
        binText += " Put dry plastic and paper in the blue dustbin. ";
      }
      if (categories.includes('hazardous')) {
        binText += " Put hazardous battery waste in the red dustbin. ";
      }
      if (categories.includes('sanitation')) {
        binText += " Inform the Gram Panchayat P D O immediately to clear stagnant pools and water logging. ";
      }

      const utterance = new SpeechSynthesisUtterance(`${scoreText} ${binText}`);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synth.speak(utterance);
    }
  };

  const handleWhatsAppReport = () => {
    if (!report) return;
    const message = `Hello Gram Panchayat PDO, reporting sanitation issue (Report ID: ${report.id}). Cleanliness Score: ${report.cleanlinessScore}/100. Issues detected: stagnant water/sewage. Please initiate clearing.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return <LoadingState count={3} />;
  }

  if (!report) {
    return (
      <EmptyState
        title="Report Not Found"
        description="We couldn't locate the specified audit report. It may have been deleted or the ID is invalid."
        actionText="Back to Dashboard"
        onAction={() => router.push('/swachh-audit')}
      />
    );
  }

  const dateStr = new Date(report.timestamp).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const categories = Array.from(new Set(report.detections.map(d => d.category)));
  const score = report.cleanlinessScore;
  const t = translations[lang];

  // Dynamic category-aware indicator description
  const getDynamicDesc = () => {
    if (score >= 75) {
      return t.cleanDesc;
    }
    const issues: string[] = [];
    if (lang === 'en') {
      if (categories.includes('sanitation')) issues.push('drainage blockages/stagnant water');
      if (categories.includes('hazardous')) issues.push('hazardous battery/e-waste');
      if (categories.includes('dry')) issues.push('scattered solid dry waste');
      if (categories.includes('wet')) issues.push('organic/wet waste accumulation');
      return `Issues detected: ${issues.join(', ')}. Please clear and segregate accordingly.`;
    } else {
      if (categories.includes('sanitation')) issues.push('ಚರಂಡಿ ಬ್ಲಾಕ್/ನಿಂತ ನೀರು');
      if (categories.includes('hazardous')) issues.push('ಅಪಾಯಕಾರಿ ಬ್ಯಾಟರಿ/ಇ-ಕಸ');
      if (categories.includes('dry')) issues.push('ಒಣ ಕಸ');
      if (categories.includes('wet')) issues.push('ಹಸಿ ಕಸದ ರಾಶಿ');
      return `ಕಂಡುಬಂದ ಸಮಸ್ಯೆಗಳು: ${issues.join(', ')}. ದಯವಿಟ್ಟು ಸೂಕ್ತವಾಗಿ ವಿಂಗಡಿಸಿ ಮತ್ತು ಸ್ವಚ್ಛಗೊಳಿಸಿ.`;
    }
  };

  // Simple traffic light indicator values
  const getTrafficLight = () => {
    const desc = getDynamicDesc();
    if (score >= 75) {
      return {
        text: t.cleanArea,
        desc,
        bg: 'bg-emerald-500/10 border-emerald-300 text-emerald-800 dark:text-emerald-300',
        pulse: 'bg-emerald-500'
      };
    }
    if (score >= 40) {
      return {
        text: t.litterAlert,
        desc,
        bg: 'bg-amber-500/10 border-amber-300 text-amber-800 dark:text-amber-300',
        pulse: 'bg-amber-500'
      };
    }
    return {
      text: t.urgentAction,
      desc,
      bg: 'bg-red-500/10 border-red-300 text-red-800 dark:text-red-300',
      pulse: 'bg-red-500'
    };
  };

  const status = getTrafficLight();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out] px-4">
      {/* Module Navigation Header */}
      <SwachhAuditHeader />

      {/* Top Controls & Language Toggle */}
      <div className="flex items-center justify-between bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md p-3 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/40 shadow-xs">
        <Link href="/swachh-audit">
          <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-800 cursor-pointer rounded-full font-bold">
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>{t.dashboard}</span>
          </Button>
        </Link>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setLang(lang === 'en' ? 'kn' : 'en');
              if (isSpeaking) {
                window.speechSynthesis?.cancel();
                setIsSpeaking(false);
              }
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full text-xs font-black cursor-pointer shadow-md transition-all duration-300 hover:scale-[1.03]"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
          </button>

          <div className="hidden md:flex items-center text-xs text-neutral-400 font-bold bg-neutral-100 dark:bg-neutral-950 px-3 py-1.5 rounded-full">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            <span>{dateStr}</span>
          </div>
        </div>
      </div>

      {/* 1. Traffic Light Health Status Banner (Premium Gradient Layout) */}
      <div className={`p-6 rounded-3xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-500 shadow-md ${status.bg}`}>
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 tracking-tight">
            <span className="relative flex h-3.5 w-3.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.pulse}`} />
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${status.pulse}`} />
            </span>
            {status.text}
          </h2>
          <p className="text-sm font-bold opacity-90 leading-relaxed max-w-2xl">{status.desc}</p>
        </div>
        <div className="shrink-0">
          <span className="text-sm uppercase font-black tracking-wider bg-black/10 dark:bg-white/10 px-4 py-2 rounded-full border border-black/5 dark:border-white/5">
            {t.score}: {score}%
          </span>
        </div>
      </div>

      {/* 2. Main Redesigned Layout (Sleek side-by-side grids) */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Left Card: Big Visual Bounding Box Preview */}
        <div className="md:col-span-7">
          <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-xl rounded-3xl overflow-hidden backdrop-blur-md bg-white/70 dark:bg-neutral-900/70">
            <div className="bg-neutral-50/80 dark:bg-neutral-900/80 border-b border-neutral-150 dark:border-neutral-800 p-4 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                {t.inspectionMap} ({report.detections.length} {t.objects})
              </span>
              <SeverityBadge severity={report.severity} />
            </div>
            <CardContent className="p-5 flex justify-center items-center bg-black/5 dark:bg-black/20">
              <div className="w-full max-w-md transition-all duration-350 hover:scale-[1.01]">
                <DetectionPreview
                  imageSrc={report.imageSrc}
                  detections={report.detections}
                  highlightedId={hoveredId}
                  onHoverDetection={setHoveredId}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Card: Simplified Cleanliness Score Gauge */}
        <div className="md:col-span-5 space-y-6">
          <CleanlinessScoreCard score={report.cleanlinessScore} />

          {/* Voice Announcement Reader Box */}
          <button
            onClick={handlePlayVoice}
            className={`w-full p-5 rounded-3xl border-2 flex items-center justify-between transition-all duration-350 shadow-md cursor-pointer text-left ${
              isSpeaking 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500 text-white animate-pulse' 
                : 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-neutral-200 dark:border-neutral-800 text-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950 hover:border-neutral-350'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${isSpeaking ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'}`}>
                {isSpeaking ? (
                  <VolumeX className="w-6 h-6 text-white animate-[bounce_1s_infinite]" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="font-extrabold text-base flex items-center gap-1.5">
                  <span>{t.listen}</span>
                  {isSpeaking && (
                    <div className="flex items-center space-x-1">
                      <span className="w-1 h-3 bg-white rounded-full animate-[bounce_0.6s_infinite_0.1s]" />
                      <span className="w-1.5 h-4 bg-white rounded-full animate-[bounce_0.6s_infinite_0.2s]" />
                      <span className="w-1 h-3 bg-white rounded-full animate-[bounce_0.6s_infinite_0.3s]" />
                    </div>
                  )}
                </div>
                <div className="text-xs opacity-75 mt-0.5">
                  {isSpeaking ? t.stopListen : t.tapListen}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Villager Action Cards (Bio-Compost Calculator / Staff Dispatch) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bio-Compost Calculator Card */}
        {categories.includes('wet') && (
          <Card className="border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/10 shadow-lg rounded-3xl relative overflow-hidden transition-all duration-300">
            <CardContent className="p-5 flex items-start space-x-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                <Sprout className="w-6 h-6 animate-[pulse_2.5s_infinite]" />
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-base font-extrabold text-emerald-900 dark:text-emerald-200">
                    {t.compostTitle}
                  </h4>
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {t.compostDesc}
                  </p>
                </div>
                
                {/* Weight slider selector */}
                <div className="space-y-2 bg-white/70 dark:bg-neutral-950/60 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                  <div className="flex justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    <span>{t.compostInput}</span>
                    <span className="text-emerald-700 dark:text-emerald-450 font-black">{wasteWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={wasteWeight}
                    onChange={(e) => setWasteWeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                {/* Outputs breakdown */}
                <div className="grid grid-cols-2 gap-3 text-center bg-white/80 dark:bg-neutral-950 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-900 shadow-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">{t.compostYield}</span>
                    <span className="text-sm font-black text-emerald-750 dark:text-emerald-400">{(wasteWeight * 0.2).toFixed(1)} kg</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">{t.compostTime}</span>
                    <span className="text-sm font-black text-amber-700 dark:text-amber-450">{t.compostTime === 'Decomposition Time' ? '4-6 weeks' : '೪-೬ ವಾರಗಳು'}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed font-semibold italic border-t border-neutral-100 dark:border-neutral-850 pt-3">
                  {t.compostSteps}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cleaning Staff Dispatch Card */}
        {score < 60 && (
          <Card className="border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/10 shadow-lg rounded-3xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
            <CardContent className="p-5 flex items-start space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-2xl text-blue-700 dark:text-blue-300 flex-shrink-0">
                <Wrench className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-3.5 flex-1">
                <div>
                  <h4 className="text-base font-extrabold text-blue-900 dark:text-blue-200">
                    {t.dispatchTitle}
                  </h4>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    {t.dispatchDesc}
                  </p>
                </div>
                <Button
                  onClick={() => alert(t.dispatchConfirm)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 cursor-pointer rounded-full shadow-md transition-all duration-300 hover:scale-[1.03]"
                >
                  {t.dispatchBtn}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 3. Highly Simplified Waste Segregation Guide (Dustbin Colors) */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-2">
          {t.guideTitle}
        </h3>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Green Dustbin: Wet Waste */}
          {categories.includes('wet') ? (
            <Card className="border-emerald-200/50 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-md rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <CardContent className="p-5 flex items-start space-x-4">
                <div className="w-11 h-16 bg-emerald-600 rounded-xl flex flex-col justify-between p-2 shadow-md flex-shrink-0">
                  <div className="w-full h-1 bg-emerald-400 rounded-full" />
                  <Trash2 className="w-6 h-6 text-white mx-auto" />
                  <div className="w-full h-1 bg-emerald-700 rounded-full" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    {t.greenBin}
                  </span>
                  <p className="text-xs font-semibold text-neutral-650 dark:text-neutral-400 leading-relaxed">
                    {t.greenDesc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Blue Dustbin: Dry Waste */}
          {categories.includes('dry') ? (
            <Card className="border-blue-200/50 bg-blue-50/30 dark:bg-blue-950/10 shadow-md rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <CardContent className="p-5 flex items-start space-x-4">
                <div className="w-11 h-16 bg-blue-600 rounded-xl flex flex-col justify-between p-2 shadow-md flex-shrink-0">
                  <div className="w-full h-1 bg-blue-400 rounded-full" />
                  <Trash2 className="w-6 h-6 text-white mx-auto" />
                  <div className="w-full h-1 bg-blue-700 rounded-full" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                    {t.blueBin}
                  </span>
                  <p className="text-xs font-semibold text-neutral-650 dark:text-neutral-400 leading-relaxed">
                    {t.blueDesc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Red Dustbin: Hazardous Waste */}
          {categories.includes('hazardous') ? (
            <Card className="border-red-200/50 bg-red-50/30 dark:bg-red-950/10 shadow-md rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <CardContent className="p-5 flex items-start space-x-4">
                <div className="w-11 h-16 bg-red-600 rounded-xl flex flex-col justify-between p-2 shadow-md flex-shrink-0">
                  <div className="w-full h-1 bg-red-400 rounded-full" />
                  <Trash2 className="w-6 h-6 text-white mx-auto" />
                  <div className="w-full h-1 bg-red-700 rounded-full" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-red-800 dark:text-red-300 uppercase tracking-wider">
                    {t.redBin}
                  </span>
                  <p className="text-xs font-semibold text-neutral-650 dark:text-neutral-400 leading-relaxed">
                    {t.redDesc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* 4. One-Click WhatsApp GP PDO Reporting Feature */}
      {categories.includes('sanitation') ? (
        <Card className="border-purple-250 bg-purple-50/40 dark:bg-purple-950/10 shadow-md rounded-3xl relative overflow-hidden animate-[pulse_4s_infinite]">
          <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-start space-x-4 text-center sm:text-left">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-700 dark:text-purple-300 flex-shrink-0 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-base font-extrabold text-purple-900 dark:text-purple-200">
                  {t.stagnantTitle}
                </h4>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  {t.stagnantDesc}
                </p>
              </div>
            </div>
            <Button
              onClick={handleWhatsAppReport}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-extrabold cursor-pointer w-full sm:w-auto px-5 py-3 rounded-full shadow-md transition-all duration-300 hover:scale-[1.03]"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>{t.reportPdo}</span>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* 5. Simplified Diagnostics Details (Basic Minimal Info) */}
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-lg bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md p-5 rounded-3xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-xs text-neutral-500 dark:text-neutral-405 text-center md:text-left">
            <p className="font-extrabold text-neutral-700 dark:text-neutral-200 text-sm">
              {t.reportId}: <span className="font-mono text-xs bg-neutral-100 dark:bg-neutral-950 px-2 py-0.5 border rounded-full text-blue-600 dark:text-blue-400">{report.id}</span>
            </p>
            <p className="mt-1 font-semibold opacity-75">{t.offlineSync}</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3">
            {/* Swachh India Sanitation Hotline Call Option */}
            <a href="tel:1916" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 font-black cursor-pointer w-full rounded-full px-5 py-2.5 shadow-sm transition-all duration-300 hover:scale-[1.03]"
              >
                <PhoneCall className="w-3.5 h-3.5 mr-2" />
                <span>{t.callHelpline}</span>
              </Button>
            </a>

            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="md"
              className="text-xs bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-black w-full sm:w-auto rounded-full px-5 py-2.5 shadow-sm transition-all duration-300 hover:scale-[1.03]"
            >
              <FileText className="w-3.5 h-3.5 mr-2 text-neutral-500" />
              <span>{t.downloadPdf}</span>
            </Button>

            <Link href="/swachh-audit/camera" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-800 text-white cursor-pointer font-black w-full rounded-full px-5 py-2.5 shadow-md transition-all duration-300 hover:scale-[1.03]">
                <Plus className="w-3.5 h-3.5 mr-2" />
                <span>{t.newAudit}</span>
              </Button>
            </Link>

            <Link href="/swachh-audit" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="text-xs bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-black w-full sm:w-auto rounded-full px-5 py-2.5 shadow-sm transition-all duration-300 hover:scale-[1.03]">
                <LayoutDashboard className="w-3.5 h-3.5 mr-2 text-neutral-500" />
                <span>{t.dashboard}</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function SwachhAuditResultPage() {
  return (
    <Suspense fallback={<LoadingState count={3} />}>
      <ResultContent />
    </Suspense>
  );
}
