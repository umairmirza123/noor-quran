// Vercel Serverless Proxy for Quran Foundation API
// Bypasses CORS by making server-to-server calls

const QF_ID = "9c9dd24f-9873-4211-a6b5-502ac85754bf";
const QF_SECRET = "d6uetkamUhnfIhHoFedfaVGcFG";
const QF_AUTH = "https://prelive-oauth2.quran.foundation";
const QF_API = "https://apis-prelive.quran.foundation/content/api/v4";

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
    
    const apiRes = await fetch(
      `${QF_API}/verses/by_page/${page}?words=true&word_fields=code_v2,v2_page,line_number,char_type_name&per_page=50`,
      {
        headers: {
          "x-auth-token": token,
          "x-client-id": QF_ID,
        },
      }
    );
    
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
