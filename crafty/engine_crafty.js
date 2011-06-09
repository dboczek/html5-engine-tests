var engine = (function() {
    var that = {};
    
    var FPS = 30,
        tileSize = 48,
        tilePadding = 2,
        spriteImages = [
            'img/tiles2,jpg',
            'img/kayak.png'
        ],
        sprites = {
            'img/tiles2.jpg':{
                tile1: [0, 0], tile2: [0, 1], tile3: [0, 2], tile4: [1, 0],
                tile5: [1, 2], tile6: [2, 0], tile7: [2, 1], tile8: [2, 2],
                water: [0, 12]
            },
            'img/kayak.png':{player: [0, 0]},
            'img/cloudshigh.png':{cloudshigh: [0, 0, 2, 2]},
            'img/cloudslow.png':{cloudslow: [0, 0, 2, 2]}
        },
        loadSprites = function(spriteList, callback) {
            var spriteArray = [],
                v, k;
            if (arguments.length == 1) {
                callback = spriteList;
                spriteList = undefined;
            }
            if (spriteList == undefined) {
                $.each(sprites, function(v, k) {
                    spriteArray.push(k);
                })
            } else if (typeof spriteList == 'array') {
                spriteArray = spriteList;
            }
            //$.each(spriteArray, function() {
            //    
            //})
            if (typeof callback == 'function') {
                callback();
            }
        };

    
    that.initViewport = function(width, height) {
        Crafty.init(FPS, width, height);
        Crafty.canvas();
    }
    
    
    

    that.prepareWorldData = function(xTiles, yTiles, callback){
        Crafty.load(['img/tiles2.jpg', 'img/kayak.png', 'img/cloudshigh.png', 'img/cloudslow.png'], function() {
            Crafty.sprite(tileSize, 'img/tiles2.jpg', {
                tile1: [0, 0], tile2: [0, 1], tile3: [0, 2], tile4: [1, 0],
                tile5: [1, 2], tile6: [2, 0], tile7: [2, 1], tile8: [2, 2],
                water: [0, 12]
            }, tilePadding, tilePadding);
            Crafty.sprite(tileSize, 'img/kayak.png', {
                player: [0, 0]
            }, tilePadding, tilePadding);
            Crafty.sprite(tileSize, 'img/cloudshigh.png', {
                cloudshigh: [0, 0, 10, 5]
            });
            Crafty.sprite(tileSize, 'img/cloudslow.png', {
                cloudslow: [0, 0, 10, 5]
            });
            var entities = [];
            var tileOffset, tileType;
            for (var r = 0; r < yTiles; r++) {
                for (var c = 0; c < xTiles; c++) {
                    tileOffset = Crafty.randRange(0, 3);
                    tileType = (c % 2) ^ (r % 2) ? 1 + tileOffset : 5 + tileOffset;
                    entities.push({
                        componentList: '2D, Canvas, tile' + tileType,
                        attrs: {x: c * tileSize, y: r * tileSize}
                    });
                }
            }
            that.worldData = entities;
            if(typeof callback == "function"){
                callback();
            }
        },
        function(){},
        function(){alert('err');}
        );
    };

    that.prepareWaterWorldData = function(xTiles, yTiles, callback){
        Crafty.load(['img/tiles2.jpg', 'img/kayak.png', 'img/water.gif'], function() {
            Crafty.sprite(tileSize, 'img/tiles2.jpg', {
                tile1: [0, 0], tile2: [0, 1], tile3: [0, 2], tile4: [1, 0],
                tile5: [1, 2], tile6: [2, 0], tile7: [2, 1], tile8: [2, 2],
                water: [0, 12]
            }, tilePadding, tilePadding);
            Crafty.sprite(tileSize, 'img/kayak.png', {
                player: [0, 0]
            }, tilePadding, tilePadding);
            var entities = [];
            var tileOffset, tileType;

            var makeEntity = function(c,r){
                var e = this.e('2D, Canvas, water, Animate')
                .attr({x: c * tileSize, y: r * tileSize})
                .animate('wave',[
                    [0*50, 12*50],
                    [1*50, 12*50],
                    [2*50, 12*50],
                    [3*50, 12*50],
                    [4*50, 12*50],
                    [5*50, 12*50],
                    [6*50, 12*50],
                    [7*50, 12*50]
                ]).animate('wave', 20, -1);
                return e;
            };
            for (var r = 0; r < yTiles; r++) {
                for (var c = 0; c < xTiles; c++) {
                    entities.push({
                        make: makeEntity,
                        attrs: [c,r]
                    });
                }
            }
            that.worldData = entities;
            if(typeof callback == "function"){
                callback();
            }
        },
        function(){},
        function(){alert('err');}
        );
    };
    
    that.prepareWaterBckWorldData = function(xTiles, yTiles, callback){
        Crafty.load(['img/tiles2.jpg', 'img/kayak.png', 'img/water.gif'], function() {
            Crafty.sprite(tileSize, 'img/tiles2.jpg', {
                tile1: [0, 0], tile2: [0, 1], tile3: [0, 2], tile4: [1, 0],
                tile5: [1, 2], tile6: [2, 0], tile7: [2, 1], tile8: [2, 2],
                water: [0, 12]
            }, tilePadding, tilePadding);
            Crafty.sprite(tileSize, 'img/kayak.png', {
                player: [0, 0]
            }, tilePadding, tilePadding);
            Crafty.background('url(img/water.gif)');
            if(typeof callback == "function"){
                callback();
            }
        },
        function(){},
        function(){alert('err');}
        );
    };
    
    that.prepareMixedWorldData = function(xTiles, yTiles, callback) {
        Crafty.load(['img/tiles2.jpg', 'img/kayak.png', 'img/water.gif'], function() {
            Crafty.sprite(tileSize, 'img/tiles2.jpg', {
                tile1: [10, 0], tile2: [9, 0], tile3: [11, 0],
                tile4: [10, 1], tile5: [9, 1], tile6: [11, 1],
                tile7: [10, 2], tile8: [9, 2], tile9: [11, 2]
            }, tilePadding, tilePadding);
            Crafty.sprite(tileSize, 'img/kayak.png', {
                player: [0, 0]
            }, tilePadding, tilePadding);
            Crafty.background('url(img/water.gif)');
            var entities = [],
                tileMap = [
                    [1,1,1,0,0,1,1,1,1,1,1,1],
                    [1,1,1,0,0,1,1,1,1,1,1,1],
                    [1,1,1,0,0,1,1,1,1,1,1,1],
                    [1,1,1,0,0,1,1,1,1,1,1,1],
                    [1,1,0,0,0,1,1,1,1,1,1,1],
                    [0,0,0,0,0,0,1,0,1,1,1,0],
                    [1,1,0,0,0,0,0,0,0,1,0,0],
                    [1,1,1,0,0,1,0,0,0,1,0,1],
                    [1,1,1,0,0,1,1,0,0,0,0,1],
                    [1,1,1,0,0,1,1,1,1,0,1,1],
                    [1,1,1,0,0,1,1,1,1,1,1,1],
                    [1,1,1,0,0,1,1,1,1,1,1,1]
                ],
                tileOffset, tileType,
                tileMapSize = {
                    w: tileMap[0].length,
                    h: tileMap.length
                };
            for (var r = 0; r < yTiles; r++) {
                for (var c = 0; c < xTiles; c++) {
                    tileOffset = Crafty.randRange(1, 9);
                    tileType = tileOffset * (tileMap[r % tileMapSize.h][c % tileMapSize.w]);
                    if (tileType) {
                        entities.push({
                            componentList: '2D, Canvas, tile' + tileType,
                            attrs: {x: c * tileSize, y: r * tileSize}
                        });
                    }
                }
            }
            that.worldData = entities;
            if (typeof callback == 'function') {
                callback();
            }
        });
    };

    that.generateWorld = function(entities){
        for (var i = 0; i < entities.length;i++) {
            if ( entities[i].make !== undefined ){
                entities[i].make.apply(Crafty, entities[i].attrs);
            } else {
                Crafty.e(entities[i].componentList).attr(entities[i].attrs);
            }
        }
    };
    
    that.destroyViewport = function() {
        Crafty.viewport.x = 0;
        Crafty.viewport.y = 0;
        Crafty.stop();
        $('#cr-stage').remove();
    }

    that.moveViewportTo = function(x,y, speed, callback) {
        var prop,
            old = {},
            step = {},
            startFrame,
            duration = speed / 1000 * FPS,
            endFrame;

        var distanceX = x - Crafty.viewport.x;
        var distanceY = y - Crafty.viewport.y;
        var stepX = distanceX / duration ;
        var stepY = distanceY / duration;
        var steps = duration;
        startFrame = Crafty.frame();
        endFrame = startFrame + duration;
        var a = startFrame;
        Crafty.bind("enterframe", function d(e) {
            if(e.frame >= endFrame) {
                Crafty.unbind("enterframe", d);
                if (typeof callback == 'function') {
                        callback();
                }
                return;
            }
            Crafty.viewport.x += stepX;
            Crafty.viewport.y += stepY;
        });
    }
    
    that.showScene = function(scene, callback) {
        Crafty.scene(scene);
        if( typeof callback == "function"){
            callback();
        }
    }
    
    that.createScene = function(scene) {
        Crafty.scene(scene, function() {
            if (that.worldData !== undefined) {
                that.generateWorld(that.worldData);
            }
        });
    }
    
    that.putEntity = function(posX, posY, spriteName) {
        var ent = Crafty.e('2D, DOM, Tween, ' + spriteName);
        ent.attr({x: posX * tileSize, y: posY * tileSize});
        player = ent;
        ent.moveTo = function(x,y, duration, callback) {
            ent.tween({x:x*tileSize, y:y*tileSize}, (duration /1000) * FPS , callback);
        };
        ent.playAnimation = function(){
            ent.addComponent('Animate').animate('paddle',[
                 [0*50, 0],
                 [1*50, 0],
                 [2*50, 0],
                 [3*50, 0],
                 [4*50, 0],
                 [5*50, 0],
                 [6*50, 0],
                 [7*50, 0],
                 [8*50, 0],
                 [9*50, 0]
            ]).animate('paddle', 20, -1);
        }
        ent.rotate = function(deg, duration, originX, originY, callback) {
            if (arguments.length > 3) {
                ent.origin(originX, originY);
            } else {
                ent.origin(24,24);
                callback = originX;
            }
            ent.tween({rotation: deg}, (duration/1000) * FPS, callback);
        }
        ent.setZ = function(z) {
            ent.attr({z: z});
        }
        return ent; 
    }
    
    that.putText = function(textData) {
        var ent = Crafty.e('2D, DOM, Text').text(textData.text);
        ent.attr({x: textData.position.x, y: textData.position.y, w: textData.position.w, h: textData.position.h});
        ent.css(textData.properites);
        ent.font(textData.font);
    }
    
    return that;
})();
