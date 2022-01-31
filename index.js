const express = require("express")
const server = express()
const { got } = require("got-cjs")

/* -------------------------------------------------- */

const getJSON = async (id) => {
    const video = await got.post(`https://fembed.com/api/source/${id}`).json()
    if (!video["success"]) return { success: false }
    return video
}

const getVideoURL = async (videoJSON) => {
    const data = []
    for (filedata of videoJSON) {
        data.push({
            file: filedata["file"],
            label: filedata["label"],
            type: filedata["type"]
        })
    }

    return data
}

/* -------------------------------------------------- */

server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    return next()
})

server.get("/", async (req, res) => {
    return res.json({ success: true, github: "https://github.com/aeongdesu/fembed-video-api" })
})

server.get("/:id", async (req, res) => {
    const id = req.params.id
    return res.json(await getJSON(id))
})

server.get("/:id/player", async (req, res) => {
    
    const id = req.params.id
    const videoJSON = await getJSON(id)
    if (!videoJSON["success"]) return res.status(404).json({ success: false })
    res.json(videoJSON["player"])
})

server.get("/:id/video", async (req, res) => {
    
    const id = req.params.id
    const videoJSON = await getJSON(id)
    if (!videoJSON["success"]) return res.sendStatus(404)
    return res.json(videoJSON["data"])
})

server.get("/:id/video/:type", async (req, res) => {
    
    const id = req.params.id
    const type = req.params.type
    const videoJSON = await getJSON(id)
    if (!videoJSON["success"]) return res.sendStatus(404)
    const json = await getVideoURL(videoJSON["data"])
    for (video in json) {
        if (json[video].label === type + "p") {
            res.setHeader("Content-Type", "video/mp4")
            return got.stream(json[video].file).pipe(res)
        }
    }
    return res.status(404).json({ success: false })
})

server.get("/:id/captions", async (req, res) => {
    
    const id = req.params.id
    const videoJSON = await getJSON(id)
    if (!videoJSON["success"]) return res.status(404).json({ success: false })
    res.json(videoJSON["captions"])
})

/* -------------------------------------------------- */

if (!process.env.DETA_RUNTIME) {
server.listen(8080, () => {
    console.log("Example app listening at http://localhost:8080")
})
}

module.exports = server
