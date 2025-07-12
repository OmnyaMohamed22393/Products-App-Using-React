import React from 'react';

export default function NavigationBlocker ({ blocker }) {
  if (blocker.state !== 'blocked') return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Unsaved Changes</h5>
          </div>
          <div className="modal-body">
            <p>You have unsaved changes. Are you sure you want to leave this page?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => blocker.reset()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => blocker.proceed()}
            >
              Leave Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

