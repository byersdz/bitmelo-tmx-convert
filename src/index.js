#!/usr/bin/env node

const tmx = require( 'tmx-parser' );

console.log( 'convert tmx file' );

tmx.parseFile( './test.tmx', function( err, map ) {
  if ( err ) throw err;

  const width = parseInt( map.width );
  const height = parseInt( map.height );

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
  }

  console.log( mainLayer );

  for ( let y = 0; y < height; y += 1 ) {
    for ( let x = 0; x < width; x += 1 ) {

    }
  }

  // console.log( map );

  // console.log( map.layers[0].tiles[0].id );
});
