const express = require("express")
const server = express()
const fetch = require("node-fetch")

/* -------------------------------------------------- */

const getJSON = async (id) => {
    const url = await (await fetch(`https://fembed.com/v/${id}`).then(response => response["url"])).replace("v", "api/source")
    const video = await fetch(url, {
        method: "POST"
    }).then(response => response.json())
    if (!video["success"]) return { success: false }
    return video
}

const getVideoURL = async (videoJSON) => {
    const data = []
    for (filedata of videoJSON) {
    const url = await fetch(filedata["file"]).then(data => data["url"])
        data.push({
            file: url,
            label: filedata["label"],
            type: filedata["type"]
        })
    }

    return data
}

/* -------------------------------------------------- */

server.get("/", async (req, res) => {
    res.redirect("https://github.com/KeepSOBP/fembed-video-api")
})

server.get("/:id", async (req, res) => {
    const id = req.params.id
    res.json(await getJSON(id))
})

server.get("/:id/player", async (req, res) => {
    const id = req.params.id
    const videoJSON = await getJSON(id)
    if (!videoJSON["success"]) return res.json({ success: false })
    res.json(videoJSON["player"])
})

server.get("/:id/video", async (req, res) => {
    const id = req.params.id
    const videoJSON = await getJSON(id)
    if (!videoJSON["success"]) return res.json({ success: false })
    res.json(await getVideoURL(videoJSON["data"]))
})


server.get("/:id/captions", async (req, res) => {
    const id = req.params.id
    const videoJSON = await getJSON(id)
    if (!videoJSON["success"]) return res.json({ success: false })
    res.json(videoJSON["captions"])
})

/* -------------------------------------------------- */

if (process.env.DETA_RUNTIME == null) {
server.listen(8080, () => {
    console.log("Example app listening at http://localhost:8080")
})
}

module.exports = server
