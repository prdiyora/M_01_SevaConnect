import React, { useEffect, useState, useMemo } from "react";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchVolunteersByEvent,
  cancelRegistration,
} from "../../services/adminApi";
import "./ManageEvents.css";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  // Custom Delete Confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  // Category selection state
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  const [formData, setFormData] = useState({
    eventname: "",
    description: "",
    category: "",
    location: "",
    event_date: "",
    imageUrl: "",
  });

  const [imgError, setImgError] = useState(false);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      showMessage("Failed to load events", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  const showMessage = (text, type = "success") => {
    const id = Date.now();
    const title = type === "success" ? "Action Successful" : "System Error";
    setNotifications(prev => [...prev, { id, text, type, title }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const createEventHandler = async () => {
    try {
      await createEvent(formData);
      showMessage("Service has been registered and is now live on the platform.");
      resetForm();
      fetchEventsData();
    } catch (err) {
      console.error("Error creating event:", err);
      showMessage("Failed to create service. Please verify your data.", "error");
    }
  };

  const updateEventHandler = async () => {
    try {
      await updateEvent(editingEvent.id, formData);
      showMessage("Service details have been synchronized successfully.");
      resetForm();
      fetchEventsData();
    } catch (err) {
      console.error("Error updating event:", err);
      showMessage("Update failed. Connection error.", "error");
    }
  };

  const deleteEventHandler = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null });
    try {
      await deleteEvent(id);
      showMessage("Service has been permanently removed from the records.");
      fetchEventsData();
    } catch (err) {
      console.error("Error deleting event:", err);
      showMessage("Critical: Failed to remove service.", "error");
    }
  };

  const viewVolunteers = async (eventId) => {
    try {
      const data = await fetchVolunteersByEvent(eventId);
      setVolunteers(data);
      setSelectedEventId(eventId);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      showMessage("Failed to retrieve volunteer data.", "error");
    }
  };

  const cancelRegistrationHandler = async (regId) => {
    if (!window.confirm("Are you sure you want to cancel this registration?")) return;
    try {
      await cancelRegistration(regId);
      showMessage("Registration has been successfully revoked.");
      viewVolunteers(selectedEventId);
    } catch (err) {
      console.error("Error cancelling:", err);
      showMessage("Revoke operation failed.", "error");
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      eventname: event.eventname || "",
      description: event.description || "",
      category: event.category || "",
      location: event.location || "",
      event_date: event.event_date || "",
      imageUrl: event.imageUrl || "",
    });
    setImgError(false);
    setIsAddingNewCategory(false);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editingEvent ? updateEventHandler() : createEventHandler();
  };

  const resetForm = () => {
    setFormData({
      eventname: "",
      description: "",
      category: "",
      location: "",
      event_date: "",
      imageUrl: "",
    });
    setImgError(false);
    setEditingEvent(null);
    setShowForm(false);
    setIsAddingNewCategory(false);
  };

  // 🔎 Advanced Filtering & Sorting
  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events];

    // Search
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter(ev => 
        ev.eventname?.toLowerCase().includes(kw) || 
        ev.location?.toLowerCase().includes(kw) ||
        ev.description?.toLowerCase().includes(kw)
      );
    }

    // Category Filter
    if (categoryFilter !== "All") {
      result = result.filter(ev => ev.category === categoryFilter);
    }

    // Sorting (A-Z / Z-A)
    result.sort((a, b) => {
      const titleA = a.eventname?.toLowerCase() || "";
      const titleB = b.eventname?.toLowerCase() || "";
      if (sortOrder === "asc") return titleA.localeCompare(titleB);
      return titleB.localeCompare(titleA);
    });

    return result;
  }, [events, searchKeyword, categoryFilter, sortOrder]);

  // Derive unique categories
  const uniqueCategories = useMemo(() => {
    const cats = new Set(events.map(ev => ev.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [events]);

  return (
    <div className="me-container">
      {/* 🔔 Premium Notification Stack */}
      <div className="me-notification-container">
        {notifications.map(n => (
          <div key={n.id} className={`me-toast ${n.type}`}>
            <div className="me-toast-icon">
              {n.type === "success" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              )}
            </div>
            <div className="me-toast-content">
              <span className="me-toast-title">{n.title}</span>
              <span className="me-toast-msg">{n.text}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="me-header-section">
        <div className="me-title-row">
          <div className="me-title-group">
            <h2>Manage Services</h2>
            <p>Design, organize, and monitor your impact events.</p>
          </div>
          <button className="me-add-btn" onClick={() => setShowForm(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>Add New Event</span>
          </button>
        </div>

        <div className="me-controls-row">
          <div className="me-search-group">
            <svg className="me-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Search by name, location..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="me-search-input"
            />
          </div>

          <div className="me-filters">
            <div className="me-filter-item">
              <label>Category</label>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="me-select"
              >
                <option value="All">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button 
              className={`me-sort-btn ${sortOrder === 'desc' ? 'desc' : ''}`}
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? "Sort A-Z" : "Sort Z-A"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="14" y2="12"></line><line x1="4" y1="18" x2="8" y2="18"></line></svg>
              <span>{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="me-loading">
          <div className="me-spinner"></div>
          <p>Gathering event data...</p>
        </div>
      ) : filteredAndSortedEvents.length === 0 ? (
        <div className="me-empty-state">
          <div className="me-empty-icon">📂</div>
          <h3>No events found</h3>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="me-table-wrapper">
          <table className="me-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Event Details</th>
                <th>Category</th>
                <th>Location</th>
                <th>Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedEvents.map((ev) => (
                <tr key={ev.id}>
                  <td data-label="Preview">
                    <div className="me-img-container">
                      <img
                        src={ev.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                        alt={ev.eventname}
                        className="me-table-img"
                        onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Image+Error"; }}
                      />
                    </div>
                  </td>
                  <td data-label="Event Details">
                    <div className="me-info-cell">
                      <strong>{ev.eventname}</strong>
                      <span className="me-desc-truncate" title={ev.description}>{ev.description || "No description provided."}</span>
                    </div>
                  </td>
                  <td data-label="Category">
                    <span className="me-category-badge">{ev.category}</span>
                  </td>
                  <td data-label="Location">
                    <div className="me-location-cell">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {ev.location}
                    </div>
                  </td>
                  <td data-label="Schedule">
                    <div className="me-date-cell">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {ev.event_date}
                    </div>
                  </td>
                  <td data-label="Actions">
                    <div className="me-actions-group">
                      <button className="me-action-btn view" onClick={() => viewVolunteers(ev.id)} title="View Volunteers">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      </button>
                      <button className="me-action-btn edit" onClick={() => handleEdit(ev)} title="Edit Event">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                      </button>
                      <button className="me-action-btn delete" onClick={() => deleteEventHandler(ev.id)} title="Delete Event">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ➕ Premium Event Modal */}
      {showForm && (
        <div className="me-modal-overlay" onClick={resetForm}>
          <div className="me-modal" onClick={(e) => e.stopPropagation()}>
            <div className="me-modal-header">
              <div className="me-modal-title-group">
                <div className="me-modal-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <h3>{editingEvent ? "Edit Service" : "Register New Service"}</h3>
              </div>
              <button className="me-close-circle" onClick={resetForm}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="me-form-stack">
                <div className="me-input-group">
                  <label>Service Title</label>
                  <input
                    type="text"
                    placeholder="E.g. Community Clean-up Drive"
                    value={formData.eventname}
                    onChange={(e) => setFormData({ ...formData, eventname: e.target.value })}
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="me-row-grid">
                  <div className="me-input-group">
                    <label>Category</label>
                    {isAddingNewCategory ? (
                      <div className="me-category-toggle-group">
                        <input
                          type="text"
                          placeholder="Type new category..."
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          required
                          autoFocus
                          autoComplete="off"
                        />
                        <button type="button" onClick={() => { setIsAddingNewCategory(false); setFormData({...formData, category: ""}); }} className="me-category-back">Back</button>
                      </div>
                    ) : (
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          if (e.target.value === "ADD_NEW") {
                            setIsAddingNewCategory(true);
                            setFormData({ ...formData, category: "" });
                          } else {
                            setFormData({ ...formData, category: e.target.value });
                          }
                        }}
                        required
                      >
                        <option value="">Select Category</option>
                        {uniqueCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="ADD_NEW" className="me-opt-new">➕ Add New Category</option>
                      </select>
                    )}
                  </div>

                  <div className="me-input-group">
                    <label>Service Date</label>
                    <input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="me-input-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="E.g. Central Park, New York"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="me-input-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => { setFormData({ ...formData, imageUrl: e.target.value }); setImgError(false); }}
                    autoComplete="off"
                  />
                </div>

                {formData.imageUrl && !imgError && (
                  <div className="me-preview-box">
                    <img src={formData.imageUrl} alt="Preview" onError={() => setImgError(true)} />
                  </div>
                )}

                <div className="me-input-group">
                  <label>Brief Description</label>
                  <textarea
                    placeholder="What is this service about?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="me-modal-actions">
                <button type="button" className="me-btn cancel-large" onClick={resetForm}>Cancel</button>
                <button type="submit" className="me-btn save-large">
                  {editingEvent ? "💾 Update Service" : "✨ Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 👥 Volunteers Modal */}
      {selectedEventId && (
        <div className="me-modal-overlay" onClick={() => setSelectedEventId(null)}>
          <div className="me-modal volunteers-mode" onClick={(e) => e.stopPropagation()}>
            <div className="me-modal-header">
              <div className="me-modal-title-group">
                <div className="me-modal-icon volunteers">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3>Active Volunteers</h3>
              </div>
              <button className="me-close-circle" onClick={() => setSelectedEventId(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="me-modal-content">
              {volunteers.length === 0 ? (
                <div className="me-no-volunteers">
                  <p>No volunteers have joined this service yet.</p>
                </div>
              ) : (
                <div className="me-vol-list">
                  {volunteers.map((v) => (
                    <div key={v.id} className="me-vol-card">
                      <div className="me-vol-info">
                        <div className="me-vol-avatar">{v.volunteerName?.charAt(0)}</div>
                        <div className="me-vol-details">
                          <strong>{v.volunteerName}</strong>
                          <span className="me-vol-meta">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            {v.volunteerEmail}
                          </span>
                          {v.volunteerPhone && (
                            <span className="me-vol-meta">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                              <a href={`tel:${v.volunteerPhone}`} className="me-tel-link">{v.volunteerPhone}</a>
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="me-vol-cancel" onClick={() => cancelRegistrationHandler(v.id)} title="Remove Volunteer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="me-modal-actions">
              <button className="me-btn cancel-large" onClick={() => setSelectedEventId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ Custom Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="me-modal-overlay" onClick={() => setDeleteConfirm({ show: false, id: null })}>
          <div className="me-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="me-confirm-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
            <h3>Remove Service?</h3>
            <p>This action is irreversible. All volunteer registrations and requests for this service will be permanently deleted.</p>
            <div className="me-confirm-actions">
              <button className="me-confirm-btn cancel" onClick={() => setDeleteConfirm({ show: false, id: null })}>Keep Service</button>
              <button className="me-confirm-btn confirm" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
