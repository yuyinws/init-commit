// ==UserScript==
// @name         open-in-initcommit
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Find the initial commit of the repository
// @author       yuyinws
// @license      MIT
// @match        https://github.com/**
// @icon         https://initcommit.info/logo.svg
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  function createButton() {
    const repoInfo = window.location.pathname.split('/').slice(1, 3).join('/')
    const a = document.createElement('a')
    a.href = `https://initcommit.info/${repoInfo}`
    a.classList.add('btn')
    a.classList.add('btn-sm')
    a.textContent = 'Init Commit'
    a.target = '_blank'

    return a
  }

  function run() {
    const repoActions = document.querySelector('#repository-details-container ul')
    if (repoActions) {
      const li = document.createElement('li')
      li.appendChild(createButton())
      repoActions.prepend(li)
    }
  }

  run()

  document.addEventListener('pjax:end', () => run())
  document.addEventListener('turbo:render', () => run())
})()
