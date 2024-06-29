import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import uniqid from 'uniqid'

export const config = {
  api: {
    bodyParser: false,
  },
}

console.log(
  process.env.NEXT_PUBLIC_S3_REGION,
  process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
  process.env.NEXT_PUBLIC_S3_SECRET_KEY,
  process.env.NEXT_PUBLIC_S3_BUCKET,
  process.env.NEXT_PUBLIC_S3_PATH
)

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION ?? '',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY ?? '',
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY ?? '',
  },
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Return error
    res.status(405).json('Method not allowed for File Upload')
  }

  try {
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm()
      form.parse(req, (err, fields, files) => {
        if (err) reject({ err })
        resolve({ files })
      })
    })

    Object.keys(data.files).forEach(async (key) => {
      const [file] = data.files[key]
      const body = fs.readFileSync(file.filepath)
      const contentType = file.mimetype
      await s3.send(
        new PutObjectCommand({
          ACL: 'public-read',
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
          Key: `${process.env.NEXT_PUBLIC_S3_PATH}${uniqid('abi-', `-${Date.now()}`)}`,
          Body: body,
          ContentType: contentType,
        })
      )
    })

    res.status(200).json('success')
  } catch (error) {
    res.status(500).json(error.message)
  }
}
