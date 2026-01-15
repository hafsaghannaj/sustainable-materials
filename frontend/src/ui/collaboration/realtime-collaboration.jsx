import React, { useEffect, useRef, useState } from "react";


export const RealtimeCollaboration = ({ projectId, userId }) => {
  const editorRef = useRef(null);
  const [doc, setDoc] = useState();
  const [provider, setProvider] = useState();
  const [editorError, setEditorError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let ydoc;
    let yprovider;

    const init = async () => {
      try {
        const Y = await import("yjs");
        const { WebsocketProvider } = await import("y-websocket");

        ydoc = new Y.Doc();
        yprovider = new WebsocketProvider(
          "wss://collab.terraweave.com",
          projectId,
          ydoc
        );

        if (!isMounted) return;
        setDoc(ydoc);
        setProvider(yprovider);
      } catch (err) {
        if (!isMounted) return;
        setEditorError(err);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (yprovider) yprovider.destroy();
      if (ydoc) ydoc.destroy();
    };
  }, [projectId]);

  useEffect(() => {
    if (!editorRef.current || !doc || !provider) return;

    let editor;
    let binding;
    let isMounted = true;

    const initEditor = async () => {
      try {
        const monaco = await import("monaco-editor");
        const { MonacoBinding } = await import("y-monaco");

        if (!isMounted) return;
        const model = monaco.editor.createModel("", "json");
        editor = monaco.editor.create(editorRef.current, {
          model,
          theme: "vs-dark",
          minimap: { enabled: true },
          wordWrap: "on",
        });

        const ytext = doc.getText("specification");
        binding = new MonacoBinding(
          ytext,
          model,
          new Set([editor]),
          provider.awareness
        );

        provider.awareness.setLocalStateField("user", {
          name: userId,
          color: getRandomColor(),
          cursor: null,
        });
      } catch (err) {
        if (!isMounted) return;
        setEditorError(err);
      }
    };

    initEditor();

    return () => {
      isMounted = false;
      if (binding) binding.destroy();
      if (editor) editor.dispose();
    };
  }, [doc, provider, userId]);

  return (
    <div className="collaboration-environment">
      <div className="presence-panel">
        <UserList provider={provider} />
      </div>

      <div className="editor-container">
        {editorError ? (
          <div className="monaco-editor">Editor unavailable in this build.</div>
        ) : (
          <div ref={editorRef} className="monaco-editor" />
        )}
        <div className="cursor-chat-placeholder">Cursor chat</div>
      </div>

      <div className="comments-sidebar">
        <div className="comments-placeholder">Comments panel</div>
      </div>

      <div className="history-timeline">
        <VersionHistory doc={doc} onRevert={handleRevert} />
      </div>

      <div className="activity-feed">
        <ActivityStream projectId={projectId} filter="recent" />
      </div>
    </div>
  );
};

const ConflictResolver = ({ conflicts, onResolve }) => {
  return (
    <div className="conflict-resolver">
      <h4>Merge Conflicts ({conflicts.length})</h4>

      {conflicts.map((conflict, idx) => (
        <div key={idx} className="conflict-item">
          <div className="conflict-header">
            <span className="file-path">{conflict.path}</span>
            <span className="conflict-type">{conflict.type}</span>
          </div>

          <div className="conflict-diff">
            <div className="diff-side left">
              <h5>Your Changes</h5>
              <pre>{conflict.ours}</pre>
            </div>

            <div className="diff-side right">
              <h5>Their Changes</h5>
              <pre>{conflict.theirs}</pre>
            </div>
          </div>

          <div className="resolution-options">
            <button type="button" onClick={() => handleResolve(conflict, "ours")}>
              Keep Your Changes
            </button>
            <button type="button" onClick={() => handleResolve(conflict, "theirs")}>
              Keep Their Changes
            </button>
            <button type="button" onClick={() => handleResolve(conflict, "merge")}>
              Merge Manually
            </button>
          </div>
        </div>
      ))}

      <div className="resolver-actions">
        <button type="button" onClick={handleResolveAll}>
          Resolve All
        </button>
        <button type="button" onClick={handleSkip}>
          Skip for Now
        </button>
      </div>
    </div>
  );
};

const UserList = () => <div className="user-list">Users</div>;
const VersionHistory = () => <div className="version-history">History</div>;
const ActivityStream = () => <div className="activity-stream">Activity</div>;

const handleRevert = () => {};
const handleResolve = () => {};
const handleResolveAll = () => {};
const handleSkip = () => {};

const getRandomColor = () => "#00B894";
