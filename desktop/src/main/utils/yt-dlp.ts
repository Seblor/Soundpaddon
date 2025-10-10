import { app } from 'electron';
import path from 'path';
import YTDlpWrap from 'yt-dlp-wrap';
import os from 'os';

const ytDlpWrap = new YTDlpWrap(path.join(app.getPath('assets'), 'yt-dlp.exe'));
ytDlpWrap.getVersion().then(console.log)

export function getYtDlpWrapper () {
  return ytDlpWrap;
}

export async function updateYTDlp () {
  const latestReleases = await YTDlpWrap.getGithubReleases();
  const currentVersion = await getYtDlpWrapper().getVersion();
  if (latestReleases[0].tag_name.trim() !== currentVersion.trim()) {
    console.log('downloading latest yt-dlp version:', latestReleases[0].tag_name);
    await YTDlpWrap.downloadFromGithub(path.join(app.getPath('assets'), 'yt-dlp.exe'), latestReleases[0].tag_name, os.platform());
  }
  console.log('yt-dlp is up to date:', await getYtDlpWrapper().getVersion());
}