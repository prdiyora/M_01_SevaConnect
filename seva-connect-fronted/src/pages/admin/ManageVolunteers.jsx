import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchVolunteers, updateVolunteer, deleteVolunteer, createVolunteer } from "../../services/adminApi";
import "./ManageVolunteers.css";

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editVolunteer, setEditVolunteer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    role: "VOLUNTEER",
    password: "Password@123",
  });
  const [notifications, setNotifications] = useState([]);
  const [confirmAction, setConfirmAction] = useState({ show: false, id: null, title: "", message: "" });
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'volunteer', 'admin'

  // ✅ Fetch all volunteers
  const fetchVolunteersData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("DEBUG: Calling fetchVolunteers...");
      const data = await fetchVolunteers();
      console.log("DEBUG: fetchVolunteers raw response:", data);
      
      if (Array.isArray(data)) {
        setVolunteers(data);
      } else {
        console.error("DEBUG: Expected array but got:", typeof data, data);
        setVolunteers([]);
        showMessage("System returned unexpected data format", "error");
      }
    } catch (err) {
      console.error("DEBUG: fetchVolunteers Error:", err);
      showMessage("Failed to load volunteers", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolunteersData();
  }, [fetchVolunteersData]);

  const confirmDelete = async () => {
    const id = confirmAction.id;
    console.log(`DEBUG: Attempting to delete volunteer with ID: ${id}`);
    setConfirmAction({ show: false, id: null, title: "", message: "" });
    try {
      const data = await deleteVolunteer(id);
      console.log("DEBUG: Delete success response:", data);
      showMessage("The account has been purged from the system.");
      // 🔥 Full refresh from server to bypass any stale data
      fetchVolunteersData();
    } catch (err) {
      console.error("DEBUG: Delete failed:", err);
      showMessage(err.message || "Delete failed", "error");
    }
  };

  // ✅ Delete Trigger
  const handleDeleteTrigger = (id) => {
    setConfirmAction({
      show: true,
      id,
      title: "Delete Account?",
      message: "This volunteer will be permanently removed. This action is irreversible."
    });
  };

  const handleAddVolunteer = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      console.log("DEBUG: Creating new volunteer:", newVolunteer);
      const message = await createVolunteer(newVolunteer);
      console.log("DEBUG: Create success message:", message);
      showMessage("User account has been successfully provisioned.");
      setShowAddModal(false);
      setNewVolunteer({ name: "", email: "", phone: "", city: "", role: "VOLUNTEER", password: "Password@123" });
      fetchVolunteersData();
    } catch (err) {
      console.error("DEBUG: Create failed:", err);
      showMessage(err.message || "Creation failed", "error");
    } finally {
      setIsCreating(false);
    }
  };

  // ✅ Update volunteer (PATCH)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("DEBUG: Updating volunteer:", editVolunteer.id, editVolunteer);
      const updated = await updateVolunteer(editVolunteer.id, editVolunteer);
      console.log("DEBUG: Update success:", updated);
      showMessage("User profile details have been synchronized.");
      setEditVolunteer(null);
      // 🔥 Full refresh from server to bypass any stale data
      fetchVolunteersData();
    } catch (err) {
      console.error("DEBUG: Update failed:", err);
      showMessage(err.message || "Update failed", "error");
    }
  };

  const showMessage = (text, type = "success") => {
    const id = Date.now();
    const title = type === "success" ? "Action Successful" : "System Alert";
    setNotifications(prev => [...prev, { id, text, type, title }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // 🔎 Filter & Search logic
  const filtered = useMemo(() => {
    if (!Array.isArray(volunteers)) return [];
    
    return volunteers.filter((v) => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        v.id?.toString().includes(searchLower) ||
        v.name?.toLowerCase().includes(searchLower) ||
        v.email?.toLowerCase().includes(searchLower);
      
      const matchesTab = 
        activeTab === "all" || 
        (activeTab === "volunteer" && v.role === "VOLUNTEER") ||
        (activeTab === "admin" && v.role === "ADMIN");

      return matchesSearch && matchesTab;
    });
  }, [volunteers, search, activeTab]);

  return (
    <div className="mv-container">
      {/* 🔔 Premium Notification Stack */}
      <div className="mv-notification-container">
        {notifications.map(n => (
          <div key={n.id} className={`mv-toast ${n.type}`}>
            <div className="mv-toast-icon">
              {n.type === "success" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              )}
            </div>
            <div className="mv-toast-content">
              <span className="mv-toast-title">{n.title}</span>
              <span className="mv-toast-msg">{n.text}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mv-header-section">
        <div className="mv-title-row">
          <h2>Manage Volunteers</h2>
          <button 
            className="mv-add-btn" 
            onClick={() => {
              setNewVolunteer({ name: "", email: "", phone: "", city: "", role: "VOLUNTEER", password: "Password@123" });
              setShowAddModal(true);
            }}
          >
            ➕ Add Volunteer
          </button>
        </div>
        
        <div className="mv-controls-row">
          <div className="mv-tabs">
            <button 
              className={`mv-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Team <span className="mv-tab-count">{Array.isArray(volunteers) ? volunteers.length : 0}</span>
            </button>
            <button 
              className={`mv-tab ${activeTab === 'volunteer' ? 'active' : ''}`}
              onClick={() => setActiveTab('volunteer')}
            >
              Volunteers <span className="mv-tab-count">{Array.isArray(volunteers) ? volunteers.filter(v => v.role === 'VOLUNTEER').length : 0}</span>
            </button>
            <button 
              className={`mv-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admins <span className="mv-tab-count">{Array.isArray(volunteers) ? volunteers.filter(v => v.role === 'ADMIN').length : 0}</span>
            </button>
          </div>
          
          <div className="mv-search-group">
            <span className="mv-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by ID, Name or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mv-search"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="mv-loading">Loading users...</p>
      ) : filtered.length === 0 ? (
        <p className="mv-empty">No {activeTab === 'admin' ? 'admins' : 'volunteers'} found.</p>
      ) : (
        <div className="mv-table-wrapper">
          <table className="mv-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id}>
                  <td data-label="ID">{v.id}</td>
                  <td data-label="Name">
                    <div className="mv-user-cell">
                      <span className="mv-user-avatar-small">{v.name?.charAt(0)}</span>
                      {v.name}
                    </div>
                  </td>
                  <td data-label="Email">{v.email}</td>
                  <td data-label="City">{v.city || "-"}</td>
                  <td data-label="Role">
                    <span className={`mv-role-badge ${v.role?.toLowerCase()}`}>
                      {v.role}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="mv-actions-group">
                      {v.role === "ADMIN" ? (
                        <span className="mv-admin-protected">🛡️ Admin Protected</span>
                      ) : (
                        <>
                          <button
                            className="mv-btn edit"
                            onClick={() => setEditVolunteer(v)}
                            title="Edit User"
                          >
                            ✏️ <span>Edit</span>
                          </button>
                          <button
                            className="mv-btn delete"
                            onClick={() => handleDeleteTrigger(v.id)}
                            title="Delete User"
                          >
                            🗑️ <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ➕ Add Modal */}
      {showAddModal && (
        <div className="mv-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="mv-modal create-mode" onClick={(e) => e.stopPropagation()}>
            <div className="mv-modal-header">
              <div className="mv-modal-title-group">
                <div className="mv-modal-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                </div>
                <h3>Create Volunteer</h3>
              </div>
              <button className="mv-close-circle" onClick={() => setShowAddModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddVolunteer} autoComplete="off">
              <div className="mv-form-stack">
                <div className="mv-input-group">
                  <label>Full Name</label>
                  <div className="mv-input-with-icon">
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={newVolunteer.name}
                      onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                      required
                      autoComplete="off"
                    />
                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                  </div>
                </div>

                <div className="mv-input-group">
                  <label>Email Address</label>
                  <div className="mv-input-with-icon">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={newVolunteer.email}
                      onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                      required
                      autoComplete="off"
                    />
                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                  </div>
                </div>

                <div className="mv-row-grid">
                  <div className="mv-input-group">
                    <label>Phone Number</label>
                    <div className="mv-input-with-icon">
                      <input
                        type="text"
                        placeholder="Enter phone"
                        value={newVolunteer.phone}
                        onChange={(e) => setNewVolunteer({ ...newVolunteer, phone: e.target.value })}
                        required
                        autoComplete="off"
                      />
                      <div className="field-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      </div>
                    </div>
                  </div>

                  <div className="mv-input-group">
                    <label>City</label>
                    <div className="mv-input-with-icon">
                      <input
                        type="text"
                        placeholder="Enter city"
                        value={newVolunteer.city}
                        onChange={(e) => setNewVolunteer({ ...newVolunteer, city: e.target.value })}
                        required
                        autoComplete="off"
                      />
                      <div className="field-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mv-input-group">
                  <label>Access Role</label>
                  <div className="mv-input-with-icon">
                    <select
                      className="mv-role-select"
                      value={newVolunteer.role}
                      onChange={(e) => setNewVolunteer({ ...newVolunteer, role: e.target.value })}
                    >
                      <option value="VOLUNTEER">Standard Volunteer</option>
                      <option value="ADMIN">System Administrator</option>
                    </select>
                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="mv-hint-premium">
                  <div className="mv-hint-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </div>
                  <p>Initial password will be <strong>Password@123</strong>. User can change it later.</p>
                </div>
              </div>

              <div className="mv-modal-actions">
                <button type="button" className="mv-btn cancel-large" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="mv-btn save-large" disabled={isCreating}>
                  {isCreating ? "⚡ Creating..." : "✨ Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ Edit Modal */}
      {editVolunteer && (
        <div className="mv-modal-overlay" onClick={() => setEditVolunteer(null)}>
          <div className="mv-modal edit-mode" onClick={(e) => e.stopPropagation()}>
            <div className="mv-modal-header">
              <div className="mv-modal-title-group">
                <div className="mv-modal-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                </div>
                <h3>Edit User</h3>
              </div>
              <button className="mv-close-circle" onClick={() => setEditVolunteer(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdate}>
              <div className="mv-form-stack">
                <div className="mv-input-group">
                  <label>Full Name</label>
                  <div className="mv-input-with-icon">
                    <input
                      type="text"
                      value={editVolunteer.name || ""}
                      onChange={(e) => setEditVolunteer({ ...editVolunteer, name: e.target.value })}
                      required
                      placeholder="Enter name"
                    />
                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                  </div>
                </div>

                <div className="mv-input-group">
                  <label>Email Address</label>
                  <div className="mv-input-with-icon">
                    <input
                      type="email"
                      value={editVolunteer.email || ""}
                      onChange={(e) => setEditVolunteer({ ...editVolunteer, email: e.target.value })}
                      required
                      placeholder="Enter email"
                    />
                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                  </div>
                </div>

                <div className="mv-row-grid">
                  <div className="mv-input-group">
                    <label>Phone</label>
                    <div className="mv-input-with-icon">
                      <input
                        type="text"
                        value={editVolunteer.phone || ""}
                        onChange={(e) => setEditVolunteer({ ...editVolunteer, phone: e.target.value })}
                        placeholder="Enter phone"
                      />
                      <div className="field-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      </div>
                    </div>
                  </div>

                  <div className="mv-input-group">
                    <label>City</label>
                    <div className="mv-input-with-icon">
                      <input
                        type="text"
                        value={editVolunteer.city || ""}
                        onChange={(e) => setEditVolunteer({ ...editVolunteer, city: e.target.value })}
                        placeholder="Enter city"
                      />
                      <div className="field-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mv-input-group">
                  <label>Access Role</label>
                  <div className="mv-input-with-icon">
                    <select
                      className="mv-role-select"
                      value={editVolunteer.role}
                      onChange={(e) => setEditVolunteer({ ...editVolunteer, role: e.target.value })}
                    >
                      <option value="VOLUNTEER">Standard Volunteer</option>
                      <option value="ADMIN">System Administrator</option>
                    </select>
                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mv-modal-actions">
                <button type="submit" className="mv-btn save-large">
                  💾 Save Changes
                </button>
                <button type="button" className="mv-btn cancel-large" onClick={() => setEditVolunteer(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🗑️ Custom Confirmation Modal */}
      {confirmAction.show && (
        <div className="mv-modal-overlay" onClick={() => setConfirmAction({ ...confirmAction, show: false })}>
          <div className="mv-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mv-confirm-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3>{confirmAction.title}</h3>
            <p>{confirmAction.message}</p>
            <div className="mv-confirm-actions">
              <button className="mv-confirm-btn cancel" onClick={() => setConfirmAction({ ...confirmAction, show: false })}>Keep Account</button>
              <button className="mv-confirm-btn confirm" onClick={confirmDelete}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVolunteers;
