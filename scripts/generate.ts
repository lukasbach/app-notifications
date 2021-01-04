import frontmatter from '@github-docs/frontmatter';
import * as fs from 'fs';
import { notificationSchema } from './notificationSchema';
import * as path from 'path';
import rimraf from 'rimraf';

const notifications = [];
const notificationsPerProduct = {
  unspecific: []
};

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
  await fs.promises.mkdir(path.join(outDir, 'products'), { recursive: true });
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
      onlyForProducts: data.onlyForProducts,
      onlyForVersion: data.onlyForVersion,
      onlyAfter: data.onlyAfter,
      onlyBefore: data.onlyBefore,
      title: data.title,
      summary: data.summary
    };

    const detailedInfo = {
      ...smallInfo,
      author: data.author,
      content: content
    };

    notifications.push(smallInfo);

    if (data.onlyForProducts) {
      for (const product of data.onlyForProducts) {
        if (!Object.keys(notificationsPerProduct).includes(product)) {
          notificationsPerProduct[product] = [];
        }
        notificationsPerProduct[product].push(smallInfo);
      }
    } else {
      notificationsPerProduct['unspecific'].push(smallInfo);
    }

    await fs.promises.writeFile(path.join(outDir, `all/${id}.json`), JSON.stringify(detailedInfo, null, 1));
    await fs.promises.writeFile(path.join(outDir, `all/${id}.tiny.json`), JSON.stringify(detailedInfo));
    await fs.promises.writeFile(path.join(outDir, `content/${id}.md`), content);
  }

  await fs.promises.writeFile(path.join(outDir, `notifications.json`), JSON.stringify(notifications, null, 1));
  await fs.promises.writeFile(path.join(outDir, `notifications.tiny.json`), JSON.stringify(notifications));

  for (const [product, notifications] of Object.entries(notificationsPerProduct)) {
    if (product !== 'unspecific') {
      notificationsPerProduct[product].push(...notificationsPerProduct['unspecific']);
    }
  }

  for (const [product, productNotifications] of Object.entries(notificationsPerProduct)) {
    await fs.promises.writeFile(path.join(outDir, `products/${product}.json`), JSON.stringify(productNotifications, null, 1));
    await fs.promises.writeFile(path.join(outDir, `products/${product}.tiny.json`), JSON.stringify(productNotifications));
  }

})();