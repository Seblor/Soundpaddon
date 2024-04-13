tsc
ncc build ./build/index.js -o ./dist
mkdir -Force node-sea
node --experimental-sea-config sea-config.json
node -e "require('fs').copyFileSync(process.execPath, 'node-sea/custom_node.exe')"
signtool remove /s ./node-sea/custom_node.exe
npx postject ./node-sea/custom_node.exe NODE_SEA_BLOB ./node-sea/blob.blob `
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 
./build-tools/ResourceHacker.exe -open ./node-sea/custom_node.exe -save ./node-sea/soundpaddon.exe -action addskip -res ./assets/soundpaddon.ico -mask ICONGROUP,MAINICON
sleep 1
