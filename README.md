# Opinionoted - Girls in Tech Taiwan x Facebook Hack for a Cause

Heroku App: [http://fb6likes.herokuapp.com](http://fb6likes.herokuapp.com)
Github: [https://github.com/maxis1718/fb6likes](https://github.com/maxis1718/fb6likes)

## Running Locally

```sh
$ git clone git@github.com:maxis1718/fb6likes.git
$ cd fb6likes
$ npm install
$ modified `/etc/hosts`, and added `127.0.0.1 fb6likes.herokuapp.com`
$ sudo PORT=80 node index.js
```
Your app should now be running on [localhost](http://localhost:80/).

## Deploying to Heroku

- push to the `master` branch (or file a PR), and it will deploy to heroku automatically

## Screenshots
![Opinionoted Page](https://raw.githubusercontent.com/maxis1718/fb6likes/master/screenshots/opinionoted_1.jpg "Opinionoted Page")

![Opinionoted Query](https://raw.githubusercontent.com/maxis1718/fb6likes/master/screenshots/opinionoted_2.jpg "Opinionoted Query")

![Opinionoted Graph](https://raw.githubusercontent.com/maxis1718/fb6likes/master/screenshots/opinionoted_3.jpg "Opinionoted Graph")