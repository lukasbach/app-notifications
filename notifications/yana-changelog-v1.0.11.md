---
appVersions: ['1.0.11']
apps: ['yana']
title: New things in Yana 1.0.11
summary: Changelog
date: 22.04.2021
author:
    name: Lukas Bach
    url: https://lukasbach.com
    avatar: https://avatars1.githubusercontent.com/u/4140121?s=128
---
# Yana v1.0.11

## Minor changes
* The sqlite database file is not being constantly locked while Yana is running, but only while it actually is accessed
* Added link to issue tracker in Yana about page

## Bug Fixes
* Fixed issue from previous release where sometimes folders could not be opened in sidebar
