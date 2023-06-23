import { intro, outro, text, select, spinner } from '@clack/prompts'
import { $ } from 'zx'
import { slug } from 'github-slugger'
import fs from 'fs'
import { confirm } from '@clack/prompts'

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

intro('Create new post')

const title = await text({
  message: 'Title',
  placeholder: 'Advantages of eating',
  validate(value) {
    if (value.length === 0) return `Value is required!`
  },
})
const description = await text({
  message: 'Description',
  placeholder: 'Concise resume of the post',
  validate(value) {
    if (value.length === 0) return `Value is required!`
  },
})
const category = await select({
  message: 'Category',
  options: [
    { value: 'Article', label: 'Article' },
    { value: 'How To', label: 'How To' },
    { value: 'List', label: 'List' },
    { value: 'Notes', label: 'Notes' },
  ],
})
const tags = await text({
  message: 'Tags (separated by ",")',
  placeholder: 'javascript, rust, css, life',
})
const author = await text({
  message: 'Author username',
  placeholder: 'mateusfg7',
  defaultValue: 'mateusfg7',
  initialValue: 'mateusfg7',
})
const status = await select({
  message: 'Initial status',
  options: [
    { value: 'draft', label: 'Draft' },
    { value: 'planned', label: 'Planned' },
  ],
})

const s = spinner()

s.start('Creating post')

const postPath = `${slug(title.toString())}.mdx`

const parsedTags = tags
  ? tags
      .toString()
      .split(',')
      .map((tag) => tag.trim())
      .toString()
  : ''

fs.writeFile(
  postPath,
  `---
title: '${title.toString()}'
date: '${new Date().toISOString()}'
description: '${description.toString()}'
category: '${category}'
tags: '${parsedTags}'
author: '${author.toString()}'
status: '${status}'
---`,
  () => {}
)

s.stop(`Post created on ${postPath}`)

const edit = await confirm({
  message: 'Do you want to open post on gnome text editor?',
})

if (edit) {
  $`gnome-text-editor ${postPath}`
}
