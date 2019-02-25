#!/usr/bin/env node

const fs = require( 'fs' );
const tmx = require( 'tmx-parser' );
const program = require( 'commander' );

let fileValue = null;

program
  .version( '1.0.0' )
  .arguments( '<file>' )
  .action( ( file ) => {
    fileValue = file;
  } )
  .parse( process.argv );

if ( !fileValue ) {
  console.log( 'No file value specified!' );
  process.exit( 1 );
}

const fileName = fileValue.split( '.' )[0];

tmx.parseFile( `./${ fileName }.tmx`, function( err, map ) {
  if ( err ) throw err;

  const width = parseInt( map.width );
  const height = parseInt( map.height );

  const { tileSets } = map;

  let mainLayer = null;
  let bg1Layer = null;
  let bg2Layer = null;
  let bg3Layer = null;
  let fg1Layer = null;
  let fg2Layer = null;
  let fg3Layer = null;
  let collisionLayer = null;
  let metaLayer = null;

  for ( let i = 0; i < map.layers.length; i += 1 ) {
    const layer = map.layers[i];
    if ( layer.name === 'main' ) {
      mainLayer = layer;
    }
    else if ( layer.name === 'bg1' ) {
      bg1Layer = layer;
    }
    else if ( layer.name === 'bg2' ) {
      bg2Layer = layer;
    }
    else if ( layer.name === 'bg3' ) {
      bg3Layer = layer;
    }
    else if ( layer.name === 'fg1' ) {
      fg1Layer = layer;
    }
    else if ( layer.name === 'fg2' ) {
      fg2Layer = layer;
    }
    else if ( layer.name === 'fg3' ) {
      fg3Layer = layer;
    }
    else if ( layer.name === 'col' ) {
      collisionLayer = layer;
    }
    else if ( layer.name === 'meta' ) {
      metaLayer = layer;
    }
  }

  // console.log( mainLayer );
  let mainTiles = [];
  let bg1Tiles = [];
  let bg2Tiles = [];
  let bg3Tiles = [];
  let fg1Tiles = [];
  let fg2Tiles = [];
  let fg3Tiles = [];
  let collisionTiles = [];
  let metaTiles = [];

  for ( let y = 0; y < height; y += 1 ) {
    for ( let x = 0; x < width; x += 1 ) {
      const adjustedY = height - y - 1;
      const mapIndex = adjustedY * width + x;
      if ( mainLayer ) {
        addTile( x, y, mapIndex, mainLayer, mainTiles, tileSets );
      }
      if ( bg1Layer ) {
        addTile( x, y, mapIndex, bg1Layer, bg1Tiles, tileSets );
      }
      if ( bg2Layer ) {
        addTile( x, y, mapIndex, bg2Layer, bg2Tiles, tileSets );
      }
      if ( bg3Layer ) {
        addTile( x, y, mapIndex, bg3Layer, bg3Tiles, tileSets );
      }
      if ( fg1Layer ) {
        addTile( x, y, mapIndex, fg1Layer, fg1Tiles, tileSets );
      }
      if ( fg2Layer ) {
        addTile( x, y, mapIndex, fg2Layer, fg2Tiles, tileSets );
      }
      if ( fg3Layer ) {
        addTile( x, y, mapIndex, fg3Layer, fg3Tiles, tileSets );
      }
      if ( collisionLayer ) {
        addTile( x, y, mapIndex, collisionLayer, collisionTiles, tileSets );
      }
      if ( metaLayer ) {
        addTile( x, y, mapIndex, metaLayer, metaTiles, tileSets );
      }
    }
  }

  const outputData = {};
  outputData.name = fileName;
  outputData.width = width;
  outputData.height = height;
  if ( mainLayer ) {
    outputData.main = mainTiles;
  }
  if ( bg1Layer ) {
    outputData.bg1 = bg1Tiles;
  }
  if ( bg2Layer ) {
    outputData.bg2 = bg2Tiles;
  }
  if ( bg3Layer ) {
    outputData.bg3 = bg3Tiles;
  }
  if ( fg1Layer ) {
    outputData.fg1 = fg1Tiles;
  }
  if ( fg2Layer ) {
    outputData.fg2 = fg2Tiles;
  }
  if ( fg3Layer ) {
    outputData.fg3 = fg3Tiles;
  }
  if ( collisionLayer ) {
    outputData.col = collisionTiles;
  }
  if ( metaLayer ) {
    outputData.meta = metaTiles;
  }

  const outputString = JSON.stringify( outputData );

  fs.writeFile( './test.map.json', outputString, ( error ) => {
    if ( error ) {
      console.log( error );
      process.exit( 1 );
    }

    console.log( 'Tilemap succesfully created!' );
  } );
});

function addTile( x, y, mapIndex, tileLayer, tileArray, tileSets ) {
  const tile = tileLayer.tiles[mapIndex];
  if ( tile ) {
    const gid = tile.gid;
    // get the tileset we are working with
    let tileSet = tileSets[0];
    for ( let i = 0; i < tileSets.length; i += 1 ) {
      const firstGid = tileSets[i].firstGid;
      if ( gid < firstGid ) {
        break;
      }
      tileSet = tileSets[i];
    }

    // adjust the gid so that it uses a bottom left origin
    const localGid = gid - tileSet.firstGid;
    const tileSetWidth =  tileSet.image.width / tileSet.tileWidth;
    const tileSetHeight = tileSet.image.height / tileSet.tileHeight;
    const localX = localGid % tileSetWidth;
    let localY = Math.floor( localGid / tileSetWidth );
    localY = tileSetHeight - localY - 1;
    let adjustedGid = localY * tileSetWidth + localX + tileSet.firstGid;
    tileArray.push( adjustedGid );
  }
  else {
    tileArray.push( 0 );
  }
}
