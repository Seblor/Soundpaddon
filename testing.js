import Soundpad from 'soundpad.js';

const soundpadClient = new Soundpad();

soundpadClient.connect().then(main);

async function main() {
  console.log(await soundpadClient.getPlaybackPosition());
  main()
}
