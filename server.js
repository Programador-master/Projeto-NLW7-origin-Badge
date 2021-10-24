const express = require('express')
const { response } = require('express')

const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const axios = require('axios')


const server = express()

function getInfos(req, res) {
    return {nameUser: req.body.nameGit, links: {inst: req.body.linkInst, you: req.body.linkYou, face: req.body.linkFace, twit: req.body.linkTwi}}
}

server.use(bodyParser.json());

server.use(bodyParser.urlencoded({
  extended: true
}));

server.set("view engine", "njk")

server.use(express.static('public'))

nunjucks.configure("views", {
    express:server,
    autoescape: false
})

server.get("/", (req, res) => {
    return res.render("index")
})

server.get("/Create-Badge", (req, res) => {
    return res.render("create-badge")
})

server.post("/create-Badge", (req, res) => {
    let username = getInfos(req, res).nameUser
    let links = getInfos(req, res).links

    res.redirect(`/Badge/${username}/${links.you}/${links.inst}/${links.face}/${links.twit}`)

})

server.get("/Badge/:name/:youtube/:instagram/:facebook/:twitter", async (req, res) => {
    let links = {
        you: req.params.youtube,
        inst: req.params.instagram,
        twit: req.params.twitter,
        face: req.params.facebook,
    }
    const { data } = await axios(`https://api.github.com/users/${req.params.name}`)

    return res.render("your-badge", { user: data, link: links })
}
)

server.listen(666, () => {
    console.log("Foi")})

