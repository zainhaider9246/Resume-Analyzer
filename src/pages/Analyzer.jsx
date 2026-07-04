import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { extractTextFromPDF } from '../utils/pdfParser';
import { analyzeResume } from '../utils/gemini';
import AnalysisResults from '../components/AnalysisResults';

const Analyzer = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_key') || '');
  const [apiKeySaved, setApiKeySaved] = useState(() => Boolean(localStorage.getItem('gemini_key')));
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleSaveKey = () => {
    if (!apiKey.trim()) return toast.error('Please enter your API key');
    localStorage.setItem('gemini_key', apiKey.trim());
    setApiKeySaved(true);
    toast.success('API key saved!');
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') return toast.error('Please upload a PDF file');
    if (file.size > 5 * 1024 * 1024) return toast.error('File too large. Max 5MB');

    setResumeFile(file);
    try {
      setLoadingStep('Reading PDF...');
      const text = await extractTextFromPDF(file);
      setResumeText(text);
      toast.success(`Resume loaded: ${file.name}`);
    } catch {
      toast.error('Failed to read PDF. Try a text-based PDF.');
    } finally {
      setLoadingStep('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!apiKey) return toast.error('Please enter your Gemini API key first');
    if (!resumeText) return toast.error('Please upload your resume PDF');
    if (!jobDescription.trim()) return toast.error('Please paste the job description');
    if (jobDescription.trim().length < 50) return toast.error('Job description is too short');

    setLoading(true);
    setAnalysis(null);

    try {
      setLoadingStep('Sending to Gemini AI...');
      await new Promise(r => setTimeout(r, 500));
      setLoadingStep('Analyzing keywords...');
      await new Promise(r => setTimeout(r, 800));
      setLoadingStep('Calculating ATS score...');
      const result = await analyzeResume(resumeText, jobDescription, apiKey);
      setLoadingStep('Generating recommendations...');
      await new Promise(r => setTimeout(r, 400));
      setAnalysis(result);
      toast.success('Analysis complete!');
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch (err) {
      if (err.message.includes('API_KEY_INVALID') || err.message.includes('API key')) {
        toast.error('Invalid API key. Please check your Gemini API key.');
      } else {
        toast.error('Analysis failed: ' + err.message);
      }
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 1100 }}>

      {/* Hero */}
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3" style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
          <i className="bi bi-cpu text-white fs-3"></i>
        </div>
        <h1 className="fw-bold display-6 mb-2">AI Resume Analyzer</h1>
        <p className="text-muted fs-5 mb-0">Upload your resume, paste the job description, and get instant AI-powered ATS analysis</p>
      </div>

      {/* API Key Section */}
      <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 16 }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-key-fill" style={{ color: '#4f46e5' }}></i>
          <h6 className="fw-bold mb-0">Gemini API Key</h6>
          {apiKeySaved && <span className="badge rounded-pill bg-success-subtle text-success ms-2"><i className="bi bi-check me-1"></i>Saved</span>}
        </div>
        <div className="d-flex gap-2">
          <input
            type="password"
            className="form-control"
            placeholder="Enter your Google Gemini API key..."
            value={apiKey}
            onChange={e => { setApiKey(e.target.value); setApiKeySaved(false); }}
            style={{ borderRadius: 10 }}
          />
          <button className="btn btn-primary rounded-pill px-4 fw-semibold flex-shrink-0" onClick={handleSaveKey} style={{ background: '#4f46e5', borderColor: '#4f46e5' }}>
            Save Key
          </button>
        </div>
        <small className="text-muted mt-2 d-block">
          <i className="bi bi-info-circle me-1"></i>
          Get your free API key at{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5' }}>
            aistudio.google.com
          </a>
          {' '}— Your key is stored locally in your browser only.
        </small>
      </div>

      <div className="row g-4 mb-4">
        {/* Upload Resume */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: 16 }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-file-earmark-pdf-fill text-danger"></i>
              <h6 className="fw-bold mb-0">Upload Resume</h6>
              {resumeFile && <span className="badge rounded-pill bg-success-subtle text-success ms-auto"><i className="bi bi-check me-1"></i>Loaded</span>}
            </div>

            <div
              className={`upload-zone p-4 text-center ${dragOver ? 'dragover' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" hidden onChange={e => handleFile(e.target.files[0])} />

              {resumeFile ? (
                <>
                  <i className="bi bi-file-earmark-check-fill text-success" style={{ fontSize: '2.5rem' }}></i>
                  <p className="fw-semibold mt-2 mb-1">{resumeFile.name}</p>
                  <small className="text-muted">{(resumeFile.size / 1024).toFixed(0)} KB • Click to change</small>
                  {resumeText && <small className="text-success d-block mt-1"><i className="bi bi-check-circle me-1"></i>{resumeText.split(' ').length} words extracted</small>}
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-upload" style={{ fontSize: '2.5rem', color: '#6366f1' }}></i>
                  <p className="fw-semibold mt-3 mb-1">Drop your PDF here</p>
                  <p className="text-muted small mb-0">or click to browse · Max 5MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: 16 }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-briefcase-fill" style={{ color: '#4f46e5' }}></i>
              <h6 className="fw-bold mb-0">Job Description</h6>
              {jobDescription.trim().length > 50 && <span className="badge rounded-pill bg-success-subtle text-success ms-auto"><i className="bi bi-check me-1"></i>Ready</span>}
            </div>
            <textarea
              className="form-control flex-grow-1"
              rows={9}
              placeholder="Paste the full job description here...&#10;&#10;Include:&#10;• Required skills&#10;• Responsibilities&#10;• Qualifications&#10;&#10;The more detailed, the better the analysis!"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              style={{ borderRadius: 10, resize: 'none', fontSize: '0.9rem' }}
            />
            <small className="text-muted mt-2">{jobDescription.split(' ').filter(Boolean).length} words</small>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="text-center mb-5">
        <button
          className="btn btn-lg rounded-pill px-5 py-3 fw-bold shadow"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', border: 'none', fontSize: '1.1rem' }}
          onClick={handleAnalyze}
          disabled={loading || !resumeText || !jobDescription.trim()}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              {loadingStep || 'Analyzing...'}
            </>
          ) : (
            <>
              <i className="bi bi-cpu me-2"></i>
              Analyze with AI
            </>
          )}
        </button>
        {(!resumeText || !jobDescription.trim()) && (
          <p className="text-muted small mt-2">
            {!resumeText ? '⬆ Upload your resume PDF first' : '⬆ Paste the job description first'}
          </p>
        )}
      </div>

      {/* Results */}
      {analysis && (
        <div id="results">
          <AnalysisResults analysis={analysis} fileName={resumeFile?.name?.replace('.pdf', '') || 'Resume'} />
        </div>
      )}
    </div>
  );
};

export default Analyzer;
