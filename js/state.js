/**
 * Central State Management for Suraksha Alert
 * Manages reactive data, computed safety readiness score, contacts,
 * active journey, escalation workflows, and persistence.
 */

const DEFAULT_STATE = {
  user: {
    name: "Aanya Sen",
    phone: "+91 98200 12345",
    city: "Bengaluru, Karnataka",
    bloodGroup: "O+",
    medicalNote: "Mild asthma, carries inhaler",
    avatar: "AS"
  },
  contacts: [
    {
      id: "c-1",
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      relation: "Sister",
      priority: 1,
      isPrimary: true,
      lastAckTime: null
    },
    {
      id: "c-2",
      name: "Rajesh Verma",
      phone: "+91 98111 22334",
      relation: "Father",
      priority: 2,
      isPrimary: false,
      lastAckTime: null
    },
    {
      id: "c-3",
      name: "Ananya Patel",
      phone: "+91 98450 99887",
      relation: "Roommate / Colleague",
      priority: 3,
      isPrimary: false,
      lastAckTime: null
    }
  ],
  system: {
    locationPermission: "granted", // 'prompt' | 'granted' | 'denied'
    gpsActive: true,
    currentLocation: {
      lat: 12.9716,
      lng: 77.5946,
      address: "Indiranagar 100ft Road, Bengaluru",
      accuracy: "High (±8m)"
    },
    safetyTimerSetup: true,
    emergencySettingsCompleted: true,
    batteryLevel: 84
  },
  shield: {
    voiceKeywordEnabled: true,
    voiceKeyword: "SURAKSHA HELP",
    shakeSosEnabled: true,
    shakeSensitivity: "Medium",
    silentSosEnabled: true,
    autoRecordAudio: true,
    fakeCallQuickTrigger: true
  },
  journey: {
    active: false,
    destination: "Home (Indiranagar)",
    estimatedMinutes: 25,
    remainingSeconds: 1500,
    checkInsCompleted: 0,
    totalCheckIns: 3,
    startTime: null,
    status: "idle" // 'idle' | 'in_progress' | 'missed_checkin' | 'completed'
  },
  escalation: {
    active: false,
    stage: 0, // 0: Idle, 1: Contact 1, 2: Contact 2, 3: Contact 3, 4: Emergency 112
    status: "idle", // 'idle' | 'notified' | 'waiting_ack' | 'acknowledged' | 'escalated'
    acknowledgedBy: null,
    dispatchLog: []
  },
  activityHistory: [
    {
      id: "act-1",
      time: "Today, 02:45 PM",
      category: "journey",
      title: "Smart Journey Completed",
      description: "Checked in safely at 'Indiranagar Metro Station'. Journey timer resolved."
    },
    {
      id: "act-2",
      time: "Today, 01:15 PM",
      category: "system",
      title: "High-Precision GPS Calibrated",
      description: "Browser location verified within ±8m accuracy radius."
    },
    {
      id: "act-3",
      time: "Yesterday, 08:30 PM",
      category: "shield",
      title: "Active Shield Armed",
      description: "Voice SOS ('SURAKSHA HELP') and Shake Detection set to active."
    },
    {
      id: "act-4",
      time: "Yesterday, 07:10 PM",
      category: "contact",
      title: "Priority 1 Contact Verified",
      description: "Emergency SMS channel tested with Priya Sharma (Sister)."
    }
  ]
};

class AppState {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem("suraksha_alert_state");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    try {
      localStorage.setItem("suraksha_alert_state", JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
    this.notify();
  }

  resetToDefaults() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  /* Computed Safety Readiness Score */
  getReadinessDetails() {
    const { contacts, system } = this.state;
    let score = 0;
    const items = [];

    // 1. Emergency Contacts (Max 30 pts)
    const contactCount = contacts.length;
    if (contactCount >= 3) {
      score += 30;
      items.push({
        id: "contacts",
        title: "3 Trusted Contacts Configured",
        category: "Contacts",
        points: 30,
        completed: true,
        desc: "Triple-tier escalation ladder is fully operational."
      });
    } else if (contactCount >= 1) {
      score += 15;
      items.push({
        id: "contacts",
        title: `${contactCount} of 3 Recommended Contacts Added`,
        category: "Contacts",
        points: 15,
        completed: false,
        desc: "Add at least 3 contacts to unlock automated multi-tiered escalation."
      });
    } else {
      items.push({
        id: "contacts",
        title: "No Emergency Contacts Added",
        category: "Contacts",
        points: 0,
        completed: false,
        desc: "Critical! Immediate alerts cannot be dispatched."
      });
    }

    // 2. Location Permission (25 pts)
    if (system.locationPermission === "granted") {
      score += 25;
      items.push({
        id: "location_perm",
        title: "Location Permission Granted",
        category: "GPS & Sensors",
        points: 25,
        completed: true,
        desc: "Browser Geolocation is allowed for live tracking coordinates."
      });
    } else {
      items.push({
        id: "location_perm",
        title: "Location Permission Missing",
        category: "GPS & Sensors",
        points: 0,
        completed: false,
        desc: "Emergency SOS cannot share real-time GPS coordinates without browser permission."
      });
    }

    // 3. High Accuracy GPS (15 pts)
    if (system.gpsActive) {
      score += 15;
      items.push({
        id: "gps",
        title: "High-Accuracy GPS Calibrated",
        category: "GPS & Sensors",
        points: 15,
        completed: true,
        desc: `Verified coordinates: ${system.currentLocation.accuracy}`
      });
    } else {
      items.push({
        id: "gps",
        title: "GPS Sensor Inactive",
        category: "GPS & Sensors",
        points: 0,
        completed: false,
        desc: "Turn on device high precision GPS for faster rescue."
      });
    }

    // 4. Safety Timer / Journey Readiness (15 pts)
    if (system.safetyTimerSetup) {
      score += 15;
      items.push({
        id: "timer",
        title: "Safety Journey Timer Armed",
        category: "Journey Protection",
        points: 15,
        completed: true,
        desc: "Automated check-in monitoring is active before you travel."
      });
    } else {
      items.push({
        id: "timer",
        title: "Journey Check-in Timer Inactive",
        category: "Journey Protection",
        points: 0,
        completed: false,
        desc: "Configure a journey timer to automatically alert contacts if you are delayed."
      });
    }

    // 5. Active Shield & Emergency Protocol (15 pts)
    if (system.emergencySettingsCompleted) {
      score += 15;
      items.push({
        id: "settings",
        title: "Emergency Protocols Configured",
        category: "Active Shield",
        points: 15,
        completed: true,
        desc: "Voice SOS keyword and silent trigger sensitivity verified."
      });
    } else {
      items.push({
        id: "settings",
        title: "Emergency Settings Incomplete",
        category: "Active Shield",
        points: 0,
        completed: false,
        desc: "Complete your medical notes and custom SOS message."
      });
    }

    let grade = "Critical";
    let gradeColor = "var(--color-coral-red)";
    if (score >= 85) {
      grade = "Shield Ready";
      gradeColor = "var(--color-success)";
    } else if (score >= 60) {
      grade = "Moderate Safety";
      gradeColor = "var(--color-warning)";
    }

    return {
      score,
      maxScore: 100,
      grade,
      gradeColor,
      items
    };
  }

  // Add Contact
  addContact(contact) {
    const newContact = {
      id: "c-" + Date.now(),
      name: contact.name,
      phone: contact.phone,
      relation: contact.relation || "Contact",
      priority: Number(contact.priority) || (this.state.contacts.length + 1),
      isPrimary: this.state.contacts.length === 0,
      lastAckTime: null
    };
    this.state.contacts.push(newContact);
    // Sort contacts by priority
    this.state.contacts.sort((a, b) => a.priority - b.priority);

    this.addActivity({
      category: "contact",
      title: `Contact Added: ${newContact.name}`,
      description: `Assigned as Priority ${newContact.priority} (${newContact.relation})`
    });

    this.saveState();
  }

  // Update Contact
  updateContact(id, updated) {
    const idx = this.state.contacts.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.state.contacts[idx] = { ...this.state.contacts[idx], ...updated };
      this.state.contacts.sort((a, b) => a.priority - b.priority);
      this.saveState();
    }
  }

  // Delete Contact
  deleteContact(id) {
    const contact = this.state.contacts.find(c => c.id === id);
    this.state.contacts = this.state.contacts.filter(c => c.id !== id);
    // Re-index priorities
    this.state.contacts.forEach((c, i) => { c.priority = i + 1; });
    if (contact) {
      this.addActivity({
        category: "contact",
        title: `Contact Removed: ${contact.name}`,
        description: `Removed from emergency escalation chain.`
      });
    }
    this.saveState();
  }

  // Log activity
  addActivity(item) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
      ", " + now.toLocaleDateString([], { month: 'short', day: 'numeric' });

    this.state.activityHistory.unshift({
      id: "act-" + Date.now(),
      time: timeStr,
      category: item.category || "system",
      title: item.title,
      description: item.description
    });

    // Keep last 30 activities
    if (this.state.activityHistory.length > 30) {
      this.state.activityHistory.pop();
    }
  }
}

window.appState = new AppState();
