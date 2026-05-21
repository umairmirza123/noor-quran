// Vercel Serverless Proxy for Quran Foundation API
// Bypasses CORS by making server-to-server calls

const QF_ID = "c161e402-186c-4bfa-bcfe-69648b0f23eb";
const QF_SECRET = "F07DqaNB6KvqqFUCiI4lFbFSC-";
const QF_AUTH = "https://oauth2.quran.foundation";
const QF_API = "https://api.quran.com/api/v4";

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  
  const res = await fetch(`${QF_AUTH}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(`${QF_ID}:${QF_SECRET}`).toString("base64"),
    },
    body: "grant_type=client_credentials&scope=content",
  });
  
  const data = await res.json();
  if (data.access_token) {
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000 - 60000;
    return cachedToken;
  }
  throw new Error("Token request failed");
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") return res.status(200).end();
  
  try {
    const { page } = req.query;
    if (!page) return res.status(400).json({ error: "page parameter required" });
    
    const token = await getToken();
    
    // Try mushaf=1 (KFGQPC Hafs) first, then mushaf=2 if it fails
    let data = null;
    for (const mushafId of [1, 2]) {
      const apiRes = await fetch(
        `${QF_API}/verses/by_page/${page}?words=true&word_fields=code_v2,v2_page,line_number,char_type_name&per_page=50&mushaf=${mushafId}`,
        {
          headers: {
            "x-auth-token": token,
            "x-client-id": QF_ID,
          },
        }
      );
      
      const d = await apiRes.json();
      if (d.verses && d.verses.length > 0) {
        data = d;
        break;
      }
    }
    
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "No data for this page in pre-production API", page });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
