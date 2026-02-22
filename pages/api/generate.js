// Initialize Grok API client using fetch
// Grok API is compatible with OpenAI's chat completion format at https://api.x.ai/v1
const grokApiKey = process.env.GROK_API_KEY;
const grokApiEndpoint = 'https://api.x.ai/v1/chat/completions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobListing, userProfile } = req.body;

    if (!jobListing || jobListing.trim() === '') {
      return res.status(400).json({ error: 'Job listing is required' });
    }

    // Check if API key is configured
    if (!grokApiKey) {
      return res.status(500).json({ 
        error: 'Grok API key not configured. Please add GROK_API_KEY to your .env file.' 
      });
    }

    // Build user context if profile is provided
    let userContext = '';
    if (userProfile && userProfile.name) {
      userContext = `\n\nUSER'S PERSONAL INFORMATION (use this in the CV):
Name: ${userProfile.name}
Email: ${userProfile.email || 'email@example.com'}
Phone: ${userProfile.phone || '+1 (555) 123-4567'}
Location: ${userProfile.location || 'City, State'}
Professional Title: ${userProfile.title || 'Professional Title'}
${userProfile.linkedin ? `LinkedIn: ${userProfile.linkedin}` : ''}
${userProfile.portfolio ? `Portfolio: ${userProfile.portfolio}` : ''}

EDUCATION:
${userProfile.education && userProfile.education.length > 0 ? 
  userProfile.education.map(edu => `- ${edu.degree} from ${edu.school}, ${edu.year}`).join('\n') : 
  'Include relevant education for the role'}

${userProfile.skills && userProfile.skills.length > 0 ? 
  `SKILLS TO INCLUDE:\n${userProfile.skills.join(', ')}` : 
  'Include relevant skills for the role'}

IMPORTANT: Use the user's exact name, contact information, education, and include their skills in the CV. Generate professional work experience that matches the job listing.`;
    }

    // Craft a detailed prompt for CV generation
    const prompt = `You are an expert CV writer and career consultant. Based on the following job listing or job title, generate a complete, professional CV that would be perfect for this role.

Job Listing/Title:
${jobListing}${userContext}

Generate a CV with the following requirements:
1. Create a professional summary that highlights relevant experience and skills for this specific role
2. Include 2-4 relevant work experiences with compelling, ATS-friendly bullet points
3. Each bullet point should:
   - Start with a strong action verb
   - Include quantifiable achievements where possible (but NEVER use percentage signs or numbers like 40)
   - Be specific and relevant to the job requirements
   - Be concise (1-2 lines maximum)
4. Include relevant education (degree appropriate for the role)
5. List 8-12 technical and soft skills that match the job requirements
6. Make the CV ATS-friendly by using standard formatting and relevant keywords from the job listing
7. Ensure all content is realistic, professional, and tailored to the specific role

WRITING STYLE REQUIREMENTS:
Write how thoughtful humans speak when writing or thinking out loud, especially when they're smart, slightly self-aware, and not trying too hard.
Make the language sound natural, varied, and a little imperfect:
- Use a mix of short, punchy lines and longer, more reflective ones
- Interrupt perfect flow occasionally with tangents, soft contradictions or rhetorical questions
- Add light qualifiers like 'I think', 'maybe', or 'to be honest' where appropriate
- Don't over-explain or tie every idea up with a bow
- Reference relatable experiences or imagined reactions that feel personal
- Vary the rhythm with natural paragraph breaks and organic pacing
- Avoid forced slang or textbook-style writing. Just keep it human.
- Do NOT use em dashes
- You are an expert who double checks things, you are skeptical and you do research. Be accurate and thoughtful.
- NEVER add percentage signs (%) or numbers like 40 in isolation

Return ONLY a valid JSON object in this exact format (no additional text or explanation):
{
  "name": "Full Name",
  "title": "Professional Title",
  "email": "email@example.com",
  "phone": "+1 (555) 123-4567",
  "location": "City, State/Country",
  "summary": "A compelling 3-4 sentence professional summary",
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "dates": "Month Year - Month Year",
      "bullets": [
        "Achievement-focused bullet point with quantifiable results",
        "Another strong bullet point highlighting relevant skills",
        "Third bullet demonstrating impact and value"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Name and Field",
      "school": "University/Institution Name",
      "year": "Year"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"]
}`;

    // Call Grok API
    const response = await fetch(grokApiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "grok-4-fast-reasoning",
        messages: [
          {
            role: "system",
            content: "You are a professional CV writer. You always respond with valid JSON only, no additional text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Grok API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const completion = await response.json();

    // Extract the generated CV
    const cvText = completion.choices[0].message.content;
    const cvData = JSON.parse(cvText);

    // Validate the structure
    if (!cvData.name || !cvData.title || !cvData.experience || !cvData.skills) {
      throw new Error('Invalid CV structure generated');
    }

    return res.status(200).json(cvData);

  } catch (error) {
    console.error('Error generating CV:', error);
    
    // Provide helpful error messages
    if (error.message.includes('401')) {
      return res.status(500).json({ 
        error: 'Invalid Grok API key. Please check your GROK_API_KEY in .env file.' 
      });
    }
    
    if (error.message.includes('429')) {
      return res.status(500).json({ 
        error: 'Grok API rate limit exceeded. Please try again later.' 
      });
    }

    return res.status(500).json({ 
      error: 'Failed to generate CV',
      details: error.message 
    });
  }
}
