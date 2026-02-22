import OpenAI from 'openai';

// Initialize Grok client (OpenAI-compatible API)
const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cvText } = req.body;

    if (!cvText || cvText.trim() === '') {
      return res.status(400).json({ error: 'CV text is required' });
    }

    // Check if API key is configured
    if (!process.env.GROK_API_KEY) {
      return res.status(500).json({ 
        error: 'Grok API key not configured. Please add GROK_API_KEY to your .env file.' 
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

    // Call Grok API with grok-2
    const completion = await grok.chat.completions.create({
      model: "grok-2",
      messages: [
        {
          role: "system",
          content: "You are a CV parser. You extract ALL information from the CV accurately and completely. You always respond with valid JSON only, no additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 16000,
      response_format: { type: "json_object" }
    });

    // Extract the parsed CV
    const cvDataText = completion.choices[0].message.content;
    const cvData = JSON.parse(cvDataText);

    // Validate the structure
    if (!cvData.name || !cvData.title) {
      throw new Error('Invalid CV structure - missing name or title');
    }

    return res.status(200).json(cvData);

  } catch (error) {
    console.error('Error parsing CV:', error);
    
    // Provide helpful error messages
    if (error.code === 'insufficient_quota') {
      return res.status(500).json({ 
        error: 'Grok API quota exceeded. Please check your Grok account.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(500).json({ 
        error: 'Invalid Grok API key. Please check your .env file.' 
      });
    }

    return res.status(500).json({ 
      error: 'Failed to parse CV',
      details: error.message 
    });
  }
}
