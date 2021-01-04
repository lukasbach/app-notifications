import frontmatter from '@github-docs/frontmatter';
import * as fs from 'fs';
import { notificationSchema } from './notificationSchema';
import * as path from 'path';
import rimraf from 'rimraf';
import MarkdownIt from 'markdown-it';

const notifications = [];
const notificationsPerApp = {
  unspecific: []
};

const md = new MarkdownIt();

const outDir = path.join(__dirname, '../out');

(async () => {
  if (fs.existsSync(outDir)) {
    await new Promise<void>(res => {
      rimraf(outDir, e => {
        if (e) {
          console.error(e);
          process.exit(1);
        } else {
          res();
        }
      });
    });
  }

  await fs.promises.mkdir(outDir, { recursive: true });
  await fs.promises.mkdir(path.join(outDir, 'apps'), { recursive: true });
  await fs.promises.mkdir(path.join(outDir, 'all'), { recursive: true });
  await fs.promises.mkdir(path.join(outDir, 'content'), { recursive: true });

  for (const file of await fs.promises.readdir(path.join(__dirname, '../notifications/'))) {
    const fileContent = await fs.promises.readFile(path.join(__dirname, '../notifications/', file), { encoding: 'utf-8' });
    const { data, content, errors } = frontmatter(fileContent, {
      schema: notificationSchema,
      validateKeyNames: true,
      validateKeyOrder: true
    });

    if (errors.length > 0) {
      console.log("Errors for " + file)
      errors.forEach(console.error);
      process.exit(1);
    }

    const id = data.id ?? file.slice(undefined, -3);

    const smallInfo = {
      id: id,
      apps: data.apps,
      appVersions: data.appVersions,
      after: data.after,
      before: data.before,
      title: data.title,
      summary: data.summary
    };

    const detailedInfo = {
      ...smallInfo,
      author: data.author,
      content: content
    };

    notifications.push(smallInfo);

    if (data.apps) {
      for (const app of data.apps) {
        if (!Object.keys(notificationsPerApp).includes(app)) {
          notificationsPerApp[app] = [];
        }
        notificationsPerApp[app].push(smallInfo);
      }
    } else {
      notificationsPerApp['unspecific'].push(smallInfo);
    }

    await fs.promises.writeFile(path.join(outDir, `all/${id}.json`), JSON.stringify(detailedInfo, null, 1));
    await fs.promises.writeFile(path.join(outDir, `all/${id}.tiny.json`), JSON.stringify(detailedInfo));
    await fs.promises.writeFile(path.join(outDir, `content/${id}.md`), content);
    await fs.promises.writeFile(path.join(outDir, `content/${id}.html`), md.render(content));
  }

  await fs.promises.writeFile(path.join(outDir, `notifications.json`), JSON.stringify(notifications, null, 1));
  await fs.promises.writeFile(path.join(outDir, `notifications.tiny.json`), JSON.stringify(notifications));

  for (const [app, notifications] of Object.entries(notificationsPerApp)) {
    if (app !== 'unspecific') {
      notificationsPerApp[app].push(...notificationsPerApp['unspecific']);
    }
  }

  for (const [app, appNotifications] of Object.entries(notificationsPerApp)) {
    await fs.promises.writeFile(path.join(outDir, `apps/${app}.json`), JSON.stringify(appNotifications, null, 1));
    await fs.promises.writeFile(path.join(outDir, `apps/${app}.tiny.json`), JSON.stringify(appNotifications));
  }

})();