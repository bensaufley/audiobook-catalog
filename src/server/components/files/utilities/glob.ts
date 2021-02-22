import globCb from 'glob';

const glob = (pattern: string, opts: globCb.IOptions = {}) =>
  new Promise<string[]>((resolve, reject) => {
    globCb(pattern, opts, (err, matches) => {
      if (err) reject(err);
      else resolve(matches);
    });
  });

export default glob;

export const supportedFileExtensions = ['.m4a', '.m4b', '.mp4', '.mp3'];
