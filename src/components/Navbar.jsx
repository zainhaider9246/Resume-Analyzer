const Navbar = () => (
  <nav className="ra-navbar navbar px-4 py-3 shadow-sm">
    <div className="container-fluid">
      <span className="navbar-brand text-white fw-bold fs-4 mb-0">
        <i className="bi bi-file-earmark-text me-2"></i>ResumeAI
      </span>
      <span className="text-white opacity-75 small d-none d-md-block">
        Smart Resume Analyzer powered by Google Gemini
      </span>
    </div>
  </nav>
);

export default Navbar;
