import { useRequest } from "../../context/RequestContext";
import toast from "react-hot-toast";
import "../../styles/editor.css";

function RequestEditor() {

  const { body, setBody } = useRequest();

  const beautifyJson = () => {

    if (!body.trim()) return;

    try {

      const formatted = JSON.stringify(
        JSON.parse(body),
        null,
        2
      );

      setBody(formatted);

      toast.success("JSON Beautified");

    } catch {

      toast.error("Invalid JSON");

    }

  };

  const minifyJson = () => {

    if (!body.trim()) return;

    try {

      const formatted = JSON.stringify(
        JSON.parse(body)
      );

      setBody(formatted);

      toast.success("JSON Minified");

    } catch {

      toast.error("Invalid JSON");

    }

  };

  return (

    <div className="editor">

      <div className="editor-header">

        <h3>Request Body</h3>

        <div className="editor-actions">

          <button
            className="editor-btn"
            onClick={beautifyJson}
          >
            Beautify
          </button>

          <button
            className="editor-btn"
            onClick={minifyJson}
          >
            Minify
          </button>

        </div>

      </div>

      <textarea
        spellCheck={false}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={`{
  "name":"John",
  "email":"john@example.com"
}`}
      />

    </div>

  );

}

export default RequestEditor;