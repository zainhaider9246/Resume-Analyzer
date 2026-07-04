const getScoreColor = (score) => {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

const getVerdict = (score) => {
  if (score >= 80) return { label: 'Strong Match', color: '#22c55e', bg: '#dcfce7' };
  if (score >= 60) return { label: 'Good Match', color: '#f59e0b', bg: '#fef9c3' };
  if (score >= 40) return { label: 'Partial Match', color: '#f97316', bg: '#ffedd5' };
  return { label: 'Weak Match', color: '#ef4444', bg: '#fee2e2' };
};

const ScoreRing = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const verdict = getVerdict(score);

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="score-ring" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Background circle */}
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          {/* Score circle */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s ease', transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }}
          />
        </svg>
        <div className="score-text">
          <div className="fw-bold" style={{ fontSize: '2rem', lineHeight: 1, color }}>{score}</div>
          <div className="text-muted" style={{ fontSize: '0.7rem' }}>/ 100</div>
        </div>
      </div>
      <span className="badge mt-2 px-3 py-2 rounded-pill fw-semibold" style={{ background: verdict.bg, color: verdict.color, fontSize: '0.85rem' }}>
        {verdict.label}
      </span>
    </div>
  );
};

export default ScoreRing;
