var url = require('url')
var http = require('http')
var express = require('express')

var routington = require('../')

var routes = [
  '/',
  '/:nav(about)',
  '/:nav(login)',
  '/:nav(logout)',
  '/:nav(register)',
  '/:nav(forgot)',
  '/:nav(reset)',
  '/:nav(blog)',
  '/:nav(faq)',
  '/:nav(balancesheet)/:timestamp(\\d{10,11})?',
  '/:nav(preferences)',
  '/:nav(account)',
  '/:nav(donate)',
  '/:nav(donate)/:tab(creditcard)',
  '/:nav(transactions)',
  '/:nav(transactions)/:tab(payments|credits|charges)',
  '/:nav(search)',
  '/:nav(search)/:collection(pages|topics|users)',
  '/:nav(activity)',
  '/:nav(activity)/:tab(discussions)',
  '/:nav(recommendations)',
  '/:nav(recommendations)/:tab(pages|discussions)',
  '/:nav(following|hidden)',
  '/:nav(following|hidden)/:tab(pages|discussions)',
  '/:nav(pages)',
  '/:nav(pages)/create',
  '/:nav(pages)/:tab(new|loved|comments|following)',
  '/:nav(discussions)',
  '/:nav(discussions)/create',
  '/:nav(discussions)/:tab(new|interesting|comments|following)',
  '/:nav(opinions)',
  '/:nav(opinions)/:tab(new|insightful|comments|following)',
  '/:nav(motions)',
  '/:nav(motions)/:tab(new|approval|granted|denied|expired)',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(comment)',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(comment)/:commentid([0-9a-f]{24})',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(comment)/:commentid([0-9a-f]{24})/:tab(new|liked|descendants)',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(comments)',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(comments)/create',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(comments)/:tab(new|liked|descendants)',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(discussions)',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(discussions)/create',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(discussions)/:tab(new|interesting|comments|followers)',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(opinions)',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(opinions)/create',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(opinions)/:tab(new|insightful|comments|followers)',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(followers)',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(motions)',
  '/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(motions)/:tab(new|approval|granted|denied|expired)',
  '/:identity(discussion|opinion|motion)/:id([0-9a-f]{24})',
  '/:identity(discussion|opinion|motion)/:id([0-9a-f]{24})/:nav(comment)',
  '/:identity(discussion|opinion|motion)/:id([0-9a-f]{24})/:nav(comment)/:commentid([0-9a-f]{24})',
  '/:identity(discussion|opinion|motion)/:id([0-9a-f]{24})/:nav(comment)/:commentid([0-9a-f]{24})/:tab(new|liked|descendants)',
  '/:identity(discussion|opinion|motion)/:id([0-9a-f]{24})/:nav(comments)',
  '/:identity(discussion|opinion|motion)/:id([0-9a-f]{24})/:nav(comments)/create',
  '/:identity(discussion|opinion|motion)/:id([0-9a-f]{24})/:nav(comments)/:tab(new|liked|descendants)',
  '/:identity(discussion|opinion|motion)/:id([0-9a-f]{24})/:nav(discussions)',
  '/:identity(discussion|opinion|motion)/:id([0-9a-f]{24})/:nav(discussions)/create',
  '/:identity(discussion|opinion|motion)/:id([0-9a-f]{24})/:nav(discussions)/:tab(new|interesting|comments|followers)',
  '/:identity(discussion|opinion|motion)/:id([0-9a-f]{24})/:nav(followers)',
  '/:identity(discussion|opinion)/:id([0-9a-f]{24})/:nav(motions)',
  '/:identity(discussion|opinion)/:id([0-9a-f]{24})/:nav(motions)/:tab(new|approval|granted|denied|expired)',
]

var router = exports.router = routington()
var app = exports.app = express()

routes.forEach(function (x) {
  router.define(x)
  app.get(x, respond)
})

function respond(req, res) {
  res.end()
}

http.createServer(function (req, res) {
  router.match(url.parse(req.url).pathname)
  res.end()
}).listen(3301)

http.createServer(app).listen(3302)

/*
./wrk http://localhost:3301/
./wrk http://localhost:3302/

./wrk http://localhost:3301/discussion/123412341234123412341234/comment/123412341234123412341234/new
./wrk http://localhost:3302/discussion/123412341234123412341234/comment/123412341234123412341234/new
*/