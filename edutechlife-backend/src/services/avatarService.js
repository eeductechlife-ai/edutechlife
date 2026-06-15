const Replicate = require('replicate')
const supabase = require('../db/supabase')
const https = require('https')

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function generateAvatar(tutorName) {
  const prompt = `Professional portrait of a ${tutorName}, professor style, 40 years old, well-groomed beard, warm friendly expression, high quality photography, cinematic lighting, depth of field, soft studio lighting, premium avatar, minimalist background, professional headshot, 8k quality`

  const output = await replicate.run(
    'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    {
      input: {
        prompt: prompt,
        negative_prompt: 'cartoon, anime, illustration, drawing, painting, ugly, distorted, low quality',
        width: 512,
        height: 512,
        num_outputs: 1,
        num_inference_steps: 25,
        guidance_scale: 7.5,
        scheduler: 'DPMSolverMultistep',
      }
    }
  )

  const imageUrl = output[0]
  const imageBuffer = await downloadImage(imageUrl)
  const fileName = `avatars/${tutorName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, imageBuffer, {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) throw new Error(`Supabase upload failed: ${uploadError.message}`)

  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

module.exports = { generateAvatar }
