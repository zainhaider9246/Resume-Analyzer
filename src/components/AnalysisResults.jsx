import ScoreRing from './ScoreRing';
import { downloadReport } from '../utils/reportGenerator';

const MiniBar = ({ label, value, color }) => (
  <div className="mb-2">
    <div className="d-flex justify-content-between mb-1">
      <small className="fw-semibold text-muted">{label}</small>
      <small className="fw-bold">{value}/100</small>
    </div>
    <div className="progress" style={{ height: 6, borderRadius: 4 }}>
      <div className="progress-bar" style={{ width: `${value}%`, background: color, borderRadius: 4, transition: 'width 1s ease' }}></div>
    </div>
  </div>
);

const AnalysisResults = ({ analysis, fileName }) => {
  const { scoreBreakdown, foundKeywords, missingKeywords, partialKeywords, strengths, improvements, tips, summary } = analysis;

  const priorityColor = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <h4 className="fw-bold mb-0"><i className="bi bi-bar-chart-fill me-2 text-indigo-600"></i>Analysis Results</h4>
        <button
          className="btn btn-primary rounded-pill px-4 fw-semibold"
          style={{ background: '#4f46e5', borderColor: '#4f46e5' }}
          onClick={() => downloadReport(analysis, fileName)}
        >
          <i className="bi bi-download me-2"></i>Download Report
        </button>
      </div>

      <div className="row g-4">
        {/* Score + Breakdown */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 p-4 text-center" style={{ borderRadius: 16 }}>
            <h6 className="fw-bold text-muted mb-4 text-uppercase" style={{ letterSpacing: 1, fontSize: '0.75rem' }}>ATS Score</h6>
            <div className="d-flex justify-content-center mb-4">
              <ScoreRing score={analysis.atsScore} />
            </div>
            <p className="text-muted small mb-4">{summary}</p>
            <div className="text-start">
              <h6 className="fw-bold mb-3 small text-uppercase text-muted" style={{ letterSpacing: 1 }}>Score Breakdown</h6>
              <MiniBar label="Keyword Match" value={scoreBreakdown.keywordMatch} color="#6366f1" />
              <MiniBar label="Relevance" value={scoreBreakdown.relevance} color="#8b5cf6" />
              <MiniBar label="Formatting" value={scoreBreakdown.formatting} color="#06b6d4" />
              <MiniBar label="Experience" value={scoreBreakdown.experience} color="#10b981" />
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 16 }}>
            <h6 className="fw-bold mb-3"><i className="bi bi-tags me-2 text-indigo-500"></i>Keyword Analysis</h6>

            {foundKeywords?.length > 0 && (
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-check-circle-fill text-success small"></i>
                  <span className="fw-semibold small text-success">Found ({foundKeywords.length})</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {foundKeywords.map((k, i) => (
                    <span key={i} className="keyword-found badge rounded-pill px-3 py-1" style={{ fontSize: '0.78rem' }}>{k}</span>
                  ))}
                </div>
              </div>
            )}

            {partialKeywords?.length > 0 && (
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-dash-circle-fill text-warning small"></i>
                  <span className="fw-semibold small text-warning">Partial Match ({partialKeywords.length})</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {partialKeywords.map((k, i) => (
                    <span key={i} className="keyword-partial badge rounded-pill px-3 py-1" style={{ fontSize: '0.78rem' }}>{k}</span>
                  ))}
                </div>
              </div>
            )}

            {missingKeywords?.length > 0 && (
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-x-circle-fill text-danger small"></i>
                  <span className="fw-semibold small text-danger">Missing ({missingKeywords.length})</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {missingKeywords.map((k, i) => (
                    <span key={i} className="keyword-missing badge rounded-pill px-3 py-1" style={{ fontSize: '0.78rem' }}>{k}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Strengths */}
          {strengths?.length > 0 && (
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 16 }}>
              <h6 className="fw-bold mb-3"><i className="bi bi-trophy me-2 text-warning"></i>Strengths</h6>
              <div className="d-flex flex-column gap-2">
                {strengths.map((s, i) => (
                  <div key={i} className="d-flex align-items-start gap-2">
                    <i className="bi bi-check2-circle text-success mt-1 flex-shrink-0"></i>
                    <span className="small">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Improvements */}
        {improvements?.length > 0 && (
          <div className="col-12">
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 16 }}>
              <h6 className="fw-bold mb-3"><i className="bi bi-tools me-2 text-danger"></i>Improvements Needed</h6>
              <div className="row g-3">
                {improvements.map((imp, i) => (
                  <div key={i} className="col-md-6">
                    <div className="tip-card p-3" style={{ borderLeftColor: priorityColor[imp.priority] }}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge rounded-pill px-2 py-1" style={{ background: priorityColor[imp.priority] + '20', color: priorityColor[imp.priority], fontSize: '0.7rem' }}>
                          {imp.priority.toUpperCase()}
                        </span>
                        <span className="fw-semibold small">{imp.section}</span>
                      </div>
                      <p className="text-muted small mb-1">{imp.issue}</p>
                      <p className="small mb-0 fw-semibold" style={{ color: '#4f46e5' }}>
                        <i className="bi bi-arrow-right me-1"></i>{imp.fix}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        {tips?.length > 0 && (
          <div className="col-12">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 16 }}>
              <h6 className="fw-bold mb-3"><i className="bi bi-lightbulb me-2 text-warning"></i>Pro Tips</h6>
              <div className="row g-3">
                {tips.map((t, i) => (
                  <div key={i} className="col-md-6 col-lg-4">
                    <div className="d-flex gap-3 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 36, height: 36, background: '#eef2ff' }}>
                        <i className="bi bi-lightbulb-fill" style={{ color: '#6366f1', fontSize: '0.9rem' }}></i>
                      </div>
                      <div>
                        <div className="fw-semibold small mb-1" style={{ color: '#4f46e5' }}>{t.category}</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{t.tip}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
