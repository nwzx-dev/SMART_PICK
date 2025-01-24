import fs from 'fs'
import path from 'path'

export default async (c: any, who: string) => {
    const data = await c.req.formData()
    const file = data.get(who) as any


    if (!file) {
        return c.json({ error: 'No file uploaded' }, 400)
    }

    const uploadDir = path.resolve(`assets/img/${who}`)
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
    }

    const filePath = path.join(uploadDir, file.name)


    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    return c.json({ message: 'File uploaded successfully', fileName: file.name })
}