/**
 * ChronoMail AI — Autonomous Email Scheduler & Conflict Engine
 * 100% Client-Side Engine for GitHub Pages & Static Hosting
 */

// Initial Seed Data for Business Club Demonstration
const DEFAULT_DATA = {
  events: [
    {
      id: "ev_agm",
      title: "Annual General Meeting (AGM)",
      description: "Business club annual governance meeting and executive board elections.",
      start_time: "2026-11-17T14:00:00",
      end_time: "2026-11-17T15:00:00",
      location: "Grand Auditorium, Room 302",
      category: "work",
      attendees: ["board@businessclub.edu", "president@businessclub.edu"],
      status: "confirmed",
      clash_with: [],
      revisions: [],
    },
    {
      id: "ev_marketing",
      title: "Marketing Strategy Review",
      description: "Review sponsor pitch decks and club social media campaign.",
      start_time: "2026-11-17T10:00:00",
      end_time: "2026-11-17T11:00:00",
      location: "https://meet.google.com/mkt-review",
      category: "work",
      attendees: ["marketing.lead@businessclub.edu"],
      status: "confirmed",
      clash_with: [],
      revisions: [],
    }
  ],

  emails: [
    {
      id: "email_01_clash",
      sender_name: "Dean Vance (Faculty Advisor)",
      sender_email: "vance.faculty@university.edu",
      subject: "URGENT: Executive Board & Investor Pitch",
      body: `Dear Executive Team,

Representatives from Apex Capital and Goldman Sachs just confirmed their pitch review slot for tomorrow (Nov 17, 2026) from 2:00 PM to 3:15 PM.

This is our primary funding review for the semester case competition, so leadership attendance is required.

Meeting Details:
Date: Tomorrow (Nov 17, 2026)
Time: 2:00 PM - 3:15 PM
Location: https://meet.google.com/apex-pitch-2026

Please review the attached slide deck 30 minutes before the call.

Best,
Dean Vance`,
      received_at: "2026-11-16T11:45:00",
      category: "Work",
      is_processed: false,
      extracted_event_id: null,
      clash_detected: false,
    },
    {
      id: "email_02_reschedule",
      sender_name: "Sarah Jenkins (VP Marketing)",
      sender_email: "sarah.j@businessclub.edu",
      subject: "Rescheduled: Marketing Strategy Review moved to 3:30 PM",
      body: `Hey Team,

Due to a campus lecture clash with Professor Miller, we are rescheduling tomorrow's (Nov 17, 2026) Marketing Strategy Review from 10:00 AM to 3:30 PM.

New Time: 3:30 PM - 4:30 PM
Location: https://meet.google.com/mkt-review

See you all then!
Sarah`,
      received_at: "2026-11-16T11:15:00",
      category: "Work",
      is_processed: false,
      extracted_event_id: null,
      clash_detected: false,
    },
    {
      id: "email_03_flight",
      sender_name: "Skyline Airways",
      sender_email: "tickets@skylineair.com",
      subject: "Flight Confirmation #SKY-4921: SFO to NYC (National Case Competition)",
      body: `Flight Confirmation #SKY-4921
Flight: SA 408 Nonstop
Departure: Thursday, Nov 19, 2026 at 08:30 AM
Departure Airport: San Francisco International Airport (SFO), Terminal 3
Arrival: 02:45 PM at JFK New York

Reminders:
- Online check-in opens 24 hours prior to departure.
- Arrive at SFO airport at least 3 hours prior to departure for bag drop.`,
      received_at: "2026-11-16T10:30:00",
      category: "Travel",
      is_processed: false,
      extracted_event_id: null,
      clash_detected: false,
    },
    {
      id: "email_04_dinner",
      sender_name: "Emily Chen (Alumni Relations)",
      sender_email: "emily.chen@alumni.org",
      subject: "Guest Speaker Dinner: Private Dining at The Capital Grille",
      body: `Hi Everyone,

I reserved a table for our alumni networking dinner this Thursday (Nov 19, 2026) from 7:00 PM to 9:00 PM.

Venue: The Capital Grille, 120 Broadway, New York
Reservation under: Business Club Alumni

Dress code is business casual. Looking forward to catching up!`,
      received_at: "2026-11-16T09:15:00",
      category: "Personal",
      is_processed: false,
      extracted_event_id: null,
      clash_detected: false,
    },
    {
      id: "email_05_cancel",
      sender_name: "Treasurer Marcus",
      sender_email: "treasurer@businessclub.edu",
      subject: "Canceled: Budget Committee Standup",
      body: `Hi all,

The weekly budget review scheduled for Wednesday has been canceled as all semester allocations have been approved.

Enjoy the free afternoon!
Marcus`,
      received_at: "2026-11-16T08:00:00",
      category: "Work",
      is_processed: false,
      extracted_event_id: null,
      clash_detected: false,
    }
  ],

  reminders: [
    {
      id: "rem_agm_1h",
      event_id: "ev_agm",
      title: "📋 Review club voting bylaws for Annual General Meeting",
      trigger_time: "2026-11-17T13:00:00",
      offset_description: "1 hour before",
      category: "meeting",
      is_completed: false
    }
  ],

  auditLogs: [
    {
      timestamp: "2026-11-15T09:30:00",
      action: "INITIAL_SYNC",
      description: "Initialized calendar with Annual General Meeting and Marketing Review."
    }
  ]
};

// Application State
let appData = { ...DEFAULT_DATA };
let selectedEmailId = null;
let currentTab = 'inbox';
let emailFilter = 'all';

// Audio Context for synthetic minimal chimes
let audioCtx = null;
function playSound(type = 'success') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'clash') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // Audio unsupported
  }
}

// ============================================================
// NLP & SCHEDULING EXTRACTION ENGINE
// ============================================================

function cleanSubject(subject) {
  return subject
    .replace(/^(re|fwd|fw|invitation|invite|urgent|rescheduled|canceled):\s*/i, '')
    .replace(/^(re|fwd|fw|invitation|invite|urgent|rescheduled|canceled):\s*/i, '')
    .trim();
}

function detectIntent(subject, body) {
  const text = `${subject} ${body}`.toLowerCase();
  if (text.includes('canceled') || text.includes('cancelled') || text.includes('calling off')) {
    return 'CANCEL_EVENT';
  }
  if (text.includes('rescheduled') || text.includes('moved to') || text.includes('postponed') || text.includes('new time')) {
    return 'UPDATE_EVENT';
  }
  return 'NEW_EVENT';
}

function extractLocation(text) {
  const meet = text.match(/https?:\/\/meet\.google\.com\/[a-z0-9-]+/i);
  if (meet) return meet[0];
  const zoom = text.match(/https?:\/\/[a-z0-9.-]*zoom\.us\/[^\s<>"']+/i);
  if (zoom) return zoom[0];
  const venue = text.match(/(?:Venue|Location|Place|Room|At):\s*([^\n\r]+)/i);
  if (venue) return venue[1].trim();
  const address = text.match(/\b\d+\s+[A-Za-z0-9\s,.-]+(?:Broadway|St|Street|Avenue|Ave|Suite|Hall|Auditorium)[^\n\r]*/i);
  if (address) return address[0].trim();
  return "Virtual Meeting";
}

function parseTimePart(timeStr) {
  let isPm = /pm/i.test(timeStr);
  let isAm = /am/i.test(timeStr);
  let cleaned = timeStr.replace(/[apm\s]/gi, '');
  let [h, m] = cleaned.includes(':') ? cleaned.split(':').map(Number) : [Number(cleaned), 0];
  if (isPm && h < 12) h += 12;
  if (isAm && h === 12) h = 0;
  return [h, m];
}

function extractTimeslots(text) {
  // Reference anchor: 2026-11-16
  let targetDate = "2026-11-17";
  if (/thursday|nov 19/i.test(text)) targetDate = "2026-11-19";
  if (/wednesday|nov 18/i.test(text)) targetDate = "2026-11-18";
  if (/friday|nov 20/i.test(text)) targetDate = "2026-11-20";

  // Check range: "2:00 PM - 3:15 PM" or "3:30 PM to 4:30 PM"
  const rangeMatch = text.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:-|to)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
  if (rangeMatch) {
    let s = rangeMatch[1];
    let e = rangeMatch[2];
    if (!/am|pm/i.test(s) && /am|pm/i.test(e)) {
      s += ` ${e.match(/am|pm/i)[0]}`;
    }
    const [sh, sm] = parseTimePart(s);
    const [eh, em] = parseTimePart(e);

    const pad = n => String(n).padStart(2, '0');
    return {
      start: `${targetDate}T${pad(sh)}:${pad(sm)}:00`,
      end: `${targetDate}T${pad(eh)}:${pad(em)}:00`,
    };
  }

  // Single time: "at 08:30 AM" or "at 3:30 PM"
  const singleMatch = text.match(/(?:at|moved to)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (singleMatch) {
    let t = singleMatch[1];
    if (!/am|pm/i.test(t)) t += " PM";
    const [sh, sm] = parseTimePart(t);
    const pad = n => String(n).padStart(2, '0');
    let eh = sh + 1;
    return {
      start: `${targetDate}T${pad(sh)}:${pad(sm)}:00`,
      end: `${targetDate}T${pad(eh)}:${pad(sm)}:00`,
    };
  }

  return {
    start: `${targetDate}T10:00:00`,
    end: `${targetDate}T11:00:00`,
  };
}

function detectClashes(targetEvent) {
  const clashes = [];
  const tStart = new Date(targetEvent.start_time).getTime();
  const tEnd = new Date(targetEvent.end_time).getTime();

  appData.events.forEach(other => {
    if (other.id === targetEvent.id || other.status === 'canceled') return;
    const oStart = new Date(other.start_time).getTime();
    const oEnd = new Date(other.end_time).getTime();

    // Overlap: start1 < end2 and end1 > start2
    if (tStart < oEnd && tEnd > oStart) {
      const overlapStart = Math.max(tStart, oStart);
      const overlapEnd = Math.min(tEnd, oEnd);
      const overlapMins = Math.round((overlapEnd - overlapStart) / 60000);

      // Suggest alternative: right after other meeting (+15m)
      const altStart = new Date(oEnd + 15 * 60000);
      const duration = tEnd - tStart;
      const altEnd = new Date(altStart.getTime() + duration);

      clashes.push({
        conflictingEvent: other,
        overlapMins,
        altStart: altStart.toISOString().slice(0, 19),
        altEnd: altEnd.toISOString().slice(0, 19),
        altLabel: `Shift to ${formatTime(altStart.toISOString())} (after ${other.title})`
      });
    }
  });

  return clashes;
}

function generateReminders(event) {
  const rems = [];
  const start = new Date(event.start_time);

  if (event.category === 'travel') {
    rems.push({
      id: `rem_${event.id}_24h`,
      event_id: event.id,
      title: `✈️ Online check-in opens for ${event.title}`,
      trigger_time: new Date(start.getTime() - 24 * 3600000).toISOString(),
      offset_description: "24 hours before flight",
      is_completed: false
    });
    rems.push({
      id: `rem_${event.id}_3h`,
      event_id: event.id,
      title: `🚕 Depart for airport: ${event.title} (Terminal 3)`,
      trigger_time: new Date(start.getTime() - 3 * 3600000).toISOString(),
      offset_description: "3 hours before flight",
      is_completed: false
    });
  } else {
    rems.push({
      id: `rem_${event.id}_15m`,
      event_id: event.id,
      title: `🔔 ${event.title} begins in 15 mins (Meeting link ready)`,
      trigger_time: new Date(start.getTime() - 15 * 60000).toISOString(),
      offset_description: "15 minutes before",
      is_completed: false
    });
    rems.push({
      id: `rem_${event.id}_1h`,
      event_id: event.id,
      title: `📋 Review slide deck & agenda for ${event.title}`,
      trigger_time: new Date(start.getTime() - 60 * 60000).toISOString(),
      offset_description: "1 hour before",
      is_completed: false
    });
  }
  return rems;
}

// ============================================================
// PROCESSING ACTIONS
// ============================================================

function processEmail(emailId) {
  const email = appData.emails.find(e => e.id === emailId);
  if (!email) return;

  const intent = detectIntent(email.subject, email.body);
  const cleanedTitle = cleanSubject(email.subject);

  if (intent === 'CANCEL_EVENT') {
    const matched = appData.events.find(ev => 
      ev.title.toLowerCase().includes(cleanedTitle.toLowerCase()) || 
      cleanedTitle.toLowerCase().includes(ev.title.toLowerCase())
    );
    if (matched) {
      matched.status = 'canceled';
      email.is_processed = true;
      appData.auditLogs.unshift({
        timestamp: new Date().toISOString(),
        action: "CANCELED_EVENT",
        description: `Automatically canceled '${matched.title}' as requested by ${email.sender_name}.`
      });
    }
  } else if (intent === 'UPDATE_EVENT') {
    // Match existing event
    const matched = appData.events.find(ev => 
      ev.title.toLowerCase().includes(cleanedTitle.toLowerCase()) || 
      cleanedTitle.toLowerCase().includes(ev.title.toLowerCase())
    );
    if (matched) {
      const { start, end } = extractTimeslots(`${email.subject} ${email.body}`);
      const oldStart = matched.start_time;
      matched.start_time = start;
      matched.end_time = end;
      matched.status = 'updated';
      matched.revisions = matched.revisions || [];
      matched.revisions.unshift({
        summary: `Rescheduled from ${formatTime(oldStart)} to ${formatTime(start)}`,
        timestamp: new Date().toISOString()
      });

      email.is_processed = true;
      email.extracted_event_id = matched.id;

      // Update reminders
      const newRems = generateReminders(matched);
      appData.reminders = appData.reminders.filter(r => r.event_id !== matched.id).concat(newRems);

      appData.auditLogs.unshift({
        timestamp: new Date().toISOString(),
        action: "RESCHEDULED_EVENT",
        description: `Rescheduled '${matched.title}' to ${formatTime(start)}.`
      });
      playSound('success');
    }
  } else {
    // New Event
    const { start, end } = extractTimeslots(`${email.subject} ${email.body}`);
    const location = extractLocation(`${email.subject}\n${email.body}`);
    const category = email.category.toLowerCase();

    const newEvent = {
      id: `ev_${Date.now()}`,
      title: cleanedTitle,
      description: `Extracted from email by ${email.sender_name}`,
      start_time: start,
      end_time: end,
      location,
      category,
      attendees: [email.sender_email],
      status: "confirmed",
      clash_with: [],
      revisions: []
    };

    const clashes = detectClashes(newEvent);
    if (clashes.length > 0) {
      newEvent.status = 'clash_detected';
      newEvent.clash_with = clashes.map(c => c.conflictingEvent.id);
      email.clash_detected = true;
      playSound('clash');
    } else {
      playSound('success');
    }

    appData.events.push(newEvent);
    email.is_processed = true;
    email.extracted_event_id = newEvent.id;

    const rems = generateReminders(newEvent);
    appData.reminders = appData.reminders.concat(rems);

    appData.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: "CREATED_EVENT",
      description: `Scheduled '${cleanedTitle}' for ${formatDateTime(start)}.`
    });
  }

  saveData();
  renderAll();
}

function processAllEmails() {
  appData.emails.forEach(e => {
    if (!e.is_processed) processEmail(e.id);
  });
}

function resolveConflict(eventId, newStart, newEnd) {
  const ev = appData.events.find(e => e.id === eventId);
  if (!ev) return;

  const oldStart = ev.start_time;
  ev.start_time = newStart;
  ev.end_time = newEnd;
  ev.status = 'confirmed';
  ev.clash_with = [];

  ev.revisions = ev.revisions || [];
  ev.revisions.unshift({
    summary: `Conflict resolved: moved from ${formatTime(oldStart)} to ${formatTime(newStart)}`,
    timestamp: new Date().toISOString()
  });

  // Re-generate reminders
  appData.reminders = appData.reminders.filter(r => r.event_id !== eventId).concat(generateReminders(ev));

  appData.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: "RESOLVED_CLASH",
    description: `Conflict resolved: Moved '${ev.title}' to ${formatTime(newStart)}.`
  });

  playSound('success');
  saveData();
  renderAll();
}

function resetDemoData() {
  if (!confirm("Reset all events, emails, and reminders to initial demonstration state?")) return;
  appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
  selectedEmailId = appData.emails[0].id;
  saveData();
  renderAll();
  playSound('success');
}

// LocalStorage Persistence
function saveData() {
  try {
    localStorage.setItem('chronomail_data', JSON.stringify(appData));
  } catch(e){}
}

function loadData() {
  try {
    const saved = localStorage.getItem('chronomail_data');
    if (saved) {
      appData = JSON.parse(saved);
      return;
    }
  } catch(e){}
  appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
}

// ============================================================
// FORMATTING HELPERS
// ============================================================

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ============================================================
// UI RENDERING
// ============================================================

function renderStats() {
  const activeEvents = appData.events.filter(e => e.status !== 'canceled');
  let clashCount = 0;
  activeEvents.forEach(e => {
    const c = detectClashes(e);
    if (c.length > 0) clashCount++;
  });

  const unprocessedCount = appData.emails.filter(e => !e.is_processed).length;
  const activeReminders = appData.reminders.filter(r => !r.is_completed).length;

  document.getElementById('stat-events').textContent = activeEvents.length;
  
  const clashCard = document.getElementById('stat-clash-card');
  const clashVal = document.getElementById('stat-clashes');
  const clashSub = document.getElementById('stat-clash-sub');
  const tabClashCount = document.getElementById('tab-clash-count');

  clashVal.textContent = clashCount;
  if (clashCount > 0) {
    clashCard.classList.add('alert-clash');
    clashSub.textContent = `${clashCount} scheduling overlap${clashCount > 1 ? 's' : ''}!`;
    tabClashCount.textContent = clashCount;
    tabClashCount.classList.add('alert');
  } else {
    clashCard.classList.remove('alert-clash');
    clashSub.textContent = 'Zero schedule conflicts';
    tabClashCount.textContent = '0';
    tabClashCount.classList.remove('alert');
  }

  document.getElementById('stat-reminders').textContent = activeReminders;
  document.getElementById('stat-emails').textContent = unprocessedCount;
  document.getElementById('tab-inbox-count').textContent = unprocessedCount;
  document.getElementById('tab-reminders-count').textContent = activeReminders;
}

function renderEmailList() {
  const container = document.getElementById('emails-list');
  let filtered = [...appData.emails];
  if (emailFilter === 'unprocessed') {
    filtered = filtered.filter(e => !e.is_processed);
  } else if (emailFilter !== 'all') {
    filtered = filtered.filter(e => e.category.toLowerCase() === emailFilter.toLowerCase());
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; font-size:12px; color:var(--text-faint);">No emails in this filter.</div>`;
    return;
  }

  container.innerHTML = filtered.map(e => {
    const isSelected = e.id === selectedEmailId;
    let chip = '';
    if (e.clash_detected) chip = `<span class="chip chip-clash">⚠️ Clash</span>`;
    else if (e.is_processed) chip = `<span class="chip chip-scheduled">✓ Synced</span>`;
    else chip = `<span class="chip chip-pending">Pending</span>`;

    return `
      <div onclick="selectEmail('${e.id}')" class="email-card ${isSelected ? 'active' : ''}">
        <div class="email-card-top">
          <span class="email-sender">${escapeHtml(e.sender_name)}</span>
          <span class="email-time">${formatTime(e.received_at)}</span>
        </div>
        <div class="email-subject">${escapeHtml(e.subject)}</div>
        <div class="email-meta">
          ${chip}
          <span style="font-size:10px; color:var(--text-faint);">${escapeHtml(e.category)}</span>
        </div>
      </div>
    `;
  }).join('');
}

function selectEmail(id) {
  selectedEmailId = id;
  renderEmailList();
  renderEmailReader();
  renderAIInspector();
}

function renderEmailReader() {
  const container = document.getElementById('email-reader');
  const email = appData.emails.find(e => e.id === selectedEmailId);

  if (!email) {
    container.innerHTML = `<div style="text-align:center; padding:50px; color:var(--text-faint);">Select an email to view.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="reader-wrapper">
      <div class="reader-header">
        <div class="reader-subject">${escapeHtml(email.subject)}</div>
        <div class="reader-meta-row">
          <div>From: <strong>${escapeHtml(email.sender_name)}</strong> (${escapeHtml(email.sender_email)})</div>
          <div>${formatDateTime(email.received_at)}</div>
        </div>
      </div>
      <div class="reader-body">${escapeHtml(email.body)}</div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:11px; color:var(--text-faint);">Status: ${email.is_processed ? '<strong style="color:var(--success);">Scheduled</strong>' : '<strong style="color:var(--warning);">Awaiting AI Scan</strong>'}</span>
        ${!email.is_processed ? `
          <button onclick="processEmail('${email.id}')" class="btn btn-primary btn-sm">
            ⚡ Scan & Auto-Schedule
          </button>
        ` : `
          <button onclick="processEmail('${email.id}')" class="btn btn-secondary btn-sm">
            Re-scan Email
          </button>
        `}
      </div>
    </div>
  `;
}

function renderAIInspector() {
  const container = document.getElementById('ai-inspector');
  const email = appData.emails.find(e => e.id === selectedEmailId);

  if (!email) {
    container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-faint);">No email selected.</div>`;
    return;
  }

  const linkedEvent = appData.events.find(ev => ev.id === email.extracted_event_id);
  const clashes = linkedEvent ? detectClashes(linkedEvent) : [];

  if (!email.is_processed) {
    container.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-title" style="color:var(--primary);">
          🤖 AI Schedule Extractor
        </div>
        <div class="inspector-details">
          Click "Scan & Auto-Schedule" to parse date, time, location, attendees, and inspect for calendar clashes.
        </div>
      </div>
    `;
    return;
  }

  let clashHtml = '';
  if (clashes.length > 0) {
    const c = clashes[0];
    clashHtml = `
      <div class="inspector-card clash">
        <div class="inspector-title" style="color:var(--danger);">
          ⚠️ Schedule Clash Detected!
        </div>
        <div class="inspector-details">
          Overlaps with <strong>"${escapeHtml(c.conflictingEvent.title)}"</strong> by ${c.overlapMins} minutes.
        </div>
        <div style="margin-top:10px;">
          <button onclick="resolveConflict('${linkedEvent.id}', '${c.altStart}', '${c.altEnd}')" class="btn btn-danger btn-sm" style="width:100%;">
            ✓ 1-Click: ${escapeHtml(c.altLabel)}
          </button>
        </div>
      </div>
    `;
  }

  let revHtml = '';
  if (linkedEvent && linkedEvent.revisions && linkedEvent.revisions.length > 0) {
    revHtml = `
      <div class="inspector-card update">
        <div class="inspector-title" style="color:var(--warning);">
          🔄 Schedule Update Applied
        </div>
        <div class="inspector-details">
          ${escapeHtml(linkedEvent.revisions[0].summary)}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    ${clashHtml}
    ${revHtml}
    ${linkedEvent ? `
      <div class="inspector-card">
        <div class="inspector-title">📅 Extracted Calendar Event</div>
        <div class="detail-row">
          <span class="label">Title:</span>
          <span class="value">${escapeHtml(linkedEvent.title)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Time:</span>
          <span class="value">${formatTime(linkedEvent.start_time)} – ${formatTime(linkedEvent.end_time)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date:</span>
          <span class="value">${formatDate(linkedEvent.start_time)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Location:</span>
          <span class="value">${escapeHtml(linkedEvent.location)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Category:</span>
          <span class="value" style="text-transform:uppercase;">${escapeHtml(linkedEvent.category)}</span>
        </div>
      </div>
    ` : ''}

    <div class="inspector-card">
      <div class="inspector-title">⏰ Contextual Reminders Generated</div>
      <div class="inspector-details">
        ${appData.reminders.filter(r => linkedEvent && r.event_id === linkedEvent.id).map(r => `
          <div style="padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; font-size:11px;">
            <span>${escapeHtml(r.title)}</span>
            <span style="color:var(--primary); font-family:var(--font-mono);">${r.offset_description}</span>
          </div>
        `).join('') || '<div style="color:var(--text-faint); padding:4px 0;">No reminders.</div>'}
      </div>
    </div>
  `;
}

function renderCalendar() {
  const container = document.getElementById('calendar-view');
  const events = appData.events.filter(e => e.status !== 'canceled');

  const grouped = {};
  events.forEach(e => {
    const day = e.start_time.split('T')[0];
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(e);
  });

  const sortedDays = Object.keys(grouped).sort();

  container.innerHTML = sortedDays.map(dayKey => {
    const dayEvents = grouped[dayKey].sort((a,b) => a.start_time.localeCompare(b.start_time));
    return `
      <div class="agenda-day">
        <div class="agenda-day-header">
          <span>${formatDate(`${dayKey}T12:00:00`)}</span>
          <span style="font-size:11px; font-weight:normal;">${dayEvents.length} events</span>
        </div>
        ${dayEvents.map(ev => {
          const clashes = detectClashes(ev);
          const hasClashes = clashes.length > 0;
          return `
            <div class="event-item ${hasClashes ? 'is-clashing' : ''}">
              <div class="event-time-badge">${formatTime(ev.start_time)} – ${formatTime(ev.end_time)}</div>
              <div class="event-info">
                <div class="event-title">${escapeHtml(ev.title)}</div>
                <div class="event-meta">
                  <span>📍 ${escapeHtml(ev.location)}</span>
                  <span>• ${ev.category}</span>
                </div>
              </div>
              ${hasClashes ? `
                <button onclick="switchTab('conflicts')" class="btn btn-danger btn-sm">
                  ⚠️ Resolve Clash
                </button>
              ` : ev.status === 'updated' ? `
                <span class="chip chip-update">Updated</span>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');
}

function renderConflicts() {
  const container = document.getElementById('conflicts-view');
  const activeEvents = appData.events.filter(e => e.status !== 'canceled');
  const conflictPairs = [];

  activeEvents.forEach(ev => {
    const clashes = detectClashes(ev);
    clashes.forEach(c => {
      // Avoid duplicate reversed pairs
      const pairKey = [ev.id, c.conflictingEvent.id].sort().join('-');
      if (!conflictPairs.some(p => p.key === pairKey)) {
        conflictPairs.push({
          key: pairKey,
          eventA: ev,
          eventB: c.conflictingEvent,
          clash: c
        });
      }
    });
  });

  if (conflictPairs.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:60px 20px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg);">
        <div style="font-size:32px; margin-bottom:10px;">✅</div>
        <h3 style="font-size:16px; font-weight:700; color:#fff;">All Clear — No Schedule Clashes!</h3>
        <p style="font-size:12px; color:var(--text-faint); margin-top:4px;">When incoming emails conflict with existing meetings, they will appear here with automated 1-click solutions.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = conflictPairs.map(p => {
    return `
      <div class="conflict-box">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="font-size:14px; font-weight:700; color:#fff;">⚠️ Conflict Alert: ${p.clash.overlapMins} Minutes Direct Overlap</h3>
          <span class="chip chip-clash">Action Required</span>
        </div>

        <div class="conflict-grid">
          <div class="conflict-event-card">
            <div style="font-size:10px; color:var(--text-faint); margin-bottom:4px;">EVENT 1</div>
            <div style="font-weight:700; font-size:13px; color:#fff;">${escapeHtml(p.eventA.title)}</div>
            <div style="font-size:11px; color:var(--primary); font-family:var(--font-mono); margin-top:4px;">
              ${formatTime(p.eventA.start_time)} – ${formatTime(p.eventA.end_time)}
            </div>
          </div>

          <div class="conflict-event-card" style="border-color:var(--danger-border);">
            <div style="font-size:10px; color:#fda4af; margin-bottom:4px;">EVENT 2 (OVERLAPPING)</div>
            <div style="font-weight:700; font-size:13px; color:#fff;">${escapeHtml(p.eventB.title)}</div>
            <div style="font-size:11px; color:#fda4af; font-family:var(--font-mono); margin-top:4px;">
              ${formatTime(p.eventB.start_time)} – ${formatTime(p.eventB.end_time)}
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
          <button onclick="resolveConflict('${p.eventA.id}', '${p.clash.altStart}', '${p.clash.altEnd}')" class="btn btn-primary btn-sm">
            ✓ 1-Click: ${escapeHtml(p.clash.altLabel)}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderReminders() {
  const container = document.getElementById('reminders-view');
  container.innerHTML = appData.reminders.map(r => {
    return `
      <div class="reminder-item ${r.is_completed ? 'done' : ''}">
        <div style="display:flex; align-items:center; gap:12px;">
          <input type="checkbox" ${r.is_completed ? 'checked' : ''} onchange="toggleReminder('${r.id}')" style="cursor:pointer;">
          <div>
            <div style="font-size:12.5px; font-weight:600; color:#fff;">${escapeHtml(r.title)}</div>
            <div style="font-size:11px; color:var(--text-faint); font-family:var(--font-mono); margin-top:2px;">
              ${formatDateTime(r.trigger_time)} (${r.offset_description})
            </div>
          </div>
        </div>
        <button onclick="snoozeReminder('${r.id}', 15)" class="btn btn-secondary btn-sm">+15m</button>
      </div>
    `;
  }).join('');
}

function toggleReminder(id) {
  const r = appData.reminders.find(rem => rem.id === id);
  if (r) {
    r.is_completed = !r.is_completed;
    saveData();
    renderAll();
    playSound('success');
  }
}

function snoozeReminder(id, mins) {
  const r = appData.reminders.find(rem => rem.id === id);
  if (r) {
    const cur = new Date(r.trigger_time).getTime();
    r.trigger_time = new Date(cur + mins * 60000).toISOString();
    r.offset_description = `Snoozed +${mins}m`;
    saveData();
    renderAll();
    playSound('success');
  }
}

function renderAudit() {
  const container = document.getElementById('audit-view');
  container.innerHTML = appData.auditLogs.map(l => {
    return `
      <div style="padding:10px 14px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; font-size:11.5px;">
        <div>
          <span class="badge-tag" style="margin-right:8px;">${escapeHtml(l.action)}</span>
          <span style="color:#fff;">${escapeHtml(l.description)}</span>
        </div>
        <span style="font-family:var(--font-mono); color:var(--text-faint); font-size:10.5px;">${formatTime(l.timestamp)}</span>
      </div>
    `;
  }).join('');
}

function renderAll() {
  renderStats();
  renderEmailList();
  renderEmailReader();
  renderAIInspector();
  renderCalendar();
  renderConflicts();
  renderReminders();
  renderAudit();
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.style.display = panel.id === `tab-${tab}` ? 'block' : 'none';
  });
}

// Modal handling
function openModal(id) {
  document.getElementById(id).style.display = 'flex';
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Quick scenario template filler
function loadTemplate(tpl) {
  const nameEl = document.getElementById('inp-sender-name');
  const emailEl = document.getElementById('inp-sender-email');
  const subjEl = document.getElementById('inp-subject');
  const bodyEl = document.getElementById('inp-body');

  if (tpl === 'clash') {
    nameEl.value = "Dean Vance (Faculty Advisor)";
    emailEl.value = "vance@university.edu";
    subjEl.value = "URGENT: Executive Board & Investor Pitch";
    bodyEl.value = `Hi Team,\n\nWe have a pitch review with investors tomorrow (Nov 17, 2026) from 2:00 PM to 3:15 PM.\nLocation: https://meet.google.com/apex-pitch-2026`;
  } else if (tpl === 'reschedule') {
    nameEl.value = "Sarah Jenkins";
    emailEl.value = "sarah@businessclub.edu";
    subjEl.value = "Rescheduled: Marketing Strategy Review moved to 3:30 PM";
    bodyEl.value = `Hi team,\n\nOur Marketing Review is moved to 3:30 PM to 4:30 PM tomorrow.\nLocation: https://meet.google.com/mkt-review`;
  } else if (tpl === 'flight') {
    nameEl.value = "Skyline Airways";
    emailEl.value = "tickets@skylineair.com";
    subjEl.value = "Flight Confirmation #SKY-4921: SFO to NYC";
    bodyEl.value = `Departure: Thursday, Nov 19, 2026 at 08:30 AM\nAirport: SFO Terminal 3\nOnline check-in opens 24h before.`;
  }
}

// Ingestion Form Submit
document.getElementById('form-add-email').addEventListener('submit', (e) => {
  e.preventDefault();
  const senderName = document.getElementById('inp-sender-name').value;
  const senderEmail = document.getElementById('inp-sender-email').value;
  const subject = document.getElementById('inp-subject').value;
  const body = document.getElementById('inp-body').value;

  const newEmail = {
    id: `email_${Date.now()}`,
    sender_name: senderName,
    sender_email: senderEmail,
    subject,
    body,
    received_at: new Date().toISOString(),
    category: "Work",
    is_processed: false,
    extracted_event_id: null,
    clash_detected: false
  };

  appData.emails.unshift(newEmail);
  selectedEmailId = newEmail.id;
  closeModal('modal-add-email');
  document.getElementById('form-add-email').reset();

  // Auto process immediately
  processEmail(newEmail.id);
});

// App Initialization
window.addEventListener('DOMContentLoaded', () => {
  loadData();
  if (appData.emails.length > 0 && !selectedEmailId) {
    selectedEmailId = appData.emails[0].id;
  }
  renderAll();
});
