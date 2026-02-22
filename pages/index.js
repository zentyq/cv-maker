import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [mode, setMode] = useState('paste'); // 'ai', 'manual', or 'paste'
  const [jobListing, setJobListing] = useState('');
  const [pastedCV, setPastedCV] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('simple');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [fontSize, setFontSize] = useState('14');
  const [cvData, setCvData] = useState(null);
  const [renderedHtml, setRenderedHtml] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const previewRef = useRef(null);

  // User Profile - Saved Personal Details
  const [userProfile, setUserProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cvUserProfile');
      return saved ? JSON.parse(saved) : {
        name: '',
        email: '',
        phone: '',
        location: '',
        title: '',
        linkedin: '',
        portfolio: '',
        education: [{ degree: '', school: '', year: '' }],
        skills: []
      };
    }
    return {
      name: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      linkedin: '',
      portfolio: '',
      education: [{ degree: '', school: '', year: '' }],
      skills: []
    };
  });

  // Manual input fields
  const [manualData, setManualData] = useState({
    name: '',
    title: '',
    summary: '',
    experience: [{ role: '', company: '', dates: '', bullets: [''] }],
    education: [{ degree: '', school: '', year: '' }],
    skills: ['']
  });

  const templates = [
    { value: 'simple', label: 'Simple ATS' },
    { value: 'modern', label: 'Modern' },
    { value: 'two-column', label: 'Two-Column' },
    { value: 'creative', label: 'Creative' },
    { value: 'classic', label: 'Classic Professional' },
    { value: 'professional', label: 'Professional Blue' },
    { value: 'creative-gradient', label: 'Creative Gradient' },
    { value: 'executive', label: 'Executive Gold' },
    { value: 'tech', label: 'Tech/Developer' },
  ];

  const fonts = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Garamond', label: 'Garamond' },
    { value: 'Calibri', label: 'Calibri' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Palatino', label: 'Palatino' },
    { value: 'Book Antiqua', label: 'Book Antiqua' },
  ];

  const fontSizes = [
    { value: '10', label: '10px - Small' },
    { value: '11', label: '11px' },
    { value: '12', label: '12px - Standard' },
    { value: '13', label: '13px' },
    { value: '14', label: '14px - Default' },
    { value: '15', label: '15px' },
    { value: '16', label: '16px - Large' },
    { value: '17', label: '17px' },
    { value: '18', label: '18px - Extra Large' },
  ];

  const handleGenerate = async () => {
    if (mode === 'paste') {
      handlePasteGenerate();
      return;
    }
    
    if (mode === 'manual') {
      handleManualGenerate();
      return;
    }

    if (!jobListing.trim()) {
      setError('Please enter a job listing or job title');
      return;
    }

    setIsGenerating(true);
    setError('');
    setCvData(null);
    setRenderedHtml('');

    try {
      // Call the generate API with user profile data
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          jobListing,
          userProfile: userProfile.name ? userProfile : null // Include profile if user has filled it
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate CV');
      }

      const data = await response.json();
      setCvData(data);
      
      // Render the template
      await renderCV(data, selectedTemplate);

    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate CV. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePasteGenerate = async () => {
    setError('');
    setIsGenerating(true);

    try {
      if (!pastedCV.trim()) {
        throw new Error('Please paste your CV content');
      }

      // Parse the pasted CV using AI
      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cvText: pastedCV }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse CV');
      }

      const data = await response.json();
      setCvData(data);
      await renderCV(data, selectedTemplate);
      setShowPreview(true);
    } catch (err) {
      console.error('Parse error:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualGenerate = async () => {
    setError('');
    setIsGenerating(true);

    try {
      // Validate manual data
      if (!manualData.name.trim()) {
        throw new Error('Please enter your name');
      }
      if (!manualData.title.trim()) {
        throw new Error('Please enter your professional title');
      }

      // Clean up the data - remove empty entries
      const cleanedData = {
        name: manualData.name,
        title: manualData.title,
        summary: manualData.summary || '',
        experience: manualData.experience.filter(exp => exp.role.trim() || exp.company.trim()).map(exp => ({
          ...exp,
          bullets: exp.bullets.filter(b => b.trim())
        })),
        education: manualData.education.filter(edu => edu.degree.trim() || edu.school.trim()),
        skills: manualData.skills.filter(s => s.trim())
      };

      setCvData(cleanedData);
      await renderCV(cleanedData, selectedTemplate);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateManualField = (field, value) => {
    setManualData(prev => ({ ...prev, [field]: value }));
  };

  const updateExperience = (index, field, value) => {
    setManualData(prev => {
      const newExp = [...prev.experience];
      newExp[index] = { ...newExp[index], [field]: value };
      return { ...prev, experience: newExp };
    });
  };

  const updateBullet = (expIndex, bulletIndex, value) => {
    setManualData(prev => {
      const newExp = [...prev.experience];
      newExp[expIndex].bullets[bulletIndex] = value;
      return { ...prev, experience: newExp };
    });
  };

  const addExperience = () => {
    setManualData(prev => ({
      ...prev,
      experience: [...prev.experience, { role: '', company: '', dates: '', bullets: [''] }]
    }));
  };

  const removeExperience = (index) => {
    setManualData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addBullet = (expIndex) => {
    setManualData(prev => {
      const newExp = [...prev.experience];
      newExp[expIndex].bullets.push('');
      return { ...prev, experience: newExp };
    });
  };

  const removeBullet = (expIndex, bulletIndex) => {
    setManualData(prev => {
      const newExp = [...prev.experience];
      newExp[expIndex].bullets = newExp[expIndex].bullets.filter((_, i) => i !== bulletIndex);
      return { ...prev, experience: newExp };
    });
  };

  const updateEducation = (index, field, value) => {
    setManualData(prev => {
      const newEdu = [...prev.education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return { ...prev, education: newEdu };
    });
  };

  const addEducation = () => {
    setManualData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', year: '' }]
    }));
  };

  const removeEducation = (index) => {
    setManualData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index, value) => {
    setManualData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = value;
      return { ...prev, skills: newSkills };
    });
  };

  const addSkill = () => {
    setManualData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index) => {
    setManualData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // User Profile Management Functions
  const saveUserProfile = () => {
    try {
      // Trim and validate
      const trimmedName = userProfile.name?.trim() || '';
      const trimmedTitle = userProfile.title?.trim() || '';
      
      if (!trimmedName || !trimmedTitle) {
        alert('Please enter your name and professional title to save your profile.');
        return;
      }
      
      // Save trimmed version
      const profileToSave = {
        ...userProfile,
        name: trimmedName,
        title: trimmedTitle,
        email: userProfile.email?.trim() || '',
        phone: userProfile.phone?.trim() || '',
        location: userProfile.location?.trim() || '',
        linkedin: userProfile.linkedin?.trim() || '',
        portfolio: userProfile.portfolio?.trim() || ''
      };
      
      localStorage.setItem('cvUserProfile', JSON.stringify(profileToSave));
      setUserProfile(profileToSave);
      setShowProfileModal(false);
      setError('');
      // Show success message
      alert('Profile saved successfully! Your details will be used in AI-generated CVs.');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const updateProfileField = (field, value) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateProfileEducation = (index, field, value) => {
    setUserProfile(prev => {
      const newEdu = [...prev.education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return { ...prev, education: newEdu };
    });
  };

  const addProfileEducation = () => {
    setUserProfile(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', year: '' }]
    }));
  };

  const removeProfileEducation = (index) => {
    setUserProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateProfileSkill = (index, value) => {
    setUserProfile(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = value;
      return { ...prev, skills: newSkills };
    });
  };

  const addProfileSkill = () => {
    setUserProfile(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeProfileSkill = (index) => {
    setUserProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const clearProfile = () => {
    if (confirm('Are you sure you want to clear your saved profile?')) {
      const emptyProfile = {
        name: '',
        email: '',
        phone: '',
        location: '',
        title: '',
        linkedin: '',
        portfolio: '',
        education: [{ degree: '', school: '', year: '' }],
        skills: []
      };
      setUserProfile(emptyProfile);
      localStorage.removeItem('cvUserProfile');
      alert('Profile cleared successfully!');
    }
  };

  const renderCV = async (data, template) => {
    try {
      // Render template using the API endpoint
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          templateName: template, 
          data,
          fontFamily: selectedFont,
          fontSize: fontSize + 'px'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to render template');
      }

      const { html } = await response.json();
      setRenderedHtml(html);
      
      // Update iframe
      if (previewRef.current) {
        const iframe = previewRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
      }
    } catch (err) {
      console.error('Rendering error:', err);
      setError('Failed to render CV template');
    }
  };

  const handleTemplateChange = async (newTemplate) => {
    setSelectedTemplate(newTemplate);
    if (cvData) {
      await renderCV(cvData, newTemplate);
    }
  };

  const handleFontChange = async (newFont) => {
    setSelectedFont(newFont);
    if (cvData) {
      await renderCV(cvData, selectedTemplate);
    }
  };

  const handleFontSizeChange = async (newSize) => {
    setFontSize(newSize);
    if (cvData) {
      await renderCV(cvData, selectedTemplate);
    }
  };

  const handleExport = async () => {
    if (!renderedHtml) {
      setError('Please generate a CV first');
      return;
    }

    setIsExporting(true);
    setError('');

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: renderedHtml }),
      });

      if (!response.ok) {
        throw new Error('Failed to export PDF');
      }

      // Create a blob from the PDF
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV-${cvData?.name?.replace(/\s/g, '-') || 'download'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Head>
        <title>CV Maker Pro - AI-Powered Resume Builder</title>
        <meta name="description" content="Create professional resumes with AI-powered generation, smart templates, and real-time preview" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.5) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10">
          {/* Header/Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex justify-end gap-3 mb-4">
                <a
                  href="/editor"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Document Editor
                  </span>
                </a>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white border-opacity-30"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {userProfile.name ? 'Edit Profile' : 'Save Your Profile'}
                    {userProfile.name && <span className="bg-green-500 w-2 h-2 rounded-full"></span>}
                  </span>
                </button>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight">
                  CV Maker <span className="text-blue-300">Pro</span>
                </h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Create stunning, ATS-friendly resumes in minutes with AI-powered generation, 
                  professional templates, and real-time customization
                </p>
                <div className="mt-6 flex justify-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-blue-100">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>9 Templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Instant PDF Export</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl p-2 inline-flex gap-2 border border-gray-700">
              <button
                onClick={() => setMode('paste')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  mode === 'paste'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  📋 <span>Paste CV</span>
                </span>
              </button>
              <button
                onClick={() => setMode('manual')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  mode === 'manual'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  📝 <span>Manual Input</span>
                </span>
              </button>
              <button
                onClick={() => setMode('ai')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  mode === 'ai'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  🤖 <span>AI Generate</span>
                </span>
              </button>
            </div>
          </div>

          {/* Main Content - Conditional Layout */}
          {showPreview ? (
            <div className="space-y-6">
              <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-gray-700">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-600"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Edit
                    </span>
                  </button>
                  
                  <div className="flex gap-3 items-center flex-wrap">
                    <div className="flex flex-col">
                      <label className="text-xs text-blue-300 mb-1 font-medium">Template Style</label>
                      <select
                        value={selectedTemplate}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        className="bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md hover:bg-gray-600 transition-colors"
                      >
                        {templates.map((template) => (
                          <option key={template.value} value={template.value}>
                            {template.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-blue-300 mb-1 font-medium">Font Family</label>
                      <select
                        value={selectedFont}
                        onChange={(e) => handleFontChange(e.target.value)}
                        className="bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md hover:bg-gray-600 transition-colors"
                      >
                        {fonts.map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-blue-300 mb-1 font-medium">Font Size</label>
                      <select
                        value={fontSize}
                        onChange={(e) => handleFontSizeChange(e.target.value)}
                        className="bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md hover:bg-gray-600 transition-colors"
                      >
                        {fontSizes.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="mt-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <span className="flex items-center gap-2">
                        {isExporting ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Exporting...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700">
                <div className="bg-white rounded-xl shadow-inner overflow-hidden">
                  <iframe
                    ref={previewRef}
                    className="w-full border-0"
                    style={{ minHeight: '1000px' }}
                    title="CV Preview"
                  />
                </div>
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Input */}
            <div className="space-y-6">
              {mode === 'paste' ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    📋 Paste Your CV
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Copy and paste your complete CV text below. The AI will extract and format it automatically.
                  </p>
                  <textarea
                    value={pastedCV}
                    onChange={(e) => setPastedCV(e.target.value)}
                    placeholder="Paste your complete CV here...&#10;&#10;Example:&#10;JOHN SMITH&#10;Software Engineer&#10;&#10;EXPERIENCE&#10;Company Name - Job Title&#10;2020 - Present&#10;• Achievement 1&#10;• Achievement 2&#10;&#10;EDUCATION&#10;University Name&#10;Degree - Year&#10;&#10;SKILLS&#10;Python, JavaScript, React..."
                    className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  />
                </div>
              ) : mode === 'ai' ? (
                <>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                      1. Job Listing
                    </h2>
                    <textarea
                      value={jobListing}
                      onChange={(e) => setJobListing(e.target.value)}
                      placeholder="Paste the full job listing here, or just enter a job title like 'Senior Software Engineer'..."
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 max-h-[600px] overflow-y-auto">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    1. Enter Your Details
                  </h2>
                  
                  {/* Name and Title */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={manualData.name}
                        onChange={(e) => updateManualField('name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title *</label>
                      <input
                        type="text"
                        value={manualData.title}
                        onChange={(e) => updateManualField('title', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                      <textarea
                        value={manualData.summary}
                        onChange={(e) => updateManualField('summary', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="3"
                        placeholder="Brief summary of your experience and skills..."
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <button
                        onClick={addExperience}
                        className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        + Add Experience
                      </button>
                    </div>
                    {manualData.experience.map((exp, expIndex) => (
                      <div key={expIndex} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Experience {expIndex + 1}</span>
                          {manualData.experience.length > 1 && (
                            <button
                              onClick={() => removeExperience(expIndex)}
                              className="text-red-500 text-sm hover:text-red-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperience(expIndex, 'role', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="Job Title"
                          />
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="Company Name"
                          />
                          <input
                            type="text"
                            value={exp.dates}
                            onChange={(e) => updateExperience(expIndex, 'dates', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="Jan 2020 - Present"
                          />
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-xs text-gray-600">Achievements/Responsibilities</label>
                              <button
                                onClick={() => addBullet(expIndex)}
                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                              >
                                + Bullet
                              </button>
                            </div>
                            {exp.bullets.map((bullet, bulletIndex) => (
                              <div key={bulletIndex} className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => updateBullet(expIndex, bulletIndex, e.target.value)}
                                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                                  placeholder="Achieved X by doing Y..."
                                />
                                {exp.bullets.length > 1 && (
                                  <button
                                    onClick={() => removeBullet(expIndex, bulletIndex)}
                                    className="text-red-500 text-sm hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Education */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">Education</label>
                      <button
                        onClick={addEducation}
                        className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        + Add Education
                      </button>
                    </div>
                    {manualData.education.map((edu, eduIndex) => (
                      <div key={eduIndex} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Education {eduIndex + 1}</span>
                          {manualData.education.length > 1 && (
                            <button
                              onClick={() => removeEducation(eduIndex)}
                              className="text-red-500 text-sm hover:text-red-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(eduIndex, 'degree', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="Bachelor of Science in Computer Science"
                          />
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducation(eduIndex, 'school', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="University Name"
                          />
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => updateEducation(eduIndex, 'year', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="2020"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">Skills</label>
                      <button
                        onClick={addSkill}
                        className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        + Add Skill
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {manualData.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="flex items-center gap-1">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateSkill(skillIndex, e.target.value)}
                            className="p-2 border border-gray-300 rounded text-sm w-32"
                            placeholder="Skill"
                          />
                          {manualData.skills.length > 1 && (
                            <button
                              onClick={() => removeSkill(skillIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {mode === 'ai' ? '2' : '2'}. Customize Appearance
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template Style</label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {templates.map((template) => (
                        <option key={template.value} value={template.value}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                      <select
                        value={selectedFont}
                        onChange={(e) => handleFontChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {fonts.map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                      <select
                        value={fontSize}
                        onChange={(e) => handleFontSizeChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {fontSizes.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Generate & Export</h2>
                    <p className="text-blue-300 text-sm">Create and download your CV</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || (mode === 'ai' && !jobListing.trim()) || (mode === 'paste' && !pastedCV.trim())}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-lg">{mode === 'paste' ? 'Parsing CV...' : 'Generating CV...'}</span>
                      </>
                    ) : mode === 'paste' ? (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-lg">Parse & Generate CV</span>
                      </>
                    ) : mode === 'ai' ? (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-lg">Generate CV with AI</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-lg">Generate CV from Input</span>
                      </>
                    )}
                  </button>

                  {cvData && (
                    <button
                      onClick={() => setShowLivePreview(!showLivePreview)}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {showLivePreview ? 'Hide' : 'Show'} Preview
                    </button>
                  )}

                  <button
                    onClick={handleExport}
                    disabled={isExporting || !renderedHtml}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {isExporting ? (
                      <>
                        <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-lg">Exporting PDF...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-lg">Download PDF</span>
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded-xl backdrop-blur-sm">
                    <p className="text-red-200 text-sm flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className={`bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700 sticky top-6 ${!showLivePreview ? 'hidden' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Live Preview</h2>
                    <p className="text-blue-300 text-sm">Real-time CV preview</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowLivePreview(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md text-sm"
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hide Preview
                  </button>
                {cvData && (
                  <button
                    onClick={() => setShowPreview(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Full Screen
                  </button>
                )}
              </div>
              </div>
              
              {!cvData ? (
                <div className="cv-preview flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-xl p-12 border-2 border-dashed border-gray-700">
                  <div className="text-center">
                    <svg className="mx-auto h-32 w-32 mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xl text-gray-400 font-semibold mb-2">Your CV Will Appear Here</p>
                    <p className="text-sm text-gray-500">
                      {mode === 'paste' ? '📋 Paste your CV and click Generate' : 
                       mode === 'ai' ? '🤖 Enter a job listing and click Generate' :
                       '📝 Fill in your details and click Generate'}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 justify-center">
                      <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                        <span className="text-blue-400 text-sm">✓ ATS-Friendly</span>
                      </div>
                      <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                        <span className="text-green-400 text-sm">✓ Professional</span>
                      </div>
                      <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                        <span className="text-purple-400 text-sm">✓ Customizable</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-inner overflow-hidden">
                  <iframe
                    ref={previewRef}
                    className="cv-preview w-full border-0"
                    title="CV Preview"
                  />
                </div>
              )}
            </div>
          </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center pb-8">
            <div className="inline-block bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg px-6 py-4 border border-gray-700">
              <p className="text-blue-200 text-sm">
                Personal use only • Powered by Grok • Made with ❤️
              </p>
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-700 my-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Your Profile</h2>
                      <p className="text-blue-200 text-sm">Save your details for AI-generated CVs</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-300 mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={userProfile.name}
                          onChange={(e) => updateProfileField('name', e.target.value)}
                          placeholder="John Smith"
                          className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-gray-100 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-300 mb-2">Professional Title *</label>
                        <input
                          type="text"
                          value={userProfile.title}
                          onChange={(e) => updateProfileField('title', e.target.value)}
                          placeholder="Software Engineer"
                          className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-gray-100 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-300 mb-2">Email</label>
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => updateProfileField('email', e.target.value)}
                          placeholder="john@email.com"
                          className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-gray-100 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-300 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) => updateProfileField('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-gray-100 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-300 mb-2">Location</label>
                        <input
                          type="text"
                          value={userProfile.location}
                          onChange={(e) => updateProfileField('location', e.target.value)}
                          placeholder="New York, USA"
                          className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-gray-100 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-300 mb-2">LinkedIn</label>
                        <input
                          type="text"
                          value={userProfile.linkedin}
                          onChange={(e) => updateProfileField('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/johnsmith"
                          className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-gray-100 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Education
                      </h3>
                      <button
                        onClick={addProfileEducation}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      >
                        + Add Education
                      </button>
                    </div>
                    {userProfile.education.map((edu, index) => (
                      <div key={index} className="bg-gray-900 bg-opacity-50 p-4 rounded-xl mb-3 border border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateProfileEducation(index, 'degree', e.target.value)}
                            placeholder="Degree & Field"
                            className="p-2 bg-gray-800 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateProfileEducation(index, 'school', e.target.value)}
                            placeholder="University/School"
                            className="p-2 bg-gray-800 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => updateProfileEducation(index, 'year', e.target.value)}
                              placeholder="Year"
                              className="flex-1 p-2 bg-gray-800 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            {userProfile.education.length > 1 && (
                              <button
                                onClick={() => removeProfileEducation(index)}
                                className="text-red-400 hover:text-red-300 px-2"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Skills
                      </h3>
                      <button
                        onClick={addProfileSkill}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      >
                        + Add Skill
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateProfileSkill(index, e.target.value)}
                            placeholder="Skill"
                            className="p-2 bg-gray-900 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg text-sm w-32 focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => removeProfileSkill(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 bg-opacity-50 p-6 rounded-b-2xl flex justify-between items-center border-t border-gray-700">
                <button
                  onClick={clearProfile}
                  className="text-red-400 hover:text-red-300 font-semibold transition-all"
                >
                  Clear Profile
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveUserProfile}
                    disabled={!userProfile.name || !userProfile.title || userProfile.name.trim() === '' || userProfile.title.trim() === ''}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Profile
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </>
  );
}

// Client-side template rendering function
function renderTemplateClient(templateName, data) {
  // This is a simplified client-side version
  // For production, you might want to use a templating library
  
  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text || '').replace(/[&<>"']/g, (m) => map[m]);
  };

  const renderExperience = (experiences) => {
    return experiences.map(exp => `
      <div class="mb-6">
        <div class="flex justify-between items-baseline mb-2">
          <h3 class="text-xl font-bold text-gray-900">${escapeHtml(exp.role)}</h3>
          <span class="text-sm font-medium text-blue-600">${escapeHtml(exp.dates)}</span>
        </div>
        <p class="text-gray-700 font-semibold mb-3">${escapeHtml(exp.company)}</p>
        <ul class="space-y-2 text-gray-700">
          ${exp.bullets.map(bullet => `
            <li class="flex items-start">
              <span class="text-blue-600 mr-2 mt-1">▸</span>
              <span>${escapeHtml(bullet)}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  };

  const renderEducation = (education) => {
    return education.map(edu => `
      <div class="mb-4 bg-gray-50 p-4 rounded-lg">
        <div class="flex justify-between items-baseline">
          <h3 class="text-lg font-bold text-gray-900">${escapeHtml(edu.degree)}</h3>
          <span class="text-sm font-medium text-blue-600">${escapeHtml(edu.year)}</span>
        </div>
        <p class="text-gray-700 mt-1">${escapeHtml(edu.school)}</p>
      </div>
    `).join('');
  };

  const renderSkills = (skills) => {
    return skills.map(skill => `
      <span class="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">${escapeHtml(skill)}</span>
    `).join('');
  };

  // Base template structure (Modern template as default)
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CV - ${escapeHtml(data.name)}</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-white">
      <div class="max-w-4xl mx-auto">
        <header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 mb-8">
          <h1 class="text-5xl font-bold mb-2">${escapeHtml(data.name)}</h1>
          <p class="text-2xl font-light">${escapeHtml(data.title)}</p>
        </header>

        <div class="px-8 pb-8">
          <section class="mb-8">
            <h2 class="text-3xl font-bold text-blue-800 mb-4 border-b-2 border-blue-300 pb-2">About Me</h2>
            <p class="text-gray-700 leading-relaxed text-lg">${escapeHtml(data.summary)}</p>
          </section>

          <section class="mb-8">
            <h2 class="text-3xl font-bold text-blue-800 mb-4 border-b-2 border-blue-300 pb-2">Experience</h2>
            ${renderExperience(data.experience || [])}
          </section>

          <section class="mb-8">
            <h2 class="text-3xl font-bold text-blue-800 mb-4 border-b-2 border-blue-300 pb-2">Education</h2>
            ${renderEducation(data.education || [])}
          </section>

          <section class="mb-8">
            <h2 class="text-3xl font-bold text-blue-800 mb-4 border-b-2 border-blue-300 pb-2">Skills</h2>
            <div class="flex flex-wrap gap-3">
              ${renderSkills(data.skills || [])}
            </div>
          </section>
        </div>
      </div>
    </body>
    </html>
  `;
}
