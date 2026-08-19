
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cvText } = req.body;

    if (!cvText || cvText.trim() === '') {
      return res.status(400).json({ error: 'CV text is required' });
    }

    // Check if Wavespeed API key is configured
    if (!process.env.WAVESPEED_API_KEY) {
      console.error('WAVESPEED_API_KEY not found in environment variables');
      return res.status(500).json({ 
        error: 'Wavespeed API Key not configured. Please add WAVESPEED_API_KEY to your environment variables.' 
      });
    }

    // Craft a prompt to parse the CV text
    const prompt = `You are a CV parser. Parse the following CV text and extract ALL information accurately.

CV Text:
${cvText}

Extract and return ONLY a valid JSON object in this exact format (no additional text):
{
  "name": "Full Name from the CV",
  "title": "Professional Title/Role",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "City, Country/State",
  "summary": "Professional summary or profile text",
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "dates": "Date Range",
      "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
    }
  ],
  "education": [
    {
      "degree": "Degree and Field",
      "school": "Institution Name",
      "year": "Year or Date"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"]
}

CRITICAL INSTRUCTIONS:
- Extract ALL work experiences from the CV (include every company and role mentioned)
- Include ALL bullet points for each work experience
- Extract ALL education entries
- Include ALL skills, tools, platforms, and certifications mentioned
- Preserve the exact wording and details from the CV
- Do not truncate or skip any information
- If there are projects, certifications, or languages sections, include relevant items in skills
- Return valid JSON only`;

    // Call Wavespeed AI via fetch
    const aiResponse = await fetch('https://llm.wavespeed.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WAVESPEED_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-5.4-mini',
        messages: [
          { role: "system", content: "You are a CV parser. You extract ALL information from the CV accurately and completely. You always respond with valid JSON only, no additional text." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 8000,
        response_format: { type: "json_object" }
      })
    }).catch(err => {
      console.error('Wavespeed AI Network Error:', err.message);
      throw new Error(`Wavespeed AI Network Error: ${err.message}`);
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`Wavespeed API error: ${aiResponse.status} ${errorText}`);
    }

    const data = await aiResponse.json();

    // Extract the parsed CV
    let cvDataText = data.choices[0].message.content.trim();
    // Strip markdown code blocks if present
    if (cvDataText.startsWith('```')) {
      cvDataText = cvDataText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');
    }
    const cvData = JSON.parse(cvDataText);

    // Validate the structure
    if (!cvData.name || !cvData.title) {
      throw new Error('Invalid CV structure - missing name or title');
    }

    return res.status(200).json(cvData);

  } catch (error) {
    console.error('Error parsing CV:', error);
    
    // Provide helpful error messages
    if (error.message && error.message.includes('429')) {
      return res.status(500).json({ 
        error: 'Wavespeed AI quota exceeded. Please try again later.' 
      });
    }
    
    if (error.message && error.message.includes('401')) {
      return res.status(500).json({ 
        error: 'Authentication failed. Please check your Wavespeed API key.' 
      });
    }

    return res.status(500).json({ 
      error: 'Failed to parse CV',
      details: error.message 
    });
  }
}
