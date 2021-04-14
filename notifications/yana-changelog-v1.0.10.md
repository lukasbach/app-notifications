---
appVersions: ['1.0.10']
apps: ['yana']
title: New things in Yana 1.0.10
summary: Changelog
date: 14.04.2021
author:
    name: Lukas Bach
    url: https://lukasbach.com
    avatar: https://avatars1.githubusercontent.com/u/4140121?s=128
---
# Yana v1.0.10

## Minor changes
* App notifications (such as the one notifying you about this update) are not shown as often anymore.
* Upgraded atlaskit dependencies.
* Workspaces can now be reordered and renamed. When starting Yana, the first Workspace in the list will always be selected.
* Re-added text-justification button in note editor.
* When creating a new note from the sidebar, it is automatically opened after naming.

## Bug Fixes
* Workspaces with the same names can cause issues. This is now enforced.
* When a workspace could not be loaded, Yana suggests opening a different workspace instead of completely crashing.
* Creating hyperlinks in notes via the url-button now works again.
