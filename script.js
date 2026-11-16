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
