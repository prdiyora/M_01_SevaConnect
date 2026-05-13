import React, { useEffect, useState } from "react";
import {
    getAllRequests,
    approveRequest,
    rejectRequest,
} from "../../services/volunteerRequestApi";
import "./ManageRequests.css";

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("PENDING"); // 'PENDING', 'APPROVED', 'REJECTED', 'ALL'
    const [search, setSearch] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [confirmAction, setConfirmAction] = useState({ show: false, id: null, type: null, title: "", message: "" });

    const fetchRequestsData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllRequests();
            setRequests(data);
        } catch (err) {
            setError(err.message);
            showMessage("Failed to load requests from server.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequestsData();
    }, []);

    const showMessage = (text, type = "success") => {
        const id = Date.now();
        const title = type === "success" ? "Action Successful" : "System Alert";
        setNotifications(prev => [...prev, { id, text, type, title }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4000);
    };

    const handleApproveTrigger = (requestId) => {
        setConfirmAction({
            show: true,
            id: requestId,
            type: "APPROVE",
            title: "Approve Request?",
            message: "The volunteer will be officially registered for this event and notified immediately."
        });
    };

    const handleRejectTrigger = (requestId) => {
        setConfirmAction({
            show: true,
            id: requestId,
            type: "REJECT",
            title: "Reject Request?",
            message: "This volunteer application will be declined. This action will be logged in the system."
        });
    };

    const executeConfirmedAction = async () => {
        const { id, type } = confirmAction;
        setConfirmAction({ ...confirmAction, show: false });

        try {
            if (type === "APPROVE") {
                await approveRequest(id);
                showMessage("Volunteer has been successfully approved for service.");
            } else {
                await rejectRequest(id);
                showMessage("The request has been declined and records updated.", "success");
            }
            fetchRequestsData();
        } catch (err) {
            showMessage(err.message || "Operation failed.", "error");
        }
    };

    const openModal = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // 🔎 Filter logic
    const filtered = requests.filter((req) => {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
            req.id?.toString().includes(searchLower) ||
            req.volunteerName?.toLowerCase().includes(searchLower) ||
            req.eventTitle?.toLowerCase().includes(searchLower);
        
        const matchesTab = 
            activeTab === "ALL" || req.status === activeTab;

        return matchesSearch && matchesTab;
    });

    const getTabCount = (status) => {
        if (status === "ALL") return requests.length;
        return requests.filter(r => r.status === status).length;
    };

    return (
        <div className="mr-container">
            {/* 🔔 Premium Notification Stack */}
            <div className="mr-notification-container">
                {notifications.map(n => (
                    <div key={n.id} className={`mr-toast ${n.type}`}>
                        <div className="mr-toast-icon">
                            {n.type === "success" ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            )}
                        </div>
                        <div className="mr-toast-content">
                            <span className="mr-toast-title">{n.title}</span>
                            <span className="mr-toast-msg">{n.text}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mr-header-section">
                <div className="mr-title-row">
                    <h2>Volunteer Requests</h2>
                    <button className="mr-refresh-btn" onClick={fetchRequestsData}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                        <span>Refresh Records</span>
                    </button>
                </div>
                
                <div className="mr-controls-row">
                    <div className="mr-tabs">
                        <button 
                            className={`mr-tab ${activeTab === 'PENDING' ? 'active' : ''}`}
                            onClick={() => setActiveTab('PENDING')}
                        >
                            Pending <span className="mr-tab-count">{getTabCount('PENDING')}</span>
                        </button>
                        <button 
                            className={`mr-tab ${activeTab === 'APPROVED' ? 'active' : ''}`}
                            onClick={() => setActiveTab('APPROVED')}
                        >
                            Approved <span className="mr-tab-count">{getTabCount('APPROVED')}</span>
                        </button>
                        <button 
                            className={`mr-tab ${activeTab === 'REJECTED' ? 'active' : ''}`}
                            onClick={() => setActiveTab('REJECTED')}
                        >
                            Rejected <span className="mr-tab-count">{getTabCount('REJECTED')}</span>
                        </button>
                        <button 
                            className={`mr-tab ${activeTab === 'ALL' ? 'active' : ''}`}
                            onClick={() => setActiveTab('ALL')}
                        >
                            All <span className="mr-tab-count">{getTabCount('ALL')}</span>
                        </button>
                    </div>
                    
                    <div className="mr-search-group">
                        <svg className="mr-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input
                            type="text"
                            placeholder="Search by Volunteer or Event..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mr-search"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="mr-loading-state">
                    <div className="mr-spinner"></div>
                    <p>Synchronizing requests...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="mr-empty">No requests found matching your criteria.</div>
            ) : (
                <div className="mr-table-wrapper">
                    <table className="mr-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Volunteer</th>
                                <th>Event</th>
                                <th>Status</th>
                                <th>Processed By</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((req) => (
                                <tr key={req.id}>
                                    <td data-label="ID">{req.id}</td>
                                    <td data-label="Volunteer">
                                        <div className="mr-user-cell">
                                            <div className="mr-avatar">{req.volunteerName?.charAt(0)}</div>
                                            <div className="mr-user-info">
                                                <strong>{req.volunteerName}</strong>
                                                <small>{req.volunteerEmail}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Event">
                                        <div className="mr-event-cell">
                                            <strong>{req.eventTitle}</strong>
                                            <small>{req.eventLocation}</small>
                                        </div>
                                    </td>
                                    <td data-label="Status">
                                        <span className={`mr-status-badge ${req.status?.toLowerCase()}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td data-label="Processed By">
                                        {req.processedByName ? (
                                            <div className="mr-admin-info">
                                                <span className="mr-admin-tag">🛡️ {req.processedByName}</span>
                                                <small>{formatDate(req.updatedAt)}</small>
                                            </div>
                                        ) : (
                                            <span className="mr-not-processed">Not processed</span>
                                        )}
                                    </td>
                                    <td data-label="Actions">
                                        <div className="mr-actions-group">
                                            <button className="mr-btn view" onClick={() => openModal(req)}>
                                                👁️ <span>View</span>
                                            </button>
                                            {req.status === "PENDING" && (
                                                <>
                                                    <button className="mr-btn approve" onClick={() => handleApproveTrigger(req.id)}>
                                                        ✅ <span>Approve</span>
                                                    </button>
                                                    <button className="mr-btn reject" onClick={() => handleRejectTrigger(req.id)}>
                                                        ❌ <span>Reject</span>
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

            {showModal && selectedRequest && (
                <div className="mr-modal-overlay" onClick={closeModal}>
                    <div className="mr-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="mr-modal-header">
                            <div className="mr-modal-title-group">
                                <div className="mr-modal-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                </div>
                                <h3>Request Details #{selectedRequest.id}</h3>
                            </div>
                            <button className="mr-close-circle" onClick={closeModal}>×</button>
                        </div>
                        <div className="mr-modal-body">
                            <div className="mr-detail-section">
                                <h4>👤 Volunteer Information</h4>
                                <div className="mr-detail-grid">
                                    <div className="mr-detail-item"><strong>Name:</strong> {selectedRequest.volunteerName}</div>
                                    <div className="mr-detail-item"><strong>Email:</strong> {selectedRequest.volunteerEmail}</div>
                                    <div className="mr-detail-item"><strong>Phone:</strong> {selectedRequest.volunteerPhone || 'N/A'}</div>
                                    <div className="mr-detail-item"><strong>City:</strong> {selectedRequest.volunteerCity || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="mr-detail-section">
                                <h4>📅 Event Information</h4>
                                <div className="mr-detail-grid">
                                    <div className="mr-detail-item"><strong>Title:</strong> {selectedRequest.eventTitle}</div>
                                    <div className="mr-detail-item"><strong>Location:</strong> {selectedRequest.eventLocation}</div>
                                    <div className="mr-detail-item"><strong>Date:</strong> {selectedRequest.eventDate}</div>
                                </div>
                            </div>

                            <div className="mr-detail-section">
                                <h4>🛡️ Processing Status</h4>
                                <div className="mr-detail-grid">
                                    <div className="mr-detail-item">
                                        <strong>Current Status:</strong> 
                                        <span className={`mr-status-badge ${selectedRequest.status?.toLowerCase()}`}>{selectedRequest.status}</span>
                                    </div>
                                    <div className="mr-detail-item"><strong>Requested On:</strong> {formatDate(selectedRequest.createdAt)}</div>
                                    
                                    {selectedRequest.status !== "PENDING" && (
                                        <>
                                            <div className="mr-detail-item">
                                                <strong>Decision By:</strong> 
                                                <span className="mr-admin-tag">{selectedRequest.processedByName || "System Administrator"}</span>
                                            </div>
                                            <div className="mr-detail-item"><strong>Decision At:</strong> {formatDate(selectedRequest.updatedAt)}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mr-modal-footer">
                            <button className="mr-btn cancel-large" onClick={closeModal}>Close Details</button>
                            {selectedRequest.status === "PENDING" && (
                                <div className="mr-footer-actions">
                                    <button className="mr-btn reject" onClick={() => handleRejectTrigger(selectedRequest.id)}>Reject</button>
                                    <button className="mr-btn approve" onClick={() => handleApproveTrigger(selectedRequest.id)}>Approve Request</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 🗑️ Custom Confirmation Modal */}
            {confirmAction.show && (
                <div className="mr-modal-overlay" onClick={() => setConfirmAction({ ...confirmAction, show: false })}>
                    <div className="mr-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className={`mr-confirm-icon ${confirmAction.type === 'REJECT' ? 'warning' : 'success'}`}>
                            {confirmAction.type === 'APPROVE' ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            )}
                        </div>
                        <h3>{confirmAction.title}</h3>
                        <p>{confirmAction.message}</p>
                        <div className="mr-confirm-actions">
                            <button className="mr-confirm-btn cancel" onClick={() => setConfirmAction({ ...confirmAction, show: false })}>Cancel</button>
                            <button className={`mr-confirm-btn ${confirmAction.type === 'REJECT' ? 'confirm-danger' : 'confirm-success'}`} onClick={executeConfirmedAction}>
                                {confirmAction.type === 'APPROVE' ? 'Yes, Approve' : 'Yes, Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRequests;
